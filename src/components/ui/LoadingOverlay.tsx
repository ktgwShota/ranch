'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLoadingStore } from '@/stores/useLoadingStore';

// --- Configuration Constants ---
const ROWS = 8;
const WIPE_TIME = 0.5; // バー1本が画面を横断する時間 (s)
const STAGGER = 0.1; // 次のバーが動き出すまでの遅延 (s)
const HOLD_TIME = 1.0; // 画面が塗りつぶされた状態で静止する時間 (s)
const CYCLE = WIPE_TIME + ROWS * STAGGER + HOLD_TIME; // 片方の色の全工程時間 (2.3s)
const TOTAL_CYCLE_MS = CYCLE * 2 * 1000; // 両方の色が一周する時間 (4.6s)
const JUMP_DELAY = 1; // 画面表示から文字が跳ね始めるまでの待機時間
const WIPE_DELAY_OFFSET = 1; // 画面表示からバーを動かすまでの時間 (JUMP_DELAY + 0.5s)
const EXIT_SAFE_BUFFER_MS = 300; // ページ遷移を待つための安全マージン

const COLORS = {
  light: '#f8fafc', // オフホワイト
  dark: '#0f172a', // ネイビー
};

// --- Sub-Components ---

/**
 * 1文字ずつ交互に跳ねるテキストコンポーネント
 */
const JumpingText = ({ text, cycle }: { text: string; cycle: number }) => (
  <h1
    style={{
      fontWeight: 900,
      letterSpacing: '0.2em',
      color: '#fff',
      marginBottom: '8px',
      fontSize: 'clamp(2.5rem, 8vw, 5rem)',
      textTransform: 'uppercase',
      display: 'flex',
      justifyContent: 'center',
      margin: 0,
    }}
  >
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        animate={{ y: [0, -25, 0] }}
        transition={{
          duration: 0.75,
          repeat: Infinity,
          repeatDelay: cycle - 0.75,
          ease: [0.45, 0, 0.55, 1],
          delay: JUMP_DELAY + i * 0.08,
        }}
        style={{ display: 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </h1>
);

/**
 * 背後で流れるストライプ状のアニメーションバー
 */
const WipeBars = ({ cycle, wipeFraction }: { cycle: number; wipeFraction: number }) => (
  <div className="absolute inset-0 z-[5] flex flex-col">
    {Array.from({ length: ROWS }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          x: ['-100%', '0%', '0%', '-100%', '0%', '0%'],
          backgroundColor: [
            COLORS.light,
            COLORS.light,
            COLORS.light,
            COLORS.dark,
            COLORS.dark,
            COLORS.dark,
          ],
        }}
        transition={{
          duration: cycle * 2,
          times: [0, wipeFraction, 0.5, 0.5001, 0.5 + wipeFraction, 1],
          ease: [[0.32, 0, 0.67, 0], 'linear', 'linear', [0.32, 0, 0.67, 0], 'linear'],
          repeat: Infinity,
          delay: WIPE_DELAY_OFFSET + i * STAGGER,
        }}
        style={{ flex: 1, width: '100%', position: 'relative' }}
      />
    ))}
  </div>
);

/**
 * 右下の回転インジケーター
 */
const RotatingIndicator = () => (
  <div className="absolute right-10 bottom-10 z-[30]" style={{ mixBlendMode: 'difference' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: 32,
        height: 32,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#fff',
        borderRadius: '50%',
      }}
    />
  </div>
);

// --- Main Component ---

export default function LoadingOverlay() {
  const { isLoading: open } = useLoadingStore();
  const [shouldRender, setShouldRender] = useState(false);
  const startTimeRef = useRef<number>(0);

  // バーが画面を覆うまでの時間の割合
  const wipeFraction = useMemo(() => WIPE_TIME / (CYCLE * 2), []);

  useEffect(() => {
    if (open) {
      if (!shouldRender) {
        startTimeRef.current = performance.now();
        setShouldRender(true);
      }
    } else if (shouldRender) {
      // ロード完了時、アニメーションの「キリが良いタイミング」まで閉じるのを待機する同期ロジック
      const elapsed = performance.now() - startTimeRef.current;
      const tMod = elapsed % TOTAL_CYCLE_MS;

      // 消え始めるタイミング（ブロック開始タイミング + 画面が隠れるのを待つバッファ）
      const p1 = WIPE_DELAY_OFFSET * 1000 + EXIT_SAFE_BUFFER_MS;
      const p2 = (CYCLE + WIPE_DELAY_OFFSET) * 1000 + EXIT_SAFE_BUFFER_MS;

      let delay = 0;
      if (tMod < p1) {
        delay = p1 - tMod;
      } else if (tMod < p2) {
        delay = p2 - tMod;
      } else {
        delay = TOTAL_CYCLE_MS - tMod + p1;
      }

      const timer = setTimeout(() => setShouldRender(false), delay);
      return () => clearTimeout(timer);
    }
  }, [open, shouldRender]);

  // スクロールの抑制
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [shouldRender]);

  return (
    <AnimatePresence>
      {shouldRender && (
        <div
          className="fixed inset-0 overflow-hidden"
          style={{
            zIndex: 99999,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              backgroundColor: [COLORS.dark, COLORS.dark, COLORS.light, COLORS.light, COLORS.dark],
            }}
            exit={{
              opacity: 0,
              transition: { opacity: { duration: 1, ease: 'easeInOut' } }, // 消える時はゆっくり (0.8s)
            }}
            transition={{
              opacity: { duration: 0.5, ease: 'easeInOut' }, // 現れる時はその半分 (0.4s)
              backgroundColor: {
                duration: CYCLE * 2,
                times: [0, 0.49, 0.5, 0.99, 1],
                ease: 'linear',
                repeat: Infinity,
                delay: WIPE_DELAY_OFFSET, // バーの動きと色の切り替わりを完全に同期
              },
            }}
            style={{
              width: '100vw',
              height: '100vh',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WipeBars cycle={CYCLE} wipeFraction={wipeFraction} />

            <div className="relative z-20 text-center" style={{ mixBlendMode: 'difference' }}>
              <JumpingText text="Loading" cycle={CYCLE} />
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  opacity: 0.9,
                  letterSpacing: '0.8em',
                }}
              >
                INITIALIZING SYSTEM
              </div>
            </div>

            <RotatingIndicator />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
