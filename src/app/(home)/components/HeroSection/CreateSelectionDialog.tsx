'use client';

import { ArrowRight, Calendar, Check, Utensils } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent } from '@/components/primitives/dialog';
import { getResponsiveValue } from '@/utils/styles';
import { COLORS } from '../../constants';

export default function CreateSelectionDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const options = [
    {
      title: '店決め',
      subtitle: 'DISCOVERY',
      description: '参加者の投票を集計し、全員が納得できるお店を決定します。',
      features: ['多数決でお店を決定', '候補は自由に追加可能', '人気順で結果を表示'],
      icon: <Utensils className="h-7 w-7 md:h-9 md:w-9" />,
      href: '/polls/create',
      accentColor: COLORS.ACCENT_INDIGO,
      iconBg: COLORS.PRIMARY_LIGHT,
    },
    {
      title: '日程調整',
      subtitle: 'SCHEDULING',
      description: '参加者の出欠を集計し、全員が参加できる最適な日程を決定します。',
      features: ['カレンダーから日程選択', '出欠状況を一覧表示', '開催可能日を自動抽出'],
      icon: <Calendar className="h-7 w-7 md:h-9 md:w-9" />,
      href: '/schedule/create',
      accentColor: COLORS.ACCENT_PURPLE,
      iconBg: COLORS.BG_GRAY,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-[2px] border-none bg-white p-0 shadow-none">
        <div className="relative" style={{ padding: getResponsiveValue(20, 40) }}>
          <div
            className="grid grid-cols-1 sm:grid-cols-2"
            style={{
              gap: getResponsiveValue(20, 40),
            }}
          >
            {options.map((opt, i) => (
              <Link
                key={i}
                href={opt.href}
                className="group flex h-full flex-col rounded-[2px] border border-solid bg-white no-underline transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  padding: '20px',
                  paddingBottom: '16px',
                  borderColor: COLORS.BORDER_LIGHT,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Header */}
                <div className="mb-10 flex items-start justify-between">
                  <div>
                    <span
                      className="mb-2 block font-bold uppercase leading-none"
                      style={{
                        color: opt.accentColor,
                        letterSpacing: '0.1em',
                        fontSize: '0.75rem',
                      }}
                    >
                      {opt.subtitle}
                    </span>
                    <h6
                      className="font-extrabold"
                      style={{
                        color: COLORS.TEXT_MAIN,
                        fontSize: 'clamp(1.1rem, 1.1rem, 1.25rem)',
                      }}
                    >
                      {opt.title}
                    </h6>
                  </div>
                  <div
                    className="icon-box flex items-center justify-center rounded-lg p-3 transition-all duration-300 group-hover:bg-[#6366f1] group-hover:text-white md:p-4"
                    style={{
                      backgroundColor: opt.iconBg,
                      color: opt.accentColor,
                    }}
                  >
                    {opt.icon}
                  </div>
                </div>

                {/* Description */}
                <p
                  className="mb-12 flex-1 text-left font-medium leading-relaxed"
                  style={{
                    color: COLORS.TEXT_SUB,
                    fontSize: '0.875rem',
                  }}
                >
                  {opt.description}
                </p>

                {/* Features */}
                <div className="mb-12 flex flex-col gap-4">
                  {opt.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <Check className="h-4 w-4" style={{ color: opt.accentColor }} />
                      <span
                        className="font-semibold"
                        style={{
                          color: COLORS.TEXT_SUB,
                          fontSize: '0.75rem',
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Action */}
                <div
                  className="flex items-center justify-end gap-2 pt-8 group-hover:[&_.action-icon]:translate-x-1 group-hover:[&_.action-icon]:opacity-100"
                  style={{
                    borderTop: `1px solid ${COLORS.BG_GRAY}`,
                    color: opt.accentColor,
                  }}
                >
                  <span className="font-bold text-[0.8rem]">イベントを作成</span>
                  <ArrowRight className="action-icon h-4 w-4 opacity-70 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
