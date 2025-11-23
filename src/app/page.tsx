'use client';

import {
  Box,
  Button,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import Link from 'next/link';

// 定数
const HEADER_HEIGHT = '80px';

// ヘッダーコンポーネント
function LandingHeader() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: HEADER_HEIGHT,
          }}
        >
          {/* ロゴ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              ◎チョイスル
            </Typography>
          </Box>

          {/* ナビゲーション */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography
              component="a"
              href="#features"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': { color: 'white' },
              }}
            >
              機能
            </Typography>
            <Typography
              component="a"
              href="#pricing"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': { color: 'white' },
              }}
            >
              料金
            </Typography>
            <Typography
              component="a"
              href="#login"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': { color: 'white' },
              }}
            >
              ログイン
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                color: 'white',
                borderRadius: '8px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.9)' },
              }}
            >
              新規登録
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ヒーローセクションコンポーネント
function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        pt: HEADER_HEIGHT,
        backgroundImage: 'url(/hero-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '980px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
          }}
        >
          "幹事の時間" もっと大切に。
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.15rem' },
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '700px',
            mx: 'auto',
            mt: 3,
            mb: 4,
            lineHeight: 1.6,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          店決めに悩む時代はもう終わり。行く店をみんなで決める。
          <br />
          チョイスルは店決めに悩む幹事のためのサービスを提供します。
        </Typography>
        <Button
          component={Link}
          href="/polls/create"
          variant="contained"
          sx={{
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            '&:hover': { backgroundColor: '#2563eb' },
          }}
        >
          無料で始める
        </Button>
      </Container>
    </Box>
  );
}

// スマートフォンモックアップコンポーネント
function PhoneMockup({ children, bgColor }: { children: React.ReactNode; bgColor: string }) {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: '400px' },
        maxWidth: '100%',
        aspectRatio: '1',
        backgroundColor: bgColor,
        borderRadius: '12px',
        border: '1px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',

      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* ステータスバー */}
        <Box
          sx={{
            backgroundColor: '#1f2937',
            color: 'white',
            px: 2,
            py: 0.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.7rem',
          }}
        >
          <Box>9:41</Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 6, border: '1px solid white', borderRadius: '2px' }} />
            <Box sx={{ width: 12, height: 6, border: '1px solid white', borderRadius: '2px' }} />
          </Box>
        </Box>
        {/* アプリ画面 */}
        {children}
      </Box>
    </Box>
  );
}

// How it Works セクションコンポーネント
function HowItWorksSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#f9fafb' }}>
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            mb: 2,
          }}
        >
          How to use Choiceru
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: '600px',
            mx: 'auto',
            mb: 6,
          }}
        >
          チョイスルの使い方
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 12 } }}>
          {/* Step 1: テキスト左、画像右 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                sx={{
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                ステップ1
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1f2937',
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                投票ページを作成
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '1.125rem' }}
              >
                候補となる店舗の URL を入力して投票ページを作成しましょう。店舗名や写真などは自動的に取得されるため、大半の情報は手動で入力する必要がありません。
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <PhoneMockup bgColor="#fed7aa">
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        mr: 1,
                      }}
                    />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      CHOICERU
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: '#1f2937',
                      mb: 2,
                    }}
                  >
                    What a Poll
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {['Bistro 92', 'Elmwood Grill', 'The Corner Cafe'].map(
                      (name, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1.5,
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                          }}
                        >
                          <Typography sx={{ fontSize: '0.8rem' }}>{name}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {idx + 1}
                          </Typography>
                        </Box>
                      ),
                    )}
                  </Box>
                </Box>
              </PhoneMockup>
            </Box>
          </Box>

          {/* Step 2: 画像左、テキスト右 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                order: { xs: 2, md: 1 },
              }}
            >
              <PhoneMockup bgColor="#ccfbf1">
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        mr: 1,
                      }}
                    />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      CHOICERU
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: '#1f2937',
                      mb: 1.5,
                    }}
                  >
                    Invite
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      p: 1,
                      mb: 2,
                      height: 32,
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map(
                      (opt, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              border: '2px solid #e5e7eb',
                              borderRadius: '4px',
                            }}
                          />
                          <Typography sx={{ fontSize: '0.8rem' }}>{opt}</Typography>
                        </Box>
                      ),
                    )}
                  </Box>
                </Box>
              </PhoneMockup>
            </Box>
            <Box
              sx={{
                flex: 1,
                textAlign: { xs: 'center', md: 'left' },
                order: { xs: 1, md: 2 },
              }}
            >
              <Typography
                sx={{
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                ステップ2
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1f2937',
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                投票ページを共有
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '1.125rem' }}
              >
                作成した投票ページを LINE や Slack などの SNS で共有して、参加者の投票が終わるまで待ちます。
              </Typography>
            </Box>
          </Box>

          {/* Step 3: テキスト左、画像右 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                sx={{
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                ステップ3
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1f2937',
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                お店が決定
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '1.125rem' }}
              >
                投票期限に達すると投票結果が公開されます。
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <PhoneMockup bgColor="#ccfbf1">
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        mr: 1,
                      }}
                    />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      CHOICERU
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: '#1f2937',
                      mb: 2,
                    }}
                  >
                    VOTES
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      { name: 'YAMADA TARO', hasHeart: true },
                      { name: 'TANAKA JIRO', hasHeart: true },
                      { name: 'SUZUKI HANAKO', hasHeart: true },
                    ].map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: '#e5e7eb',
                            }}
                          />
                          <Typography sx={{ fontSize: '0.8rem' }}>
                            {item.name}
                          </Typography>
                        </Box>
                        {item.hasHeart && (
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: '#fecdd3',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography sx={{ fontSize: '0.7rem', color: '#dc2626' }}>
                              ♥
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </PhoneMockup>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// FAQ セクションコンポーネント
function FAQSection() {
  const faqItems = [
    {
      question: '利用料金はかかりますか？',
      answer:
        '本サービスは完全無料でご利用いただけます。',
    },
    {
      question: '利用するにはアカウント登録が必要になりますか？',
      answer:
        'アカウントを作成する必要はありません。誰でもすぐにご利用いただけます。',
    }
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
            color: '#6b7280',
            textAlign: 'center',
            mx: 'auto',
            mb: 6,
          }}
        >
          よくある質問
        </Typography>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {faqItems.map((item, idx) => (
            <Accordion
              key={idx}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px !important',
                mb: 2,
                boxShadow: 'none',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 3,
                  py: 2,
                  minHeight: '64px',
                  '&.Mui-expanded': {
                    minHeight: '64px',
                  },
                  '& .MuiAccordionSummary-content': {
                    my: 0,
                    '&.Mui-expanded': {
                      my: 0,
                    },
                  },
                }}
              >
                <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// ボトムCTA セクションコンポーネント
function BottomCTASection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#3b82f6',
        color: 'white',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'white',
              mb: 2,
            }}
          >
            早速試してみませんか？
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            煩わしい調整はもう終わりです。3ステップで誰でも簡単に、みんなが納得するお店が決定します。幹事の時間を大切にする新しい方法を、今すぐ無料で体験してください。
          </Typography>
          <Button
            component={Link}
            href="/polls/create"
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: '#3b82f6',
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            今すぐ試す
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// メインコンポーネント
export default function HomePage() {
  return (
    <Box sx={{ width: '100%' }}>
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <BottomCTASection />
      <FAQSection />
    </Box>
  );
}
