'use client';

import { motion } from 'framer-motion';

const _gridRows = 4;
const gridCols = 4;

// 0: empty/hidden, 1: normal, 2: active (purple)
const _gridMap = [
  [1, 1, 1, 1],
  [1, 2, 1, 1],
  [1, 1, 1, 0], // Bottom right corner missing-ish logic based on image?
  // Actually image shows 4x3 or 4x4. Let's assume 4x4 full grid mostly.
  [1, 1, 0, 0], // The fading out part
];

// Re-analyzing image:
// Row 0: 4 cells
// Row 1: 4 cells (2nd is purple)
// Row 2: 3 cells? (4th one seems missing or very faint)
// Row 3: 2 cells? (3rd and 4th missing)
// Floating: one purple square + one faint square

export default function AboutDecoration() {
  return (
    <div
      className="pointer-events-none relative z-0 hidden sm:block"
      style={{
        marginRight: '2%',
        fontSize: 'clamp(11px, 1.8vw, 16px)',
      }}
    >
      <motion.div
        initial={{ rotate: -12, opacity: 0, x: 50 }}
        whileInView={{ rotate: -12, opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="grid gap-3 p-8"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        }}
      >
        {/* Row 1 */}
        <Cell /> <Cell /> <Cell /> <Cell />
        {/* Row 2 */}
        <Cell />
        <Cell active>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="rounded-md bg-[#8b5cf6]"
            style={{
              width: '1.25em',
              height: '1.25em',
              boxShadow: '0 0 0.625em rgba(139, 92, 246, 0.6)',
            }}
          />
        </Cell>
        <Cell /> <Cell />
        {/* Row 3 */}
        <Cell /> <Cell /> <Cell /> <Cell opacity={0.3} />
        {/* Row 4 */}
        <Cell /> <Cell opacity={0.5} /> <Cell opacity={0.1} />
      </motion.div>

      {/* Background Glow */}
      <div
        className="absolute -z-10 bg-[#8b5cf6] opacity-[0.15]"
        style={{
          top: '30%',
          left: '30%',
          width: '18.75em',
          height: '18.75em',
          filter: 'blur(6.25em)',
        }}
      />
    </div>
  );
}

function Cell({
  active = false,
  children,
  opacity = 1,
  size = '3.75em', // 60px default
}: {
  active?: boolean;
  children?: React.ReactNode;
  opacity?: number;
  size?: number | string;
}) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl transition-all duration-300"
      style={{
        width: size,
        height: size,
        backgroundColor: active ? 'rgba(139, 92, 246, 0.1)' : 'rgba(51, 65, 85, 0.4)',
        border: active ? '1px solid #8b5cf6' : '1px solid rgba(148, 163, 184, 0.1)',
        boxShadow: active
          ? '0 0 1.25em rgba(139, 92, 246, 0.2), inset 0 0 1.25em rgba(139, 92, 246, 0.1)'
          : 'none',
        opacity: opacity,
      }}
    >
      {children}
    </div>
  );
}
