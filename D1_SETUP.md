# Cloudflare D1 セットアップガイド

このガイドでは、Next.js プロジェクトで Cloudflare D1 を設定・使用する手順を説明します。

## 前提条件

- Cloudflare アカウント
- Wrangler CLI がインストール済み
- Node.js と npm がインストール済み

## 1. D1 データベースの作成

### ステージング用データベースの作成
```bash
npm run db:create:staging
```

### 本番用データベースの作成
```bash
npm run db:create:production
```

各コマンドの実行後、データベースIDが表示されます。このIDを `wrangler.jsonc` の `database_id` に設定してください。

## 2. wrangler.jsonc の設定

作成されたデータベースIDを `wrangler.jsonc` に設定します：

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "myapp_stg",
      "database_id": "your-actual-staging-database-id-here"
    }
  ],
  "env": {
    "production": {
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "myapp_prod",
          "database_id": "your-actual-production-database-id-here"
        }
      ]
    }
  }
}
```

## 3. マイグレーションの実行

### ローカル開発環境
```bash
# ローカルでマイグレーションを実行
npm run db:migrate:staging
```

### リモート環境
```bash
# ステージング環境にマイグレーションを適用
npm run db:migrate:staging:remote

# 本番環境にマイグレーションを適用
npm run db:migrate:production:remote
```

## 4. ローカル開発環境での起動

### 通常のNext.js開発サーバー
```bash
npm run dev
```

### Cloudflare Pages互換の開発サーバー（D1接続可能）
```bash
npm run dev:cf
```

## 5. データベース接続のテスト

API Route を使用してデータベース接続をテストできます：

```bash
# GET リクエストで接続テスト
curl http://localhost:3000/api/test

# POST リクエストでデータ挿入テスト
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```

## 6. デプロイ

### ステージング環境へのデプロイ
```bash
npm run deploy:staging
```

### 本番環境へのデプロイ
```bash
npm run deploy:production
```

## 7. データベースの管理

### データベースの内容確認
```bash
# ステージング環境
npm run db:studio:staging

# 本番環境
npm run db:studio:production
```

### 型定義の更新
```bash
npm run cf-typegen
```

## 環境変数の管理

- `NODE_ENV=production` の場合 → `myapp_prod` データベースを使用
- それ以外（local/preview） → `myapp_stg` データベースを使用

## トラブルシューティング

### よくある問題

1. **データベースIDが正しく設定されていない**
   - `wrangler.jsonc` の `database_id` を確認してください

2. **マイグレーションが実行されない**
   - データベースが正しく作成されているか確認してください
   - Wrangler CLI が最新版か確認してください

3. **ローカル開発でD1に接続できない**
   - `npm run dev:cf` を使用してCloudflare Pages互換モードで起動してください

4. **型エラーが発生する**
   - `npm run cf-typegen` を実行して型定義を更新してください

## 参考リンク

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
