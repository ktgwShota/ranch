import SectionContainer from '@/app/(home)/components/SectionContainer';
import SectionHeader from '@/app/(home)/components/SectionHeader';
import { COLORS } from '../../constants';
import FAQList from './FAQList';

export default function FaqSection() {
  return (
    <div id="faq" className="overflow-hidden" style={{ backgroundColor: COLORS.BG_LIGHT }}>
      <SectionContainer
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <SectionHeader
          title="FAQ"
          subtitle="よくある質問"
          mode="light"
          align="center"
          accentColor={COLORS.ACCENT_INDIGO}
        />

        <FAQList />
      </SectionContainer>
    </div>
  );
}
