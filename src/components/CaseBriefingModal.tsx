import React from 'react';
import { motion } from 'motion/react';
import { X, Play, AlertCircle, HelpCircle, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface CaseBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseBriefingModal: React.FC<CaseBriefingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="briefing-modal-overlay"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border-4 border-black text-neutral-100 comic-shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-red-600 text-black px-4 sm:px-6 py-3 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-black text-yellow-300 font-display font-black text-xs px-2 py-0.5 border border-white">
              BRIEFING
            </span>
            <h2 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider text-white">
              CASE DOSSIER: "TRUST ME BRO"
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 bg-black text-white hover:bg-neutral-800 flex items-center justify-center border-2 border-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 dot-pattern">
          <div className="bg-neutral-950 border-2 border-neutral-700 p-4">
            <span className="text-[10px] font-display uppercase tracking-widest text-yellow-400 block mb-1">
              // THE INCIDENT
            </span>
            <p className="font-body text-xs sm:text-sm text-neutral-200 leading-relaxed">
              You are at a casual gathering with your close friends <strong>Ryan</strong>, <strong>Alyssa</strong>, and <strong>Noah</strong>. 
              Ryan pulls out a sleek peach vape and offers it to you:
            </p>
            <div className="mt-2.5 p-2.5 bg-neutral-900 border-l-4 border-yellow-400 text-yellow-300 font-body text-xs sm:text-sm italic">
              “Normal only. Not Kpod. Trust me, bro. I know my guy.”
            </div>
            <p className="font-body text-xs text-neutral-300 mt-2.5">
              Alyssa has already puffed twice and says she's completely fine. Noah nods and says Ryan knows the supplier. It feels like 100% agreement.
            </p>
          </div>

          <div className="bg-neutral-950 border-2 border-yellow-500/70 p-4">
            <span className="text-[10px] font-display uppercase tracking-widest text-yellow-400 block mb-1">
              // YOUR MISSION (ACE ATTORNEY MECHANIC)
            </span>
            <div className="space-y-2 font-body text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Press for exact accounts:</strong> Question Noah, Alyssa, and Ryan to secure exact quote cards into your Pocket Notes.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span><strong>Pin & Present Evidence:</strong> Keep the active claim pinned, select a collected quote, and hit <strong>PRESENT EVIDENCE</strong> to expose the contradiction!</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Watch wording update:</strong> Noah's "CHECKED" becomes "TRIED". Alyssa's "RYAN CHECKED" becomes "RYAN TRUSTED THE SELLER".</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span><strong>Shatter the Circular Loop:</strong> Reveal how all 3 friends' confidence collapses into an anonymous stranger, and refuse safely!</span>
              </div>
            </div>
          </div>

          <div className="bg-black border border-neutral-800 p-3 text-[11px] font-display text-neutral-400">
            💡 <strong>The Golden Rule:</strong> You do NOT need to prove Ryan is lying, nor do you need a chemical test to prove what's inside. The fact that <em>nobody</em> in the room has verified knowledge is all you need to refuse.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black border-t-3 border-black flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-heading font-black text-sm uppercase tracking-wider border-2 border-black comic-shadow flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-black fill-black" />
            ENTER THE GATHERING
          </button>
        </div>
      </motion.div>
    </div>
  );
};
