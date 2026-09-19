import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, FastForward, MessageSquare, Sparkles, Coffee, ShieldAlert, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { PlayerProfile, CharacterId, CharacterExpression } from '../types';
import { CharacterIllustration } from './CharacterIllustration';
import { sound } from '../utils/sound';

interface StoryIntroProps {
  playerProfile: PlayerProfile;
  onStartInvestigation: () => void;
  onBackToSetup: () => void;
  isReducedMotion?: boolean;
}

interface IntroScene {
  id: string;
  tag: string;
  title: string;
  settingSubtitle: string;
  speakerId: CharacterId;
  speakerName: string;
  speakerRole: string;
  expression: CharacterExpression;
  dialogue: string;
  contextNote: string;
  roomMood: string;
}

export const StoryIntro: React.FC<StoryIntroProps> = ({
  playerProfile,
  onStartInvestigation,
  onBackToSetup,
  isReducedMotion = false
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const playerName = playerProfile.name;
  const playerGender = playerProfile.gender;

  const scenes: IntroScene[] = [
    {
      id: 'scene_1_gathering',
      tag: 'SCENE 1 // THE GATHERING',
      title: "Saturday Night at Ryan's Flat",
      settingSubtitle: "Living Room • Toa Payoh, Singapore • 21:45 SGT",
      speakerId: 'alyssa',
      speakerName: 'Alyssa',
      speakerRole: 'Close Friend since Secondary School',
      expression: 'smiling',
      dialogue: `“Finally, the weekend. Sit, ${playerName}—food's on the table and the game is paused.”`,
      contextNote: 'You take the open seat opposite Ryan. Everyone here has known one another for years; nobody feels on guard.',
      roomMood: 'Warm, familiar, and unguarded.'
    },
    {
      id: 'scene_3_unveiling',
      tag: 'SCENE 2 // THE DEVICE',
      title: 'A Device on the Table',
      settingSubtitle: "Living Room • Low coffee table",
      speakerId: 'ryan',
      speakerName: 'Ryan',
      speakerRole: 'The Host',
      expression: 'smiling',
      dialogue: `“Good food, cold drinks... and something special to unwind.”`,
      contextNote: 'Ryan takes a pastel vape package from his bag and sets it beside the drinks. The ordinary-looking box draws everyone closer.',
      roomMood: 'Casual curiosity shifts the room toward the coffee table.'
    },
    {
      id: 'scene_4_the_assurance',
      tag: 'SCENE 3 // THE ASSURANCES',
      title: '“Trust Me, Bro”',
      settingSubtitle: "Living Room • Ryan holding the pod forward",
      speakerId: 'ryan',
      speakerName: 'Ryan',
      speakerRole: 'Holding the Vape',
      expression: 'smiling',
      dialogue: `“Normal only. Alyssa tried it, Noah backed me, and my seller says it's clean. Three confirmations. Trust me, bro.”`,
      contextNote: `Alyssa says she felt fine right away. Noah nods because Ryan seems sure. Three voices sound independent—but may not be.`,
      roomMood: 'Borrowed confidence begins to feel like consensus.'
    },
    {
      id: 'scene_6_your_turn',
      tag: 'SCENE 4 // YOUR DECISION',
      title: 'All Eyes Turn to You',
      settingSubtitle: `Living Room • Ryan offers the pod to ${playerName}`,
      speakerId: 'ryan',
      speakerName: 'Ryan',
      speakerRole: 'Offering the Pod',
      expression: 'smiling',
      dialogue: `“Your turn, ${playerName}. We all vouch for it.”`,
      contextNote: 'The device remains in Ryan’s hand. You do not need to know what is inside to pause: first find out whether anyone actually verified it.',
      roomMood: 'Friendly pressure, focused directly on you.'
    }
  ];

  const currentScene = scenes[currentStep];
  const isLastStep = currentStep === scenes.length - 1;

  const handleNext = () => {
    sound.playClick();
    if (isLastStep) {
      sound.playTakeThat();
      onStartInvestigation();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      sound.playClick();
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    sound.playTakeThat();
    onStartInvestigation();
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-body selection:bg-amber-500 selection:text-black relative overflow-hidden">
      {/* Background Room Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-950 to-black pointer-events-none" />
      
      {/* City window silhouette ambient lighting */}
      <div className="absolute top-0 right-10 w-72 sm:w-96 h-48 bg-indigo-950/30 border-b-2 border-slate-800/60 rounded-b opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between border-b border-slate-800/70 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-slate-200">
              PROLOGUE: THE GATHERING
            </span>
          </div>
          <span className="text-[11px] font-display text-slate-500 hidden sm:inline">
            Step {currentStep + 1} of {scenes.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="skip-intro-btn"
            onClick={handleSkip}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-display font-bold uppercase tracking-wider rounded border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip to Investigation</span>
          </button>
        </div>
      </header>

      {/* Main Visual Novel Dialogue Stage */}
      <main className="relative z-10 max-w-7xl w-full mx-auto my-auto py-3 flex flex-col gap-3">
        {/* Scene Heading Badge */}
        <div className="flex items-center justify-between text-xs font-display">
          <span className="text-amber-400 font-bold uppercase tracking-widest bg-slate-900 px-3 py-1 rounded border border-slate-800">
            {currentScene.tag}
          </span>
          <span className="text-slate-400 italic">
            {currentScene.settingSubtitle}
          </span>
        </div>

        {/* Cinematic Card Presentation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="relative min-h-[560px] bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-black overflow-hidden shadow-2xl flex flex-col md:flex-row rounded-[2rem] ring-1 ring-white/10"
          >
            <img
              src="/art/living-room-ensemble.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-slate-950/70 to-slate-950" />
            <div className="absolute inset-0 manga-lines opacity-50 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/55 to-transparent pointer-events-none" />
            {/* Left: Speaker Illustration Showcase */}
            <div className="md:w-[58%] min-h-[360px] md:min-h-[560px] p-4 flex flex-col items-center justify-end relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.18),transparent_45%)]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-24 rounded-[50%] bg-black/70 blur-xl" />
              {/* Speaker Portrait */}
              <div className="relative z-10 w-64 h-72 sm:w-80 sm:h-[26rem] flex items-end justify-center origin-bottom">
                <CharacterIllustration
                  characterId={currentScene.speakerId}
                  playerGender={playerGender}
                  expression={currentScene.expression}
                  size="full"
                  className="w-full h-full"
                />
              </div>

              {currentStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.75, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute z-20 bottom-14 right-8 sm:right-14 rotate-[-8deg]"
                  aria-label="The sealed device is placed on the coffee table"
                >
                  <div className="w-20 h-28 rounded-2xl bg-gradient-to-b from-rose-200 via-orange-200 to-amber-100 border-4 border-slate-950 shadow-[0_18px_30px_rgba(0,0,0,.55)] relative">
                    <div className="absolute top-4 inset-x-2 text-center text-[8px] text-rose-950 font-display font-black tracking-widest">SEALED</div>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-5 h-12 rounded-full bg-slate-800 border border-slate-600" />
                  </div>
                </motion.div>
              )}

              {/* Speaker Nameplate */}
              <div className="relative z-30 text-center -mt-12 mb-5 bg-black/75 backdrop-blur px-6 py-2 skew-x-[-5deg] border-l-4 border-amber-400">
                <div className="font-heading font-black text-base sm:text-lg text-amber-400 uppercase tracking-wider">
                  {currentScene.speakerName}
                </div>
                <div className="text-xs font-display text-slate-400">
                  {currentScene.speakerRole}
                </div>
              </div>

              {/* Player Avatar Tag in Bottom Corner */}
              <div className="absolute z-30 top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-slate-950/80 border border-slate-700 rounded-full text-[10px] font-display text-slate-300">
                <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-800">
                  <CharacterIllustration
                    characterId="player"
                    playerGender={playerGender}
                    expression="neutral"
                    size="sm"
                    className="w-4 h-4"
                  />
                </div>
                <span>Playing as: <strong className="text-slate-200">{playerName}</strong></span>
              </div>
            </div>

            {/* Right: Dialogue & Scene Context */}
            <div className="relative z-20 md:w-[42%] p-6 sm:p-9 flex flex-col justify-between space-y-6 bg-slate-950/55 backdrop-blur-sm md:border-l border-white/10">
              <div className="space-y-4">
                <div className="text-[10px] font-display uppercase tracking-widest text-slate-500 font-bold">
                  {currentScene.title}
                </div>

                {/* Main Spoken Dialogue */}
                <div className="relative py-5 border-y border-amber-400/30">
                  <div className="absolute -left-3 top-3 text-5xl text-amber-400/20 font-heading">“</div>
                  <p className="relative font-body text-lg sm:text-xl text-slate-50 font-semibold leading-relaxed">
                    {currentScene.dialogue}
                  </p>
                </div>

                {/* Environmental & Group Context */}
                <p className="font-body text-sm text-slate-300 italic leading-relaxed pl-3 border-l-2 border-amber-500/70">
                  {currentScene.contextNote}
                </p>
              </div>

              {/* Step Progress Indicators */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  {scenes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playClick();
                        setCurrentStep(idx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentStep
                          ? 'w-6 bg-amber-400'
                          : idx < currentStep
                          ? 'w-2 bg-emerald-400'
                          : 'w-2 bg-slate-700 hover:bg-slate-600'
                      }`}
                      title={`Go to step ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-display font-bold uppercase tracking-wider rounded border border-slate-700 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  )}

                  <button
                    id="intro-next-btn"
                    type="button"
                    onClick={handleNext}
                    className={`px-6 py-2.5 font-heading font-black text-xs sm:text-sm uppercase tracking-wider rounded border-2 border-black comic-shadow flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer ${
                      isLastStep
                        ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 animate-pulse'
                        : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950'
                    }`}
                  >
                    <span>{isLastStep ? 'EXAMINE THE ASSURANCE' : 'NEXT'}</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Setting Note */}
      <footer className="relative z-10 text-center text-xs font-display text-slate-500 flex items-center justify-center gap-2">
        <span>Setting: Singapore Residential Gathering</span>
        <span>&bull;</span>
        <span>Target Playtime: ~5 Minutes</span>
      </footer>
    </div>
  );
};
