import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Network, CheckCircle2, AlertCircle, ArrowDown, Lock, Sparkles, HelpCircle, ShieldAlert, Award, ArrowRight, Zap } from 'lucide-react';
import { EvidenceQuote, SourcePersonId } from '../types';
import { CharacterIllustration } from './CharacterIllustration';
import { sound } from '../utils/sound';

interface SourceMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedQuotes: EvidenceQuote[];
  hasEarnedCaseCard: boolean;
  onAwardCaseCard: () => void;
  onOpenEvidenceDrawer: () => void;
}

interface NodeInfo {
  id: SourcePersonId;
  name: string;
  role: string;
  color: string;
}

export const SourceMapModal: React.FC<SourceMapModalProps> = ({
  isOpen,
  onClose,
  collectedQuotes,
  hasEarnedCaseCard,
  onAwardCaseCard,
  onOpenEvidenceDrawer
}) => {
  // Check which accounts player has unlocked:
  const hasRyanAccount = collectedQuotes.some(q => q.id === 'quote_telegram_anonymous' || q.id === 'quote_ryan_trusted_seller');
  const hasAlyssaAccount = collectedQuotes.some(q => q.id === 'quote_alyssa_only_tried');
  const hasNoahAccount = collectedQuotes.some(q => q.id === 'quote_noah_relied_ryan');

  // Player selected dependency connections
  const [ryanSource, setRyanSource] = useState<SourcePersonId | null>(hasEarnedCaseCard ? 'unknown_seller' : null);
  const [alyssaSource, setAlyssaSource] = useState<SourcePersonId | null>(hasEarnedCaseCard ? 'ryan' : null);
  const [noahSource, setNoahSource] = useState<SourcePersonId | null>(hasEarnedCaseCard ? 'ryan' : null);

  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const candidateNodes: NodeInfo[] = [
    { id: 'unknown_seller', name: 'Unknown Seller', role: '@VaporKush_SG on Telegram', color: 'bg-red-950 text-red-300 border-red-500' },
    { id: 'ryan', name: 'Ryan', role: 'Host & Pod Carrier', color: 'bg-amber-950 text-amber-300 border-amber-500' },
    { id: 'alyssa', name: 'Alyssa', role: 'Witness (2 puffs)', color: 'bg-purple-950 text-purple-300 border-purple-500' },
    { id: 'noah', name: 'Noah', role: 'Non-vaper Friend', color: 'bg-emerald-950 text-emerald-300 border-emerald-500' }
  ];

  const handleSelectSource = (target: 'ryan' | 'alyssa' | 'noah', selected: SourcePersonId) => {
    sound.playClick();
    setFeedback(null);

    // Guard: Account earned check
    if (target === 'ryan') {
      if (!hasRyanAccount) {
        sound.playBlip();
        setFeedback({
          text: "CLUE MISSING: You haven't pressed Ryan on where he got the pod yet. Press Ryan in testimony to discover his anonymous Telegram seller admission!",
          isError: true
        });
        return;
      }

      if (selected === 'unknown_seller') {
        setRyanSource('unknown_seller');
        checkCompletion('unknown_seller', alyssaSource, noahSource);
      } else {
        setFeedback({
          text: "CLUE: Ryan claimed he had 'a verified contact' who vouched for the flavour. He did not get it from Noah or Alyssa.",
          isError: true
        });
      }
    }

    if (target === 'alyssa') {
      if (!hasAlyssaAccount) {
        sound.playBlip();
        setFeedback({
          text: "CLUE MISSING: Press Alyssa on why she took the vape to hear her admission that she only tried it because of Ryan!",
          isError: true
        });
        return;
      }

      if (selected === 'ryan') {
        setAlyssaSource('ryan');
        checkCompletion(ryanSource, 'ryan', noahSource);
      } else {
        setFeedback({
          text: "CLUE: Alyssa said 'I thought Ryan checked this one himself'. She relied on Ryan's word before trying it.",
          isError: true
        });
      }
    }

    if (target === 'noah') {
      if (!hasNoahAccount) {
        sound.playBlip();
        setFeedback({
          text: "CLUE MISSING: Press Noah on why he vouched for the pod to uncover his admission that he just followed Ryan!",
          isError: true
        });
        return;
      }

      if (selected === 'ryan') {
        setNoahSource('ryan');
        checkCompletion(ryanSource, alyssaSource, 'ryan');
      } else {
        setFeedback({
          text: "CLUE: Noah said 'Ryan is my closest secondary school bro. If Ryan says it's normal, it's normal'.",
          isError: true
        });
      }
    }
  };

  const checkCompletion = (r: SourcePersonId | null, a: SourcePersonId | null, n: SourcePersonId | null) => {
    if (r === 'unknown_seller' && a === 'ryan' && n === 'ryan') {
      sound.playContradictionSuccess();
      if (!hasEarnedCaseCard) {
        onAwardCaseCard();
      }
      setFeedback({
        text: "★ SOURCE MAP COMPLETE! The illusion of 3 independent confirmations collapses into 1 anonymous Telegram stranger.",
        isError: false
      });
    }
  };

  const isAllCorrect = ryanSource === 'unknown_seller' && alyssaSource === 'ryan' && noahSource === 'ryan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-slate-900 border-2 border-slate-700 text-slate-100 rounded-lg overflow-hidden flex flex-col max-h-[92vh] shadow-2xl"
      >
        {/* Header */}
        <div className="bg-slate-950 px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Network className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                THE SOURCE MAP: APPARENT VS. ACTUAL ORIGIN
              </h2>
              <p className="font-display text-xs text-amber-400 font-bold uppercase tracking-wider">
                Exposing the Single Unverified Source Behind 3 Confident Friends
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Instructions Box */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-heading font-black text-xs sm:text-sm text-slate-200 uppercase tracking-wider block">
                HOW PEER ASSURANCE FOOLS US
              </span>
              <p className="text-xs font-body text-slate-300 leading-relaxed">
                Ryan claims three people confirmed the pod: himself, Alyssa, and Noah. Connect each friend to the actual source they relied on. When you map all three, the illusion of three separate safety checks will collapse.
              </p>
            </div>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-lg border text-xs font-display font-semibold flex items-start gap-2.5 ${
                feedback.isError 
                  ? 'bg-red-950/90 text-red-200 border-red-600' 
                  : 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{feedback.text}</div>
            </motion.div>
          )}

          {/* Signature Award Banner on Unlock */}
          {(isAllCorrect || hasEarnedCaseCard) && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 sm:p-5 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-yellow-400 rounded-lg text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-yellow-400 text-slate-950 flex items-center justify-center font-black rounded border-2 border-white shrink-0">
                  <Award className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <div className="text-xs font-display font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>CASE CARD AWARDED // EVIDENCE #04</span>
                  </div>
                  <div className="text-base font-heading font-black text-white">
                    “One origin, three voices”
                  </div>
                  <div className="text-xs text-slate-300 font-display">
                    Noah & Alyssa relied on Ryan &bull; Ryan relied on an anonymous Telegram seller.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onOpenEvidenceDrawer();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-xs uppercase tracking-wider rounded border-2 border-black whitespace-nowrap comic-shadow transition-transform hover:scale-105 cursor-pointer"
              >
                OPEN CASE NOTES & PRESENT →
              </button>
            </motion.div>
          )}

          {/* Interactive Workbench: 3 Dependency Questions */}
          <div className="space-y-4">
            {/* Question 1: RYAN */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-amber-500 text-black font-heading font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="font-heading font-black text-sm uppercase text-slate-200">
                    Who did Ryan depend on for the vape's safety?
                  </span>
                </div>
                <div className="text-[11px] font-display">
                  {hasRyanAccount ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Clue Available
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Locked (Press Ryan in Testimony)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {candidateNodes.map(node => {
                  const isSelected = ryanSource === node.id;
                  return (
                    <button
                      key={`ryan-${node.id}`}
                      onClick={() => handleSelectSource('ryan', node.id)}
                      className={`p-2.5 rounded border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-white shadow font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-heading font-black uppercase truncate">{node.name}</div>
                      <div className={`text-[10px] font-display truncate ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                        {node.role}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2: ALYSSA */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-purple-500 text-white font-heading font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="font-heading font-black text-sm uppercase text-slate-200">
                    Who did Alyssa look to before taking a hit?
                  </span>
                </div>
                <div className="text-[11px] font-display">
                  {hasAlyssaAccount ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Clue Available
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Locked (Press Alyssa in Testimony)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {candidateNodes.map(node => {
                  const isSelected = alyssaSource === node.id;
                  return (
                    <button
                      key={`alyssa-${node.id}`}
                      onClick={() => handleSelectSource('alyssa', node.id)}
                      className={`p-2.5 rounded border text-left transition-all ${
                        isSelected
                          ? 'bg-purple-400 text-slate-950 border-white shadow font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-heading font-black uppercase truncate">{node.name}</div>
                      <div className={`text-[10px] font-display truncate ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                        {node.role}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3: NOAH */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-emerald-500 text-white font-heading font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <span className="font-heading font-black text-sm uppercase text-slate-200">
                    Who did Noah rely on to vouch for the gathering?
                  </span>
                </div>
                <div className="text-[11px] font-display">
                  {hasNoahAccount ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Clue Available
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Locked (Press Noah in Testimony)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {candidateNodes.map(node => {
                  const isSelected = noahSource === node.id;
                  return (
                    <button
                      key={`noah-${node.id}`}
                      onClick={() => handleSelectSource('noah', node.id)}
                      className={`p-2.5 rounded border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-400 text-slate-950 border-white shadow font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-heading font-black uppercase truncate">{node.name}</div>
                      <div className={`text-[10px] font-display truncate ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                        {node.role}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Signature 3-to-1 Collapse Diagram */}
          <div className="p-4 sm:p-6 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-4">
            <span className="text-[10px] font-display uppercase tracking-widest text-slate-400 block">
              // THE COLLAPSED SOURCE TREE: ONE ORIGIN, THREE VOICES
            </span>

            <div className="flex flex-col items-center justify-center gap-3">
              {/* Top Origin */}
              <div className={`px-5 py-2.5 rounded border-2 text-xs font-heading font-black uppercase transition-all ${
                ryanSource === 'unknown_seller' 
                  ? 'bg-red-950 text-red-200 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-slate-900 text-slate-600 border-slate-800'
              }`}>
                UNKNOWN TELEGRAM SELLER (@VaporKush_SG)
              </div>

              <ArrowDown className={`w-5 h-5 transition-colors ${
                ryanSource === 'unknown_seller' ? 'text-amber-400 animate-bounce' : 'text-slate-700'
              }`} />

              {/* Middle Link */}
              <div className={`px-5 py-2.5 rounded border-2 text-xs font-heading font-black uppercase transition-all ${
                ryanSource === 'unknown_seller'
                  ? 'bg-amber-950 text-amber-200 border-amber-500 shadow'
                  : 'bg-slate-900 text-slate-600 border-slate-800'
              }`}>
                RYAN (Believed anonymous chat bio without verification)
              </div>

              {/* Split arrows */}
              <div className="flex items-center justify-center gap-24 sm:gap-36 text-slate-600">
                <ArrowDown className={`w-5 h-5 transition-colors ${
                  alyssaSource === 'ryan' ? 'text-purple-400' : 'text-slate-800'
                }`} />
                <ArrowDown className={`w-5 h-5 transition-colors ${
                  noahSource === 'ryan' ? 'text-emerald-400' : 'text-slate-800'
                }`} />
              </div>

              {/* Bottom Echoes */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                <div className={`px-4 py-2 rounded border-2 text-xs font-heading font-black uppercase transition-all ${
                  alyssaSource === 'ryan'
                    ? 'bg-purple-950 text-purple-200 border-purple-500'
                    : 'bg-slate-900 text-slate-600 border-slate-800'
                }`}>
                  ALYSSA (Echoed Ryan)
                </div>

                <div className={`px-4 py-2 rounded border-2 text-xs font-heading font-black uppercase transition-all ${
                  noahSource === 'ryan'
                    ? 'bg-emerald-950 text-emerald-200 border-emerald-500'
                    : 'bg-slate-900 text-slate-600 border-slate-800'
                }`}>
                  NOAH (Echoed Ryan)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs font-display text-slate-400">
            {isAllCorrect ? (
              <span className="text-emerald-400 font-bold">
                ✓ Full chain resolved. Present this card in testimony to break Gate #3.
              </span>
            ) : (
              <span>Map all 3 links to reveal the complete source dependency.</span>
            )}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded border border-slate-600 transition-colors"
          >
            RETURN TO ROOM
          </button>
        </div>
      </motion.div>
    </div>
  );
};
