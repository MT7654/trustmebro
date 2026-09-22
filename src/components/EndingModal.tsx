import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, CheckCircle2, Share2, BookOpen, AlertOctagon, Flame, Network, ArrowRight, CornerDownRight, Sparkles } from 'lucide-react';
import { GameEnding, EndingType, PlayerProfile } from '../types';
import { CharacterIllustration } from './CharacterIllustration';
import { sound } from '../utils/sound';

interface EndingModalProps {
  ending: GameEnding | null;
  playerProfile?: PlayerProfile;
  onRestart: () => void;
  onSelectDifferentResponse?: () => void;
  canReconsider?: boolean;
  canonicalEnding?: GameEnding | null;
}

export const EndingModal: React.FC<EndingModalProps> = ({
  ending,
  playerProfile = { name: 'Sam', gender: 'male' },
  onRestart,
  onSelectDifferentResponse,
  canReconsider = true,
  canonicalEnding = null
}) => {
  const [copied, setCopied] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ending) return;
    setShowDebrief(false);
    if (ending.type === 'BREAK_THE_CHAIN') {
      sound.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore if canvas-confetti is not available
      }
    } else if (ending.type === 'THE_NEXT_VOICE') {
      sound.playBuzzer();
    } else {
      sound.playDramaticHit();
    }
  }, [ending]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    if (showDebrief) contentRef.current?.focus({ preventScroll: true });
  }, [showDebrief]);

  if (!ending) return null;
  const outcomeArt:Record<string,string>={BREAK_THE_CHAIN:'/art/outcomes/v1/break-the-chain.png',FALSE_CONSENSUS:'/art/outcomes/v1/false-consensus.png',THE_GUESS:'/art/outcomes/v1/the-guess.png',THE_NEXT_VOICE:'/art/outcomes/v1/the-next-voice.png'};

  const handleCopyNotes = () => {
    const text = `TRUST ME BRO: Case Result
Outcome: ${ending.title} - ${ending.subtitle}
Core Lesson: ${ending.educationalDebrief.actionableTakeaway}
Singapore Context: ${ending.educationalDebrief.realWorldContext}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="ending-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="flex h-[min(96dvh,900px)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl"
      >
        {/* Outcome banner */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 border-b border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg ${ending.badgeColor}`}>
                <Network className="h-7 w-7" />
              </div>

              <div>
                <span className={`inline-block px-2.5 py-0.5 text-xs font-display font-black uppercase tracking-wider rounded mb-1 ${ending.badgeColor}`}>
                  {ending.badge}
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                  {ending.title}
                </h2>
                <p className="font-display text-xs sm:text-sm text-slate-300 font-semibold">
                  {ending.subtitle}
                </p>
                {canonicalEnding && canonicalEnding.type !== ending.type && <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-cyan-300">Counterfactual preview · canonical outcome remains {canonicalEnding.title}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Outcome Text */}
        <div ref={contentRef} tabIndex={0} role="region" aria-label={showDebrief ? 'Outcome debrief' : 'Outcome summary'} className="outcome-scroll-region min-h-0 flex-1 p-4 sm:p-6 pb-8 space-y-5 overflow-y-auto overscroll-contain outline-none select-text">
          {!showDebrief && <>
          <div role="img" aria-label={`Outcome tableau: ${ending.title}`} className="relative h-44 overflow-hidden rounded-2xl bg-slate-950 bg-cover bg-center ring-1 ring-white/10" style={{backgroundImage:`linear-gradient(180deg,transparent 55%,rgba(2,6,23,.82)),url(${outcomeArt[ending.type]})`}} />
          {/* Narrative Log */}
          <div className="bg-slate-950/60 rounded-2xl p-4 sm:p-6 relative">
            <div className="text-[10px] font-display uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5 font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              CASE RESOLUTION: HOW THE NIGHT UNFOLDED
            </div>
            <div className="font-body text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {ending.narrativeText}
            </div>
          </div>

          </>}
          {showDebrief && <>
          {/* Extended Source Chain Map (Origin -> Conduit -> Echo -> Player -> Next Friend) */}
          {ending.extendedSourceChain && (
            <div className="bg-slate-950 border border-cyan-500/50 rounded-lg p-4 sm:p-5 relative">
              <div className="text-[10px] font-display uppercase tracking-widest text-cyan-400 mb-3 flex items-center justify-between font-bold">
                <div className="flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EXTENDED SOURCE CHAIN: THE 5-STAGE SOCIAL PROOF CASCADE</span>
                </div>
                <span className="text-[9px] text-slate-400">UNRESOLVED TOXICOLOGY &bull; LOGICAL BREAKDOWN</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 text-xs">
                {/* 1. Origin */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-rose-400 font-display font-black uppercase">
                      1. UNVERIFIED SELLER
                    </div>
                    <div className="font-body text-sm leading-snug text-slate-300 mt-1 font-normal">
                      {ending.extendedSourceChain.seller}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 italic">Zero testing data</div>
                </div>

                {/* 2. Conduit */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-amber-400 font-display font-black uppercase">
                      2. CONDUIT (RYAN)
                    </div>
                    <div className="font-body text-sm leading-snug text-slate-300 mt-1 font-normal">
                      {ending.extendedSourceChain.ryan}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 italic">Conflated trust with safety</div>
                </div>

                {/* 3. Echo */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-cyan-400 font-display font-black uppercase">
                      3. ECHO CHAMBER
                    </div>
                    <div className="font-body text-sm leading-snug text-slate-300 mt-1 font-normal">
                      {ending.extendedSourceChain.group}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 italic">Followed Ryan's posture</div>
                </div>

                {/* 4. Player */}
                <div className={`p-3 rounded border flex flex-col justify-between ${
                  ending.type === 'BREAK_THE_CHAIN'
                    ? 'bg-emerald-950/70 border-emerald-500'
                    : ending.type === 'THE_NEXT_VOICE'
                    ? 'bg-rose-950/70 border-rose-500'
                    : 'bg-slate-900 border-slate-700'
                }`}>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <CharacterIllustration characterId="player" playerGender={playerProfile.gender} expression="neutral" size="sm" variant="avatar" />
                      <div className={`text-[10px] font-display font-black uppercase ${
                        ending.type === 'BREAK_THE_CHAIN'
                          ? 'text-emerald-300'
                          : ending.type === 'THE_NEXT_VOICE'
                          ? 'text-rose-300'
                          : 'text-amber-300'
                      }`}>
                        4. {playerProfile.name.toUpperCase()}'S STANCE
                      </div>
                    </div>
                    <div className="font-body text-sm leading-snug text-slate-200 mt-1 font-normal">
                      {ending.extendedSourceChain.player.replace(/You/g, playerProfile.name)}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 italic">The turning point</div>
                </div>

                {/* 5. Downstream Effect */}
                <div className={`p-3 rounded border flex flex-col justify-between ${
                  ending.type === 'BREAK_THE_CHAIN'
                    ? 'bg-emerald-950/90 border-emerald-400'
                    : ending.type === 'THE_NEXT_VOICE'
                    ? 'bg-rose-950/90 border-rose-500 ring-2 ring-rose-500/50'
                    : 'bg-slate-900 border-slate-700'
                }`}>
                  <div>
                    <div className={`text-[10px] font-display font-black uppercase ${
                      ending.type === 'BREAK_THE_CHAIN'
                        ? 'text-emerald-300'
                        : ending.type === 'THE_NEXT_VOICE'
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}>
                      5. NEXT FRIEND / EFFECT
                    </div>
                    <div className="font-body text-sm leading-snug text-slate-200 mt-1 font-normal">
                      {ending.extendedSourceChain.nextFriend}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 italic">Long-term consequence</div>
                </div>
              </div>
            </div>
          )}

          {/* Educational Debrief */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 sm:p-5 relative">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h3 className="font-heading text-sm sm:text-base font-bold text-amber-400 uppercase tracking-wider">
                THE PSYCHOLOGICAL & REAL-WORLD DEBRIEF
              </h3>
            </div>

            <div className="space-y-3 font-body text-xs text-slate-300">
              <div>
                <strong className="text-amber-300 font-display block text-xs uppercase mb-0.5 font-bold">
                  1. The Psychological Trap:
                </strong>
                <p>{ending.educationalDebrief.psychologicalPrinciple}</p>
              </div>

              <div>
                <strong className="text-cyan-300 font-display block text-xs uppercase mb-0.5 font-bold">
                  2. Ground Reality in Singapore:
                </strong>
                <p>{ending.educationalDebrief.realWorldContext}</p>
              </div>

              <div>
                <strong className="text-emerald-300 font-display block text-xs uppercase mb-0.5 font-bold">
                  3. The Actionable Takeaway:
                </strong>
                <p className="text-slate-100 font-semibold bg-slate-900 p-3 border-l-2 border-emerald-400 rounded-r">
                  {ending.educationalDebrief.actionableTakeaway}
                </p>
              </div>
            </div>
          </div>
          </>}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="share-case-notes-btn"
            onClick={handleCopyNotes}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-display text-xs uppercase tracking-wider rounded border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Copied Case Debrief!' : 'Copy Debrief Notes'}
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button onClick={() => setShowDebrief(v => !v)} className="w-full sm:w-auto px-4 py-2.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 font-heading font-black text-xs uppercase tracking-wider rounded border border-cyan-500">
              {showDebrief ? 'Back to outcome' : 'Understand this outcome'}
            </button>
            {onSelectDifferentResponse && canReconsider && (
              <button
                id="select-other-response-btn"
                onClick={() => {
                  sound.playClick();
                  onSelectDifferentResponse();
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-heading font-black text-xs uppercase tracking-wider rounded border border-amber-400/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                RECONSIDER ONCE
              </button>
            )}
            {!canReconsider && <span className="text-[10px] text-slate-500">Reconsideration used · restart to explore another outcome</span>}

            <button
              id="restart-game-btn"
              onClick={() => {
                sound.playClick();
                onRestart();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-black text-sm uppercase tracking-wider rounded border border-black shadow transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-slate-950" />
              RESTART INVESTIGATION
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
