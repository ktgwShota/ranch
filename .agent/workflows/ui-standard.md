---
description: UI実装基準、コンポーネント使用法、スタイリングルールのチェック
globs: "**/*.{tsx,ts,css}"
---

# UI実装基準 (UI Standard)

## 1. コンポーネント使用ルール
- **ベースライブラリ**: `shadcn/ui` を主要コンポーネントライブラリとして使用する。
- **Shadcnの改造禁止**: `src/components/ui/` 内のファイルを直接変更してはならない。
- **ラッパーの作成**: カスタマイズが必要な場合は、Shadcnコンポーネントをラップする独自コンポーネントを作成する。
  - 特定機能用: `src/app/(feature)/components/` に配置。
  - 全体共通: `src/components/` に配置（Shadcnと名前が被らないように `AppButton` 等とする）。

## 2. 環境・パフォーマンス
- **Edge Runtime**: 全てのコードは Cloudflare Workers/Pages (Edge Runtime) で動作する必要がある。
- **バンドルサイズ**: 新規依存ライブラリは小さいもの（3KB gzip未満）を選ぶこと。

## 3. スタイリング
- **Tailwind CSS**: 原則として Utility Class を使用する。
- **CSS Modules禁止**: CSS Modules は使用しない。
- **色指定**: `tailwind.config.ts` で定義されたテーマ変数を使用する。ハードコードされたHEX値は避ける。

## 4. コーディングスタイル
- **Server Components優先**: デフォルトは Server Components で実装する。インタラクティブな末端部分のみ `'use client'` を付与する。
- **Server Actions**: データの取得・更新には Server Actions を使用する。API Routes は避ける。
- **型定義**: 型はコンポーネントファイル内に定義する。`src/types/` は真にグローバルな型のみに使用する。
- **Zod**: バリデーションと型推論には Zod を使用する。
