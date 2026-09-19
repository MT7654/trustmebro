import React from 'react';
import { motion } from 'motion/react';
import { Search, Swords, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface StructureOverviewModalProps {
  isOpen: boolean;
  onProceed: () => void;
  isReducedMotion?: boolean;
}

export const StructureOverviewModal: React.FC<StructureOverviewModalProps> = ({
  isOpen,
  onProceed,
  isReducedMotion = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        transition={{ duration: isReducedMotion ? 0.05 : 0.25 }}
        className="bg-slate-900 border-2 border-amber-400 text-slate-100 rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col space-y-5"
      >
        {/* Header Tag */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-display font-black uppercase tracking-wider text-amber-400">
              MISSION BRIEFING // GAME STRUCTURE
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            2 PLAYABLE SEGMENTS
          </span>
        </div>

        {/* Central Core Structure Banner */}
        <div className="p-4 bg-slate-950 border-2 border-amber-400/80 rounded-lg text-center space-y-3 shadow-inner">
          <p className="font-heading font-black text-base sm:text-lg text-amber-300 leading-snug">
            “First, find out what everyone is relying on. Then, test their claims.”
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2 border-t border-slate-800">
            {/* Segment 1 */}
            <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded">
              <div className="flex items-center gap-1.5 text-amber-400 font-heading font-black text-xs uppercase mb-1">
                <Search className="w-3.5 h-3.5" />
                <span>INVESTIGATE</span>
              </div>
              <p className="text-[11px] font-display text-slate-200 font-bold">
                Inspect, question, record
              </p>
              <p className="text-[10px] font-body text-slate-400 mt-0.5">
                Examine objects on the table and ask long-time friends what proof they hold.
              </p>
            </div>

            {/* Segment 2 */}
            <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded">
              <div className="flex items-center gap-1.5 text-cyan-400 font-heading font-black text-xs uppercase mb-1">
                <Swords className="w-3.5 h-3.5" />
                <span>CROSS-EXAMINE</span>
              </div>
              <p className="text-[11px] font-display text-slate-200 font-bold">
                Press, pin, present
              </p>
              <p className="text-[10px] font-body text-slate-400 mt-0.5">
                Pin disputed claims, present evidence cards, and expose assumptions.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="structure-overview-begin-btn"
          onClick={() => {
            sound.playTakeThat();
            onProceed();
          }}
          className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-xs sm:text-sm uppercase tracking-wider rounded border-2 border-black comic-shadow transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>BEGIN INVESTIGATION</span>
          <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
        </button>
      </motion.div>
    </div>
  );
};
