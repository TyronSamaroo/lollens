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

    pub async fn fetch_all_game_data(&self) -> Result<AllGameData, reqwest::Error> {
        self.client
            .get(LIVE_CLIENT_URL)
            .send()
            .await?
            .json::<AllGameData>()
            .await
    }
}
