-- Users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  alias TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT DEFAULT NULL,
  language TEXT NOT NULL,
  tfa INTEGER NOT NULL DEFAULT 0
);

-- Friend status
CREATE TABLE IF NOT EXISTS friend_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE
);
INSERT OR IGNORE INTO friend_status(name) VALUES('Accepted');
INSERT OR IGNORE INTO friend_status(name) VALUES('Pending');

-- Friends table:
CREATE TABLE IF NOT EXISTS friends (
  user_a INTEGER NOT NULL,
  user_b INTEGER NOT NULL,
  status INTEGER NOT NULL,

  PRIMARY KEY (user_a, user_b),
  FOREIGN KEY (user_a) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_b) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (status) REFERENCES friend_status(id)
);