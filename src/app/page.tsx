'use client';

import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  AutoAwesome as AutoAwesomeIcon,
  Balance as BalanceIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import Link from 'next/link';

// ヘッダーコンポーネント
function LandingHeader() {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          {/* ロゴ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
              ◎チョイスル
            </Typography>
          </Box>

          {/* ナビゲーション */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography
              component="a"
              href="#features"
              sx={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': { color: '#3b82f6' },
              }}
            >
              機能
            </Typography>
            <Typography
              component="a"
              href="#pricing"
              sx={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': { color: '#3b82f6' },
              }}
            >
              料金
            </Typography>
            <Typography
              component="a"
              href="#login"
              sx={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': { color: '#3b82f6' },
              }}
            >
              ログイン
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#2563eb' },
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
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
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
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1000px',
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
            mb: 3,
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          幹事の店選び、サクッと解決。
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '700px',
            mx: 'auto',
            mb: 4,
            lineHeight: 1.6,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          イベントの店選びを簡単に決められる投票ツールです。
          投票を作成してリンクを共有すれば、誰でも投票でき、やり取りなしで最適な場所を見つけられます。
        </Typography>
        <Button
          component={Link}
          href="/polls/create"
          variant="contained"
          sx={{
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            '&:hover': { backgroundColor: '#2563eb' },
          }}
        >
          無料で投票を作成
        </Button>
      </Container>
    </Box>
  );
}

// 機能セクションコンポーネント
function FeaturesSection() {
  return (
    <Box id="features" sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
      <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
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
          終わりのないやり取りに疲れていませんか？チョイスルが簡単にします。
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.125rem',
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: '600px',
            mx: 'auto',
            mb: 6,
          }}
        >
          イベントの計画は楽しいものであるべきです。チョイスルは店選びのストレスをなくし、
          素晴らしい時間に集中できるように作りました。
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {/* カード1 */}
          <Card
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 28, color: '#f59e0b' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}
              >
                店舗情報の自動取得
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                店舗のURLを貼り付けるだけで、名前、住所、写真を自動で取得します。
              </Typography>
            </CardContent>
          </Card>

          {/* カード2 */}
          <Card
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <BalanceIcon sx={{ fontSize: 28, color: '#f59e0b' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}
              >
                公平で簡単な投票
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                誰でも投票できるシンプルな投票を共有できます。リアルタイムで結果を確認し、合意形成を図れます。
              </Typography>
            </CardContent>
          </Card>

          {/* カード3 */}
          <Card
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: '#d1fae5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 28, color: '#10b981' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}
              >
                簡単な意思決定
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                返信を追いかける必要はありません。迅速に明確な決定を得られ、作業負荷とストレスを軽減できます。
              </Typography>
            </CardContent>
          </Card>
        </Box>
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
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '70%',
          maxWidth: '280px',
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
      <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            mb: 8,
          }}
        >
          使い方
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
                店舗のウェブサイトリンクを貼り付けるだけで、投票に店舗オプションを追加できます。
                自動取得機能が必要な詳細情報をすべて取得するため、時間と労力を節約できます。
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PhoneMockup bgColor="#fed7aa">
                <Box sx={{ p: 2, minHeight: '400px' }}>
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
                justifyContent: 'center',
                alignItems: 'center',
                order: { xs: 2, md: 1 },
              }}
            >
              <PhoneMockup bgColor="#ccfbf1">
                <Box sx={{ p: 2, minHeight: '400px' }}>
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
                投票のユニークなリンクを取得し、任意のメッセージアプリでグループと共有できます。
                友達はどのデバイスからでも投票でき、登録は不要です。
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
                投票が集まるのを見て、どの店舗が勝者か簡単に確認できます。
                これだけです！煩雑なグループチャットやスプレッドシートは不要です。
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PhoneMockup bgColor="#ccfbf1">
                <Box sx={{ p: 2, minHeight: '400px', position: 'relative' }}>
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
      question: 'チョイスルは無料で使えますか？',
      answer:
        'はい、チョイスルは完全に無料で使用できます。無制限に投票を作成し、好きなだけ多くの人を招待して投票してもらえます。',
    },
    {
      question: '友達は投票するために登録が必要ですか？',
      answer:
        'いいえ、友達はアカウントを作成したり登録したりする必要はありません。リンクをクリックするだけで、すぐに投票できます。',
    },
    {
      question: '投票にいくつ店舗オプションを追加できますか？',
      answer:
        '投票には好きなだけ多くの店舗オプションを追加できます。オプションの数に制限はありません。',
    },
    {
      question: '自動取得機能はどの店舗サイトでも動作しますか？',
      answer:
        '自動取得機能は、主要な店舗サイトやレビュープラットフォームのほとんどで動作します。サポートされていないサイトの場合でも、手動で店舗情報を追加できます。',
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
      <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
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
          よくある質問
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.125rem',
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: '600px',
            mx: 'auto',
            mb: 6,
          }}
        >
          質問がありますか？お答えします。チョイスルについてよくある質問をまとめました。
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
                  '& .MuiAccordionSummary-content': {
                    my: 0,
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
      <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
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
            意思決定を簡単にしませんか？
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            終わりのないチャットをやめて、ストレスゼロで次のイベントの計画を始めましょう。
            みんなを素早く同じページに集められます。
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
            無料で始める
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
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <BottomCTASection />
    </Box>
  );
}
