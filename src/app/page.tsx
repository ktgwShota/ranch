"use client";

import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Fade,
  Chip,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Group as GroupIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function Home() {

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <Container maxWidth="md">
        <Box>
          {/* ヒーローセクション */}
          <Box textAlign="center" py={8}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: 3,
                lineHeight: 1.2
              }}
            >
              決まらないお店選びは、<br />
              多数決ツール「チョイスル」で解決
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 4,
                fontSize: '1.1rem'
              }}
            >
              グループでの面倒なお店選びはもう終わり。気になるお店のURLを貼って共有するだけで、みんなの意見がひと目で分かる多数決ページが完成。
            </Typography>

            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={6}>
              <Chip
                icon={<RestaurantIcon />}
                label="無料"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                icon={<GroupIcon />}
                label="会員登録不要"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                icon={<SpeedIcon />}
                label="30秒で作成"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Link href="/create" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: '#1976d2',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                投票ページを作成する
              </Button>
            </Link>
          </Box>

          {/* 特徴セクション */}
          <Box py={6}>
            <Typography
              variant="h2"
              component="h2"
              textAlign="center"
              sx={{
                fontSize: '1.8rem',
                fontWeight: 600,
                color: 'text.primary',
                mb: 4
              }}
            >
              こんなに簡単！
            </Typography>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
              <Card
                elevation={0}
                sx={{
                  flex: 1,
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    1
                  </Box>
                  <Typography variant="h6" component="h3" fontWeight="600" mb={1}>
                    お店のURLを貼る
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    食べログやぐるなびのURLを貼るだけ
                  </Typography>
                </CardContent>
              </Card>

              <Card
                elevation={0}
                sx={{
                  flex: 1,
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="h6" component="h3" fontWeight="600" mb={1}>
                    みんなで投票
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    共有したURLでみんなが投票
                  </Typography>
                </CardContent>
              </Card>

              <Card
                elevation={0}
                sx={{
                  flex: 1,
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    3
                  </Box>
                  <Typography variant="h6" component="h3" fontWeight="600" mb={1}>
                    結果を確認
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    リアルタイムで結果が分かる
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
