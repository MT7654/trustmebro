import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, FastForward, HelpCircle, Flame, ShieldAlert, Sparkles, Check, BookmarkPlus, Pin, Quote, ArrowRight, CheckCircle2, ChevronRight, Network, Lock, RotateCcw, AlertOctagon, Send } from 'lucide-react';
import { Character, TestimonyStep, PressInquiry, EvidenceQuote, PinnedClaim, EndingType, TutorialStep } from '../types';
import { FINAL_RESPONSE_OPTIONS } from '../data/gameData';
import { CharacterIllustration } from './CharacterIllustration';
import { sound } from '../utils/sound';

interface DialogueBoxProps {
  activeCharacter: Character;
  testimony: TestimonyStep;
  onPressInquiry: (inquiry: PressInquiry) => void;
  canBreakLoop: boolean;
  onSelectFinalResponse: (endingType: EndingType) => void;
  onOpenSourceMap: () => void;
  hasEarnedCaseCard: boolean;
  lastReactionText?: string | null;
  lastDialogueLead?: string | null;
  recentlyCollectedQuote?: EvidenceQuote | null;
  onResetToTestimony: () => void;
  activeClaim: PinnedClaim;
  claims: PinnedClaim[];
  onSelectClaim: (claimId: string) => void;
  onOpenEvidenceDrawer: () => void;
  collectedQuotesCount: number;
  mismatchFeedback?: string | null;
  onDismissMismatch?: () => void;
  exchangeMisses?: number;
  onRetryExchange?: () => void;
  tutorialStep?: TutorialStep;
  onAdvanceTutorialStep?: (nextStep: TutorialStep) => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  activeCharacter,
  testimony,
  onPressInquiry,
  canBreakLoop,
  onSelectFinalResponse,
  onOpenSourceMap,
  hasEarnedCaseCard,
  lastReactionText,
  lastDialogueLead,
  recentlyCollectedQuote,
  onResetToTestimony,
  activeClaim,
  claims,
  onSelectClaim,
  onOpenEvidenceDrawer,
  collectedQuotesCount,
  mismatchFeedback,
  onDismissMismatch,
  exchangeMisses = 0,
  onRetryExchange,
  tutorialStep = 'none',
  onAdvanceTutorialStep
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Room status indicators without numerical gauges
  const getRoomAttention = () => {
    switch (exchangeMisses) {
      case 0:
        return {
          label: 'The room is listening carefully.',
          pips: [true, true, true],
          badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
          textColor: 'text-emerald-400'
        };
      case 1:
        return {
          label: 'The room is getting distracted.',
          pips: [true, true, false],
          badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
          textColor: 'text-amber-400'
        };
      case 2:
        return {
          label: 'The room is moving on.',
          pips: [true, false, false],
          badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-500/50',
          textColor: 'text-orange-400'
        };
      default:
        return {
          label: 'You lost this exchange.',
          pips: [false, false, false],
          badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
          textColor: 'text-rose-400'
        };
    }
  };

  const roomAttention = getRoomAttention();
  const isExchangeLost = exchangeMisses >= 3;

  // Target text is either the latest response to a press or the base testimony statement
  const targetText = lastReactionText || testimony.statement;

