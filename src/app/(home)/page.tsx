import { Box } from '@mui/material';
import AboutSection from './AboutSection';
import HowItWorksSection from './HowItWorksSection';
import BottomCTASection from './BottomCTASection';
import FAQSection from './FAQSection';
import HeroSection from './HeroSection';

export default function Index() {
  return (
    <Box sx={{ width: '100%' }}>
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <BottomCTASection />
      <FAQSection />
    </Box>
  );
}
