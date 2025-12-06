'use client';

import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';

interface FAQAccordionItemProps {
  item: { question: string; answer: string };
  index: number;
  expanded: string | false;
  onExpand: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

function FAQAccordionItem({ item, index, expanded, onExpand }: FAQAccordionItemProps) {
  const isExpanded = expanded === `panel${index}`;

  return (
    <Accordion
      expanded={isExpanded}
      onChange={onExpand(`panel${index}`)}
      disableGutters
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: 0,
        overflow: 'hidden',
        '&:before': { display: 'none' },
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#94a3b8' }} />}
        sx={{
          padding: { xs: '0 16px', md: '0 20px' },
          minHeight: { xs: '64px', md: '72px' },
          '& .MuiAccordionSummary-content': {
            margin: { xs: '12px 0', md: '12px 0' },
          },
          '&.Mui-expanded': {
            minHeight: { xs: '64px', md: '72px' },
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            fontSize: { xs: '0.95rem', md: '1rem' },
            fontFeatureSettings: '"palt"',
          }}
        >
          {item.question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: { xs: '0 20px 24px 20px', md: '0 24px 32px 24px' },
          marginTop: '-8px', // 少しタイトに
        }}
      >
        <Typography
          sx={{
            color: '#64748b',
            lineHeight: 1.8,
            fontSize: { xs: '0.9rem', md: '0.95rem' },
            whiteSpace: 'pre-wrap', // 改行を反映
          }}
        >
          {item.answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: '利用料金はかかりますか？',
    answer: '無料でご利用いただけます。',
  },
  {
    question: '利用するにはアカウント登録が必要ですか？',
    answer: 'アカウント登録は不要です。',
  },
  {
    question: '対応しているブラウザを教えてくれますか？',
    answer:
      '本アプリは最新バージョンの Google Chrome / Safari のみをサポートしております。古いバージョンの Google Chrome / Safari または その他のブラウザ（Microsoft Edge / Firefox など）はサポート外です。',
  },
  {
    question: 'シークレットモード / プライベートモード に対応していますか？',
    answer:
      'シークレットモード / プライベートモード には対応していません。必ず標準モードをご利用ください。',
  },
];


interface FAQSectionProps {
  faqItems: { question: string; answer: string }[];
}

export default function FaqSection() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      id="faq-section"
      style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: '#f8fafc',
      }}
      sx={{
        '@media (min-width: 900px)': {
          paddingTop: '5rem',
          paddingBottom: '5rem',
        },
      }}
    >
      <Container
        maxWidth={false}
        style={{
          maxWidth: '960px',
        }}
      >
        <ScrollReveal>
          <Box>
            <Typography
              variant="h2"
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'rgba(0, 0, 0, 0.87)',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
              sx={{
                '@media (min-width: 900px)': {
                  fontSize: '2.25rem',
                },
              }}
            >
              FAQ
            </Typography>
            <Typography
              variant="body1"
              style={{
                fontWeight: 'bold',
                fontSize: '1.125rem',
                color: 'rgba(0, 0, 0, 0.6)',
                textAlign: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '600px',
                marginBottom: '4rem',
              }}
            >
              よくある質問
            </Typography>
          </Box>
        </ScrollReveal>

        <Box
          style={{
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {FAQ_ITEMS.map((item, index) => (
            <ScrollReveal key={index} mode="slide" direction="up" distance={30} delay={index * 0.1}>
              <FAQAccordionItem
                item={item}
                index={index}
                expanded={expanded}
                onExpand={handleChange}
              />
            </ScrollReveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

