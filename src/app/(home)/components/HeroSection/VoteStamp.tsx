import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function VoteStamp({
  status,
  index,
  isWinner,
}: {
  status: string;
  index: number;
  isWinner: boolean;
}) {
  const isOk = status === 'ok';
  const isNg = status === 'ng';
  const isMaybe = status === 'maybe';

  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const randomDelay = Math.random() * 1200;
    const delay = 200 + randomDelay;

    const timer = setTimeout(() => {
      setShowResult(true);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const avatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${index}&backgroundColor=c0aede,b6e3f4,ffdfbf,d1d4f9,ffdfbf`;

  return (
    <div className="relative">
      <img
        src={avatarUrl}
        alt="User Avatar"
        className="block h-9 w-9 rounded-full bg-white"
        style={{
          border: '2px solid rgba(255, 255, 255, 0.8)',
          boxShadow: 'none',
        }}
      />

      <AnimatePresence mode="wait">
        {showResult && (
          <motion.div
            key="result"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            style={{ position: 'absolute', bottom: -6, right: -6, zIndex: 10 }}
          >
            <div
              className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-black/10 bg-white"
              style={{ boxShadow: 'none' }}
            >
              {isOk && <Check size={14} color="#10b981" strokeWidth={3} />}
              {isNg && <X size={13} color="#f43f5e" strokeWidth={3} />}
              {isMaybe && <span className="font-black text-[#f59e0b] text-xs leading-none">?</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
