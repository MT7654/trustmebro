import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, ShieldCheck, LogOut, AlertOctagon, HelpCircle } from 'lucide-react';
import { PinnedClaim } from '../types';
import { sound } from '../utils/sound';

interface LostExchangeModalProps {
  isOpen: boolean;
  claim: PinnedClaim | null;
  onRetry: () => void;
}

export const LostExchangeModal: React.FC<LostExchangeModalProps> = ({
  isOpen,
  claim,
  onRetry
}) => {
  if (!isOpen || !claim) return null;

  // Contextual lost dialog for each character
  const getLostExchangeNarrative = () => {
    switch (claim.speakerId) {
      case 'noah':
        return `Noah shrugs and pulls out his phone: "Look, we've spent ten minutes picking apart Alyssa's words. It really doesn't matter, bro. Pass the pretzels." The conversation moves past you before you can expose the contradiction.`;
      case 'alyssa':
        return `Alyssa giggles nervously and leans back: "You're overthinking this so much! Ryan said it was sweet peach, I took two puffs, and nobody's dropping dead. Ryan, turn up the music." The room's attention drifts away.`;
      case 'ryan':
        return `Ryan shakes his head with a chuckle: "Bro, you're interrogating us like detectives! Relax, it's a casual night, we're all good here." The room laughs, and someone changes the topic to weekend plans.`;
      default:
        return `The room's attention drifted away after three unsuccessful challenges. The group lost patience with this line of questioning and moved on.`;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-neutral-950 border-4 border-red-600 text-neutral-100 shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-red-600 text-white px-5 py-3.5 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-yellow-300" />
              <h2 className="font-heading font-black text-base sm:text-lg uppercase tracking-wider">
                YOU LOST THIS EXCHANGE
              </h2>
            </div>
            <span className="text-[10px] font-display font-black bg-black text-red-300 px-2 py-0.5 border border-red-400 uppercase">
              0/3 ATTEMPTS LEFT
            </span>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-4 font-body">
            {/* Target Claim Reminder */}
            <div className="p-3 bg-neutral-900 border-2 border-neutral-700">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Statement You Were Challenging:
              </span>
              <p className="font-heading font-black text-xs sm:text-sm text-yellow-300">
                {claim.speakerName}: "{claim.originalText}"
              </p>
            </div>

            {/* Narrative Explanation */}
            <div className="p-4 bg-neutral-900/90 border-l-4 border-red-500 text-xs sm:text-sm text-neutral-200 leading-relaxed italic">
              {getLostExchangeNarrative()}
            </div>

            {/* Preservation Reassurance */}
            <div className="p-3 bg-neutral-900/60 border border-neutral-800 text-[11px] font-display text-neutral-300 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">All your progress is safe:</strong> Retrying resets only the 3 attempts and tested cards for this statement. All collected quotes, earlier breakthroughs, completed source map links, and settings remain untouched.
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                id="retry-exchange-btn"
                onClick={() => {
                  sound.playClick();
                  onRetry();
                }}
                className="w-full p-3.5 bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black comic-shadow font-heading font-black text-sm uppercase tracking-wider flex items-center justify-between transition-transform hover:scale-[1.01]"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-black" />
                  <span>Retry This Exchange</span>
                </div>
                <span className="text-[10px] font-display font-bold bg-black text-yellow-300 px-2 py-0.5">
                  FRESH 3 ATTEMPTS
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
