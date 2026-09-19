import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pin, ArrowRight, CheckCircle2, AlertCircle, Quote, Sparkles, Send, HelpCircle } from 'lucide-react';
import { EvidenceQuote, PinnedClaim, CharacterId, TutorialStep } from '../types';
import { sound } from '../utils/sound';

interface PinnedClaimSectionProps {
  claims: PinnedClaim[];
  activeClaimId: string;
  onSelectClaim: (claimId: string) => void;
  collectedQuotes: EvidenceQuote[];
  selectedQuoteId: string | null;
  onSelectQuote: (quoteId: string) => void;
  onPresentQuote: () => void;
  mismatchFeedback: string | null;
  onDismissMismatch: () => void;
  tutorialStep?: TutorialStep;
  onAdvanceTutorialStep?: (nextStep: TutorialStep) => void;
}

export const PinnedClaimSection: React.FC<PinnedClaimSectionProps> = ({
  claims,
  activeClaimId,
  onSelectClaim,
  collectedQuotes,
  selectedQuoteId,
  onSelectQuote,
  onPresentQuote,
  mismatchFeedback,
  onDismissMismatch,
  tutorialStep = 'none',
  onAdvanceTutorialStep
}) => {
  const [showEvidenceList, setShowEvidenceList] = useState(true);

  const activeClaim = claims.find(c => c.id === activeClaimId) || claims[0];
  const selectedQuote = collectedQuotes.find(q => q.id === selectedQuoteId);
  const solvedCount = claims.filter(c => c.isCorrected).length;

  return (
    <div className="w-full bg-neutral-900 border-4 border-black comic-shadow-lg mb-4 overflow-hidden relative">
      {/* Top Banner with Pinned Claim Tabs */}
      <div className="bg-black text-white px-3 sm:px-4 py-2 border-b-2 border-black flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 text-black flex items-center justify-center font-bold text-xs clip-badge">
            <Pin className="w-3.5 h-3.5 fill-black" />
          </div>
          <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-yellow-300">
            PINNED CLAIM FOR SCRUTINY
          </span>
          <span className="text-[10px] font-display uppercase tracking-widest text-neutral-400">
            ({solvedCount}/{claims.length} CONTRADICTIONS RESOLVED)
          </span>
        </div>

        {/* Claim Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {claims.map((claim, idx) => {
            const isActive = claim.id === activeClaim.id;
            const isTargetTutorialClaim = idx === 0 && tutorialStep === 'crossexam_pin_sentence';
            return (
              <button
                key={claim.id}
                onClick={() => {
                  sound.playClick();
                  onSelectClaim(claim.id);
                  onDismissMismatch();
                  if (tutorialStep === 'crossexam_pin_sentence') {
                    onAdvanceTutorialStep?.('crossexam_open_casefile');
                  }
                }}
                className={`px-2.5 py-1 text-[11px] font-display font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isTargetTutorialClaim
                    ? 'ring-4 ring-yellow-400 animate-pulse bg-yellow-400 text-black border-yellow-300 font-black scale-105 shadow-[0_0_15px_rgba(250,204,21,0.8)]'
                    : isActive
                    ? 'bg-yellow-400 text-black border-yellow-300 shadow-[2px_2px_0px_#000]'
                    : claim.isCorrected
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white hover:border-neutral-500'
                }`}
              >
                {claim.isCorrected ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                )}
                <span>
                  #{idx + 1} {claim.speakerName}'s Claim
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Pinned Claim Display Area */}
      <div className="p-3 sm:p-4 bg-gradient-to-b from-neutral-950 to-neutral-900 border-b-2 border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Claim Statement Body */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-display uppercase tracking-wider px-2 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700">
                Target: {activeClaim.speakerName} ({activeClaim.title})
              </span>
              {activeClaim.isCorrected && (
                <span className="text-[10px] font-display uppercase tracking-wider px-2 py-0.5 bg-emerald-900/80 text-emerald-300 border border-emerald-600 font-bold animate-pulse">
                  ✓ CONTRADICTION EXPOSED
                </span>
              )}
            </div>

            {/* If Not Corrected: Shows the Original Claim with highlight */}
            {!activeClaim.isCorrected ? (
              <div className="p-3 bg-neutral-900 border-2 border-red-900/60 rounded-sm">
                <p className="font-body text-sm sm:text-base text-neutral-100 font-medium">
                  {activeClaim.originalText.split(activeClaim.keyWordOriginal).map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="bg-red-950/80 text-red-300 font-bold border-b-2 border-red-500 px-1 py-0.5 uppercase tracking-wide">
                          [{activeClaim.keyWordOriginal}]
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
                <p className="mt-1 text-xs text-neutral-400 font-display">
                  {activeClaim.description}
                </p>
              </div>
            ) : (
              /* If Corrected: Shows visible strike-through transformation */
              <div className="p-3 bg-emerald-950/40 border-2 border-emerald-600 rounded-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-body text-xs sm:text-sm text-neutral-400 line-through decoration-red-500 decoration-2">
                    {activeClaim.keyWordOriginal}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-body text-sm sm:text-base font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 border border-emerald-500 uppercase tracking-wide">
                    {activeClaim.keyWordCorrected}
                  </span>
                </div>
                <p className="mt-1.5 font-body text-xs sm:text-sm text-emerald-200 font-medium">
                  "{activeClaim.fullCorrectedText}"
                </p>
              </div>
            )}
          </div>

          {/* Quick Status / Hint */}
          <div className="text-right shrink-0 md:max-w-xs">
            {!activeClaim.isCorrected ? (
              <div className="text-left md:text-right">
                <span className="text-[11px] font-display uppercase tracking-wider text-yellow-400 block font-bold">
                  WHAT TO DO:
                </span>
                <span className="text-xs text-neutral-300 font-body block leading-tight">
                  Press character accounts to collect a contradicting quote, then present it below.
                </span>
              </div>
            ) : (
              <div className="text-left md:text-right">
                <span className="text-[11px] font-display uppercase tracking-wider text-emerald-400 block font-bold">
                  FACT ESTABLISHED:
                </span>
                <span className="text-xs text-emerald-300 font-body block leading-tight">
                  This claim has been debunked. Select the next claim above to keep unravelling!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evidence Quotes / Present Section */}
      <div className="p-3 sm:p-4 bg-neutral-950">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-yellow-400" />
            <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-neutral-200">
              COLLECTED QUOTES & TESTIMONY ({collectedQuotes.length})
            </span>
          </div>

          <div className="text-[11px] font-display text-neutral-400">
            {collectedQuotes.length === 0 ? (
              <span className="text-amber-400/90 italic">
                Press Alyssa or Ryan below to gather accounts!
              </span>
            ) : (
              <span>Select a quote card to present</span>
            )}
          </div>
        </div>

        {/* Collected Quote Cards */}
        {collectedQuotes.length === 0 ? (
          <div className="p-4 border-2 border-dashed border-neutral-800 bg-neutral-900/50 text-center rounded-sm">
            <p className="text-xs sm:text-sm font-body text-neutral-400">
              Your pocket notes are currently empty. Talk to the room, press their statements, and collect verbatim admissions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-3">
            {collectedQuotes.map((quote) => {
              const isSelected = selectedQuoteId === quote.id;
              const isTargetEvidence = (quote.id === 'item_inspected_box' || quote.id === 'item_unmarked_foil_pod') && (tutorialStep === 'crossexam_select_evidence' || tutorialStep === 'crossexam_open_casefile');
              return (
                <button
                  key={quote.id}
                  onClick={() => {
                    sound.playPaperSlide();
                    onSelectQuote(quote.id);
                    onDismissMismatch();
                    if (tutorialStep === 'crossexam_select_evidence' || tutorialStep === 'crossexam_open_casefile') {
                      onAdvanceTutorialStep?.('crossexam_present_evidence');
                    }
                  }}
                  className={`text-left p-3 border-2 transition-all relative flex flex-col justify-between ${
                    isTargetEvidence
                      ? 'bg-yellow-400/20 border-yellow-400 ring-4 ring-yellow-400 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-102'
                      : isSelected
                      ? 'bg-neutral-900 border-yellow-400 ring-2 ring-yellow-400/40 shadow-[2px_2px_0px_#000]'
                      : 'bg-neutral-900/90 border-neutral-700 hover:border-neutral-500 hover:bg-neutral-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-display font-bold uppercase tracking-wider px-1.5 py-0.2 bg-black text-yellow-300 border border-neutral-700">
                        {quote.speakerName}'s Quote
                      </span>
                      <span className="text-[9px] font-display uppercase tracking-widest text-neutral-400">
                        {quote.tag}
                      </span>
                    </div>
                    <p className="font-body text-xs sm:text-sm text-neutral-100 font-semibold leading-snug line-clamp-3">
                      {quote.quote}
                    </p>
                  </div>

                  <p className="mt-2 text-[10px] font-display text-neutral-400 italic">
                    {quote.context}
                  </p>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Mismatch Conversational Feedback (In-character redirect, NOT generic error) */}
        <AnimatePresence>
          {mismatchFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-3 mb-3 bg-neutral-900 border-l-4 border-yellow-400 border-y border-r border-neutral-800 text-xs text-neutral-200 font-body flex items-start justify-between gap-2"
            >
              <div>
                <span className="font-display font-bold text-yellow-400 uppercase tracking-wide block mb-0.5">
                  // Conversational Reaction:
                </span>
                <p className="text-neutral-200">{mismatchFeedback}</p>
                <p className="text-[11px] text-neutral-400 mt-1 italic">
                  Tip: Look closely at who made the claim and whose quote directly addresses that exact assumption.
                </p>
              </div>
              <button
                onClick={onDismissMismatch}
                className="text-neutral-400 hover:text-white text-xs px-2 py-0.5 border border-neutral-700 bg-neutral-800 shrink-0"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Present Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800">
          <div className="text-xs font-display text-neutral-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>
              {selectedQuote
                ? `Ready to present: "${selectedQuote.title}" against ${activeClaim.speakerName}'s claim`
                : "Select a quote above, then present it against the active pinned claim."}
            </span>
          </div>

          <button
            id="present-evidence-btn"
            disabled={!selectedQuote || activeClaim.isCorrected}
            onClick={() => {
              if (selectedQuote && !activeClaim.isCorrected) {
                onPresentQuote();
                if (tutorialStep === 'crossexam_present_evidence' || (typeof tutorialStep === 'string' && tutorialStep.startsWith('crossexam_'))) {
                  onAdvanceTutorialStep?.('crossexam_completed');
                }
              }
            }}
            className={`w-full sm:w-auto px-6 py-2.5 font-heading font-black text-sm uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${
              !selectedQuote || activeClaim.isCorrected
                ? 'bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed'
                : tutorialStep === 'crossexam_present_evidence'
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black border-black comic-shadow ring-4 ring-yellow-400 animate-pulse scale-105 shadow-[0_0_25px_rgba(250,204,21,0.9)]'
                : 'bg-yellow-400 hover:bg-yellow-300 text-black border-black comic-shadow hover:scale-105 active:scale-95'
            }`}
          >
            <Send className="w-4 h-4 text-black" />
            {activeClaim.isCorrected ? "CLAIM ALREADY RESOLVED" : "PRESENT EVIDENCE! [TAKE THAT!]"}
          </button>
        </div>
      </div>
    </div>
  );
};
