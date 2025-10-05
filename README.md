# My Next.js App with Cloudflare D1

Next.js プロジェクトに Cloudflare D1 データベースを統合したアプリケーションです。

## 🚀 機能

- **Next.js 15.4.6** (App Router)
- **Cloudflare D1** データベース統合
- **環境別データベース** (ステージング・本番)
- **マイグレーション管理**
- **TypeScript** 完全対応
- **Material-UI** によるモダンなUI

## 📋 前提条件

- Node.js 20.x 以上
- npm または yarn
- Cloudflare アカウント
- Wrangler CLI

## 🛠️ セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Cloudflare D1 データベースの作成

```bash
# ステージング用データベース
npm run db:create:staging

# 本番用データベース
npm run db:create:production
```

各コマンドの実行後、表示されるデータベースIDを `wrangler.jsonc` の `database_id` に設定してください。

### 3. マイグレーションの実行

```bash
# ローカル開発環境（ステージングDB）
npm run db:migrate:staging

# リモートのステージングDB
npm run db:migrate:staging:remote

# 本番DB
npm run db:migrate:production:remote
```

## 🏃‍♂️ 開発サーバーの起動

### 通常のNext.js開発サーバー（推奨）

```bash
npm run dev
```

- URL: http://localhost:3000
- 通常のNext.js開発環境
- フロントエンド開発に最適
- D1データベースは利用不可（モックAPI使用）

### Cloudflare Pages互換開発サーバー

```bash
npm run dev:cf
```

- URL: http://localhost:8788
- Cloudflare Pages環境と同等
- D1データベースに接続可能
- **注意**: 静的ファイルの配信に問題がある場合があります

### 使い分けの推奨

- **フロントエンド開発**: `npm run dev` を使用
- **API Route・D1テスト**: `npm run dev:cf` を使用
- **本番環境テスト**: デプロイ後のURLを使用

## 🚀 デプロイ

### ステージング環境へのデプロイ

```bash
npm run deploy:staging
```

- デプロイ先: https://my-next-app-staging.ktgw-shota-1998.workers.dev
- データベース: `myapp_stg`

### 本番環境へのデプロイ

```bash
npm run deploy:production
```

- データベース: `myapp_prod`

### 通常のデプロイ

```bash
npm run deploy
```

## 🗄️ データベース管理

### ローカルD1データベース（完全ローカル環境）

ローカル開発用のD1データベースは、Cloudflare上ではなく、ローカルPC上（Miniflare）に作成されます。

#### ローカルD1の特徴
- **保存場所**: `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/XXXX.sqlite`
- **完全ローカル**: Cloudflare上には存在しない
- **データ永続化**: `wrangler dev`実行時に自動的にマウントされる
- **任意のID**: `database_id`は任意の値でOK（例: "1"）

#### ローカルD1へのデータ追加

```bash
# 1. スキーマファイルの作成
# worker/schema.sql にテーブル定義とデータを記述

# 2. ローカルD1にスキーマを適用
npx wrangler d1 execute myapp-local --local --file=./worker/schema.sql

# 3. データの確認
npx wrangler d1 execute myapp-local --local --command="SELECT * FROM Customers"

# 4. 個別のSQLコマンド実行
npx wrangler d1 execute myapp-local --local --command="INSERT INTO Customers (name, email) VALUES ('新規ユーザー', 'new@example.com')"

# 5. 開発サーバー起動（ローカルD1が自動マウントされる）
npm run dev
```

#### ローカルD1のリセット

```bash
# ローカルD1データベースを削除（完全リセット）
rm -rf .wrangler/state/v3/d1/

# 再作成
npx wrangler d1 execute myapp-local --local --file=./worker/schema.sql
```

### マイグレーション

```bash
# ローカル（ステージング）
npm run db:migrate:staging

# リモート（ステージング）
npm run db:migrate:staging:remote

# リモート（本番）
npm run db:migrate:production:remote
```

### データベースの確認

```bash
# ステージング環境のテーブル一覧
npm run db:studio:staging

# 本番環境のテーブル一覧
npm run db:studio:production
```

### 新しいマイグレーションの作成

1. `migrations/` ディレクトリに新しいSQLファイルを作成
2. ファイル名: `{連番}_{説明}.sql` (例: `0003_add_new_feature.sql`)
3. ローカルでテスト後、リモートに適用

## 🧪 API テスト

### ヘルスチェック

