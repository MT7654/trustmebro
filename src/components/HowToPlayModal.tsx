import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, Search, ShieldAlert, CheckCircle2, Bookmark, Flame, ArrowRight, Eye, Send, Pin } from 'lucide-react';
import { sound } from '../utils/sound';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReducedMotion?: boolean;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  isReducedMotion = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: isReducedMotion ? 0.05 : 0.2 }}
        className="bg-slate-900 border-2 border-amber-400 text-slate-100 rounded-xl max-w-xl w-full p-4 sm:p-6 shadow-2xl flex flex-col space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400 font-bold shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-display font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950 tracking-wider">
                HOW TO PLAY
              </span>
              <h2 className="font-heading font-black text-base sm:text-lg text-slate-100 mt-0.5">
                Game Structure & Controls
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close How to Play"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Objective Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-2 border-amber-400/80 rounded-lg text-center space-y-2">
          <p className="font-heading font-black text-sm sm:text-base text-amber-300 leading-snug">
            “First, find out what everyone is relying on. Then, test their claims.”
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-display font-bold">
            <span className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded uppercase tracking-wider">
              INVESTIGATE — Inspect, question, record
            </span>
            <span className="text-slate-400 hidden sm:inline">&bull;</span>
            <span className="px-2.5 py-1 bg-cyan-400 text-slate-950 rounded uppercase tracking-wider">
              CROSS-EXAMINE — Press, pin, present
            </span>
          </div>
        </div>

        {/* Segment Breakdown */}
        <div className="space-y-3">
          {/* Segment 1: Investigation */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-heading font-black text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
                Segment 1: Investigation
              </h3>
            </div>
            <ul className="text-xs text-slate-300 font-body space-y-1.5 pl-8 list-disc">
              <li>
                <strong className="text-amber-300">Inspect Physical & Digital Objects:</strong> Practise on the speaker, then examine the sealed box and Ryan's message history for objective observations.
              </li>
              <li>
                <strong className="text-amber-300">Question the Room:</strong> Talk to Ryan, Alyssa, and Noah to collect their verbatim accounts and identify where their confidence comes from.
              </li>
              <li>
                <strong className="text-amber-300">Record Evidence:</strong> Save observed facts into your visual Case File to prepare for the cross-examination.
              </li>
            </ul>
          </div>

          {/* Segment 2: Cross-Examination */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-heading font-black text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
                Segment 2: Cross-Examination
              </h3>
            </div>
            <ul className="text-xs text-slate-300 font-body space-y-1.5 pl-8 list-disc">
              <li>
                <strong className="text-cyan-300">Press Statements:</strong> Question character assumptions and scrutinize their reasoning.
              </li>
              <li>
                <strong className="text-cyan-300">Pin Disputed Claims:</strong> Select the active contradiction gate you wish to disprove.
              </li>
              <li>
                <strong className="text-cyan-300">Present Evidence:</strong> Select matching physical, digital, or source-map evidence from your Case File and click <span className="text-amber-300 font-bold">PRESENT EVIDENCE!</span> to expose contradictions.
              </li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-xs sm:text-sm uppercase tracking-wider rounded border border-black comic-shadow transition-transform hover:scale-102 cursor-pointer"
          >
            Got It &mdash; Return to Game
          </button>
        </div>
      </motion.div>
    </div>
  );
};
