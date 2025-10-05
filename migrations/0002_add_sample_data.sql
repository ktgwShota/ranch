-- サンプルデータの挿入
-- 開発・テスト用のサンプルデータを追加します

-- サンプルユーザーの挿入
INSERT OR IGNORE INTO users (id, email, name) VALUES 
(1, 'admin@example.com', 'Admin User'),
(2, 'user1@example.com', 'Test User 1'),
(3, 'user2@example.com', 'Test User 2');

-- サンプルポールの挿入
INSERT OR IGNORE INTO polls (id, title, description, options, created_by, expires_at) VALUES 
('sample-poll-1', '好きなプログラミング言語は？', '開発でよく使う言語を教えてください', '["JavaScript", "TypeScript", "Python", "Go", "Rust"]', 1, datetime('now', '+7 days')),
('sample-poll-2', 'Next.js vs React', 'どちらがお好みですか？', '["Next.js", "React", "どちらも好き", "どちらも使わない"]', 2, datetime('now', '+3 days'));

-- サンプル投票の挿入
INSERT OR IGNORE INTO votes (poll_id, user_id, option_index) VALUES 
('sample-poll-1', 2, 1), -- user1 が TypeScript を選択
('sample-poll-1', 3, 2), -- user2 が Python を選択
('sample-poll-2', 1, 0), -- admin が Next.js を選択
('sample-poll-2', 3, 2); -- user2 が どちらも好き を選択
