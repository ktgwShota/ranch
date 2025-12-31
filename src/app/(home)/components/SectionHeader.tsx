import type { CSSProperties } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getResponsiveValue } from '@/utils/styles';
import { COLORS } from '../constants';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  mode?: 'light' | 'dark';
  align?: 'left' | 'center';
  accentColor?: string;
  maxWidth?: string | number;
  className?: string;
  mb?: CSSProperties['marginBottom'] | { xs?: string; sm?: string };
}

export default function SectionHeader({
  title,
  subtitle,
  mode = 'light',
  align = 'center',
  accentColor = COLORS.ACCENT_INDIGO,
  maxWidth,
  mb,
}: SectionHeaderProps) {
  const isLight = mode === 'light';
  const titleColor = isLight ? COLORS.TEXT_MAIN : COLORS.TEXT_ON_DARK;
  const _subtitleColor = isLight ? COLORS.TEXT_SUB : COLORS.TEXT_MUTED;
  const isCenter = align === 'center';

  const marginBottom = mb ?? {
    xs: getResponsiveValue(32, 40, 320, 600),
    sm: getResponsiveValue(40, 40, 600, 900),
  };

  const marginBottomValue =
    typeof marginBottom === 'object'
      ? marginBottom.xs || getResponsiveValue(32, 40, 320, 600)
      : marginBottom;

  return (
    <ScrollReveal
      mode="slide"
      direction={isCenter ? 'up' : 'right'}
      duration={1}
      viewportAmount={0.5}
    >
      <div
        className={`w-full ${isCenter ? 'mx-auto sm:mx-auto' : 'mx-auto sm:mx-0'} text-center ${align === 'left' ? 'sm:text-left' : 'sm:text-center'}`}
        style={{
          maxWidth: maxWidth || '900px',
          marginBottom: marginBottomValue,
        }}
      >
        <span
          className="mb-2 block font-bold uppercase"
          style={{
            color: accentColor,
            fontSize: 'clamp(0.7rem, 0.6rem + 0.27vw, 0.8rem)',
          }}
        >
          {subtitle}
        </span>
        <h2
          className="font-extrabold leading-none tracking-wide"
          style={{
            color: titleColor,
            fontSize: 'clamp(2rem, 1.25rem + 2vw, 2.5rem)',
            letterSpacing: '1px',
          }}
        >
          {title}
        </h2>
        <div
          className={`mt-4 h-1 w-[60px] rounded-[2px] transition-colors duration-300 ${isCenter ? 'mx-auto sm:mx-auto' : 'mx-auto sm:mx-0'}`}
          style={{
            backgroundColor: accentColor,
          }}
        />
      </div>
    </ScrollReveal>
  );
}
