import type { Metadata } from 'next';
import StyledList from '@/components/ui/StyledList';
// import { LAYOUT_CONSTANTS } from '@/config/constants';

export const metadata: Metadata = {
  title: '利用規約',
  description: 'Choisur（チョイスル）の利用規約を記載したページです。',
  openGraph: {
    title: '利用規約',
    description: 'Choisur（チョイスル）の利用規約を記載したページです。',
  },
};

export default function TermsPage() {
  return (
    <>
      <h1 className="mb-8 font-bold text-[rgba(0,0,0,0.87)] text-lg sm:text-xl">利用規約</h1>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">第1条（適用）</h6>
        <p className="text-[rgba(0,0,0,0.6)] leading-relaxed">
          本利用規約（以下「本規約」といいます）は
          Choisur（以下「当サービス」といいます）の利用条件を定めるものです。
          利用者（以下「ユーザー」といいます）は本規約に同意した場合のみ当サービスを利用することができます。
        </p>
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">第2条（利用登録）</h6>
        <p className="mb-6 text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、無料・登録不要でご利用いただけます。
        </p>
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">第3条（禁止事項）</h6>
        <p className="mb-6 text-[rgba(0,0,0,0.6)] leading-relaxed">
          ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
        </p>
        <StyledList
          items={[
            '法令または公序良俗に違反する行為',
            '犯罪行為に関連する行為',
            '当サービスの内容等、当サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為',
            '当サービス、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為',
            '当サービスによって得られた情報を商業的に利用する行為',
          ]}
        />
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">
          第4条（当サービスの提供の停止等）
        </h6>
        <p className="mb-6 text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします。
        </p>
        <StyledList
          items={[
            '当サービスにかかるコンピュータシステムの保守点検または更新を行う場合',
            '地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合',
            'その他、当サービスが提供の停止または中断を必要と判断した場合',
          ]}
        />
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">
          第5条（保証の否認および免責）
        </h6>
        <p className="mb-6 text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
        </p>
        <p className="text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
        </p>
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">
          第6条（サービス内容の変更等）
        </h6>
        <p className="text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあります。
        </p>
      </div>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">第7条（利用規約の変更）</h6>
        <p className="text-[rgba(0,0,0,0.6)] leading-relaxed">
          当サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
          なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
        </p>
      </div>

      <div>
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">第8条（準拠法・裁判管轄）</h6>
        <p className="text-[rgba(0,0,0,0.6)] leading-relaxed">
          本規約の解釈にあたっては、日本法を準拠法とします。
          本サービスに関して紛争が生じた場合には、当サービスの本店所在地を管轄する裁判所を専属的合意管轄とします。
        </p>
      </div>
    </>
  );
}
