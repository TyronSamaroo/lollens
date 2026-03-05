use serde::{Deserialize, Deserializer, Serialize};

/// Some players (bots) return items as {} instead of []. This handles both.
fn deserialize_items<'de, D>(deserializer: D) -> Result<Vec<Item>, D::Error>
where
    D: Deserializer<'de>,
{
    #[derive(Deserialize)]
    #[serde(untagged)]
    enum ItemsOrMap {
        Items(Vec<Item>),
        Empty(serde_json::Value), // catch {} or anything else
    }
    match ItemsOrMap::deserialize(deserializer)? {
        ItemsOrMap::Items(items) => Ok(items),
        ItemsOrMap::Empty(_) => Ok(Vec::new()),
    }
}

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
#[serde(default)]
pub struct ActivePlayer {
    #[serde(rename = "summonerName")]
    pub summoner_name: String,
    #[serde(rename = "riotIdGameName")]
    pub riot_id_game_name: String,
    #[serde(rename = "riotIdTagLine")]
    pub riot_id_tag_line: String,
    pub level: u32,
    #[serde(rename = "currentGold")]
    pub current_gold: f64,
    #[serde(rename = "championStats")]
    pub champion_stats: ChampionStats,
    pub abilities: serde_json::Value,
    #[serde(rename = "fullRunes")]
    pub full_runes: serde_json::Value,
    #[serde(rename = "teamRelativeColors")]
    pub team_relative_colors: serde_json::Value,
    #[serde(rename = "riotId")]
    pub riot_id: String,
}

impl Default for ActivePlayer {
    fn default() -> Self {
        Self {
            summoner_name: String::new(),
            riot_id_game_name: String::new(),
            riot_id_tag_line: String::new(),
            level: 0,
            current_gold: 0.0,
            champion_stats: ChampionStats::default(),
            abilities: serde_json::Value::Null,
            full_runes: serde_json::Value::Null,
            team_relative_colors: serde_json::Value::Null,
            riot_id: String::new(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(default)]
pub struct ChampionStats {
    #[serde(rename = "abilityPower")]
    pub ability_power: f64,
    #[serde(rename = "abilityHaste")]
    pub ability_haste: f64,
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
    #[serde(rename = "bonusArmorPenetrationPercent")]
    pub bonus_armor_penetration_percent: f64,
    #[serde(rename = "bonusMagicPenetrationPercent")]
    pub bonus_magic_penetration_percent: f64,
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
    #[serde(rename = "healthRegenRate")]
    pub health_regen_rate: f64,
    pub omnivamp: f64,
    #[serde(rename = "physicalLethality")]
    pub physical_lethality: f64,
    #[serde(rename = "magicLethality")]
    pub magic_lethality: f64,
    #[serde(rename = "physicalVamp")]
    pub physical_vamp: f64,
    #[serde(rename = "healShieldPower")]
    pub heal_shield_power: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Player {
    #[serde(rename = "summonerName")]
    pub summoner_name: String,
    #[serde(rename = "riotId")]
    pub riot_id: String,
    #[serde(rename = "riotIdGameName")]
    pub riot_id_game_name: String,
    #[serde(rename = "riotIdTagLine")]
    pub riot_id_tag_line: String,
    #[serde(rename = "championName")]
    pub champion_name: String,
    #[serde(rename = "rawChampionName")]
    pub raw_champion_name: String,
    #[serde(rename = "skinName")]
    pub skin_name: String,
    #[serde(rename = "rawSkinName")]
    pub raw_skin_name: String,
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
    #[serde(deserialize_with = "deserialize_items")]
    pub items: Vec<Item>,
    pub scores: Scores,
    pub runes: serde_json::Value,
    #[serde(rename = "summonerSpells")]
    pub summoner_spells: serde_json::Value,
}

impl Default for Player {
    fn default() -> Self {
        Self {
            summoner_name: String::new(),
            riot_id: String::new(),
            riot_id_game_name: String::new(),
            riot_id_tag_line: String::new(),
            champion_name: String::new(),
            raw_champion_name: String::new(),
            skin_name: String::new(),
            raw_skin_name: String::new(),
            level: 0,
            team: String::new(),
            position: String::new(),
            is_dead: false,
            is_bot: false,
            respawn_timer: 0.0,
            skin_id: 0,
            items: Vec::new(),
            scores: Scores::default(),
            runes: serde_json::Value::Null,
            summoner_spells: serde_json::Value::Null,
        }
    }
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

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(default)]
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
#[serde(default)]
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

impl Default for GameData {
    fn default() -> Self {
        Self {
            game_mode: String::new(),
            game_time: 0.0,
            map_name: String::new(),
            map_number: 0,
            map_terrain: String::new(),
        }
    }
}
