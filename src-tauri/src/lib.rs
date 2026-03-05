mod api;
mod commands;
mod models;
mod polling;

use tauri::Manager;
#[cfg(target_os = "macos")]
use tauri::Listener;
#[cfg(target_os = "macos")]
use tauri_nspanel::{ManagerExt, WebviewWindowExt};

/// League uses kCGScreenSaverWindowLevel (1000) in borderless and
/// potentially higher in fullscreen. We use a very high level to cover both.
#[cfg(target_os = "macos")]
const LEAGUE_OVERLAY_LEVEL: i32 = 25000;

/// Normal floating level when League is not the foreground app.
#[cfg(target_os = "macos")]
const NORMAL_OVERLAY_LEVEL: i32 = 8; // kCGModalPanelWindowLevel

#[cfg(target_os = "macos")]
const LEAGUE_BUNDLE_ID: &str = "com.riotgames.LeagueofLegends.GameClient";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    // Register tauri-nspanel plugin on macOS
    #[cfg(target_os = "macos")]
    {
        builder = builder.plugin(tauri_nspanel::init());
    }

    builder
        .setup(|app| {
            let app_handle = app.handle().clone();

            // Start the API polling loop in a background task
            tauri::async_runtime::spawn(async move {
                polling::game_poller::start_polling(app_handle).await;
            });

            // Convert window to NSPanel for game overlay on macOS
            #[cfg(target_os = "macos")]
            {
                setup_macos_overlay(app)?;
            }

            // Register global shortcut for show/hide toggle
            #[cfg(desktop)]
            {
                use tauri_plugin_global_shortcut::{
                    Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState,
                };

                let toggle_shortcut =
                    Shortcut::new(Some(Modifiers::META | Modifiers::SHIFT), Code::KeyA);

                let handle = app.handle().clone();
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(move |_app, shortcut, event| {
                            if shortcut == &toggle_shortcut
                                && event.state() == ShortcutState::Pressed
                            {
                                eprintln!("[LolLens] Toggle shortcut pressed!");
                                #[cfg(target_os = "macos")]
                                {
                                    use tauri_nspanel::ManagerExt;
                                    if let Ok(panel) = handle.get_webview_panel("main") {
                                        if panel.is_visible() {
                                            panel.order_out(None);
                                            eprintln!("[LolLens] Panel hidden");
                                        } else {
                                            panel.show();
                                            eprintln!("[LolLens] Panel shown");
                                        }
                                    } else {
                                        eprintln!("[LolLens] Could not get panel");
                                    }
                                }
                                #[cfg(not(target_os = "macos"))]
                                {
                                    if let Some(window) = handle.get_webview_window("main") {
                                        if window.is_visible().unwrap_or(false) {
                                            let _ = window.hide();
                                        } else {
                                            let _ = window.show();
                                            let _ = window.set_focus();
                                        }
                                    }
                                }
                            }
                        })
                        .build(),
                )?;
                app.global_shortcut().register(toggle_shortcut)?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "macos")]
fn setup_macos_overlay(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri_nspanel::ManagerExt;

    if let Some(window) = app.get_webview_window("main") {
        // Convert the regular window into an NSPanel
        let panel = window.to_panel().unwrap();

        // NSWindowStyleMaskNonActivatingPanel: won't steal focus from game
        // NSResizableWindowMask: allow resizing
        let non_activating_panel: i32 = 1 << 7; // 128
        let resizable: i32 = 1 << 3; // 8
        panel.set_style_mask(non_activating_panel | resizable);

        // CRITICAL: Prevent panel from hiding when app loses focus (e.g. League takes focus)
        // NSPanel defaults to hidesOnDeactivate=YES which hides it in fullscreen
        panel.set_hides_on_deactivate(false);

        // Start at normal level (will bump higher when League activates)
        panel.set_level(NORMAL_OVERLAY_LEVEL);

        // Appear on all Spaces (including fullscreen Spaces) and stay put
        use cocoa::appkit::NSWindowCollectionBehavior;
        panel.set_collection_behaviour(
            NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                | NSWindowCollectionBehavior::NSWindowCollectionBehaviorStationary
                | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
        );

        // Listen for foreground app changes and dynamically adjust window level
        let app_handle = app.handle().clone();
        app_handle.listen(
            "NSWorkspaceDidActivateApplicationNotification",
            move |_event| {
                // This is a simplified approach — we'll also use a polling fallback
            },
        );

        // Spawn a lightweight task to detect when League is in the foreground
        let handle_for_poll = app.handle().clone();
        tauri::async_runtime::spawn(async move {
            use tokio::time::{interval, Duration};

            let mut check_interval = interval(Duration::from_secs(2));
            let mut current_level = NORMAL_OVERLAY_LEVEL;

            loop {
                check_interval.tick().await;

                let league_is_foreground = is_league_foreground();
                let target_level = if league_is_foreground {
                    LEAGUE_OVERLAY_LEVEL // 1001
                } else {
                    NORMAL_OVERLAY_LEVEL // 8
                };

                if target_level != current_level {
                    let h = handle_for_poll.clone();
                    let h2 = h.clone();
                    let _ = h.run_on_main_thread(move || {
                        use tauri_nspanel::ManagerExt;
                        if let Ok(panel) = h2.get_webview_panel("main") {
                            panel.set_level(target_level);
                            eprintln!(
                                "[LolLens] Window level -> {} (League foreground: {})",
                                target_level, league_is_foreground
                            );
                        }
                    });
                    current_level = target_level;
                }
            }
        });
    }

    Ok(())
}

/// Check if League of Legends game client is the frontmost application
#[cfg(target_os = "macos")]
fn is_league_foreground() -> bool {
    use objc::{msg_send, sel, sel_impl};
    use cocoa::base::nil;

    unsafe {
        let workspace: cocoa::base::id = msg_send![
            objc::class!(NSWorkspace),
            sharedWorkspace
        ];
        let frontmost_app: cocoa::base::id = msg_send![workspace, frontmostApplication];
        if frontmost_app == nil {
            return false;
        }
        let bundle_id: cocoa::base::id = msg_send![frontmost_app, bundleIdentifier];
        if bundle_id == nil {
            return false;
        }

        let utf8: *const std::os::raw::c_char = msg_send![bundle_id, UTF8String];
        if utf8.is_null() {
            return false;
        }

        let bundle_str = std::ffi::CStr::from_ptr(utf8).to_str().unwrap_or("");
        bundle_str == LEAGUE_BUNDLE_ID
    }
}
