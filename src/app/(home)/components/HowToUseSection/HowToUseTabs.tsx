'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SectionHeader from '@/app/(home)/components/SectionHeader';
import { Button } from '@/components/primitives/button';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { getResponsiveValue } from '@/utils/styles';
import { COLORS } from '../../constants';
import { STEPS_DATA } from './constants';

export default function HowToUseTabs() {
  const [activeTab, setActiveTab] = useState<'poll' | 'schedule'>('poll');
  const isMobile = useMediaQuery('(max-width: 899px)');

  const handleTabChange = (newTab: 'poll' | 'schedule') => {
    setActiveTab(newTab);
  };

  const currentSteps = STEPS_DATA[activeTab];
  const ctaLink =
    activeTab === 'poll' ? 'https://choisur.jp/polls/create' : 'https://choisur.jp/schedule/create';

  const accentColor = activeTab === 'poll' ? COLORS.ACCENT_ORANGE : COLORS.ACCENT_PURPLE;
  const accentColorGlow =
    activeTab === 'poll' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(167, 139, 250, 0.4)';

  return (
    <>
      <SectionHeader
        title="HOW TO USE"
        subtitle="利用方法"
        mode="dark"
        align="center"
        accentColor={accentColor}
        mb={{ xs: '32px', sm: '48px' }}
      />

      <div
        className="ease absolute z-0 transition-all duration-800"
        style={{
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '40vw',
          background: `radial-gradient(ellipse at center, ${accentColorGlow} 0%, transparent 70%)`,
          opacity: 0.2,
          filter: 'blur(100px)',
        }}
      />

      {/* Tab Switcher (Diagonal Split - Preserved) */}
      <div
        className="relative z-10 flex justify-center"
        style={{
          marginBottom: getResponsiveValue(60, 90),
        }}
      >
        <div
          className="relative h-12 w-[240px]"
          style={{
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
          }}
        >
          {/* Poll Button */}
          <Button
            onClick={() => handleTabChange('poll')}
            className={`absolute top-0 bottom-0 left-0 w-[55%] transform rounded-none pr-8 font-extrabold text-[0.9rem] shadow-none backdrop-blur-[10px] transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:z-10 hover:shadow-none ${
              activeTab === 'poll'
                ? 'z-[5] bg-orange-500 text-white hover:bg-[#ea580c]'
                : 'z-[1] bg-slate-800/80 text-white/50 hover:bg-[#283246]/90'
            }`}
            style={{
              clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0% 100%)',
            }}
          >
            店決め
          </Button>

          {/* Schedule Button */}
          <Button
            onClick={() => handleTabChange('schedule')}
            className={`absolute top-0 right-0 bottom-0 w-[55%] transform rounded-none pl-8 font-extrabold text-[0.9rem] shadow-none backdrop-blur-[10px] transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:z-10 hover:shadow-none ${
              activeTab === 'schedule'
                ? 'z-[5] bg-[#8b5cf6] text-white hover:bg-[#7c3aed]'
                : 'z-[1] bg-slate-800/80 text-white/50 hover:bg-[#283246]/90'
            }`}
            style={{
              clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0% 100%)',
            }}
          >
            日程調整
          </Button>
        </div>
      </div>

      {/* Steps Container (Premium Glassmorphism) */}
      <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 items-stretch gap-12 md:grid-cols-3 md:gap-20">
        {/* Connector Line (Desktop - Gradient Fade) */}
        <div
          className="absolute z-0 hidden md:block"
          style={{
            top: '25%',
            left: '15%',
            right: '15%',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: 0.3,
          }}
        />

        {currentSteps.map((step, index) => (
          <ScrollReveal
            key={step.num}
            mode="slide"
            direction="up"
            delay={index * 0.15}
            style={{ height: '100%' }}
          >
            <div
              className="group relative z-10 flex h-full flex-col items-center overflow-hidden rounded-3xl p-16 text-center transition-all duration-400 md:p-20"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = `0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px -5px ${accentColorGlow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              {/* Decorative Top Highlight */}
              <div
                className="absolute top-0 right-0 left-0 h-[1px]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
              />

              {/* Step Number (Background Watermark) */}
              <span
                className="step-number pointer-events-none absolute top-10 right-20 z-0 font-black leading-none transition-colors duration-400"
                style={{
                  color: 'rgba(255,255,255,0.03)',
                  fontSize: isMobile ? '4rem' : '5rem',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                0{step.num}
              </span>

              {/* Icon Container (Glass Circle) */}
              <div
                className="relative z-[2] mb-16 flex h-[70px] w-[70px] items-center justify-center rounded-full md:h-[90px] md:w-[90px]"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${activeTab === 'poll' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(167, 139, 250, 0.3)'}`,
                  boxShadow: `0 0 15px ${activeTab === 'poll' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(167, 139, 250, 0.1)'}`,
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    color: accentColor,
                    filter: `drop-shadow(0 0 8px ${accentColor})`,
                  }}
                >
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <h6
                className="z-[2] mb-8 font-bold text-white leading-snug"
                style={{
                  fontSize: isMobile ? '1.1rem' : '1.25rem',
                }}
              >
                {step.title}
              </h6>

              <p
                className="z-[2] text-[rgba(255,255,255,0.7)] leading-relaxed"
                style={{
                  fontSize: isMobile ? '0.9rem' : '0.95rem',
                }}
              >
                {step.desc}
              </p>

              {/* Mobile Connector (Gradient Line) */}
              {isMobile && index < currentSteps.length - 1 && (
                <div
                  className="absolute bottom-[-32px] left-1/2 z-0 h-6 w-[1px] -translate-x-1/2 opacity-50"
                  style={{
                    background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
                  }}
                />
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* CTA Button (Rounded Pill - Restored) */}
      <ScrollReveal mode="pop" delay={0.4}>
        <div
          className="relative z-10 text-center"
          style={{
            marginTop: getResponsiveValue(60, 90),
          }}
        >
          <Link href={ctaLink} passHref legacyBehavior>
            <Button
              className={`rounded-full px-12 py-4 font-bold text-[1rem] text-white tracking-wider shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out hover:-translate-y-[2px] md:text-[1.1rem] ${
                activeTab === 'poll'
                  ? 'bg-[#f97316] shadow-orange-500/40 hover:bg-[#ea580c] hover:shadow-orange-500/60'
                  : 'bg-[#8b5cf6] shadow-violet-500/40 hover:bg-[#7c3aed] hover:shadow-violet-500/60'
              }`}
            >
              今すぐ使う
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    </>
  );
}
