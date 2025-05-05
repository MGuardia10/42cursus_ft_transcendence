-- Configuration
CREATE TABLE IF NOT EXISTS configuration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  default_value INTEGER NOT NULL DEFAULT 1,
  points_to_win INTEGER NOT NULL,
  serve_delay INTEGER NOT NULL,
  ball_color TEXT NOT NULL,
  bar_speed INTEGER NOT NULL,
  field_color INTEGER NOT NULL
);

-- Players
CREATE TABLE IF NOT EXISTS test (
  -- Generic information
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  active INTEGER NOT NULL DEFAULT 1,
  configuration INTEGER NOT NULL,

  -- Games/punctuation data
  win_count INTEGER NOT NULL DEFAULT 0,
  lose_count INTEGER NOT NULL DEFAULT 0,
  win_points INTEGER NOT NULL DEFAULT 0,
  lose_points INTEGER NOT NULL DEFAULT 0,
  percentage REAL NOT NULL DEFAULT 0.0,

  -- Constraints
  FOREIGN KEY (configuration) REFERENCES configuration(id) ON DELETE CASCADE
);

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
  player_a INTEGER NOT NULL,
  player_a_score INTEGER NOT NULL,
  player_b INTEGER NOT NULL,
  player_b_score INTEGER NOT NULL,

  -- Constraints
  FOREIGN KEY (status) REFERENCES game_status(id),
  FOREIGN KEY (player_a) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (player_b) REFERENCES players(id) ON DELETE CASCADE
);