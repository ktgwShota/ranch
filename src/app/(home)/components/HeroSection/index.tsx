// Removed unused Typography import
// import FloatingCalendarVisual from './FloatingCalendarVisual'; // Removed from here
import ScrollDownArrow from '@/app/(home)/components/ScrollDownArrow';
// import CreateSelectionDialog from './CreateSelectionDialog'; // Removed from here
import { getResponsiveValue } from '@/utils/styles';
import { COLORS } from '../../constants';
import FloatingCalendarVisual from './FloatingCalendarVisual';
import HeroActions from './HeroActions';

const TITLE = '幹事、もっと簡単に。';
const SUBTITLE =
  'URLを共有するだけで、日程もお店も、回答がリアルタイムに反映。幹事は結果を見るだけです。';

export default function HeroSection() {
  return (
    <div
      id="hero-section"
      className="relative z-[1] min-h-auto overflow-hidden md:min-h-screen"
      style={{
        background: COLORS.BG_LIGHT,
        color: COLORS.TEXT_MAIN,
      }}
    >
      {/* Background Decor Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative flex h-full min-h-auto w-full items-center overflow-hidden md:min-h-screen">
        <div
          className="relative z-10 mx-auto w-full max-w-[950px] pt-56 pb-40"
          style={{
            paddingLeft: getResponsiveValue(20, 60),
            paddingRight: getResponsiveValue(20, 60),
          }}
        >
          <div className="flex flex-col items-center justify-between gap-0 md:flex-row md:gap-24">
            {/* Left Area: Text */}
            <div className="flex-1 text-center md:text-left">
              <h1
                className="mb-12 font-extrabold leading-tight"
                style={{
                  fontSize: getResponsiveValue(24, 36),
                  color: COLORS.TEXT_MAIN,
                }}
              >
                {TITLE}
              </h1>

              <div className="mb-12 flex flex-col gap-2">
                {SUBTITLE.split('\n').map((line, index) => (
                  <div key={index} className="overflow-hidden">
                    <p
                      className="mx-auto font-medium leading-relaxed md:mx-0"
                      style={{
                        fontSize: getResponsiveValue(15.2, 17.6),
                        color: COLORS.TEXT_SUB,
                      }}
                    >
                      {line}
                    </p>
                  </div>
                ))}
              </div>

              <HeroActions />
            </div>

            {/* Right Area: Live Preview */}
            <div
              className="relative flex w-full flex-1 justify-center"
              style={{ perspective: '1000px' }}
            >
              <FloatingCalendarVisual />
            </div>
          </div>
        </div>

        <ScrollDownArrow
          targetId="about-section"
          color="#94a3b8" // Slate 400
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
          }}
        />
      </div>
    </div>
  );
}
