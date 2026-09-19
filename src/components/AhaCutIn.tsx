import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/sound';

interface AhaCutInProps {
  isOpen: boolean;
  onComplete: () => void;
  customText?: string;
  subtitle?: string;
  variant?: 'breakthrough' | 'clue';
  durationMs?: number;
  isReducedMotion?: boolean;
}

export const AhaCutIn: React.FC<AhaCutInProps> = ({
  isOpen,
  onComplete,
  customText = 'AHA!',
  subtitle,
  variant = 'breakthrough',
  durationMs,
  isReducedMotion = false
}) => {
  const isClue = variant === 'clue';
  const resolvedSubtitle = subtitle || (isClue ? 'OBSERVATION RECORDED — CASE FILE UPDATED' : 'CIRCULAR TRUST LOOP DETECTED');

  useEffect(() => {
    if (isOpen) {
      sound.playAhaSting();
      if (!isClue) sound.playDramaticHit();
      const timer = setTimeout(() => {
        onComplete();
      }, durationMs ?? (isClue ? 1050 : 2200));
      return () => clearTimeout(timer);
    }
  }, [durationMs, isClue, isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="aha-cut-in-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[70] flex items-center justify-center overflow-hidden select-none ${isClue ? 'bg-slate-950/88' : 'bg-black/95'}`}
        >
          {/* Dynamic speedlines background */}
          <div className="absolute inset-0 opacity-40">
            <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${isClue ? 'from-cyan-500/35 via-slate-950 to-black' : 'from-red-600/40 via-black to-black'}`} />
            {!isReducedMotion && <div className={`absolute inset-0 opacity-25 animate-spin [animation-duration:8s] ${isClue ? 'bg-[repeating-conic-gradient(#22d3ee_0_10deg,transparent_10deg_24deg)]' : 'bg-[repeating-conic-gradient(#ef4444_0_15deg,transparent_15deg_30deg)]'}`} />}
          </div>

          {/* Diagonal Persona banner slash */}
          <motion.div
            initial={isReducedMotion ? { opacity: 0 } : { scaleX: 0, rotate: isClue ? -3 : -6 }}
            animate={isReducedMotion ? { opacity: 1 } : { scaleX: 1, rotate: isClue ? -3 : -6 }}
            exit={{ scaleX: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 220 }}
            className={`absolute w-[140%] ${isClue ? 'h-32 sm:h-40 bg-gradient-to-r from-cyan-700 via-cyan-300 to-blue-700 shadow-[0_0_50px_rgba(34,211,238,0.65)]' : 'h-44 sm:h-56 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 shadow-[0_0_50px_rgba(239,68,68,0.8)]'} border-y-8 border-black flex items-center justify-center`}
          >
            {/* Halftone texture overlay */}
            <div className="absolute inset-0 dot-pattern opacity-30" />
            
            {/* Background comic action lines */}
            <div className="absolute inset-0 flex justify-between px-12 opacity-20 pointer-events-none">
              <span className="font-display text-8xl font-black text-black tracking-tighter">{isClue ? 'FOUND!' : 'HOLD IT!'}</span>
              <span className="font-display text-8xl font-black text-black tracking-tighter">{isClue ? 'RECORDED!' : 'OBJECTION!'}</span>
            </div>

            {/* Main Punch Text */}
            <motion.div
              initial={isReducedMotion ? { opacity: 0 } : { scale: 3, opacity: 0 }}
              animate={isReducedMotion ? { opacity: 1 } : { scale: [3, 0.9, 1], opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: 'easeOut' }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className={`${isClue ? 'text-5xl sm:text-7xl' : 'text-7xl sm:text-9xl'} font-heading font-black tracking-wider text-black uppercase drop-shadow-[5px_5px_0px_#ffffff] italic`}>
                {customText}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-black text-yellow-300 font-display font-bold text-sm sm:text-xl px-6 py-1 tracking-widest uppercase border-2 border-white -mt-2 sm:-mt-4 comic-shadow"
              >
                {resolvedSubtitle}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Subtext warning */}
          {!isClue && <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-16 sm:bottom-20 text-center z-10 px-4"
          >
            <p className="font-display text-red-400 text-sm sm:text-base tracking-widest uppercase font-semibold">
              // BREAKING THE INFORMATION CASCADE //
            </p>
          </motion.div>}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
