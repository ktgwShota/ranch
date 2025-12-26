'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * InteractiveHoneycomb - Separate component for the background animation
 * Tracing Honeycomb Grid - Even Distribution
 * Divides the screen into 4 quadrants, each allowing up to 3 active hexes.
 */
export function InteractiveHoneycomb({ delay = 0 }: { delay?: number }) {
  const [activeHexes, setActiveHexes] = useState<{ id: string; x: number; y: number; row: number; col: number; color: string; delay: number; quad: number }[]>([]);

  useEffect(() => {
    // ... same constants ...
    const hexWidth = 224;
    const rowHeight = 193.988;
    const cols = 6;
    const rows = 5;

    const isAdjacent = (r1: number, c1: number, r2: number, c2: number) => {
      if (r1 === r2 && c1 === c2) return true;
      if (r1 === r2) return Math.abs(c1 - c2) <= 1;
      if (Math.abs(r1 - r2) === 1) {
        const isR1Odd = r1 % 2 !== 0;
        if (isR1Odd) return c2 === c1 || c2 === c1 + 1;
        else return c2 === c1 || c2 === c1 - 1;
      }
      return false;
    };

    const spawnGlitches = () => {
      setActiveHexes(prev => {
        const now = Date.now();
        const activeOnly = prev.filter(h => {
          const timestamp = parseInt(h.id.split('-')[0]);
          return now - timestamp < 7000;
        });

        const updatedHexes = [...activeOnly];

        for (let q = 0; q < 4; q++) {
          const hexesInQuad = updatedHexes.filter(h => h.quad === q);
          if (hexesInQuad.length < 3 && Math.random() > 0.3) {
            const rowStart = q < 2 ? 0 : rows / 2;
            const rowEnd = q < 2 ? rows / 2 : rows;
            const colStart = q % 2 === 0 ? 0 : cols / 2;
            const colEnd = q % 2 === 0 ? cols / 2 : cols;

            const row = Math.floor(Math.random() * (rowEnd - rowStart)) + rowStart;
            const col = Math.floor(Math.random() * (colEnd - colStart)) + colStart;
            const tooClose = updatedHexes.some(h => isAdjacent(row, col, h.row, h.col));

            if (!tooClose) {
              const isOdd = row % 2 !== 0;
              updatedHexes.push({
                id: `${Date.now()}-${Math.random()}`,
                x: col * hexWidth + (isOdd ? 112 : 0),
                y: row * rowHeight,
                row,
                col,
                color: '#22d3ee',
                delay: Math.random() * 2,
                quad: q
              });
            }
          }
        }
        return updatedHexes;
      });
    };

    let interval: NodeJS.Timeout;
    const startTimeout = setTimeout(() => {
      interval = setInterval(spawnGlitches, 2500);
    }, delay * 1000);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [delay]);

  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      <AnimatePresence>
        {activeHexes.map((hex) => (
          <motion.div
            key={hex.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: hex.y - 129.326,
              left: hex.x - 112,
              width: 256,
              height: 288,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="-16 -16 256 290.652" width="100%" height="100%">
              {[
                { width: 12, blur: 12, op: 0.2 }, // Slightly thicker bloom for larger scale
                { width: 6, blur: 3, op: 0.5 },  // Slightly thicker glow
                { width: 2, blur: 0, op: 1.0 },   // Slightly thicker core
              ].map((layer, i) => {
                const len = 0.3; // Segment length
                return (
                  <motion.polygon
                    key={i}
                    points="112,0 224,64.664 224,193.988 112,258.652 0,193.988 0,64.664"
                    fill="none"
                    stroke={hex.color}
                    strokeWidth={layer.width}
                    strokeLinecap="round"
                    initial={{
                      pathLength: len,
                      pathOffset: -len,
                      opacity: 0
                    }}
                    animate={{
                      pathOffset: 1,
                      opacity: [0, layer.op, layer.op, 0]
                    }}
                    transition={{
                      duration: 3,
                      delay: hex.delay,
                      times: [0, 0.1, 0.9, 1],
                      ease: "linear"
                    }}
                    style={{
                      filter: layer.blur ? `blur(${layer.blur}px)` : `drop-shadow(0 0 10px ${hex.color})`,
                    }}
                  />
                );
              })}
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}
