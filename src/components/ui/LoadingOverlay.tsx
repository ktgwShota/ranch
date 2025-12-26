'use client';

import { Backdrop, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLoadingStore } from '@/stores/useLoadingStore';

export default function LoadingOverlay() {
  const { isLoading: open, message } = useLoadingStore();

  // Prevent scrolling while the overlay is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Also prevent touch-based scrolling on mobile
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [open]);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 9999, // Ensure it's on top of everything
        backgroundColor: '#ffffff', // Solid white to hide the underlying page ensuring smooth transition
        flexDirection: 'column',
        gap: 4,
      }}
      open={open}
      transitionDuration={{ enter: 800, exit: 1500 }} // Smooth fade in (whitening) and slow fade out
    >
      {/* 3D Cyber Sphere Container */}
      <Box
        sx={{
          width: 100,
          height: 100,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          perspective: '900px',
        }}
      >
        {/* Core Glow */}
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            boxShadow: [
              '0 0 10px #06b6d4',
              '0 0 20px #06b6d4',
              '0 0 10px #06b6d4'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: '#06b6d4',
            position: 'absolute',
          }}
        />

        {/* Ring 1 - Vertical Rotate */}
        <Box
          component={motion.div}
          animate={{ rotateY: 360, rotateX: 45 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderTop: '2px solid #3b82f6',
          }}
        />

        {/* Ring 2 - Horizontal Rotate (Reverse) */}
        <Box
          component={motion.div}
          animate={{ rotateX: 360, rotateY: 45 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          sx={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            border: '1px dashed rgba(6, 182, 212, 0.4)',
            borderLeft: '2px solid #06b6d4',
          }}
        />

        {/* Ring 3 - Diagonal Fast */}
        <Box
          component={motion.div}
          animate={{ rotateZ: 360, rotateX: 60 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          sx={{
            position: 'absolute',
            width: '110%',
            height: '110%',
            borderRadius: '50%',
            border: '1px dotted rgba(59, 130, 246, 0.5)',
          }}
        />

        {/* Data Particles (Simulated by dots on a ring) */}
        <Box
          component={motion.div}
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          sx={{
            position: 'absolute',
            width: '130%',
            height: '130%',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0)', // Invisible border
          }}
        >
          <Box sx={{
            position: 'absolute', top: 0, left: '50%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#06b6d4', boxShadow: '0 0 5px #06b6d4'
          }} />
          <Box sx={{
            position: 'absolute', bottom: 0, left: '50%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#3b82f6', boxShadow: '0 0 5px #3b82f6'
          }} />
          <Box sx={{
            position: 'absolute', top: '50%', right: 0, width: 4, height: 4, borderRadius: '50%', backgroundColor: '#06b6d4', boxShadow: '0 0 5px #06b6d4'
          }} />
        </Box>
      </Box>

      <Typography
        variant="h6"
        component={motion.p}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        sx={{
          color: '#1e293b', // Slate 800
          fontWeight: 500,
          letterSpacing: '0.05em',
          fontSize: '16px',
          fontFamily: "'Roboto Mono', monospace", // Mono font for cyber feel
        }}
      >
        {message}
      </Typography>
    </Backdrop>
  );
}
