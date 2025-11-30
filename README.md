# My Next.js App with Cloudflare D1

Next.js プロジェクトに Cloudflare D1 データベースを統合したアプリケーションです。

## 🚀 機能

- **Next.js 15.4.6** (App Router)
- **Cloudflare D1** データベース統合
- **環境別データベース** (ステージング・本番)
- **マイグレーション管理**
- **TypeScript** 完全対応
- **Material-UI** によるモダンなUI

## 📊 アーキテクチャとデータフロー

### 全体構成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │ Cloudflare      │
│   (React)       │◄──►│   Routes        │◄──►│ Worker + D1     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### リクエストフロー

#### 1. **エントリーポイント (src/worker/main.ts)**
すべてのリクエストが最初に通る場所：

```
Cloudflare Worker
    ↓
src/worker/main.ts (エントリーポイント)
    ↓
URL判定
    ├── /worker/db/* → Worker DB API
    └── その他 → Next.js App
```

#### 2. **Worker DB API の流れ**
```
リクエスト → main.ts → routes/index.ts → routes/polls.ts → services/database.ts → D1 Database
```

#### 3. **Next.js App の流れ**
```
リクエスト → main.ts → .open-next/worker.js → Next.js App Router → API Routes
```

### データベース操作の流れ

#### **投票作成の例:**
```
1. Frontend: POST /api/polls
2. Next.js API: OGP情報取得 + データ整形
3. Next.js API: POST /worker/db/polls (Worker API呼び出し)
4. Worker: routes/polls.ts → services/database.ts
5. Database: D1 にデータ保存
6. Response: 作成された投票データを返却
```

#### **投票取得の例:**
```
1. Frontend: GET /api/polls/[id]
2. Next.js API: GET /worker/db/polls/[id] (Worker API呼び出し)
3. Worker: routes/polls.ts → services/database.ts
4. Database: D1 からデータ取得
5. Response: 投票データを返却
```

### ディレクトリ構造

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API Routes (ビジネスロジック)
│   ├── components/      # React Components
│   └── polls/           # Poll Pages
├── libs/                 # Libraries & Utilities
│   ├── mui/             # Material-UI
│   └── api-helpers.ts   # API Helpers
├── types/                # Type Definitions
│   └── worker.ts         # Worker Types
└── worker/               # Cloudflare Worker
    ├── main.ts          # エントリーポイント
    ├── routes/          # ルーティング
    ├── services/        # ビジネスロジック
    ├── utils/           # ユーティリティ
    └── sqls/            # SQL Files
```

### コンポーネント分類ルール

#### ✅ `app/components/` に配置する
- 複数のページで使用されるコンポーネント
- 他のコンポーネントや Context に依存しない独立したコンポーネント
- 例: `Header`, `Footer`, `OGPPreview`

#### ❌ `app/components/` に配置しない
- **特定の Context に依存しているコンポーネント** → `app/contexts/` に配置
  - 例: `app/contexts/TutorialContext.tsx` 内の `Tutorial` コンポーネント
- **特定のページでのみ使用するコンポーネント** → 該当するページのディレクトリに配置
  - 例: `app/polls/[id]/components/` 内のコンポーネント

### 型定義分類ルール

#### ✅ コンポーネントファイル内に定義する
- **コンポーネントのProps型** → コンポーネントファイル内に直接定義
  - そのコンポーネントでのみ使用される型
  - 例: `OptionCard.tsx` 内の `OptionCardProps`

```typescript
// OptionCard.tsx
interface OptionCardProps {
  option: Option;
  totalVotes: number;
  // ...
}

export function OptionCard({ option, ... }: OptionCardProps) {
  // ...
}
```

#### ✅ `types.ts` に定義する
- **複数の場所で使用される型** → 機能のディレクトリ内の `types.ts` に配置
  - 複数のコンポーネントやhooksで使用される型
  - 例: `app/polls/[id]/types.ts` 内の `Poll`, `Option`, `Voter`

```typescript
// types.ts
export interface Poll {
  id: string;
  title: string;
  options: Option[];
}
```

#### ✅ Contextファイル内に定義する
- **Context専用の型** → Contextファイル内に直接定義
  - Contextと一緒に管理する型
  - 例: `TutorialContext.tsx` 内の `TutorialStep`

```typescript
// TutorialContext.tsx
interface TutorialStep {
  elementId: string;
  title: string;
  // ...
}
```

#### 判断基準

| 型の種類 | 配置場所 | 例 |
|---------|---------|-----|
| **コンポーネントのProps** | コンポーネントファイル内 | `OptionCardProps` |
| **複数箇所で使用** | `types.ts` | `Poll`, `Option` |
| **Context専用** | Contextファイル内 | `TutorialStep` |
| **汎用的な型** | `types.ts` | `OGPData`（他の場所でも使う可能性） |

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

### 通常のNext.js開発サーバー（フロントエンド開発用・推奨）

```bash
npm run dev
```

- **URL**: http://localhost:3000
- **ホットリロード**: ✅ 有効（ファイル変更が即座に反映される）
- **用途**: フロントエンド開発（UI、コンポーネント、スタイル）
- **D1データベース**: ❌ 利用不可（APIはエラーになる可能性があります）
- **特徴**: 開発体験が良く、変更が即座に反映される

### Cloudflare Pages互換開発サーバー（API/D1テスト用）

```bash
npm run dev:cf
```

- **URL**: http://localhost:8788
- **ホットリロード**: ❌ 無効（変更を反映するには再起動が必要）
- **用途**: API Route・D1データベースのテスト
- **D1データベース**: ✅ 利用可能（ローカルD1に接続）
- **特徴**: Cloudflare環境と同等の動作

### 使い分けの推奨

| 作業内容 | 使用するコマンド | 理由 |
|---------|----------------|------|
| **フロントエンド開発**<br>（UI、コンポーネント、スタイル） | `npm run dev` | ホットリロードが効き、変更が即座に反映される |
| **API Route開発**<br>（D1データベース操作） | `npm run dev:cf` | D1に接続可能。変更時は再起動が必要 |
| **本番環境テスト** | デプロイ後のURL | 実際の本番環境での動作確認 |

### 開発フローの例

1. **フロントエンド開発時**:
   ```bash
   npm run dev  # http://localhost:3000
   ```
   - コンポーネントやスタイルを変更すると即座に反映
   - APIは動作しないが、UIの確認には最適

2. **API/D1テスト時**:
   ```bash
   npm run dev:cf  # http://localhost:8788
   ```
   - D1データベースに接続してAPIの動作確認
   - 変更を反映するには再起動が必要

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
# src/worker/sqls/schema.sql にテーブル定義とデータを記述

# 2. ローカルD1にスキーマを適用
npx wrangler d1 execute myapp-local --local --file=./src/worker/sqls/schema.sql

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
npx wrangler d1 execute myapp-local --local --file=./src/worker/sqls/schema.sql
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
│   ├── src/worker/sqls/schema.sql
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
npm run cf-typegen       # Cloudflare型定義生成（src/types/cloudflare-env.d.ts）
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
   - Wranglerのバージョンアップ時や新しいCloudflareサービス導入時に実行

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
   # フロントエンド開発（推奨）
   npm run dev
   
   # API/D1テストが必要な場合
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


# 本番 (env=prd)
npx wrangler d1 execute myapp_prod \
  --remote \
  --file="./src/services/db/migrations/schema.sql" \
  --env=prd