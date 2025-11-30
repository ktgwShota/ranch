-- pollsテーブルにpasswordカラムを追加するマイグレーション
-- 既存のテーブルにカラムを追加（既に存在する場合はエラーにならないようにする）

-- SQLiteではALTER TABLE ADD COLUMNを使用
-- ただし、カラムが既に存在する場合はエラーになるため、事前にチェックが必要
-- D1では、カラムが既に存在する場合はエラーになるが、アプリケーション側でエラーハンドリングする

ALTER TABLE polls ADD COLUMN password TEXT;

