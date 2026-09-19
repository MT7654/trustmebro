import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2, Flame, User, MessageSquare } from 'lucide-react';
import { BreakthroughDialogue, CharacterExpression, CharacterId, PlayerProfile } from '../types';
import { CharacterIllustration } from './CharacterIllustration';
import { sound } from '../utils/sound';

interface BreakthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  claimSpeaker: string;
  oldWording: string;
  newWording: string;
  fullSentence: string;
  dialogueSteps: BreakthroughDialogue[];
  playerProfile?: PlayerProfile;
}

export const BreakthroughModal: React.FC<BreakthroughModalProps> = ({
  isOpen,
  onClose,
  title,
  claimSpeaker,
  oldWording,
  newWording,
  fullSentence,
  dialogueSteps,
  playerProfile = { name: 'Sam', gender: 'male' }
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentDialogue = dialogueSteps[currentStepIndex] || dialogueSteps[0];
  const isLastStep = currentStepIndex >= dialogueSteps.length - 1;

  const handleNext = () => {
    sound.playClick();
    if (isLastStep) {
      sound.playContradictionSuccess();
      onClose();
      setCurrentStepIndex(0);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-slate-900 border-2 border-yellow-400 text-slate-100 comic-shadow-lg rounded-lg overflow-hidden flex flex-col relative shadow-2xl"
      >
        {/* Flashy Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 px-4 py-3 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-red-600 fill-red-600 animate-bounce" />
            <span className="font-heading font-black text-sm sm:text-base uppercase tracking-wider">
              CONTRADICTION EXPOSED &bull; BREAKTHROUGH
            </span>
          </div>
          <span className="text-xs font-display font-bold uppercase tracking-widest bg-slate-950 text-yellow-300 px-2 py-0.5 rounded">
            {title}
          </span>
        </div>

        {/* Wording Correction Banner with Dynamic Text Replacement Animation */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-b border-slate-800 text-center space-y-3">
          <span className="text-[10px] font-display uppercase tracking-widest text-amber-400 block">
            LIVE PREMISE REVISION
          </span>

          <div className="flex items-center justify-center gap-3 text-sm sm:text-lg font-body flex-wrap">
            <motion.span 
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 0.95] }}
              className="text-slate-400 line-through decoration-red-500 decoration-4 font-semibold px-3 py-1 bg-slate-900 border border-slate-700 rounded"
            >
              {oldWording}
            </motion.span>
            <ArrowRight className="w-5 h-5 text-yellow-400 shrink-0 animate-pulse" />
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="text-slate-950 bg-yellow-400 px-3 py-1 font-heading font-black uppercase tracking-wider rounded shadow-md"
            >
              {newWording}
            </motion.span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium italic max-w-lg mx-auto leading-relaxed">
            "{fullSentence}"
          </p>

          {/* Signature 3-to-1 Collapse Visualization on Final Gate */}
          {(oldWording.includes('THREE') || newWording.includes('ONE CLAIM')) && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="text-[10px] font-display uppercase tracking-wider text-yellow-400 font-bold mb-2">
                STRUCTURAL COLLAPSE: 3 INDEPENDENT ECHOES ➔ 1 UNVERIFIED STRANGER
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-xs font-heading font-black">
                <div className="px-2 py-1 bg-emerald-950 border border-emerald-500/60 text-emerald-200 rounded">
                  Noah (Relied on Ryan)
                </div>
                <span className="text-slate-500">+</span>
                <div className="px-2 py-1 bg-purple-950 border border-purple-500/60 text-purple-200 rounded">
                  Alyssa (Relied on Ryan)
                </div>
                <span className="text-slate-500">+</span>
                <div className="px-2 py-1 bg-amber-950 border border-amber-500/60 text-amber-200 rounded">
                  Ryan (Relied on Telegram)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Character Dialogue Sequence (Visual Novel Cut-Scene) */}
        <div className="p-4 sm:p-6 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="flex items-start gap-3 sm:gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-3 sm:p-4"
            >
              <div className="shrink-0">
                <CharacterIllustration 
                  characterId={currentDialogue.characterId} 
                  playerGender={playerProfile.gender}
                  expression={currentDialogue.expression} 
                  size="sm"
                  className="w-14 h-14 sm:w-16 sm:h-16"
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-xs sm:text-sm text-yellow-400 uppercase tracking-wider">
                    {currentDialogue.characterId === 'player' || currentDialogue.speaker === 'Player'
                      ? playerProfile.name
                      : currentDialogue.speaker}
                  </span>
                  <span className="text-[10px] font-display text-slate-500">
                    Step {currentStepIndex + 1} of {dialogueSteps.length}
                  </span>
                </div>
                <p className="font-body text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentDialogue.text.replace(/Player/g, playerProfile.name)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progression Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-display text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Evidence Gate Verified</span>
            </span>

            <button
              id="breakthrough-next-btn"
              onClick={handleNext}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-xs sm:text-sm uppercase tracking-wider rounded border-2 border-black comic-shadow transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>{isLastStep ? 'RETURN TO ROOM' : 'CONTINUE DIALOGUE'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
