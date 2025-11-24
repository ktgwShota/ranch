-- Contacts テーブルの作成
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  isRead INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- インデックスの作成（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_contacts_createdAt ON contacts(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_isRead ON contacts(isRead);

