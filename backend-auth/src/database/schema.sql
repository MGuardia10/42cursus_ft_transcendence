-- TFA codes
CREATE TABLE IF NOT EXISTS tfa_codes (
  hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  code INTEGER NOT NULL,
  tries INTEGER NOT NULL DEFAULT 3
);

-- Invitation codes
CREATE TABLE IF NOT EXISTS invitation_codes (
  hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  code INTEGER NOT NULL,
  tries INTEGER NOT NULL DEFAULT 3
);
