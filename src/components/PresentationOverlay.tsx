import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EvidenceQuote, PinnedClaim, PlayerProfile } from '../types';
import { EvidenceThumbnail } from './EvidenceThumbnail';
import { sound } from '../utils/sound';
import { 
  Pin, 
  Target, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Zap,
  ShieldCheck,
  Search
} from 'lucide-react';

interface PresentationOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  claim: PinnedClaim;
  evidence: EvidenceQuote;
  playerProfile?: PlayerProfile;
  isReducedMotion?: boolean;
}

export const PresentationOverlay: React.FC<PresentationOverlayProps> = ({
  isOpen,
  onComplete,
  claim,
  evidence,
  playerProfile = { name: 'Sam', gender: 'male' },
  isReducedMotion = false
}) => {
  const [phase, setPhase] = useState<'intro' | 'connect' | 'revised'>('intro');

  useEffect(() => {
    if (!isOpen) {
      setPhase('intro');
      return;
    }

    sound.playTakeThat();
    sound.playDramaticHit();

    const t1 = setTimeout(() => {
      setPhase('connect');
      sound.playPaperSlide();
    }, 700);

    const t2 = setTimeout(() => {
      setPhase('revised');
      sound.playContradictionSuccess();
    }, 1800);

    const t3 = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-md select-none overflow-hidden"
      >
        {/* Dynamic Speedlines & Grid Aura */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-950 to-black" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        </div>

        {/* TOP CINEMATIC PRESENTATION HEADER */}
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 sm:top-6 inset-x-0 flex justify-center z-20"
        >
          <div className="flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-heading font-black text-sm sm:text-base uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] border-2 border-white">
            <Zap className="w-5 h-5 fill-slate-950 animate-pulse" />
            <span>PIN THE CLAIM &bull; PRESENT EVIDENCE</span>
            <Target className="w-5 h-5 text-slate-950" />
          </div>
        </motion.div>

        {/* MAIN PRESENTATION STAGE */}
        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center space-y-6">
          
          {/* ENLARGED EVIDENCE CARD SURGING FORWARD */}
          <motion.div
            initial={isReducedMotion ? { scale: 1 } : { scale: 0.5, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 220 }}
            className="w-full max-w-xl bg-slate-900 border-2 border-amber-400 rounded-xl p-4 sm:p-5 shadow-[0_0_50px_rgba(251,191,36,0.3)] relative overflow-hidden"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-heading font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded">
                  {evidence.category === 'physical' && '📦 PHYSICAL EVIDENCE'}
                  {evidence.category === 'digital' && '📱 DIGITAL RECORD'}
                  {evidence.category === 'verbal' && '💬 WITNESS ACCOUNT'}
                  {evidence.category === 'source_map' && '🗺️ SOURCE DEPENDENCY MAP'}
                </span>
                <span className="text-xs font-heading font-black text-amber-300">
                  {evidence.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {evidence.tag}
              </span>
            </div>

            {/* Content: Large Illustrated Thumbnail + Observation Note */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <div className="relative group shrink-0">
                <EvidenceThumbnail type={evidence.thumbnailType} evidenceId={evidence.id} size="xl" className="border-2 border-amber-400/80 shadow-lg" />
                <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 p-1 rounded-full shadow">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2 text-left flex-1">
                <div>
                  <div className="text-[10px] font-display font-black uppercase tracking-wider text-slate-400">
                    What Was Actually Observed:
                  </div>
                  <p className="text-xs sm:text-sm font-body text-slate-100 font-medium leading-relaxed bg-slate-950/80 p-2.5 rounded border border-slate-800">
                    {evidence.neutralDescription}
                  </p>
                </div>

                <div className="text-[11px] font-body text-amber-200/90 italic">
                  "{evidence.quote}"
                </div>
              </div>
            </div>
          </motion.div>

          {/* VISUAL CONNECTOR BRACKETS & LINES */}
          <div className="w-full max-w-xl flex flex-col items-center">
            {phase !== 'intro' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 36, opacity: 1 }}
                className="w-0.5 bg-gradient-to-b from-amber-400 to-cyan-400 relative"
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-0.5 bg-slate-950 border border-cyan-400 text-cyan-300 font-mono text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  CONFRONTING PREMISE
                </div>
              </motion.div>
            )}
          </div>

          {/* TARGET PINNED TESTIMONY WITH DYNAMIC STRIKE-THROUGH */}
          <motion.div
            initial={isReducedMotion ? { opacity: 1 } : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 relative shadow-xl"
          >
            <div className="flex items-center justify-between text-[11px] font-display uppercase tracking-wider text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Pin className="w-3.5 h-3.5 text-amber-400" />
                Target Statement: {claim.speakerName}
              </span>
              <span className="font-mono text-slate-500">{claim.title}</span>
            </div>

            {/* Dynamic Revision Area */}
            <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg">
              {phase !== 'revised' ? (
                <div className="font-body text-sm sm:text-base font-bold text-slate-200">
                  "{claim.originalText}"
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 flex-wrap text-sm sm:text-base">
                    <span className="font-heading font-black text-rose-400 line-through decoration-rose-500 decoration-4 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                      {claim.keyWordOriginal}
                    </span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                    <span className="font-heading font-black text-slate-950 bg-emerald-400 px-2.5 py-0.5 rounded uppercase tracking-wider shadow-[0_0_12px_rgba(52,211,153,0.6)]">
                      {claim.keyWordCorrected}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-body text-emerald-200 font-bold">
                    "{claim.fullCorrectedText}"
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom Status Banner */}
            <div className="mt-3 flex items-center justify-between text-xs font-display">
              <span className="text-slate-400">
                Premise Disproved:{' '}
                <strong className="text-amber-300 font-black">{claim.keyWordOriginal}</strong>
              </span>

              {phase === 'revised' ? (
                <span className="px-2.5 py-0.5 bg-emerald-950 border border-emerald-500 text-emerald-300 font-heading font-black uppercase tracking-wider rounded text-[10px] animate-pulse">
                  ✓ ACCOUNT REVISED
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-amber-950 border border-amber-500 text-amber-300 font-heading font-black uppercase tracking-wider rounded text-[10px]">
                  CHECKING THE SOURCE...
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
