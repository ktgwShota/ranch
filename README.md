# My Next.js App with Cloudflare D1

Next.js プロジェクトに Cloudflare D1 データベースを統合したアプリケーションです。
OpenNext (@opennextjs/cloudflare) を利用して、Next.js アプリケーションを Cloudflare Workers 上で動作させています。

## 🚀 技術スタック

### 言語 & フレームワーク
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Next.js 15.4](https://nextjs.org/)** (App Router / Server Actions)

### インフラ & データベース
- **[Cloudflare Workers](https://workers.cloudflare.com/)** (エッジランタイム)
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)** (SQLite データベース)
- **[OpenNext](https://opennext.js.org/)** (Cloudflare Adapter)

### UI & デザイン
- **[Material UI v6](https://mui.com/)** (コンポーネントライブラリ)
- **[Tailwind CSS v4](https://tailwindcss.com/)** (ユーティリティCSS)
- **[Framer Motion](https://www.framer.com/motion/)** (アニメーション)
- **[Lenis](https://lenis.studio/)** (スムーススクロール)

### 状態管理 & フォーム
- **[Zustand](https://github.com/pmndrs/zustand)** (グローバルステート管理)
- **[React Hook Form](https://react-hook-form.com/)** (フォーム管理)
- **[Zod](https://zod.dev/)** (スキーマバリデーション)
- **[Day.js](https://day.js.org/)** (日付操作)

### 開発ツール
- **[Biome](https://biomejs.dev/)** (高速リンター & フォーマッター)
- **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)** (Cloudflare CLI)

## 📊 アーキテクチャ

### リクエスト処理フロー

すべてのリクエストは OpenNext が生成した Worker エントリーポイントによって処理され、Next.js の App Router 機能（Page, API Route）にルーティングされます。

```
Cloudflare Worker (Entrypoint)
    ↓
.open-next/worker.js (OpenNext Generated)
    ↓
Next.js App Router / API Routes
    ↓
D1 Database Access (via Binding)
```

## 🛠️ セットアップ手順

このリポジトリをローカル環境で動作させるための手順です。

### 1. 依存関係のインストール

```bash
npm install
```

### 2. ローカルデータベースの準備

ローカル開発用のD1データベース（SQLite）を作成し、初期スキーマを適用します。

```bash
npm run db:setup
```

### 3. 開発サーバーの起動

**A. フロントエンド開発（推奨）**
UIやコンポーネントの実装に適しています。ホットリロードが高速です。
※ D1データベースへの接続はできません（APIはモックまたはエラーになります）。

```bash
npm run dev
# -> http://localhost:3000
```

**B. API / データベース開発**
Cloudflare Pages 互換モードで起動します。ローカルD1データベースに実際に接続して動作確認ができます。
※ 設定変更時は再起動が必要です。

```bash
npm run dev:cf
# -> http://localhost:8788
```

## 🗄️ データベース操作（ローカル）

開発中にデータベースを操作するコマンドです。

```bash
# テーブルのリセット（スキーマの再適用）
npm run db:reset

# 任意のSQLを実行
npm run db:query -- "SELECT * FROM polls LIMIT 5"
```

スキーマ定義ファイル: `src/services/db/migrations/schema.sql`

## 📁 ディレクトリ構造

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API Routes (Backend Logic)
│   ├── (home)/          # トップページのコンポーネント
│   ├── polls/           # 店決め（多数決）機能
│   └── schedule/        # 日程調整機能
├── components/           # 共通 React コンポーネント
├── lib/                  # 汎用ライブラリ (DB接続, OGP取得など)
├── services/             # ビジネスロジック & DBアクセス層
│   └── db/
│       └── migrations/  # SQLマイグレーションファイル
└── types/                # 型定義ファイル
```

## 📏 開発ルール

### コンポーネントの配置
- **`app/components/`**: アプリ全体で使う汎用コンポーネント（Header, Footer, UIパーツなど）。
- **`app/**/components/`**: 特定のページや機能に依存するコンポーネント。

### 環境変数とDB接続
D1データベースへのアクセスには `env.DB` バインディングを使用します。
Next.js API Route 内では `getCloudflareContext()` を使用して環境変数を取得します。

## 📚 利用可能なコマンド

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | フロントエンド開発サーバー起動 |
| `npm run dev:cf` | API/DB連携用サーバー起動（Cloudflare互換） |
| `npm run db:setup` | ローカルDBの作成・初期化 |
| `npm run db:reset` | ローカルDBのリセット |
| `npm run lint` | コードの静的解析 (Biome) |
| `npm run format` | コードのフォーマット (Biome) |
| `npm run cf-typegen` | Cloudflare型定義の自動生成 |
