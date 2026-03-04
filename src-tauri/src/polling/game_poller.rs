use crate::api::live_client::LiveClientApi;
use serde::Serialize;
use tauri::{AppHandle, Emitter};
use tokio::time::{interval, Duration};

#[derive(Clone, Serialize)]
pub struct ConnectionEvent {
    pub state: String,
}

pub async fn start_polling(app_handle: AppHandle) {
    let api = LiveClientApi::new();
    let mut poll_interval = interval(Duration::from_secs(2));
    let mut was_connected = false;

    loop {
        poll_interval.tick().await;

        match api.fetch_all_game_data().await {
            Ok(game_data) => {
                if !was_connected {
                    let _ = app_handle.emit(
                        "connection-state",
                        ConnectionEvent {
                            state: "connected".to_string(),
                        },
                    );
                    was_connected = true;
                }
                let _ = app_handle.emit("game-data-update", &game_data);
            }
            Err(_) => {
                if was_connected {
                    let _ = app_handle.emit(
                        "connection-state",
                        ConnectionEvent {
                            state: "searching".to_string(),
                        },
                    );
                    was_connected = false;
                }
                // Back off when no game is active
                tokio::time::sleep(Duration::from_secs(3)).await;
            }
        }
    }
}
