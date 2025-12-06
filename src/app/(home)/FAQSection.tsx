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
      style={{
        backgroundColor: 'transparent',
        marginBottom: 0,
      }}
      sx={{
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ color: '#3b82f6' }} />}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          marginBottom: 0,
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease',
          ...(isExpanded && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottom: 'none',
            backgroundColor: '#fff',
          }),
        }}
        sx={{
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        }}
      >
        <Typography
          style={{
            fontWeight: 600,
            color: 'rgba(0, 0, 0, 0.87)',
            fontSize: '0.95rem',
          }}
          sx={{
            '@media (min-width: 900px)': {
              fontSize: '1rem',
            },
          }}
        >
          {item.question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        style={{
          backgroundColor: 'white',
          borderLeft: '1px solid #e2e8f0',
          borderRight: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          marginTop: 0,
          paddingTop: '1rem',
          paddingBottom: '1.5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        <Typography
          style={{
            color: 'rgba(0, 0, 0, 0.6)',
            lineHeight: 1.8,
            fontSize: '0.9rem',
          }}
          sx={{
            '@media (min-width: 900px)': {
              fontSize: '0.95rem',
            },
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

export default function FAQSection() {
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

