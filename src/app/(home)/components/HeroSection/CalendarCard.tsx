'use client';

import { motion } from 'framer-motion';
import { COLORS } from '../../constants';
import VoteStamp from './VoteStamp';

export default function CalendarCard({
  data,
  isDecided,
  index,
}: {
  data: any;
  isDecided: boolean;
  index: number;
}) {
  const isWinner = data.id === 2;

  return (
    <motion.div
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5, // Simple fade transition
      }}
      style={{ height: '100%', flex: '1 1 calc(50% - 10px)' }}
    >
      <motion.div
        animate={{
          borderColor: isWinner && isDecided ? COLORS.PRIMARY : COLORS.BORDER,
          boxShadow: isWinner && isDecided ? '0 30px 60px -12px rgba(37, 99, 235, 0.25)' : 'none',
        }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center rounded-[40px] p-10"
        style={{
          background: COLORS.CARD_BG,
          border: '1.5px solid',
          borderColor: COLORS.BORDER,
        }}
      >
        {isWinner && isDecided && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 12 }}
            transition={{
              delay: 0.6,
              type: 'spring',
              stiffness: 400,
              damping: 15,
            }}
            style={{
              position: 'absolute',
              top: -20,
              right: -10,
              zIndex: 30,
            }}
          >
            <div
              className="rounded-lg px-[9.6px] py-[2.4px] font-black text-[8px] text-white"
              style={{
                backgroundColor: COLORS.PRIMARY,
                boxShadow: `0 8px 16px ${COLORS.PRIMARY}30`,
              }}
            >
              DECIDED
            </div>
          </motion.div>
        )}

        {/* Date Header */}
        <div className="relative z-[1] mt-4 mb-10 text-center">
          <span
            className="mb-2 block font-extrabold uppercase leading-none"
            style={{
              color: isWinner ? COLORS.PRIMARY : COLORS.TEXT_SUB,
              fontSize: '9px',
              letterSpacing: '0.15em',
            }}
          >
            {data.day}
          </span>
          <div
            className="font-extrabold text-[28px] leading-none"
            style={{ color: COLORS.TEXT_MAIN }}
          >
            {data.date.split('/')[1]}
          </div>
          <div className="mt-2 font-medium text-[10px]" style={{ color: COLORS.TEXT_SUB }}>
            Dec
          </div>
        </div>

        {/* Voting Status */}
        <div className="relative z-[1] mb-4 grid w-full grid-cols-3 justify-items-center gap-[9.6px]">
          {data.votes.map((vote: string, i: number) => (
            <VoteStamp key={i} status={vote} index={i} isWinner={isWinner} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
