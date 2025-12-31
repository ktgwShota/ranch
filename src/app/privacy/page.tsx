import type { Metadata } from 'next';
import StyledList from '@/components/ui/StyledList';
// import { LAYOUT_CONSTANTS } from '@/config/constants';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'Choisur（チョイスル）のプライバシーポリシーを記載したページです',
  openGraph: {
    title: 'プライバシーポリシー',
    description: 'Choisur（チョイスル）のプライバシーポリシーを記載したページです。',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <h1 className="mb-8 font-bold text-[rgba(0,0,0,0.87)] text-lg sm:text-xl">
        プライバシーポリシー
      </h1>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">1. はじめに</h6>
        <p className="text-[rgba(0,0,0,0.6)] leading-relaxed">
          Choisur（以下「当サービス」といいます）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
        </p>
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">2. 収集する情報</h6>
        <p className="mb-6 text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、以下の情報を収集する場合があります。
        </p>
        <StyledList
          items={[
            '投票作成時に入力された情報（投票タイトル、選択肢のURL、説明文など）',
            '投票参加時に入力された情報（投票者名など）',
            'アクセスログ、IPアドレス、ブラウザ情報などの技術的情報',
          ]}
        />
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">3. 情報の利用目的</h6>
        <p className="mb-6 text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、収集した情報を以下の目的で利用します。
        </p>
        <StyledList
          items={[
            '投票サービスの提供・運営',
            'サービスの改善・新機能の開発',
            '不正利用の防止',
            'お問い合わせへの対応',
          ]}
        />
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">4. 情報の管理</h6>
        <p className="mb-6 text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、ユーザーの個人情報を適切に管理し、以下の措置を講じます。
        </p>
        <StyledList
          items={[
            '個人情報への不正アクセス・紛失・破壊・改ざん・漏洩などのリスクに対して、適切かつ合理的な安全対策を実施します',
            '個人情報の取扱いに関する規程を整備し、従業員への教育を実施します',
          ]}
        />
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">5. 第三者への提供</h6>
        <p className="mb-6 text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
        </p>
        <StyledList
          items={[
            'ユーザーの同意がある場合',
            '法令に基づく場合',
            '人の生命、身体または財産の保護のために必要がある場合',
          ]}
        />
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">6. Cookie（クッキー）の使用</h6>
        <p className="text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、サービスの提供および改善のため、Cookieを使用する場合があります。
          Cookieの使用により収集された情報は、統計的な分析に利用されます。
        </p>
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">
          7. プライバシーポリシーの変更
        </h6>
        <p className="text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、必要に応じて、本ポリシーの内容を変更することがあります。
          変更後のプライバシーポリシーは、当サービスに掲載した時点で効力を生じるものとします。
        </p>
      </div>

      <div>
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">8. お問い合わせ</h6>
        <p className="text-[rgba(0,0,0,0.6)] leading-relaxed">
          個人情報の取扱いに関するお問い合わせは、
          <a href="/contact" className="text-[#1976d2] no-underline">
            お問い合わせページ
          </a>
          からご連絡ください。
        </p>
      </div>
    </>
  );
}
