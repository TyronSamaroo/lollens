use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AllGameData {
    #[serde(rename = "activePlayer")]
    pub active_player: ActivePlayer,
    #[serde(rename = "allPlayers")]
    pub all_players: Vec<Player>,
    pub events: serde_json::Value,
    #[serde(rename = "gameData")]
    pub game_data: GameData,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivePlayer {
    #[serde(rename = "summonerName")]
    pub summoner_name: String,
    pub level: u32,
    #[serde(rename = "currentGold")]
    pub current_gold: f64,
    #[serde(rename = "championStats")]
    pub champion_stats: ChampionStats,
    pub abilities: serde_json::Value,
    #[serde(rename = "fullRunes")]
    pub full_runes: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChampionStats {
    #[serde(rename = "abilityPower")]
    pub ability_power: f64,
    #[serde(rename = "attackDamage")]
    pub attack_damage: f64,
    #[serde(rename = "attackSpeed")]
    pub attack_speed: f64,
    pub armor: f64,
    #[serde(rename = "magicResist")]
    pub magic_resist: f64,
    #[serde(rename = "maxHealth")]
    pub max_health: f64,
    #[serde(rename = "currentHealth")]
    pub current_health: f64,
    #[serde(rename = "moveSpeed")]
    pub move_speed: f64,
    #[serde(rename = "attackRange")]
    pub attack_range: f64,
    #[serde(rename = "cooldownReduction")]
    pub cooldown_reduction: f64,
    #[serde(rename = "critChance")]
    pub crit_chance: f64,
    #[serde(rename = "critDamage")]
    pub crit_damage: f64,
    #[serde(rename = "lifeSteal")]
    pub life_steal: f64,
    #[serde(rename = "spellVamp")]
    pub spell_vamp: f64,
    pub tenacity: f64,
    #[serde(rename = "armorPenetrationFlat")]
    pub armor_penetration_flat: f64,
    #[serde(rename = "armorPenetrationPercent")]
    pub armor_penetration_percent: f64,
    #[serde(rename = "magicPenetrationFlat")]
    pub magic_penetration_flat: f64,
    #[serde(rename = "magicPenetrationPercent")]
    pub magic_penetration_percent: f64,
    #[serde(rename = "resourceType")]
    pub resource_type: String,
    #[serde(rename = "resourceValue")]
    pub resource_value: f64,
    #[serde(rename = "resourceMax")]
    pub resource_max: f64,
    #[serde(rename = "resourceRegenRate")]
    pub resource_regen_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    #[serde(rename = "summonerName")]
    pub summoner_name: String,
    #[serde(rename = "championName")]
    pub champion_name: String,
    #[serde(rename = "rawChampionName")]
    pub raw_champion_name: String,
    pub level: u32,
    pub team: String,
    pub position: String,
    #[serde(rename = "isDead")]
    pub is_dead: bool,
    #[serde(rename = "isBot")]
    pub is_bot: bool,
    #[serde(rename = "respawnTimer")]
    pub respawn_timer: f64,
    #[serde(rename = "skinID")]
    pub skin_id: u32,
    pub items: Vec<Item>,
    pub scores: Scores,
    pub runes: serde_json::Value,
    #[serde(rename = "summonerSpells")]
    pub summoner_spells: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Item {
    #[serde(rename = "canUse")]
    pub can_use: bool,
    pub consumable: bool,
    pub count: u32,
    #[serde(rename = "displayName")]
    pub display_name: String,
    #[serde(rename = "itemID")]
    pub item_id: u32,
    pub price: u32,
    #[serde(rename = "rawDescription")]
    pub raw_description: String,
    #[serde(rename = "rawDisplayName")]
    pub raw_display_name: String,
    pub slot: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Scores {
    pub kills: u32,
    pub deaths: u32,
    pub assists: u32,
    #[serde(rename = "creepScore")]
    pub creep_score: u32,
    #[serde(rename = "wardScore")]
    pub ward_score: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameData {
    #[serde(rename = "gameMode")]
    pub game_mode: String,
    #[serde(rename = "gameTime")]
    pub game_time: f64,
    #[serde(rename = "mapName")]
    pub map_name: String,
    #[serde(rename = "mapNumber")]
    pub map_number: u32,
    #[serde(rename = "mapTerrain")]
    pub map_terrain: String,
}
