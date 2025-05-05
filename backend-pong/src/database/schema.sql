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
  percentage REAL NOT NULL DEFAULT 0.0

  -- Constraints
  FOREIGN KEY (configuration) REFERENCES configuration(id) ON DELETE CASCADE
);

