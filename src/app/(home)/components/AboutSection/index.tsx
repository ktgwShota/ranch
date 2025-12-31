import SectionContainer from '@/app/(home)/components/SectionContainer';
import SectionHeader from '@/app/(home)/components/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getResponsiveValue } from '@/utils/styles';
import { COLORS } from '../../constants';
import AboutDecoration from './AboutDecoration';

export default function AboutSection() {
  return (
    <section
      id="about-section"
      className="relative flex w-full flex-col overflow-hidden"
      style={{ background: COLORS.BG_DARK }}
    >
      <SectionContainer
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="relative z-[2] w-full sm:w-[60%]">
          {/* Header */}
          <SectionHeader title="ABOUT" subtitle="サイトについて" mode="dark" align="left" />

          <ScrollReveal mode="slide" direction="up" duration={0.8} delay={0.2}>
            <div>
              {/* Main Message */}
              <h3
                className="font-bold leading-snug"
                style={{
                  fontSize: 'clamp(1.3rem, 1rem + 1.33vw, 1.6rem)',
                  color: COLORS.TEXT_ON_DARK,
                  marginBottom: getResponsiveValue(16, 24),
                }}
              >
                幹事の負担を
                <span
                  className="px-[2px]"
                  style={{
                    background: 'linear-gradient(120deg, #818cf8 0%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  限りなくゼロ
                </span>
                へ。
              </h3>

              {/* Body Text */}
              <div className="flex flex-col" style={{ gap: getResponsiveValue(16, 24) }}>
                <p
                  className="font-normal leading-[2]"
                  style={{
                    color: COLORS.TEXT_SUB_ON_DARK,
                    fontSize: 'clamp(0.875rem, 0.65rem + 0.6vw, 1rem)',
                  }}
                >
                  Choisur（チョイスル）は、
                  <br />
                  飲み会やイベントの「店決め」や「日程調整」といった、幹事に集中しがちな手間を減らすために生まれました。
                </p>

                <p
                  className="font-normal leading-[2]"
                  style={{
                    color: '#cbd5e1',
                    fontSize: 'clamp(0.875rem, 0.65rem + 0.6vw, 1rem)',
                  }}
                >
                  URLを共有するだけで参加者の回答がリアルタイムに集まり、最適な「場所」と「時間」が自然と見えてきます。
                </p>

                <p
                  className="font-normal leading-[2]"
                  style={{
                    color: '#cbd5e1',
                    fontSize: 'clamp(0.875rem, 0.65rem + 0.6vw, 1rem)',
                  }}
                >
                  利用に際して、アプリのインストールや会員登録は不要です。
                </p>
              </div>
            </div>
          </ScrollReveal>
          {/* Decoration */}
        </div>
      </SectionContainer>

      {/* Decoration Wrapper with Max Width */}
      <div className="pointer-events-none absolute inset-0 z-0 mx-auto flex max-w-[960px] items-center justify-end">
        <AboutDecoration />
      </div>
    </section>
  );
}
