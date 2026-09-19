import React from 'react';
import { motion } from 'motion/react';
import { X, ShieldAlert, ArrowRight, HelpCircle, AlertTriangle, CheckCircle2, Flame, UserCheck, Pin, Quote } from 'lucide-react';
import { PinnedClaim, EvidenceQuote } from '../types';
import { sound } from '../utils/sound';

interface TrustGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  claims: PinnedClaim[];
  quotes: EvidenceQuote[];
  onTriggerAha?: () => void;
  canObject: boolean;
}

export const TrustGraphModal: React.FC<TrustGraphModalProps> = ({
  isOpen,
  onClose,
  claims,
  quotes,
  onTriggerAha,
  canObject
}) => {
  if (!isOpen) return null;

  const solvedClaimsCount = claims.filter(c => c.isCorrected).length;
  const noahClaim = claims.find(c => c.id === 'claim_noah_alyssa');
  const alyssaClaim = claims.find(c => c.id === 'claim_alyssa_ryan');
  const ryanClaim = claims.find(c => c.id === 'claim_ryan_seller');

  return (
    <div
      id="trust-graph-modal"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl bg-neutral-900 border-4 border-black text-neutral-100 comic-shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header banner */}
        <div className="bg-red-600 text-black px-4 sm:px-6 py-3 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-yellow-300 font-display font-black text-lg flex items-center justify-center border-2 border-white">
              #
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-wider text-white drop-shadow-[2px_2px_0px_#000]">
                MIND PALACE: THE CHAIN OF TRUST
              </h2>
              <p className="font-display text-xs text-neutral-950 font-bold uppercase tracking-wider">
                Investigating Apparent Consensus vs. Actual Single Source
              </p>
            </div>
          </div>
          <button
            id="close-trust-graph-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 bg-black hover:bg-neutral-800 text-white flex items-center justify-center border-2 border-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 dot-pattern">
          {/* Top Status Bar: Apparent vs Real */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Illusion */}
            <div className="bg-neutral-950 border-2 border-neutral-700 p-4 relative">
              <span className="text-[10px] font-display uppercase tracking-widest text-neutral-400 block mb-1">
                // What It Sounds Like To Your Brain
              </span>
              <h3 className="font-heading text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-400" />
                The "3-to-1 Majority" Illusion
              </h3>
              <p className="font-body text-xs text-neutral-300 leading-relaxed mb-3">
                Noah is nodding, Alyssa is smiling, and Ryan is offering. Your brain screams: <em>"Three independent friends wouldn't all be wrong."</em>
              </p>
              <div className="flex items-center gap-2 text-xs font-display bg-red-950/60 border border-red-800 px-3 py-1.5 text-red-300">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>Apparent Confidence: 100% Social Proof</span>
              </div>
            </div>

            {/* The Reality */}
            <div className="bg-neutral-950 border-2 border-yellow-500/80 p-4 relative">
              <span className="text-[10px] font-display uppercase tracking-widest text-yellow-400 block mb-1">
                // What Investigation Actually Reveals
              </span>
              <h3 className="font-heading text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                The Single Point of Failure
              </h3>
              <p className="font-body text-xs text-neutral-300 leading-relaxed mb-3">
                {canObject
                  ? "Every single person in this room was relying on Ryan, who relied on an anonymous Telegram stranger. There are zero independent verifications."
                  : `Contradictions unmasked: ${solvedClaimsCount} of ${claims.length}. Pin claims and present quotes to expose the chain.`}
              </p>
              <div className="flex items-center gap-2 text-xs font-display bg-yellow-950/60 border border-yellow-700 px-3 py-1.5 text-yellow-300">
                <Flame className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>True Independent Checks: <strong>0 (ZERO)</strong></span>
              </div>
            </div>
          </div>

          {/* Real-time Pinned Claims & Contradictions Overview */}
          <div className="bg-black border-3 border-neutral-700 p-5 relative overflow-hidden">
            <h4 className="font-display text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>ACTIVE CONTRADICTION SCRUTINY ({solvedClaimsCount}/{claims.length} RESOLVED)</span>
              <span className="text-yellow-400 font-mono">{quotes.length} QUOTES COLLECTED</span>
            </h4>

            <div className="space-y-3.5">
              {/* Noah's Claim */}
              <div className={`p-3 border-2 transition-all ${noahClaim?.isCorrected ? 'bg-emerald-950/30 border-emerald-500' : 'bg-neutral-900 border-neutral-800'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500 text-black font-display font-black text-xs flex items-center justify-center">N</span>
                    <span className="font-heading text-sm font-bold text-white">1. Noah's Claim: "Alyssa checked what was inside"</span>
                  </div>
                  <span className={`font-display text-[10px] px-2 py-0.5 uppercase border ${noahClaim?.isCorrected ? 'bg-emerald-900 text-emerald-300 border-emerald-500' : 'bg-black text-neutral-400 border-neutral-700'}`}>
                    {noahClaim?.isCorrected ? "EXPOSED: TRIED ONLY" : "UNREFUTED"}
                  </span>
                </div>
                {noahClaim?.isCorrected ? (
                  <div className="mt-2 text-xs font-body text-emerald-200 pl-8 space-y-1">
                    <p className="line-through text-neutral-400">CHECKED what was inside</p>
                    <p className="text-emerald-300 font-semibold">→ Alyssa TRIED it (did not check chemical contents).</p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs font-body text-neutral-400 pl-8">
                    Noah assumed Alyssa checked the cartridge. Press Alyssa to collect her account.
                  </p>
                )}
              </div>

              {/* Alyssa's Claim */}
              <div className={`p-3 border-2 transition-all ${alyssaClaim?.isCorrected ? 'bg-emerald-950/30 border-emerald-500' : 'bg-neutral-900 border-neutral-800'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-black font-display font-black text-xs flex items-center justify-center">A</span>
                    <span className="font-heading text-sm font-bold text-white">2. Alyssa's Claim: "I thought Ryan checked this one himself"</span>
                  </div>
                  <span className={`font-display text-[10px] px-2 py-0.5 uppercase border ${alyssaClaim?.isCorrected ? 'bg-emerald-900 text-emerald-300 border-emerald-500' : 'bg-black text-neutral-400 border-neutral-700'}`}>
                    {alyssaClaim?.isCorrected ? "EXPOSED: RYAN CHECKED NOTHING" : "UNREFUTED"}
                  </span>
                </div>
                {alyssaClaim?.isCorrected ? (
                  <div className="mt-2 text-xs font-body text-emerald-200 pl-8 space-y-1">
                    <p className="line-through text-neutral-400">RYAN CHECKED this one</p>
                    <p className="text-emerald-300 font-semibold">→ RYAN TRUSTED THE SELLER'S WORD (showed zero batch verification).</p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs font-body text-neutral-400 pl-8">
                    Alyssa assumed Ryan checked the pod. Press Ryan to discover what testing was done.
                  </p>
                )}
              </div>

              {/* Ryan's Claim */}
              <div className={`p-3 border-2 transition-all ${ryanClaim?.isCorrected ? 'bg-emerald-950/30 border-emerald-500' : 'bg-neutral-900 border-neutral-800'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-display font-black text-xs flex items-center justify-center">R</span>
                    <span className="font-heading text-sm font-bold text-white">3. Ryan's Claim: "The seller is verified and clean"</span>
                  </div>
                  <span className={`font-display text-[10px] px-2 py-0.5 uppercase border ${ryanClaim?.isCorrected ? 'bg-emerald-900 text-emerald-300 border-emerald-500' : 'bg-black text-neutral-400 border-neutral-700'}`}>
                    {ryanClaim?.isCorrected ? "EXPOSED: ANONYMOUS BOT" : "UNREFUTED"}
                  </span>
                </div>
                {ryanClaim?.isCorrected ? (
                  <div className="mt-2 text-xs font-body text-emerald-200 pl-8 space-y-1">
                    <p className="line-through text-neutral-400">VERIFIED SELLER</p>
                    <p className="text-emerald-300 font-semibold">→ ANONYMOUS TELEGRAM STRANGER (@VaporKush_SG) left in an HDB stairwell.</p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs font-body text-neutral-400 pl-8">
                    Ryan swears by "his guy". Press Ryan on who his guy actually is.
                  </p>
                )}
              </div>
            </div>

            {/* Circular Loop Banner */}
            {canObject && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-6 p-4 bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 border-2 border-red-500 text-center relative"
              >
                <div className="text-yellow-400 font-display font-black text-sm tracking-widest uppercase mb-1">
                  ★ THE CIRCULAR LOOP IS COMPLETELY UNMASKED ★
                </div>
                <p className="font-body text-xs sm:text-sm text-neutral-200 max-w-xl mx-auto leading-relaxed">
                  Noah relied on Alyssa. Alyssa relied on Ryan. Ryan relied on an anonymous stranger on Telegram.
                  <strong> The entire room is taking a chemical gamble on zero verifiable facts.</strong>
                </p>
              </motion.div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs font-display text-neutral-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-neutral-400" />
              <span>You don't need to know what's in the cartridge to prove nobody verified it.</span>
            </div>

            {canObject && onTriggerAha ? (
              <button
                id="object-from-modal-btn"
                onClick={() => {
                  onClose();
                  onTriggerAha();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-heading font-black text-sm uppercase tracking-wider border-2 border-black comic-shadow transition-all flex items-center justify-center gap-2 animate-pulse"
              >
                <Flame className="w-4 h-4 text-black" />
                OBJECT: SHATTER THE CIRCULAR LOOP
              </button>
            ) : (
              <button
                id="resume-investigation-btn"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-display text-xs uppercase tracking-wider border border-neutral-600 transition-colors"
              >
                Return to Testimony
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
