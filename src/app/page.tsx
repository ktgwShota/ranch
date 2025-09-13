"use client";

import { Container, Typography, Button, Box, Paper, Stack, Divider } from '@mui/material';
import {
  Link as LinkIcon,
  Bolt as BoltIcon,
  HowToVote as HowToVoteIcon,
  Create as CreateIcon,
  Share as ShareIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- Reusable Animated Components ---
const StaggeredContainer = ({ children, ...props }: { children: React.ReactNode;[key: string]: any }) => {
  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } };
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants} {...props}>
      {children}
    </motion.div>
  );
};
const FadeInItem = ({ children, ...props }: { children: React.ReactNode;[key: string]: any }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };
  return <motion.div variants={itemVariants} {...props}>{children}</motion.div>;
};

// --- Main Page Component ---
export default function Home() {
  const features = [
    { icon: <BoltIcon />, title: '無料 & 会員登録不要', description: '思い立った瞬間から誰でもすぐに無料で利用を開始できます。', highlight: '完全無料' },
    { icon: <LinkIcon />, title: '便利な自動生成', description: 'サイトの URL を貼るだけで、お店の名前と写真・説明文付きの投票ページが自動的に作成されます。', highlight: '30秒で完成' },
    { icon: <HowToVoteIcon />, title: '分かりやすい UI', description: '複雑な設定は不要です。直感的な操作で誰でも簡単に使えます。', highlight: '直感的操作' },
  ];

  const howItWorks = [
    { icon: <CreateIcon />, title: 'STEP 1: ページを作成', description: 'タイトルと候補となるお店の URL を2つ以上入力します。' },
    { icon: <ShareIcon />, title: 'STEP 2: リンクを共有', description: '作成したページの URL を LINE や Slack でメンバーに共有します。' },
    { icon: <DoneAllIcon />, title: 'STEP 3: お店を決定', description: 'メンバーはリンク先で投票。結果はリアルタイムに集計され、お店が自動で決まります。' },
  ]

  return (
    // ここがスクロールコンテナになります
    <Box sx={{
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      overflowX: 'hidden',
      // --- CSS Scroll Snapの設定 ---
      height: '100vh',         // コンテナの高さを画面の高さに
      overflowY: 'auto',        // Y軸のスクロールを有効に
      scrollSnapType: 'y mandatory', // Y軸方向で、必ずスナップポイントに強制的に止まる
      '&::-webkit-scrollbar': {
        display: 'none' // スクロールバーを非表示にして、よりアプリらしく
      },
      msOverflowStyle: 'none',  // IE/Edge用
      scrollbarWidth: 'none',   // Firefox用
    }}>
      {/* <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 10% 20%, rgba(52, 152, 219, 0.08) 0%, rgba(248, 250, 252, 0.8) 25%), radial-gradient(circle at 80% 90%, rgba(142, 68, 173, 0.08) 0%, rgba(248, 250, 252, 0.8) 25%), linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', zIndex: 0 }} /> */}

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* ヒーローセクション */}
        <Container component="section" maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', scrollSnapAlign: 'start' }}>
          <StaggeredContainer>
            <Box textAlign="center">
              <FadeInItem>
                <Typography component="h1" variant="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }, fontWeight: 800, lineHeight: 1.2, my: 3, letterSpacing: '-0.02em', background: 'linear-gradient(45deg, #1a1a1a 30%, #3498db 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  「何でもいいよ」<span className="-ml-3">は</span><span className="ml-1 -mr-4">、</span>許さない。
                </Typography>
              </FadeInItem>

              <FadeInItem>
                <Typography sx={{ color: '#666666', maxWidth: '650px', mx: 'auto', mb: 1, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  全員の意思を可視化する。
                </Typography>
              </FadeInItem>

              <FadeInItem>
                <Typography sx={{ color: '#666666', maxWidth: '650px', mx: 'auto', mb: 5, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  これからの時代<span className="-mr-2">、</span>お店はスマートな多数決で決めましょう。
                </Typography>
              </FadeInItem>

              <FadeInItem>
                <Button component={Link} href="/create" variant="contained" size="large" sx={{ py: 2, px: 6, fontSize: '1.125rem', fontWeight: 700, borderRadius: '999px', textTransform: 'none', boxShadow: '0 0 20px rgba(52, 152, 219, 0.5)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 30px rgba(52, 152, 219, 0.7)' } }}>
                  無料で始める
                </Button>
              </FadeInItem>
            </Box>
          </StaggeredContainer>
        </Container>

        {/* 特徴セクション */}
        <Container component="section" maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', scrollSnapAlign: 'start' }}>
          <StaggeredContainer>
            <FadeInItem>
              <Box textAlign="center" mb={10}>
                <Typography component="h2" variant="h2" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  圧倒的な使いやすさ。
                </Typography>
                <Typography sx={{ color: '#666666', fontSize: '1.125rem', maxWidth: '600px', mx: 'auto' }}>
                  誰もが直感的に使えることに拘った3つの特徴。
                </Typography>
              </Box>
            </FadeInItem>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, justifyContent: 'center', alignItems: 'stretch' }}>
              {features.map((feature, index) => (
                <FadeInItem key={feature.title}>
                  <Box sx={{ position: 'relative', p: 5, flex: 1, height: '100%', maxWidth: { xs: '100%', sm: '320px' }, borderRadius: 4, background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(255, 255, 255, 0.8) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(52, 152, 219, 0.1)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { transform: 'translateY(-8px) scale(1.02)', borderColor: 'rgba(52, 152, 219, 0.3)', boxShadow: '0 16px 48px 0 rgba(52, 152, 219, 0.15)' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '20px', background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white', mb: 4, boxShadow: '0 8px 24px rgba(52, 152, 219, 0.3)', fontSize: '1.5rem' }}>{feature.icon}</Box>
                    <Typography variant="h5" fontWeight="700" mb={2} sx={{ fontSize: '1.25rem', color: '#1a1a1a' }}>{feature.title}</Typography>
                    <Typography variant="body1" color="#666666" lineHeight={1.7} sx={{ fontSize: '0.95rem' }}>{feature.description}</Typography>
                  </Box>
                </FadeInItem>
              ))}
            </Box>
          </StaggeredContainer>
        </Container>

        {/* 「使い方」セクション */}
        <Container component="section" maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', scrollSnapAlign: 'start' }}>
          <StaggeredContainer>
            <FadeInItem>
              <Box textAlign="center" mb={10}>
                <Typography component="h2" variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  簡単3ステップで。
                </Typography>
                <Typography sx={{ color: '#666666', fontSize: '1.125rem', maxWidth: '600px', mx: 'auto' }}>
                  驚くほど簡単な操作で、面倒な調整から解放されます。
                </Typography>
              </Box>
            </FadeInItem>
            <Stack spacing={4} divider={<Divider sx={{ borderColor: 'rgba(0,0,0,0.1)' }} />}>
              {howItWorks.map((step, index) => (
                <FadeInItem key={step.title}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #3498db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3498db', flexShrink: 0 }}>
                      <Typography fontWeight="700" fontSize="1.5rem">{index + 1}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="700" mb={0.5} sx={{ color: '#1a1a1a' }}>{step.title}</Typography>
                      <Typography variant="body1" color="#666666">{step.description}</Typography>
                    </Box>
                  </Box>
                </FadeInItem>
              ))}
            </Stack>
          </StaggeredContainer>
        </Container>

        {/* CTAセクション */}
        <Container component="section" maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', scrollSnapAlign: 'start' }}>
          <FadeInItem>
            <Paper sx={{ p: { xs: 4, md: 8 }, textAlign: 'center', borderRadius: 6, background: 'linear-gradient(45deg, rgba(52, 152, 219, 0.05) 0%, rgba(142, 68, 173, 0.05) 100%)', border: '1px solid rgba(52, 152, 219, 0.1)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}>
              <Typography component="h2" variant="h2" sx={{ fontWeight: 700, mb: 3, color: '#1a1a1a' }}>
                さあ、最高の選択を。
              </Typography>
              <Typography sx={{ color: '#666666', fontSize: '1.125rem', maxWidth: '600px', mx: 'auto', mb: 5 }}>
                今すぐ無料で、最高の意思決定ツールを体験してください。
              </Typography>
              <Button component={Link} href="/create" variant="contained" size="large" sx={{ py: 2, px: 6, fontSize: '1.125rem', fontWeight: 700, borderRadius: '999px', textTransform: 'none', boxShadow: '0 0 30px rgba(52, 152, 219, 0.3)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 40px rgba(52, 152, 219, 0.5)' } }}>
                投票ページを作成する
              </Button>
            </Paper>
          </FadeInItem>
        </Container>
      </Box>
    </Box>
  );
}