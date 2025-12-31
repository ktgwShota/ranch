export const COLORS = {
  // Brand Colors
  PRIMARY: '#2563eb', // ロイヤルブルー (信頼感) - Main Actions, Hero, Links
  PRIMARY_LIGHT: '#dbeafe', // 薄いブルー (背景アクセント)

  // Accents (Used for specific features/services)
  ACCENT_CYAN: '#0ea5e9', // スカイブルー
  ACCENT_INDIGO: '#6366f1', // インディゴ (Service: Discovery等)
  ACCENT_PURPLE: '#8b5cf6', // パープル (Service: Schedule, HowToUse: Schedule)
  ACCENT_ORANGE: '#f97316', // オレンジ (HowToUse: Poll)

  // Backgrounds
  BG_LIGHT: '#ffffff', // 純白の背景
  BG_GRAY: '#f8fafc', // わずかにグレーな背景
  BG_DARK: '#1e293b', // ダークセクション背景 (About, HowToUse)
  BG_DARK_LIGHT: '#334155', // ダークモード上のカード/ボタン背景 (Slate 700)

  // Text
  TEXT_MAIN: '#0f172a', // Slate 900 (見出し, 重要テキスト)
  TEXT_SUB: '#475569', // Slate 600 (本文, 補足)
  TEXT_ON_DARK: '#ffffff', // 白 (ダークモード見出し)
  TEXT_SUB_ON_DARK: '#cbd5e1', // Slate 300 (ダークモード本文)
  TEXT_MUTED: '#94a3b8', // Slate 400 (無効化, 控えめなラベル)

  // UI Elements
  BORDER: '#cbd5e1', // Slate 300 (標準枠線)
  BORDER_LIGHT: '#e2e8f0', // Slate 200 (薄い枠線 - カード等)
  CARD_BG: '#ffffff', // カード背景
  SHADOW_COLOR: 'rgba(0, 0, 0, 0.1)', // 汎用シャドウ
};

export const ANIMATION_DELAYS = {
  TITLE: 0.5,
  SUBTITLE: 2.2,
  BUTTONS: 3.3,
  CARD: 3.3,
  ARROW: 4.5,
};

export const FAQ_ITEMS = [
  {
    question: '会員登録は必要ですか？',
    answer:
      'いいえ、会員登録なしですぐにご利用いただけます。アプリのインストールも不要で、ブラウザからそのまま使えます。',
  },
  {
    question: '利用料金はかかりますか？',
    answer: 'いいえ、すべての機能を無料でご利用いただけます。',
  },
  {
    question: '作成したイベントの後から編集はできますか？',
    answer:
      'はい、イベント作成後に発行される「編集用URL」から、タイトルや候補の追加・変更が可能です。',
  },
  {
    question: '推奨環境を教えてください',
    answer:
      'スマートフォン（iOS / Android）、PCの最新のブラウザ（Google Chrome, Safari, Edgeなど）でご利用いただけます。',
  },
];
