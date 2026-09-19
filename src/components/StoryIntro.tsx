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
      tag: 'SCENE 1 // CASUAL REUNION',
      title: "Saturday Night at Ryan's Flat",
      settingSubtitle: "Living Room &bull; Toa Payoh, Singapore &bull; 21:45 SGT",
      speakerId: 'alyssa',
      speakerName: 'Alyssa',
      speakerRole: 'Close Friend since Secondary School',
      expression: 'smiling',
      dialogue: `“Ah, finally the weekend! That poly project deadline was draining my soul. Thanks for having us over, Ryan.”`,
      contextNote: 'The aircon is humming quietly. Pokka green tea cans and potato chip bowls sit on the coffee table.',
      roomMood: 'Relaxed, friendly weekend hangout among long-time friends.'
    },
    {
      id: 'scene_2_banter',
      tag: 'SCENE 2 // OLD HABITS',
      title: 'Comfortable Banter',
      settingSubtitle: "Living Room &bull; Mario Kart paused on the television",
      speakerId: 'noah',
      speakerName: 'Noah',
      speakerRole: 'Track Athlete & Friend',
      expression: 'neutral',
      dialogue: `“Tell me about it. Coach had us running twelve 400-meter intervals this morning. ${playerName} almost beat my Mario Kart record earlier though!”`,
      contextNote: 'Everyone has known one another for years. No one feels on guard.',
      roomMood: 'Familiar and trusting.'
    },
    {
      id: 'scene_3_unveiling',
      tag: 'SCENE 3 // THE UNVEILING',
      title: 'A Device on the Table',
      settingSubtitle: "Living Room &bull; Low coffee table",
      speakerId: 'ryan',
      speakerName: 'Ryan',
      speakerRole: 'The Host',
      expression: 'smiling',
      dialogue: `“That’s why I called the crew over tonight. Good food, cold drinks, and something special to unwind.”`,
      contextNote: 'Ryan reaches into his sling bag, pulling out a sleek pastel peach vape pod cartridge.',
      roomMood: 'Casual curiosity as the device is placed between the drink cans.'
    },
    {
      id: 'scene_4_the_assurance',
      tag: 'SCENE 4 // THE ASSURANCE',
      title: '“Trust Me, Bro”',
      settingSubtitle: "Living Room &bull; Ryan holding the pod forward",
      speakerId: 'ryan',
      speakerName: 'Ryan',
      speakerRole: 'Holding the Vape',
      expression: 'smiling',
      dialogue: `“Normal only. Not Kpod. Noah backed it, Alyssa is chill, and my seller is verified. That's three separate confirmations. Trust me, bro.”`,
      contextNote: 'Ryan presents his confidence with total ease and genuine warmth.',
      roomMood: 'Confidence established without question.'
    },
    {
      id: 'scene_5_echoes',
      tag: 'SCENE 5 // THE CONSENSUS FORMS',
      title: 'The Reassurances Echo',
      settingSubtitle: "Living Room &bull; Alyssa and Noah nod along",
      speakerId: 'alyssa',
      speakerName: 'Alyssa',
      speakerRole: 'Witness',
      expression: 'neutral',
      dialogue: `“Yeah, I took two hits 10 minutes ago, tastes just like sweet peach iced tea, see? Totally chill.”`,
      contextNote: `Noah chips in: "Alyssa checked what was inside, and Ryan knows the seller. It's fine, ${playerName}."`,
      roomMood: 'Three confident voices forming an apparent consensus.'
    },
    {
      id: 'scene_6_your_turn',
      tag: 'SCENE 6 // THE SPOTLIGHT',
      title: 'All Eyes Turn to You',
      settingSubtitle: `Living Room &bull; Ryan offers the pod to ${playerName}`,
      speakerId: 'ryan',
      speakerName: 'Ryan',
      speakerRole: 'Offering the Pod',
      expression: 'smiling',
      dialogue: `“Eh ${playerName}, what are you waiting for? Take a hit la. We all vouch for it!”`,
      contextNote: 'All three friends look at you expectantly. The assurance sounds solid—but where did it actually originate?',
      roomMood: 'The moment of decision.'
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
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-body selection:bg-amber-500 selection:text-black relative overflow-hidden">
      {/* Background Room Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-950 to-black pointer-events-none" />
      
      {/* City window silhouette ambient lighting */}
      <div className="absolute top-0 right-10 w-72 sm:w-96 h-48 bg-indigo-950/30 border-b-2 border-slate-800/60 rounded-b opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between border-b border-slate-800 pb-3">
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
      <main className="relative z-10 max-w-4xl w-full mx-auto my-auto py-4 sm:py-8 flex flex-col gap-4">
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
            className="bg-slate-900/95 border-2 border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Left: Speaker Illustration Showcase */}
            <div className="md:w-5/12 bg-slate-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative">
              {/* Speaker Portrait */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                <CharacterIllustration
                  characterId={currentScene.speakerId}
                  playerGender={playerGender}
                  expression={currentScene.expression}
                  size="md"
                  className="w-full h-full"
                />
              </div>

              {/* Speaker Nameplate */}
              <div className="text-center mt-3">
                <div className="font-heading font-black text-base sm:text-lg text-amber-400 uppercase tracking-wider">
                  {currentScene.speakerName}
                </div>
                <div className="text-xs font-display text-slate-400">
                  {currentScene.speakerRole}
                </div>
              </div>

              {/* Player Avatar Tag in Bottom Corner */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-slate-900/80 border border-slate-800 rounded text-[10px] font-display text-slate-400">
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
            <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-[10px] font-display uppercase tracking-widest text-slate-500 font-bold">
                  {currentScene.title}
                </div>

                {/* Main Spoken Dialogue */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg relative">
                  <p className="font-body text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                    {currentScene.dialogue}
                  </p>
                </div>

                {/* Environmental & Group Context */}
                <p className="font-body text-xs sm:text-sm text-slate-400 italic leading-relaxed pl-2 border-l-2 border-amber-500/50">
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
