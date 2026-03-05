use crate::models::game_data::AllGameData;
use reqwest::Client;

const LIVE_CLIENT_URL: &str = "https://127.0.0.1:2999/liveclientdata/allgamedata";

pub struct LiveClientApi {
    client: Client,
}

impl LiveClientApi {
    pub fn new() -> Self {
        let client = Client::builder()
            .danger_accept_invalid_certs(true)
            .timeout(std::time::Duration::from_secs(3))
            .build()
            .expect("Failed to create HTTP client");

        Self { client }
    }

    pub async fn fetch_all_game_data(&self) -> Result<AllGameData, Box<dyn std::error::Error + Send + Sync>> {
        let text = self.client
            .get(LIVE_CLIENT_URL)
            .send()
            .await?
            .text()
            .await?;

        match serde_json::from_str::<AllGameData>(&text) {
            Ok(data) => Ok(data),
            Err(e) => {
                eprintln!("[LolLens] Deserialization error: {} (line {}, col {})", e, e.line(), e.column());
                // Print a snippet around the error
                let chars: Vec<char> = text.chars().collect();
                let byte_offset = e.column().saturating_sub(1);
                let start = byte_offset.saturating_sub(50);
                let end = (byte_offset + 50).min(chars.len());
                let snippet: String = chars[start..end].iter().collect();
                eprintln!("[LolLens] Near: ...{}...", snippet);
                Err(Box::new(e))
            }
        }
    }
}
