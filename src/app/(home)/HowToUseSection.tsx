'use client';

import type React from 'react';
import { useState } from 'react';
import { Box, Container, Typography, Button, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  AddBoxOutlined as CreateIcon,
  SendOutlined as ShareIcon,
  StorefrontOutlined as StoreIcon,
  CalendarMonthOutlined as CalendarIcon,
  Add as AddIcon
} from '@mui/icons-material';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function HowToUseSection() {
  const [activeTab, setActiveTab] = useState<'poll' | 'schedule'>('poll');

  // タブの切り替えハンドラー
  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newTab: 'poll' | 'schedule' | null,
  ) => {
    if (newTab !== null) {
      setActiveTab(newTab);
    }
  };

  // 各モードのデータ定義
  const stepsData = {
    poll: [
      {
        num: 1,
        title: 'ページを作成',
        desc: 'イベント名とお店の候補を入力して『多数決を行うページ』を作成します。',
        icon: <CreateIcon sx={{ fontSize: '2rem', color: '#f97316' }} />,
      },
      {
        num: 2,
        title: 'URLをシェア',
        desc: 'イベントに参加するメンバーに作成したページを LINE や Slack などの SNS で共有します。',
        icon: <ShareIcon sx={{ fontSize: '2rem', color: '#f97316' }} />,
      },
      {
        num: 3,
        title: '目的地が決定',
        desc: '投票によって目的地が決定します。日程が決まっていない場合は『日程調整』をご利用ください。',
        icon: <StoreIcon sx={{ fontSize: '2rem', color: '#f97316' }} />,
      },
    ],
    schedule: [
      {
        num: 1,
        title: 'ページを作成',
        desc: 'イベント名と日程の候補を入力して『日程調整を行うページ』を作成します。',
        icon: <CreateIcon sx={{ fontSize: '2rem', color: '#f97316' }} />,
      },
      {
        num: 2,
        title: 'URLをシェア',
        desc: 'イベントに参加するメンバーに作成したページを LINE や Slack などの SNS で共有します。',
        icon: <ShareIcon sx={{ fontSize: '2rem', color: '#f97316' }} />,
      },
      {
        num: 3,
        title: '日程を決定',
        desc: 'メンバーの回答から日程を決定します。お店も同時に決めたい場合は『店決め』をご利用ください。',
        icon: <CalendarIcon sx={{ fontSize: '2rem', color: '#f97316' }} />,
      },
    ],
  };

  // 現在のタブに基づくデータ取得
  const currentSteps = stepsData[activeTab];

  // CTAボタンのリンク先
  const ctaLink = activeTab === 'poll'
    ? 'https://choisur.jp/polls/create'
    : 'https://choisur.jp/schedule/create';

  return (
    <Box
      id="how-to-use"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '900px', textAlign: 'center' }}>
        {/* Top Badge */}
        <ScrollReveal mode="slide" direction="up" distance={20}>
          <Box sx={{
            display: 'inline-block',
            bgcolor: '#FFF7ED',
            color: '#f97316',
            px: 2,
            py: 0.5,
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            mb: 4,
            border: '1px solid #FFEDD5',
            textTransform: 'uppercase'
          }}>
            HOW TO USE
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 900,
              color: '#1a1a1a',
              lineHeight: 1.2,
              mb: 3,
              letterSpacing: '-0.02em',
            }}
          >
            簡単3ステップ
          </Typography>
        </ScrollReveal>

        {/* Toggle Switch */}
        <ScrollReveal mode="pop" delay={0.1}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
            <ToggleButtonGroup
              value={activeTab}
              exclusive
              onChange={handleTabChange}
              aria-label="function toggle"
              sx={{
                bgcolor: '#f3f4f6',
                p: 0.5,
                borderRadius: '9999px',
                '& .MuiToggleButton-root': {
                  borderRadius: '9999px',
                  border: 'none',
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#6b7280',
                  '&.Mui-selected': {
                    bgcolor: '#fff',
                    color: '#f97316',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    '&:hover': {
                      bgcolor: '#fff',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.03)',
                  }
                }
              }}
            >
              <ToggleButton value="poll" disableRipple>
                店決め
              </ToggleButton>
              <ToggleButton value="schedule" disableRipple>
                日程調整
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </ScrollReveal>

        {/* Steps Grid */}
        <Box sx={{ position: 'relative', mb: 10 }}>
          {/* Dashed Connector Line (Desktop Only) */}
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            top: '50px',
            left: '15%',
            right: '15%',
            height: '2px',
            backgroundImage: 'linear-gradient(to right, #E5E7EB 50%, rgba(255,255,255,0) 0%)',
            backgroundPosition: 'top',
            backgroundSize: '12px 1px',
            backgroundRepeat: 'repeat-x',
            zIndex: 0
          }} />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 8, md: 4 }}
            justifyContent="center"
            alignItems="flex-start"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            {currentSteps.map((step) => (
              <Box key={`${activeTab}-${step.num}`} sx={{ flex: 1, px: { md: 2 } }}>
                <ScrollReveal mode="pop" delay={step.num * 0.1}>
                  <Box sx={{ position: 'relative', mb: 4, mx: 'auto', width: 'fit-content' }}>
                    {/* Icon Circle */}
                    <Box sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      bgcolor: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,0,0,0.03)',
                      position: 'relative'
                    }}>
                      <Box sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        bgcolor: '#FFF7ED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {step.icon}
                      </Box>
                    </Box>
                    {/* Step Number Badge */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 24,
                      height: 24,
                      bgcolor: '#f97316',
                      color: 'white',
                      borderRadius: '50%',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(249, 115, 22, 0.4)',
                      border: '2px solid #fff'
                    }}>
                      {step.num}
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#1a1a1a', mb: 1, fontSize: '1.25rem' }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: '#666', lineHeight: 1.6, fontSize: '0.9rem', fontWeight: 500 }}>
                    {step.desc}
                  </Typography>
                </ScrollReveal>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Bottom CTA */}
        <ScrollReveal mode="pop" delay={0.5}>
          <Button
            href={ctaLink}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              px: 5,
              py: 2,
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: 800,
              bgcolor: '#f97316',
              boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#ea580c',
                transform: 'translateY(-2px)',
                boxShadow: '0 15px 40px rgba(249, 115, 22, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {activeTab === 'poll' ? '店決めのページを作成' : '日程調整のページを作成'}
          </Button>
        </ScrollReveal>
      </Container>
    </Box>
  );
}