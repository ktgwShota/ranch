-- Customers テーブルの作成
CREATE TABLE IF NOT EXISTS Customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- サンプルデータの挿入
INSERT OR IGNORE INTO Customers (name, email) VALUES 
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  ('Charlie', 'charlie@example.com');

-- Polls テーブルの作成
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  duration INTEGER,
  endDateTime TEXT,
  createdBy TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  isClosed INTEGER DEFAULT 0,
  password TEXT
);

-- Poll Options テーブルの作成
CREATE TABLE IF NOT EXISTS poll_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pollId TEXT NOT NULL,
  optionId INTEGER NOT NULL,
  url TEXT NOT NULL,
  title TEXT DEFAULT '店舗情報を取得中...',
  description TEXT DEFAULT '説明を取得中...',
  image TEXT,
  budgetMin TEXT,
  budgetMax TEXT,
  votes INTEGER DEFAULT 0,
  voters TEXT DEFAULT '[]',
  FOREIGN KEY (pollId) REFERENCES polls (id) ON DELETE CASCADE
);

-- サンプル投票データの挿入
INSERT OR IGNORE INTO polls (id, title, duration, endDateTime, createdBy, createdAt, isClosed, password) VALUES 
  ('sample-poll-1', '今日のランチはどこで食べますか？', 30, NULL, 'user1', '2025-10-05T07:00:00.000Z', 0, NULL);

INSERT OR IGNORE INTO poll_options (pollId, optionId, url, title, description, votes, voters) VALUES 
  ('sample-poll-1', 1, 'https://example.com/restaurant1', 'レストランA', '美味しいイタリアン', 3, '["user1", "user2", "user3"]'),
  ('sample-poll-1', 2, 'https://example.com/restaurant2', 'レストランB', '人気の和食', 2, '["user4", "user5"]'),
  ('sample-poll-1', 3, 'https://example.com/restaurant3', 'レストランC', '安い定食屋', 1, '["user6"]');
