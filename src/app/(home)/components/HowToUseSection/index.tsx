import SectionContainer from '@/app/(home)/components/SectionContainer';
import { COLORS } from '../../constants';
import HowToUseTabs from './HowToUseTabs';

export default function HowToUseSection() {
  return (
    <div
      id="how-to-use"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: COLORS.BG_DARK }}
    >
      {/* Premium Background: Subtle Grid + Deep Ambient GLow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        }}
      />

      <SectionContainer
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header - Still mostly static, but accentColor changes in Client. 
            Wait, SectionHeader takes accentColor. 
            The accentColor in HowToUse depends on the active tab (Client State).
            However, the SectionHeader uses a static color initially or we can pass a default.
            
            In the original code:
            `const accentColor = activeTab === 'poll' ? COLORS.ACCENT_ORANGE : COLORS.ACCENT_PURPLE;`
            
            If we want the SectionHeader subtitle color ("HOW TO USE") to change dynamically, 
            it needs to be inside the Client Component (HowToUseContent).
            
            Let's move SectionHeader inside HowToUseContent or accept that it might not change color?
            The subtitle "利用方法" was white or accent color?
            `<SectionHeader ... accentColor={accentColor} />`
            
            Yes, it changes color. 
            So I should move `SectionHeader` *into* `HowToUseContent` or pass the color state up (which I can't do if Parent is Server).
            So `HowToUseContent` should include the Header if we want that dynamic behavior.
            
            Let's check `HowToUseContent` code I just wrote...
            I didn't include `SectionHeader` in `HowToUseContent`.
            I should probably move `SectionHeader` into `HowToUseContent` to preserve the dynamic color.
            
            Let me update `HowToUseContent.tsx` to include `SectionHeader`.
            And then `HowToUseSection` (Server) just renders `HowToUseContent` (Client) wrapped in the container/background.
        */}
        <HowToUseTabs />
      </SectionContainer>
    </div>
  );
}
