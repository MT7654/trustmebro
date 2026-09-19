import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Eye, EyeOff, Play, ShieldAlert, Sparkles, HelpCircle, ArrowRight, UserCheck, Flame } from 'lucide-react';
import { sound } from '../utils/sound';

interface TitleScreenProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isReducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleMute,
  isReducedMotion,
  onToggleReducedMotion
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'cast'>('visual');

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Night Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep navy/indigo background with warm amber corner lamp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#080d1a]" />
        {/* City skyline glow at window */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
        {/* Living room floor lamp glow */}
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full" />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      {/* Top Bar with Settings */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-yellow-400 text-black font-display font-black text-xs sm:text-sm uppercase tracking-widest border border-yellow-300">
            CASE #01
          </div>
          <span className="text-xs sm:text-sm font-display uppercase tracking-widest text-slate-400 hidden sm:inline">
            Social Proof Investigation
          </span>
        </div>

        {/* Accessibility & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="title-reduced-motion-btn"
            onClick={() => {
              sound.playClick();
              onToggleReducedMotion();
            }}
            className={`px-3 py-1.5 rounded text-xs font-display flex items-center gap-1.5 border transition-colors ${
              isReducedMotion
                ? 'bg-purple-950/80 text-purple-300 border-purple-500'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle reduced motion"
            aria-label="Toggle reduced motion"
          >
            {isReducedMotion ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden md:inline">{isReducedMotion ? 'Motion: Reduced' : 'Motion: Standard'}</span>
          </button>

          <button
            id="title-sound-btn"
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className={`px-3 py-1.5 rounded text-xs font-display flex items-center gap-1.5 border transition-colors ${
              !isMuted
                ? 'bg-amber-950/80 text-amber-300 border-amber-500'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle audio"
            aria-label="Toggle audio"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
            <span className="hidden md:inline">{isMuted ? 'Sound: Muted' : 'Sound: Active'}</span>
          </button>
        </div>
      </header>

      {/* Main Hero & Cinematic Key Visual */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-8 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 flex-1">
        {/* Left Column: Title Typography & Hook */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          {/* Main Title Banner */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-display uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>A PSYCHOLOGICAL SOCIAL INVESTIGATION</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-7xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] leading-[0.95]">
              TRUST ME <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
                BRO.
              </span>
            </h1>

            <p className="font-display text-sm sm:text-base text-yellow-300/90 font-bold uppercase tracking-widest pt-1">
              Three friends. One assurance. Where did it actually come from?
            </p>
          </div>

          {/* Narrative Premise */}
          <p className="font-body text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            You're at Ryan's place on a Saturday night. A sealed device crosses the coffee table with total confidence. Noah says Alyssa checked it. Alyssa says Ryan checked it. Ryan trusts one unknown source.
          </p>

          {/* Key Visual Callout / Core Mechanic Teaser */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 max-w-xl mx-auto lg:mx-0 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>YOUR OBJECTIVE</span>
            </div>
            <p className="font-body text-xs sm:text-sm text-slate-300 leading-snug">
              Cross-examine the room, collect their own words, and expose the single unverified origin hidden behind mutual peer confirmation.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              id="enter-the-room-btn"
              onClick={() => {
                sound.playTakeThat();
                onStartGame();
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-heading font-black text-base sm:text-lg uppercase tracking-wider border-2 border-black comic-shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Play className="w-5 h-5 text-slate-950 fill-current group-hover:translate-x-1 transition-transform" />
              <span>ENTER THE ROOM</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Key Visual / Cast Staging */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-xl aspect-[16/10] bg-slate-950 rounded-[1.5rem] overflow-hidden shadow-2xl flex flex-col justify-between ring-1 ring-white/15">
            <img
              src="/art/living-room-ensemble.png"
              alt="Ryan, Noah and Alyssa gathered tensely around the living-room coffee table"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-slate-950/30" />
            <div className="absolute top-3 right-4 rounded-full bg-black/55 px-3 py-1 text-[10px] font-display text-slate-200 uppercase tracking-widest backdrop-blur">
              SINGAPORE // 22:45 SGT
            </div>

            {/* Living room gathering visual */}
            <div className="relative z-10 mt-auto grid grid-cols-3 items-end gap-2 px-4 pb-16 text-center">
              <div className="rounded-full bg-emerald-950/80 px-2 py-1 text-[10px] font-display font-bold text-emerald-200 backdrop-blur">NOAH · RELIED ON RYAN</div>
              <div className="rounded-full bg-amber-950/85 px-2 py-1 text-[10px] font-display font-bold text-amber-200 backdrop-blur ring-1 ring-amber-400/70">RYAN · THE HOST</div>
              <div className="rounded-full bg-purple-950/80 px-2 py-1 text-[10px] font-display font-bold text-purple-200 backdrop-blur">ALYSSA · TRUSTED RYAN</div>
            </div>

            {/* Coffee table scene foreground */}
            <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/75 px-4 py-3 flex items-center justify-between text-xs text-slate-300 font-display backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-slate-300">Coffee Table // 1 Unverified Pod</span>
              </div>
              <div className="text-[11px] text-amber-400/90 font-bold">
                Apparent Consensus: 3 Votes
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Educational Framework Tagline */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-display">
        <div>
          TRUST ME BRO &bull; AN INTERACTIVE SOCIAL-PROOF INVESTIGATION
        </div>
        <div className="text-slate-400">
          Exploring Circular Trust, Informational Cascades & Unverified Verification
        </div>
      </footer>
    </div>
  );
};