```bash
curl https://my-next-app-staging.ktgw-shota-1998.workers.dev/api/health
```

### D1データベース接続テスト

```bash
# GET: 接続テスト
curl https://my-next-app-staging.ktgw-shota-1998.workers.dev/api/test

# POST: データ挿入テスト
curl -X POST https://my-next-app-staging.ktgw-shota-1998.workers.dev/api/test \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```

### モックAPI（ローカル開発用）

```bash
# ローカル開発サーバーでテスト
curl http://localhost:3000/api/db-test
```

## 📁 プロジェクト構造

```
my-next-app/
├── src/
│   ├── app/
│   │   ├── api/           # API Routes
│   │   │   ├── test/      # D1接続テスト
│   │   │   ├── health/    # ヘルスチェック
│   │   │   └── db-test/   # モックAPI
│   │   ├── components/    # React コンポーネント
│   │   └── ...
│   └── lib/
│       └── db.ts          # D1接続ユーティリティ
├── migrations/            # データベースマイグレーション
│   ├── worker/schema.sql
│   ├── 0002_add_sample_data.sql
│   └── README.md
├── wrangler.jsonc         # Cloudflare設定
├── package.json
└── README.md
```

## 🔧 設定ファイル

### wrangler.jsonc

```jsonc
{
  "name": "my-next-app",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-03-01",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "myapp_stg",
      "database_id": "your-staging-database-id"
    }
  ],
  "env": {
    "staging": {
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "myapp_stg",
          "database_id": "your-staging-database-id"
        }
      ]
    },
    "production": {
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "myapp_prod",
          "database_id": "your-production-database-id"
        }
      ]
    }
  }
}
```

## 🌍 環境変数

- `NODE_ENV=production` → `myapp_prod` データベース
- その他（local/preview） → `myapp_stg` データベース

## 📚 利用可能なスクリプト

```bash
# 開発
npm run dev              # 通常のNext.js開発サーバー
npm run dev:cf           # Cloudflare Pages互換開発サーバー

# ビルド・デプロイ
npm run build            # プロダクションビルド
npm run deploy           # 通常デプロイ
npm run deploy:staging   # ステージング環境デプロイ
npm run deploy:production # 本番環境デプロイ

# データベース
npm run db:create:staging     # ステージングDB作成
npm run db:create:production  # 本番DB作成
npm run db:migrate:staging    # ローカルマイグレーション
npm run db:migrate:staging:remote    # リモートマイグレーション（ステージング）
npm run db:migrate:production:remote # リモートマイグレーション（本番）

# ローカルD1データベース
npm run db:setup              # ローカルD1にスキーマ適用
npm run db:local:query        # ローカルD1でクエリ実行
npm run db:local:reset        # ローカルD1を完全リセット

# その他
npm run lint             # ESLint実行
npm run cf-typegen       # Cloudflare型定義生成
```

## 🔍 トラブルシューティング

### よくある問題

1. **データベースIDが正しく設定されていない**
   - `wrangler.jsonc` の `database_id` を確認
   - `npm run db:create:staging` で取得したIDを使用

2. **マイグレーションが実行されない**
   - データベースが正しく作成されているか確認
   - Wrangler CLI が最新版か確認

3. **ローカル開発でD1に接続できない**
   - `npm run dev:cf` を使用してCloudflare Pages互換モードで起動

4. **型エラーが発生する**
   - `npm run cf-typegen` を実行して型定義を更新

5. **デプロイでエラーが発生する**
   - `npm run build` でビルドエラーがないか確認
   - Cloudflare アカウントの認証状態を確認

### ログの確認

```bash
# Wranglerのログを確認
wrangler tail

# 特定の環境のログ
wrangler tail --env=staging
```

## 📖 参考リンク

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Documentation](https://nextjs.org/docs)
- [@opennextjs/cloudflare](https://opennext.js.org/cloudflare)

## 📄 ライセンス

MIT License

---

## 🎯 クイックスタート

1. **セットアップ**
   ```bash
   npm install
   npm run db:create:staging
   npm run db:migrate:staging
   ```

2. **開発開始**
   ```bash
   npm run dev:cf
   ```

3. **デプロイ**
   ```bash
   npm run deploy:staging
   ```

4. **テスト**
   ```bash
   curl https://my-next-app-staging.ktgw-shota-1998.workers.dev/api/test
   ```

これで Cloudflare D1 を使った Next.js アプリケーションの開発・デプロイが可能です！