-------------------
-- Configuration --
-------------------
CREATE TABLE IF NOT EXISTS configuration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  default_value INTEGER NOT NULL DEFAULT 1,
  points_to_win INTEGER NOT NULL,
  serve_delay INTEGER NOT NULL,
  ball_color TEXT NOT NULL,
  stick_speed INTEGER NOT NULL,
  field_color INTEGER NOT NULL
);


-------------
-- Players --
-------------
CREATE TABLE IF NOT EXISTS players (
  -- Generic information
  id INTEGER PRIMARY KEY,
  active INTEGER NOT NULL DEFAULT 1,
  configuration_id INTEGER NOT NULL,

  -- Games/punctuation data
  win_count INTEGER NOT NULL DEFAULT 0,
  lose_count INTEGER NOT NULL DEFAULT 0,
  win_points INTEGER NOT NULL DEFAULT 0,
  lose_points INTEGER NOT NULL DEFAULT 0,

  -- Constraints
  FOREIGN KEY (configuration_id) REFERENCES configuration(id) ON DELETE CASCADE
);


-----------
-- Games --
-----------

-- Game status
CREATE TABLE IF NOT EXISTS game_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE
);
INSERT OR IGNORE INTO game_status(name) VALUES('Waiting');
INSERT OR IGNORE INTO game_status(name) VALUES('In Progress');
INSERT OR IGNORE INTO game_status(name) VALUES('Finished');

-- Games
CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status INTEGER NOT NULL,
  date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Players and puntuation
  player_a_id INTEGER NOT NULL,
  player_a_score INTEGER NOT NULL,
  player_b_id INTEGER NOT NULL,
  player_b_score INTEGER NOT NULL,

  -- Constraints
  FOREIGN KEY (status) REFERENCES game_status(id),
  FOREIGN KEY (player_a_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (player_b_id) REFERENCES players(id) ON DELETE CASCADE
);


-----------------
-- Tournaments --
-----------------

-- Tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  configuration_id INTEGER NOT NULL,

  -- Constraints
  FOREIGN KEY (configuration_id) REFERENCES configuration(id) ON DELETE CASCADE
);

-- Tournament players
CREATE TABLE IF NOT EXISTS tournament_players (
  tournament_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,

  -- Constraints
  PRIMARY KEY (tournament_id, player_id),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Tournament games
CREATE TABLE IF NOT EXISTS tournament_games (
  tournament_id INTEGER NOT NULL,
  game_id INTEGER NOT NULL,
  phase INTEGER NOT NULL,
  ordr INTEGER NOT NULL,

  -- Constraints
  PRIMARY KEY (tournament_id, game_id),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
