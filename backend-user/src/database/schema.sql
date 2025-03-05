
-- Languages
CREATE TABLE IF NOT EXISTS languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE
);

-- Users:
--   · id
--   · Nombre de perfil (alias)
--   · Email
--   · Avatar (url)
--   · Lenguaje (es/en...)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  language INTEGER NOT NULL,

  FOREIGN KEY (language) REFERENCES languages(id)
);


-- Friend status
CREATE TABLE IF NOT EXISTS friend_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE
);

-- Amigos:
--   · Id 1
--   · Id 2
--   · Status

CREATE TABLE IF NOT EXISTS friends (
  user_a INTEGER NOT NULL,
  user_b INTEGER NOT NULL,
  status INTENER NOT NULL,

  FOREIGN KEY user_a REFERENCES users(id),
  FOREIGN KEY user_b REFERENCES users(id),
  FOREIGN KEY status REFERENCES friend_status(id)
);