import { Calendar, Gavel, Info, Mail, ShieldCheck, Store } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/primitives/separator';
import { getResponsiveValue } from '@/utils/styles';

export default function GlobalFooter() {
  const serviceLinks = [
    { label: '店決め', href: '/polls/create', icon: Store },
    { label: '日程調整', href: '/schedule/create', icon: Calendar },
  ];

  const aboutLinks = [
    { label: '当サイトについて', href: '/about', icon: Info },
    { label: '利用規約', href: '/terms', icon: Gavel },
    { label: 'プライバシーポリシー', href: '/privacy', icon: ShieldCheck },
    { label: 'お問い合わせ', href: '/contact', icon: Mail },
  ];

  return (
    <footer className="mt-auto border-white/10 border-t bg-[#1e293b] text-white">
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: '900px',
          padding: getResponsiveValue(20, 32),
          paddingTop: '48px',
          paddingBottom: getResponsiveValue(20, 24),
        }}
      >
        <div className="mb-6 flex flex-col items-start justify-between gap-8 sm:flex-row">
          {/* タイトル */}
          <div className="flex-1 text-left">
            <h4
              className="mb-4 font-black text-white"
              style={{
                letterSpacing: '-0.03em',
                fontSize: 'clamp(2.25rem, 2.125rem, 2.25rem)',
              }}
            >
              Choisur
            </h4>
            <p
              className="mb-8 max-w-[40ch] font-medium text-sm text-white/90"
              style={{
                letterSpacing: '0.05em',
              }}
            >
              Choisur（チョイスル）は、飲み会やイベントの日程調整 /
              店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。会員登録・ログイン不要でご利用いただけます。
            </p>
          </div>

          {/* リンクセクション */}
          <div className="flex w-full flex-col flex-wrap justify-start gap-8 sm:w-auto sm:flex-row sm:justify-end sm:gap-[56px]">
            {/* SERVICE */}
            <div className="text-left">
              <span
                className="mx-0 mb-6 inline-block w-fit border-[#3b82f6] border-b-2 pb-2 font-extrabold text-white uppercase"
                style={{
                  fontSize: getResponsiveValue(14, 16),
                  letterSpacing: '0.1em',
                }}
              >
                SERVICE
              </span>
              <div className="flex flex-row flex-wrap justify-start gap-x-6 gap-y-3 sm:flex-col">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex items-center gap-3 font-medium text-[0.85rem] text-white/90 no-underline transition-all duration-200 hover:text-white"
                  >
                    <link.icon className="h-[1.2rem] w-[1.2rem] text-white/90 transition-colors duration-200 group-hover:text-white" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* ABOUT */}
            <div className="text-left">
              <span
                className="mx-0 mb-6 inline-block w-fit border-[#3b82f6] border-b-2 pb-2 font-extrabold text-white uppercase"
                style={{
                  fontSize: getResponsiveValue(14, 16),
                  letterSpacing: '0.1em',
                }}
              >
                ABOUT
              </span>
              <div className="flex flex-row flex-wrap justify-start gap-x-6 gap-y-3 sm:flex-col">
                {aboutLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex items-center gap-3 font-medium text-[0.85rem] text-white/90 no-underline transition-all duration-200 hover:text-white"
                  >
                    <link.icon className="h-[1.2rem] w-[1.2rem] text-white/90 transition-colors duration-200 group-hover:text-white" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/5" />

        <p className="mt-6 text-center font-normal text-white/60 text-xs">
          © 2025 Choisur. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
