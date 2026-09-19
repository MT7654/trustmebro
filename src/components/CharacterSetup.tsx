import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, ArrowRight, Sparkles, Check, Heart, Lock } from 'lucide-react';
import { PlayerGender, PlayerProfile } from '../types';
import { CharacterIllustration } from './CharacterIllustration';
import { sound } from '../utils/sound';

interface CharacterSetupProps {
  onComplete: (profile: PlayerProfile) => void;
  onBackToTitle: () => void;
  isReducedMotion?: boolean;
}

const DEFAULT_NAMES = {
  male: 'Sam',
  female: 'Alexis'
};

const MAX_NAME_LENGTH = 15;

export const CharacterSetup: React.FC<CharacterSetupProps> = ({
  onComplete,
  onBackToTitle,
  isReducedMotion = false
}) => {
  const [gender, setGender] = useState<PlayerGender>('male');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const activeDefaultName = DEFAULT_NAMES[gender];
  const effectiveName = name.trim() || activeDefaultName;

  const handleGenderSelect = (selectedGender: PlayerGender) => {
    sound.playClick();
    setGender(selectedGender);
    setError(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, MAX_NAME_LENGTH);
    setName(val);
    if (error) setError(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sound.playDramaticHit();
    
    // Clean name
    const finalName = name.trim() || activeDefaultName;
    
    onComplete({
      name: finalName,
      gender
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-body selection:bg-amber-500 selection:text-black relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-display font-black uppercase tracking-widest text-amber-400 block mb-1">
            CHARACTER IDENTITY SETUP
          </span>
          <h1 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-100">
            CHOOSE YOUR PRESENCE IN THE ROOM
          </h1>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onBackToTitle();
          }}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-display font-bold uppercase tracking-wider rounded border border-slate-700 transition-colors cursor-pointer"
        >
          &larr; Title Screen
        </button>
      </header>

      {/* Center Setup Box */}
      <main className="relative z-10 max-w-3xl w-full mx-auto my-auto py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/90 border-2 border-slate-700 rounded-xl p-5 sm:p-8 shadow-2xl space-y-8"
        >
          {/* Step 1: Avatar Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-heading text-sm sm:text-base font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-xs flex items-center justify-center font-bold">1</span>
                <span>Select Your Avatar</span>
              </label>
              <span className="text-xs font-display text-slate-400">
                Visible during breakthroughs & cross-examinations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Male Avatar Card */}
              <button
                type="button"
                id="avatar-select-male"
                onClick={() => handleGenderSelect('male')}
                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-4 cursor-pointer text-left ${
                  gender === 'male'
                    ? 'bg-rose-950/60 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.25)] ring-1 ring-rose-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <CharacterIllustration
                    characterId="player"
                    playerGender="male"
                    expression="neutral"
                    size="sm"
                    className="w-14 h-14 sm:w-16 sm:h-16"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-sm uppercase text-rose-300">
                      Avatar A (Male)
                    </span>
                    {gender === 'male' && (
                      <span className="w-5 h-5 rounded-full bg-rose-400 text-slate-950 flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-body mt-1 leading-relaxed">
                    Wireframe spectacles, ash quiff, crimson bomber. Default name: <strong className="text-slate-200">Sam</strong>
                  </p>
                </div>
              </button>

              {/* Female Avatar Card */}
              <button
                type="button"
                id="avatar-select-female"
                onClick={() => handleGenderSelect('female')}
                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-4 cursor-pointer text-left ${
                  gender === 'female'
                    ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.25)] ring-1 ring-purple-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <CharacterIllustration
                    characterId="player"
                    playerGender="female"
                    expression="neutral"
                    size="sm"
                    className="w-14 h-14 sm:w-16 sm:h-16"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-sm uppercase text-purple-300">
                      Avatar B (Female)
                    </span>
                    {gender === 'female' && (
                      <span className="w-5 h-5 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-body mt-1 leading-relaxed">
                    Chic topknot & copper balayage, silver hoop earrings, plum jacket. Default name: <strong className="text-slate-200">Alexis</strong>
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Custom Player Name */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label htmlFor="player-name-input" className="font-heading text-sm sm:text-base font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-xs flex items-center justify-center font-bold">2</span>
                <span>Enter Your Name In The Story</span>
              </label>
              <span className="text-xs font-display text-slate-400">
                {name.length}/{MAX_NAME_LENGTH} characters
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <input
                  id="player-name-input"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder={`Leave blank to use "${activeDefaultName}"`}
                  maxLength={MAX_NAME_LENGTH}
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 text-slate-100 px-4 py-3 rounded-lg font-heading text-base sm:text-lg tracking-wider focus:outline-none transition-colors placeholder:text-slate-600 placeholder:font-body placeholder:text-sm"
                />
                {name && (
                  <button
                    type="button"
                    onClick={() => setName('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-display uppercase tracking-wider text-slate-500 hover:text-slate-300 px-2 py-1 bg-slate-900 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setName(activeDefaultName)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-display font-bold uppercase tracking-wider rounded border border-slate-700 transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Use "{activeDefaultName}"</span>
              </button>
            </div>

            {/* In-Game Preview Tag */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                <CharacterIllustration
                  characterId="player"
                  playerGender={gender}
                  expression="neutral"
                  size="sm"
                  className="w-8 h-8"
                />
              </div>
              <div className="text-xs text-slate-300 font-body">
                Ryan will greet you as: <span className="text-amber-400 font-heading font-black tracking-wider">"{effectiveName}"</span>
              </div>
            </div>
          </div>

          {/* Privacy and Storage Assurance Notice */}
          <div className="flex items-start gap-2.5 p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-xs font-body">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-200">Playthrough Privacy:</strong> Your selected name and avatar are held strictly in temporary session memory for this run. No personal data is stored, transmitted, or analysed.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              id="confirm-character-btn"
              onClick={() => handleSubmit()}
              className="w-full sm:w-auto px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-sm sm:text-base uppercase tracking-wider rounded-lg border-2 border-black comic-shadow flex items-center justify-center gap-3 transition-transform hover:scale-102 cursor-pointer"
            >
              <span>JOIN THE GATHERING AS {effectiveName.toUpperCase()}</span>
              <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs font-display text-slate-500">
        TRUST ME BRO &bull; An Interactive Social Investigation
      </footer>
    </div>
  );
};
