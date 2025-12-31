'use client';

import { ArrowRight, Calendar, Check, Utensils } from 'lucide-react';
import SectionContainer from '@/app/(home)/components/SectionContainer';
import SectionHeader from '@/app/(home)/components/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getResponsiveValue } from '@/utils/styles';
import { COLORS } from '../../constants';

export default function ServiceSection() {
  return (
    <div
      id="service-section"
      className="relative flex w-full flex-col overflow-hidden"
      style={{ background: COLORS.BG_LIGHT }}
    >
      <SectionContainer
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <SectionHeader
          title="SERVICE"
          subtitle="サービス"
          mode="light"
          align="center"
          accentColor={COLORS.ACCENT_INDIGO}
        />

        {/* カードエリア */}
        <div
          className="flex w-full flex-col md:flex-row"
          style={{
            gap: getResponsiveValue(20, 60),
          }}
        >
          {/* 01: 店決め (Discovery) - Sharp & Modern */}
          <ScrollReveal
            mode="slide"
            direction="up"
            delay={0.1}
            style={{ flex: 1, display: 'flex' }}
          >
            <a
              href="https://choisur.jp/polls/create"
              className="group relative block w-full flex-1 cursor-pointer border border-solid no-underline transition-all duration-300 hover:border-[#6366f1] hover:shadow-[0_0_0_1px_#6366f1]"
              style={{
                borderColor: COLORS.BORDER_LIGHT,
                backgroundColor: COLORS.CARD_BG,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                className="inner-card relative flex h-full flex-col"
                style={{
                  padding: getResponsiveValue(24, 40),
                  paddingBottom: getResponsiveValue(24, 28),
                }}
              >
                {/* Header */}
                <div className="mb-16 flex items-start justify-between">
                  <div>
                    <span
                      className="mb-2 block font-bold uppercase"
                      style={{
                        color: COLORS.ACCENT_INDIGO,
                        letterSpacing: '0.2em',
                        fontSize: getResponsiveValue(11.2, 12.8),
                      }}
                    >
                      DISCOVERY
                    </span>
                    <h3
                      className="font-extrabold"
                      style={{
                        fontSize: getResponsiveValue(20.8, 25.6),
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      店決め
                    </h3>
                  </div>
                  <div
                    className="icon-box flex items-center justify-center rounded-lg p-3 transition-all duration-300 group-hover:bg-[#6366f1] group-hover:text-white md:p-4"
                    style={{
                      backgroundColor: COLORS.PRIMARY_LIGHT,
                      color: COLORS.ACCENT_INDIGO,
                    }}
                  >
                    <Utensils size={getResponsiveValue(28, 40)} />
                  </div>
                </div>

                <p
                  className="mb-10 text-left font-medium leading-relaxed"
                  style={{
                    color: COLORS.TEXT_SUB,
                    fontSize: getResponsiveValue(14, 17.6),
                  }}
                >
                  参加者の投票を集計し、全員が納得できるお店を決定します。
                </p>

                {/* Feature List */}
                <div className="mb-auto flex flex-col gap-6">
                  {['多数決でお店を決定', '候補は自由に追加可能', '人気順で結果を表示'].map(
                    (text, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Check
                          size={getResponsiveValue(16, 20)}
                          style={{ color: COLORS.ACCENT_INDIGO }}
                        />
                        <span
                          className="font-semibold"
                          style={{
                            color: COLORS.TEXT_SUB,
                            fontSize: getResponsiveValue(12, 14.4),
                          }}
                        >
                          {text}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Action */}
                <div
                  className="mt-20 flex justify-end pt-12"
                  style={{
                    borderTop: `1px solid ${COLORS.BG_GRAY}`,
                  }}
                >
                  <div
                    className="flex items-center gap-4 group-hover:[&_.action-text]:translate-x-0 group-hover:[&_.action-text]:opacity-100"
                    style={{
                      color: COLORS.ACCENT_INDIGO,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      イベントを作成
                    </span>
                    <ArrowRight
                      className="action-text opacity-70 transition-all duration-300"
                      size={18}
                      style={{ transform: 'translateX(-4px)' }}
                    />
                  </div>
                </div>
              </div>
            </a>
          </ScrollReveal>

          {/* 02: 日程調整 (Scheduling) - Sharp & Modern */}
          <ScrollReveal
            mode="slide"
            direction="up"
            delay={0.25}
            style={{ flex: 1, display: 'flex' }}
          >
            <a
              href="https://choisur.jp/schedule/create"
              className="group relative block w-full flex-1 cursor-pointer border border-[#e2e8f0] border-solid bg-white no-underline transition-all duration-300 hover:border-[#8b5cf6] hover:shadow-[0_0_0_1px_#8b5cf6]"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                className="inner-card relative flex h-full flex-col"
                style={{
                  padding: getResponsiveValue(20, 40),
                  paddingBottom: getResponsiveValue(20, 28),
                }}
              >
                {/* Header */}
                <div className="mb-16 flex items-start justify-between">
                  <div>
                    <span
                      className="mb-2 block font-bold uppercase"
                      style={{
                        color: COLORS.ACCENT_PURPLE,
                        letterSpacing: '0.2em',
                        fontSize: getResponsiveValue(11.2, 12.8),
                      }}
                    >
                      SCHEDULING
                    </span>
                    <h3
                      className="font-extrabold"
                      style={{
                        fontSize: getResponsiveValue(20.8, 25.6),
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      日程調整
                    </h3>
                  </div>
                  <div
                    className="icon-box flex items-center justify-center rounded-lg p-3 transition-all duration-300 group-hover:bg-[#8b5cf6] group-hover:text-white md:p-4"
                    style={{
                      backgroundColor: COLORS.BG_GRAY,
                      color: COLORS.ACCENT_PURPLE,
                    }}
                  >
                    <Calendar size={getResponsiveValue(28, 40)} />
                  </div>
                </div>

                <p
                  className="mb-10 text-left font-medium leading-relaxed"
                  style={{
                    color: COLORS.TEXT_SUB,
                    fontSize: getResponsiveValue(14, 17.6),
                  }}
                >
                  参加者の出欠を集計し、全員が参加できる最適な日程を決定します。
                </p>

                {/* Feature List */}
                <div className="mb-auto flex flex-col gap-6">
                  {['カレンダーから日程選択', '出欠状況を一覧表示', '開催可能日を自動抽出'].map(
                    (text, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Check
                          size={getResponsiveValue(16, 20)}
                          style={{ color: COLORS.ACCENT_PURPLE }}
                        />
                        <span
                          className="font-semibold"
                          style={{
                            color: COLORS.TEXT_SUB,
                            fontSize: getResponsiveValue(12, 14.4),
                          }}
                        >
                          {text}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Action */}
                <div
                  className="mt-20 flex justify-end pt-12"
                  style={{
                    borderTop: `1px solid ${COLORS.BG_GRAY}`,
                  }}
                >
                  <div
                    className="flex items-center gap-4 group-hover:[&_.action-text]:translate-x-0 group-hover:[&_.action-text]:opacity-100"
                    style={{
                      color: COLORS.ACCENT_PURPLE,
                    }}
                  >
                    <span
                      className="font-bold uppercase"
                      style={{ letterSpacing: '0.1em', fontSize: '0.875rem' }}
                    >
                      イベントを作成
                    </span>
                    <ArrowRight
                      className="action-text opacity-70 transition-all duration-300"
                      size={18}
                      style={{ transform: 'translateX(-4px)' }}
                    />
                  </div>
                </div>
              </div>
            </a>
          </ScrollReveal>
        </div>
      </SectionContainer>
    </div>
  );
}