  useEffect(() => {
    let index = 0;
    setIsTyping(true);
    setDisplayedText('');

    const interval = setInterval(() => {
      index++;
      if (index <= targetText.length) {
        setDisplayedText(targetText.slice(0, index));
        if (index % 3 === 0) {
          sound.playTextTick();
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [targetText]);

  const handleSkipTyping = () => {
    sound.playClick();
    setDisplayedText(targetText);
    setIsTyping(false);
  };

  return (
    <div className="w-full bg-slate-900 border-2 border-slate-700 text-slate-100 rounded-lg shadow-xl flex flex-col relative overflow-hidden">
      {/* Top Claim Strip & Evidence Trigger */}
      <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* Claim switch tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[10px] font-display uppercase tracking-wider text-amber-400 font-bold mr-1 flex items-center gap-1">
            <Pin className="w-3 h-3 fill-amber-400" />
            GATES:
          </span>
          {claims.map((c, idx) => {
            const isCurrent = c.id === activeClaim.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  sound.playClick();
                  onSelectClaim(c.id);
                  if (onDismissMismatch) onDismissMismatch();
                }}
                className={`px-2.5 py-0.5 text-[10px] sm:text-[11px] font-display font-bold uppercase tracking-wider rounded border transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 border-white shadow font-black'
                    : c.isCorrected
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {c.isCorrected ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                )}
                <span>Gate #{idx + 1}: {c.speakerName}</span>
              </button>
            );
          })}
        </div>

        {/* Actions: Source Map & Evidence Drawer */}
        <div className="flex items-center gap-1.5">
          {/* Interactive Source Map Button */}
          <button
            id="open-source-map-from-dialogue"
            onClick={() => {
              sound.playClick();
              onOpenSourceMap();
            }}
            className={`px-2.5 py-1 font-heading font-black text-[11px] sm:text-xs uppercase tracking-wider rounded border transition-all hover:scale-102 flex items-center gap-1 cursor-pointer ${
              hasEarnedCaseCard
                ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                : activeClaim.id === 'claim_ryan_confirmations'
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Source Map</span>
            {hasEarnedCaseCard && (
              <span className="text-[8px] font-display font-black px-1 rounded bg-black text-emerald-300">
                CARD READY
              </span>
            )}
          </button>

          {/* Evidence Drawer Button */}
          <button
            id="open-evidence-drawer-from-dialogue"
            onClick={() => {
              sound.playPaperSlide();
              onOpenEvidenceDrawer();
            }}
            className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-[11px] sm:text-xs uppercase tracking-wider rounded border border-yellow-300 flex items-center gap-1.5 transition-transform hover:scale-102 cursor-pointer"
          >
            <Quote className="w-3.5 h-3.5 fill-black" />
            <span>Case Notes</span>
            <span className="bg-slate-950 text-yellow-300 text-[9px] font-display px-1.5 py-0.2 rounded font-bold">
              {collectedQuotesCount}
            </span>
          </button>
        </div>
      </div>

      {/* Pinned Premise & Room Attention in a unified, space-saving banner */}
      <div className="bg-slate-900/90 px-3 py-2 border-b border-slate-800 flex flex-col gap-1.5 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="text-[9px] font-display uppercase tracking-wider bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded border border-slate-800 font-bold shrink-0">
              PINNED STATEMENT
            </span>
            <p className="font-heading font-black text-xs sm:text-[13px] text-slate-200 truncate">
              {activeClaim.speakerName}:{' '}
              {activeClaim.isCorrected ? (
                <span className="text-emerald-300">
                  <span className="line-through text-slate-400 mr-1">{activeClaim.keyWordOriginal}</span>
                  <strong className="text-emerald-300 underline underline-offset-2">{activeClaim.keyWordCorrected}</strong>
                </span>
              ) : (
                <span className="text-amber-200">
                  "{activeClaim.originalText.replace(activeClaim.keyWordOriginal, `[${activeClaim.keyWordOriginal}]`)}"
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Room Vibe Pips */}
            <div className="flex items-center gap-1.5 text-[10px] font-display">
              <span className="text-slate-400 hidden xs:inline text-[9px] uppercase">Vibe:</span>
              <div className="flex items-center gap-0.5">
                {roomAttention.pips.map((pip, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      pip ? 'bg-amber-400 shadow-[0_0_5px_#f59e0b]' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className={`font-semibold text-[10px] ${roomAttention.textColor}`}>
                {roomAttention.label}
              </span>
            </div>

            <button
              onClick={() => {
                sound.playPaperSlide();
                onOpenEvidenceDrawer();
              }}
              className={`px-2.5 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider rounded border transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                activeClaim.isCorrected
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : isExchangeLost
                  ? 'bg-slate-800 text-rose-300 border-rose-800'
                  : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow animate-pulse'
              }`}
            >
              {activeClaim.isCorrected
                ? '✓ Resolved'
                : isExchangeLost
                ? '⚠ Lost'
                : '⚡ Contradict with Quote'}
            </button>
          </div>
        </div>
      </div>

      {/* Nameplate & Speaker Avatar */}
      <div className="bg-slate-950 text-white px-3 py-1.5 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-slate-700 bg-slate-900 shrink-0 flex items-center justify-center">
            <CharacterIllustration characterId={activeCharacter.id} expression={activeCharacter.currentExpression} size="sm" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-amber-400">
              {activeCharacter.name}
            </span>
            <span className="text-[9px] sm:text-[10px] font-display text-slate-400 uppercase">
              ({activeCharacter.role})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTyping && (
            <button
              onClick={handleSkipTyping}
              className="text-[10px] font-display uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 transition-colors cursor-pointer"
            >
              <FastForward className="w-3 h-3" /> Skip
            </button>
          )}
        </div>
      </div>

      {/* Dialogue Text Viewport */}
      <div
        onClick={() => isTyping && handleSkipTyping()}
        className="px-4 py-3 min-h-[70px] sm:min-h-[80px] flex flex-col justify-center cursor-pointer relative z-10 bg-slate-900/40"
      >
        <p className="font-body text-sm sm:text-base text-slate-100 font-semibold leading-relaxed">
          {displayedText}
        </p>

        {lastDialogueLead && !isTyping && (
          <motion.p
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs font-display text-amber-400 italic bg-slate-950/80 px-2.5 py-1 border-l-2 border-amber-400 rounded-r"
          >
            💭 Thought: {lastDialogueLead}
          </motion.p>
        )}

        {/* Recently Collected Quote Notification */}
        <AnimatePresence>
          {recentlyCollectedQuote && !isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2 p-2 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-display rounded flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5">
                <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  <strong>QUOTE RECORDED:</strong> "{recentlyCollectedQuote.quote}"
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playPaperSlide();
                  onOpenEvidenceDrawer();
                }}
                className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold uppercase text-[9px] rounded border border-emerald-400 shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>View</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mismatch Feedback Inline */}
        <AnimatePresence>
          {mismatchFeedback && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 p-2 bg-slate-950 border-l-4 border-amber-400 border-y border-r border-slate-800 text-xs font-body text-slate-200 rounded-r flex items-center justify-between gap-2"
            >
              <p className="italic">{mismatchFeedback}</p>
              {onDismissMismatch && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismissMismatch();
                  }}
                  className="text-slate-400 hover:text-white text-[9px] font-display uppercase shrink-0 underline cursor-pointer"
                >
                  Dismiss
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cross-Examination & Action Area */}
      <div className="bg-slate-950 px-3 py-2.5 sm:px-4 border-t border-slate-800 z-10 space-y-2">
        {/* Lost Exchange Banner */}
        {isExchangeLost && (
          <div className="p-2.5 bg-rose-950/90 border border-rose-500 rounded text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="font-heading font-black text-xs text-rose-300 uppercase">
                  You Lost This Exchange (0/3 Attempts Remaining)
                </div>
                <div className="text-[10px] font-body text-slate-300">
                  The room moved on. Retrying gives 3 fresh attempts without resetting previously solved gates.
                </div>
              </div>
            </div>
            {onRetryExchange && (
              <button
                id="dialogue-retry-exchange-btn"
                onClick={() => {
                  sound.playClick();
                  onRetryExchange();
                }}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-xs uppercase tracking-wider rounded border border-black shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Topic</span>
              </button>
            )}
          </div>
        )}

        {/* Back to overview button if currently showing a reaction */}
        {lastReactionText && (
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-[11px] font-display text-slate-400">
              Account recorded. Choose another inquiry or return to base statement.
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onResetToTestimony();
              }}
              className="text-[10px] font-display font-bold uppercase text-amber-400 hover:text-white bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded transition-colors cursor-pointer"
            >
              ← Back to Base Statement
            </button>
          </div>
        )}

        {/* Press Inquiries */}
        <div>
          <span className="text-[10px] sm:text-[11px] font-display uppercase tracking-widest text-slate-400 block mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-amber-400" />
            PRESS {activeCharacter.name.toUpperCase()} ON THIS STATEMENT:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {testimony.inquiries.map((inq, idx) => {
              const isTutorialPressTarget = idx === 0 && tutorialStep === 'crossexam_press_statement';
              return (
                <button
                  key={inq.id}
                  id={`press-inquiry-${idx}`}
                  onClick={() => {
                    sound.playClick();
                    onPressInquiry(inq);
                    if (tutorialStep === 'crossexam_press_statement') {
                      onAdvanceTutorialStep?.('crossexam_pin_sentence');
                    }
                  }}
                  className={`text-left p-2 sm:p-2.5 rounded transition-all font-body text-xs sm:text-[13px] text-slate-200 flex items-start gap-2 group cursor-pointer ${
                    isTutorialPressTarget
                      ? 'ring-4 ring-yellow-400 animate-pulse bg-yellow-400/30 border-yellow-400 text-white font-bold shadow-[0_0_15px_rgba(250,204,21,0.8)] scale-102'
                      : 'bg-slate-900 hover:bg-slate-800/90 border border-slate-700 hover:border-amber-400'
                  }`}
                >
                  <span className={`font-display font-bold shrink-0 group-hover:translate-x-0.5 transition-transform text-[10px] sm:text-xs ${isTutorialPressTarget ? 'text-yellow-300 font-black' : 'text-amber-400'}`}>
                    [PRESS #{idx + 1}]
                  </span>
                  <span className="leading-snug">{inq.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Final Room Deliberation when all 3 gates are solved */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          {canBreakLoop ? (
            <div className="space-y-3 bg-slate-900 border-2 border-yellow-400 p-4 sm:p-5 rounded-lg shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="font-heading font-black text-sm sm:text-base text-yellow-300 uppercase tracking-wider">
                    FINAL DELIBERATION: HOW DO YOU RESPOND TO THE ROOM?
                  </span>
                </div>
                <span className="text-[10px] bg-yellow-400 text-slate-950 px-2.5 py-0.5 font-display font-black uppercase tracking-wider rounded">
                  3/3 GATES SOLVED
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
                The entire dependency chain has been uncovered. Noah, Alyssa, and Ryan are all looking at you across the table, waiting to see what you do next.
              </p>

              <div className="space-y-2 pt-1">
                {FINAL_RESPONSE_OPTIONS.map((opt, idx) => (
                  <button
                    key={opt.id}
                    id={`final-response-opt-${opt.id}`}
                    onClick={() => {
                      sound.playDramaticHit();
                      onSelectFinalResponse(opt.id);
                    }}
                    className={`w-full p-3.5 text-left rounded border transition-all flex items-start justify-between gap-3 group cursor-pointer ${
                      opt.id === 'BREAK_THE_CHAIN'
                        ? 'bg-slate-950 hover:bg-emerald-950/60 border-slate-700 hover:border-emerald-400'
                        : opt.id === 'THE_NEXT_VOICE'
                        ? 'bg-slate-950 hover:bg-rose-950/60 border-slate-700 hover:border-rose-400'
                        : 'bg-slate-950 hover:bg-amber-950/60 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-display font-black text-xs px-2 py-0.5 bg-slate-900 border border-slate-700 text-yellow-400 rounded shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-heading font-black text-xs sm:text-sm text-white group-hover:text-yellow-300 transition-colors">
                          {opt.promptText}
                        </div>
                        <div className="text-[11px] text-slate-400 font-body mt-0.5">
                          {opt.subtext}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full p-3 bg-slate-900 border border-slate-800 rounded text-slate-400 flex items-center justify-between gap-2 text-xs font-display">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  <strong className="text-slate-300 uppercase">Final Room Deliberation:</strong> Solve all 3 evidence gates to unlock the final response choice ({claims.filter(c => c.isCorrected).length}/3 Solved)
                </span>
              </div>
              <span className="text-[10px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded border border-slate-800 uppercase font-bold">
                IN PROGRESS
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
