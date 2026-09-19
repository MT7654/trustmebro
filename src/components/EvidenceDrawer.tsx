import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Pin, 
  Quote, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  Bookmark, 
  Sparkles, 
  HelpCircle, 
  AlertCircle, 
  ShieldAlert, 
  Network, 
  Award, 
  RotateCcw, 
  ShieldCheck, 
  LogOut,
  Ban,
  BookOpen,
  Eye,
  Layers,
  Smartphone,
  Box
} from 'lucide-react';
import { EvidenceQuote, PinnedClaim, EvidenceCategory, TutorialStep } from '../types';
import { EvidenceThumbnail } from './EvidenceThumbnail';
import { PinnedClaimSection } from './PinnedClaimSection';
import { sound } from '../utils/sound';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  claims: PinnedClaim[];
  activeClaim: PinnedClaim;
  collectedQuotes: EvidenceQuote[];
  selectedQuoteId: string | null;
  onSelectClaim: (claimId: string) => void;
  onSelectQuote: (quoteId: string) => void;
  onPresentQuote: () => void;
  mismatchFeedback: string | null;
  onDismissMismatch: () => void;
  onOpenSourceMap?: () => void;
  presentedQuoteIds?: string[];
  exchangeMisses?: number;
  onRetryExchange?: () => void;
  tutorialStep?: TutorialStep;
  onAdvanceTutorialStep?: (nextStep: TutorialStep) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  claims,
  activeClaim,
  collectedQuotes,
  selectedQuoteId,
  onSelectClaim,
  onSelectQuote,
  onPresentQuote,
  mismatchFeedback,
  onDismissMismatch,
  onOpenSourceMap,
  presentedQuoteIds = [],
  exchangeMisses = 0,
  onRetryExchange,
  tutorialStep = 'none',
  onAdvanceTutorialStep
}) => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'claims'>('quotes');
  const [categoryFilter, setCategoryFilter] = useState<'all' | EvidenceCategory>('all');

  if (!isOpen) return null;

  const solvedCount = claims.filter(c => c.isCorrected).length;
  const selectedQuote = collectedQuotes.find(q => q.id === selectedQuoteId);
  const isSelectedQuoteAlreadyPresented = selectedQuote ? presentedQuoteIds.includes(selectedQuote.id) : false;
  const isExchangeLost = exchangeMisses >= 3;

  const filteredQuotes = categoryFilter === 'all' 
    ? collectedQuotes 
    : collectedQuotes.filter(q => q.category === categoryFilter);

  // Room status indicators without numerical gauges
  const getRoomAttention = () => {
    switch (exchangeMisses) {
      case 0:
        return {
          label: 'The room is listening carefully.',
          subtext: 'The group is quiet and waiting to see what point you make.',
          pips: [true, true, true],
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/50',
          textColor: 'text-emerald-400'
        };
      case 1:
        return {
          label: 'The room is getting distracted.',
          subtext: 'People are checking notifications and exchanging sideways glances.',
          pips: [true, true, false],
          badgeColor: 'bg-amber-950 text-amber-300 border-amber-500/50',
          textColor: 'text-amber-400'
        };
      case 2:
        return {
          label: 'The room is moving on.',
          subtext: 'Losing patience: side conversations are starting; one try remaining.',
          pips: [true, false, false],
          badgeColor: 'bg-orange-950 text-orange-300 border-orange-500/50',
          textColor: 'text-orange-400'
        };
      default:
        return {
          label: 'You lost this exchange.',
          subtext: 'The room brushed off the topic and moved on before you proved the point.',
          pips: [false, false, false],
          badgeColor: 'bg-rose-950 text-rose-300 border-rose-500/50',
          textColor: 'text-rose-400'
        };
    }
  };

  const roomAttention = getRoomAttention();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-xs">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="relative z-10 w-full max-w-2xl h-full bg-slate-900 border-l-2 border-slate-700 text-slate-100 flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="bg-slate-950 text-white px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <BookOpen className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                VISUAL CASE FILE & EVIDENCE
              </h2>
              <p className="font-display text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                {collectedQuotes.length} Discovered Items &bull; {solvedCount}/{claims.length} Gates Resolved
              </p>
            </div>
          </div>

          <button
            id="close-evidence-drawer-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Quotes vs Claims */}
        <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('quotes');
            }}
            className={`flex-1 py-2 px-3 text-xs font-display font-bold uppercase tracking-wider rounded border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-amber-400 text-slate-950 border-white font-black shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Case File Items ({collectedQuotes.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('claims');
            }}
            className={`flex-1 py-2 px-3 text-xs font-display font-bold uppercase tracking-wider rounded border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'claims'
                ? 'bg-amber-400 text-slate-950 border-white font-black shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>All 4 Gates ({solvedCount}/{claims.length})</span>
          </button>
        </div>

        {/* Category Filter Pills (When on Quotes tab) */}
        {activeTab === 'quotes' && (
          <div className="bg-slate-950/70 px-4 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] font-display uppercase tracking-wider shrink-0 scrollbar-none">
            <span className="text-slate-400 font-bold text-[10px] mr-1">Filter:</span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'physical', label: '📦 Physical' },
              { id: 'digital', label: '📱 Digital' },
              { id: 'verbal', label: '💬 Witness' },
              { id: 'source_map', label: '🗺️ Source Map' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  sound.playClick();
                  setCategoryFilter(filter.id as any);
                }}
                className={`px-2.5 py-1 rounded whitespace-nowrap border transition-all cursor-pointer ${
                  categoryFilter === filter.id
                    ? 'bg-slate-800 text-amber-300 border-amber-400/60 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Target Statement Banner */}
        <div className="bg-slate-950/90 p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-display font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Pin className="w-3 h-3 text-amber-400" />
              CURRENT STATEMENT BEING CHALLENGED:
            </span>

            {/* Room status pips */}
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-display font-bold ${roomAttention.badgeColor}`}>
              <span>Attempts:</span>
              <div className="flex items-center gap-1">
                {roomAttention.pips.map((pip, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      pip ? 'bg-amber-400 shadow-[0_0_4px_#f59e0b]' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono">{Math.max(0, 3 - exchangeMisses)}/3</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="px-2 py-0.5 bg-slate-950 text-amber-300 font-heading font-black text-xs uppercase rounded border border-slate-800">
                {activeClaim.speakerName} &bull; {activeClaim.title}
              </span>
              <span className={`text-[10px] font-display font-bold uppercase px-2 py-0.5 rounded border ${
                activeClaim.isCorrected 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500' 
                  : 'bg-rose-950 text-rose-300 border-rose-600'
              }`}>
                {activeClaim.isCorrected ? '✓ Resolved' : 'Unrefuted'}
              </span>
            </div>

            <p className="font-body text-sm sm:text-base font-bold text-white leading-snug">
              {activeClaim.isCorrected ? (
                <span>{activeClaim.fullCorrectedText}</span>
              ) : (
                <span>"{activeClaim.originalText}"</span>
              )}
            </p>

            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-display flex-wrap gap-1">
              <span className="text-slate-400">
                Premise to challenge:{' '}
                <strong className="text-amber-300 uppercase underline decoration-rose-500 decoration-2 font-black">
                  {activeClaim.keyWordOriginal}
                </strong>
              </span>
              <span className={`font-semibold ${roomAttention.textColor}`}>
                {roomAttention.label}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Quotes / Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'quotes' ? (
            <div className="space-y-3">
              {/* Source Map Workbench Callout */}
              {onOpenSourceMap && (
                <div className="p-3.5 bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500 rounded-lg flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <Network className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <div className="font-heading font-black text-xs text-cyan-200 uppercase tracking-wider">
                        Source Map Workbench
                      </div>
                      <div className="text-[11px] text-slate-300 font-body">
                        Trace origin chain: Unknown Seller ➔ Ryan ➔ Alyssa & Noah
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenSourceMap();
                    }}
                    className="px-3 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded border border-black shadow shrink-0 cursor-pointer"
                  >
                    Open Map
                  </button>
                </div>
              )}

              {filteredQuotes.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-700 bg-slate-950/50 rounded-lg space-y-3">
                  <Quote className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="font-heading font-black text-sm uppercase text-slate-300">
                    No Items In This Category
                  </p>
                  <p className="font-display text-xs text-slate-400 max-w-sm mx-auto">
                    Inspect objects on the table or question Noah, Alyssa, and Ryan to collect admissions and records.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuotes.map((quote) => {
                    const isSelected = selectedQuoteId === quote.id;
                    const isCaseCard = quote.id === 'card_one_origin_three_voices' || quote.tag.includes('CASE CARD');
                    const isAlreadyPresented = presentedQuoteIds.includes(quote.id);

                    return (
                      <button
                        type="button"
                        key={quote.id}
                        id={`evidence-card-${quote.id}`}
                        aria-pressed={isSelected}
                        aria-disabled={isAlreadyPresented}
                        onClick={() => {
                          if (isAlreadyPresented) {
                            sound.playShock();
                            return;
                          }
                          sound.playPaperSlide();
                          onSelectQuote(quote.id);
                          onDismissMismatch();
                        }}
                        className={`w-full p-4 rounded-xl border transition-all relative text-left ${
                          isAlreadyPresented
                            ? 'opacity-40 grayscale border-dashed border-slate-700 bg-slate-950 cursor-not-allowed'
                            : isSelected
                            ? 'border-2 border-amber-400 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-[1.01]'
                            : isCaseCard
                            ? 'bg-slate-950 border-amber-500 hover:bg-slate-900 hover:border-amber-400 cursor-pointer'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900 cursor-pointer'
                        }`}
                      >
                        {/* Header Tags */}
                        <div className="flex items-center justify-between gap-1 mb-2.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[10px] font-heading font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                                isAlreadyPresented
                                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                                  : isCaseCard
                                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                                  : isSelected
                                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                                  : 'bg-slate-900 text-amber-300 border-slate-700'
                              }`}
                            >
                              {quote.category === 'physical' && '📦 Physical Evidence'}
                              {quote.category === 'digital' && '📱 Digital Record'}
                              {quote.category === 'verbal' && '💬 Witness Account'}
                              {quote.category === 'source_map' && '🗺️ Source Map'}
                            </span>
                            <span className="text-xs font-heading font-black text-slate-200">
                              {quote.title}
                            </span>
                          </div>

                          {/* Right Status Badge */}
                          {isAlreadyPresented ? (
                            <span className="text-[10px] font-display uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1">
                              <Ban className="w-3 h-3" /> Already Tested
                            </span>
                          ) : isSelected ? (
                            <span className="text-[10px] font-display uppercase tracking-wider font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                              ★ Ready To Present
                            </span>
                          ) : (
                            <span className={`text-[9px] font-display uppercase tracking-widest ${isCaseCard ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                              {quote.tag}
                            </span>
                          )}
                        </div>

                        {/* Content Layout: Large Thumbnail + Neutral Description + Quote */}
                        <div className="flex flex-col sm:flex-row items-start gap-3.5">
                          <div className="shrink-0 self-center sm:self-start">
                            <EvidenceThumbnail 
                              type={quote.thumbnailType || 'box'} 
                              size="lg" 
                              className={isSelected ? 'border-amber-400 shadow-md' : ''} 
                            />
                          </div>

                          <div className="flex-1 space-y-2 text-left">
                            <div>
                              <div className="text-[10px] font-display font-black uppercase tracking-wider text-slate-400">
                                Neutral Observation:
                              </div>
                              <p className="text-xs font-body text-slate-200 leading-relaxed bg-slate-950/90 p-2 rounded border border-slate-800">
                                {quote.neutralDescription || quote.itemDetails || quote.quote}
                              </p>
                            </div>

                            <div className="text-[11px] font-body text-amber-200/90 italic">
                              "{quote.quote}"
                            </div>
                          </div>
                        </div>

                        {/* Selected Card Highlight Callout */}
                        {isSelected && !isAlreadyPresented && (
                          <div className="mt-3 pt-2.5 border-t border-amber-400/40 flex items-center justify-between text-xs font-display font-bold text-amber-300 bg-amber-950/30 -mx-4 -mb-4 p-2.5 px-4 rounded-b-xl">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-amber-400" />
                              Selected against {activeClaim.speakerName} ({activeClaim.keyWordOriginal})
                            </span>
                            <span className="uppercase text-[10px] bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded font-heading font-black">
                              Click Present Below
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Claims Switcher View */
            <div className="space-y-3">
              <p className="text-xs font-display text-slate-400">
                Click any gate to focus on it and switch directly to cross-examining that premise:
              </p>

              <div className="space-y-2.5">
                {claims.map((claim, idx) => {
                  const isCurrent = claim.id === activeClaim.id;
                  return (
                    <button
                      type="button"
                      key={claim.id}
                      onClick={() => {
                        sound.playClick();
                        onSelectClaim(claim.id);
                        onDismissMismatch();
                      }}
                      className={`w-full p-3.5 rounded-lg border transition-all cursor-pointer text-left ${
                        isCurrent
                          ? 'bg-slate-900 border-2 border-amber-400 shadow'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-heading font-black uppercase text-white">
                          Gate #{idx + 1}: {claim.speakerName}'s Claim
                        </span>
                        <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded uppercase border ${
                          claim.isCorrected
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                            : 'bg-rose-950 text-rose-300 border-rose-700'
                        }`}>
                          {claim.isCorrected ? '✓ Contradiction Resolved' : 'Unrefuted'}
                        </span>
                      </div>

                      <p className="font-body text-xs text-slate-200">
                        {claim.isCorrected ? claim.fullCorrectedText : claim.originalText}
                      </p>

                      <p className="mt-2 text-[10px] font-display text-slate-400">
                        {claim.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mismatch Feedback */}
          <AnimatePresence>
            {mismatchFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="p-3.5 bg-slate-950 border-l-4 border-amber-400 border-y border-r border-slate-800 rounded-r text-xs font-body text-slate-200"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-display font-black text-amber-400 uppercase text-[10px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    Why This Evidence Doesn't Break the Premise:
                  </span>
                  <button
                    onClick={onDismissMismatch}
                    className="text-slate-400 hover:text-white text-[10px] underline uppercase font-display cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-slate-100 italic font-semibold leading-relaxed">
                  {mismatchFeedback}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exchange Lost Warning Block inside Drawer */}
          {isExchangeLost && (
            <div className="p-4 bg-rose-950/90 border border-rose-500 rounded-lg text-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 font-heading font-black text-sm text-rose-300 uppercase">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>You Lost This Exchange (0/3 Attempts Remaining)</span>
              </div>
              <p className="text-xs font-body text-slate-300">
                The room lost patience with this topic. You can retry with 3 fresh attempts—your collected evidence, earlier breakthroughs, and source map links are completely preserved.
              </p>
              {onRetryExchange && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onRetryExchange();
                  }}
                  className="w-full py-2.5 px-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-xs uppercase tracking-wider rounded border border-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
                  Retry This Topic
                </button>
              )}
            </div>
          )}
        </div>

        {/* Drawer Bottom Action Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-2 shrink-0">
          <button
            id="drawer-present-quote-btn"
            disabled={!selectedQuote || activeClaim.isCorrected || isSelectedQuoteAlreadyPresented || isExchangeLost}
            onClick={() => {
              if (selectedQuote && !activeClaim.isCorrected && !isSelectedQuoteAlreadyPresented && !isExchangeLost) {
                onPresentQuote();
                if (tutorialStep === 'crossexam_present_evidence' || (typeof tutorialStep === 'string' && tutorialStep.startsWith('crossexam_'))) {
                  onAdvanceTutorialStep?.('crossexam_completed');
                }
              }
            }}
            className={`w-full py-3.5 px-4 font-heading font-black text-sm uppercase tracking-widest rounded-lg border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              !selectedQuote || activeClaim.isCorrected || isSelectedQuoteAlreadyPresented || isExchangeLost
                ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                : tutorialStep === 'crossexam_present_evidence'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-white ring-4 ring-yellow-400 animate-pulse scale-105 shadow-[0_0_25px_rgba(250,204,21,0.9)]'
                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-white hover:brightness-110 active:scale-[0.99] shadow-[0_0_20px_rgba(251,191,36,0.4)]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {activeClaim.isCorrected
                ? 'GATE ALREADY RESOLVED'
                : selectedQuote
                ? `PRESENT EVIDENCE & CHALLENGE ${activeClaim.speakerName}`
                : 'SELECT AN ITEM ABOVE TO PRESENT'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

