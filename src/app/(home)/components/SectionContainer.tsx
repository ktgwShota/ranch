import type { CSSProperties, ReactNode } from 'react';
import { getResponsiveValue } from '@/utils/styles';

interface SectionContainerProps {
  children: ReactNode;
  sx?: CSSProperties;
  className?: string;
}

export default function SectionContainer({
  children,
  sx,
  className,
  ...props
}: SectionContainerProps) {
  // getResponsiveValueはclamp()を生成するため、styleで直接使用
  // clamp()自体がレスポンシブなので、メディアクエリは不要
  return (
    <div
      className={`mx-auto w-full max-w-[970px] ${className || ''}`}
      style={{
        paddingLeft: getResponsiveValue(20, 40, 320, 600),
        paddingRight: getResponsiveValue(20, 40, 320, 600),
        paddingBottom: getResponsiveValue(20, 40, 320, 600),
        paddingTop: getResponsiveValue(20, 40, 320, 600),
        ...(sx || {}),
      }}
      {...props}
    >
      {children}
    </div>
  );
}
