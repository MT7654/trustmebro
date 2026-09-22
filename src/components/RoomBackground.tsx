import React from 'react';
import { motion } from 'motion/react';
import { CharacterId, Character, PinnedClaim, PlayerProfile } from '../types';
import { CharacterIllustration } from './CharacterIllustration';
import { sound } from '../utils/sound';

interface RoomBackgroundProps {
  characters: Record<string, Character>;
  selectedCharacterId: CharacterId;
  onSelectCharacter: (id: CharacterId) => void;
  solvedGatesCount: number;
  exchangeMisses: number;
  playerProfile?: PlayerProfile;
  isReducedMotion?: boolean;
}

export const RoomBackground: React.FC<RoomBackgroundProps> = ({
  characters,
  selectedCharacterId,
  onSelectCharacter,
  solvedGatesCount,
  exchangeMisses,
  playerProfile = { name: 'Sam', gender: 'male' },
  isReducedMotion = false
}) => {
  const activeChar = characters[selectedCharacterId];

  // Calculate mood tone
  const getRoomLighting = () => {
    if (exchangeMisses >= 2) {
      return 'from-rose-950/40 via-slate-950/90 to-black';
    }
    if (solvedGatesCount === 3) {
      return 'from-amber-950/40 via-slate-950/90 to-black';
    }
    return 'from-slate-900/60 via-slate-950/90 to-black';
  };

  return (
    <div className="courtroom-room-stage relative h-full min-h-0 w-full bg-slate-950 bg-cover rounded-[1.75rem] overflow-hidden select-none flex flex-col justify-between shadow-2xl ring-1 ring-white/10" style={{backgroundImage:"url('/art/environments/living-room-empty-master.png')",backgroundPosition:selectedCharacterId==='noah'?'35% 50%':selectedCharacterId==='alyssa'?'68% 50%':'50% 50%'}}>
      {/* Background Living Room & Window Layer */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getRoomLighting()} opacity-70 transition-colors duration-700`}>
        {/* City Window Silhouette */}
        <div className="absolute top-0 right-6 sm:right-16 w-36 sm:w-60 h-24 bg-indigo-950/30 border-b border-x border-slate-800/80 rounded-b flex items-center justify-around opacity-50">
          <div className="w-1 h-full bg-slate-800/40" />
          <div className="w-1 h-full bg-slate-800/40" />
          {/* Distant skyline light blips */}
          <div className="absolute bottom-1 left-3 w-1.5 h-4 bg-yellow-400/20" />
          <div className="absolute bottom-1 left-8 w-2 h-6 bg-blue-400/20" />
          <div className="absolute bottom-1 right-6 w-1.5 h-5 bg-amber-400/20" />
        </div>

        {/* Ambient Floor Lamp Glow (Left) */}
        <div className="absolute top-2 left-6 w-24 h-24 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none" />

        {/* Center Room Spotlight on Active Witness */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-32 bg-yellow-400/5 blur-[35px] rounded-full pointer-events-none" />
      </div>

      {/* Top Scene Status Indicator */}
      <div className="courtroom-scene-status absolute inset-x-0 top-0 z-30 px-3 py-1.5 sm:px-4 flex items-center justify-between text-[11px] font-display border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 uppercase tracking-wider font-bold text-[10px] sm:text-[11px]">
            RYAN'S LIVING ROOM &bull; 23:00 SGT
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400">
          <span className="hidden xs:inline">EVIDENCE GATES:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map(gateNum => (
              <span
                key={gateNum}
                className={`w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center border ${
                  gateNum <= solvedGatesCount
                    ? 'bg-yellow-400 text-black border-yellow-300'
                    : 'bg-slate-900 text-slate-500 border-slate-700'
                }`}
              >
                {gateNum}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Character Staging (Visual Novel Theater: Active in center, receded friends on sides) */}
      <div className="courtroom-character-stage absolute inset-0 z-10 flex items-end justify-center px-4 sm:px-12 pb-5 pt-6 gap-8 sm:gap-24">
        {/* Left Character: Noah */}
        <button
          id="room-select-noah"
          data-active={selectedCharacterId === 'noah'}
          onClick={() => {
            sound.playClick();
            onSelectCharacter('noah');
          }}
          className={`courtroom-character-button relative flex flex-col items-center transition-all cursor-pointer ${
            selectedCharacterId === 'noah'
              ? 'scale-110 z-20 opacity-100 -translate-y-1'
              : 'scale-90 z-10 opacity-55 hover:opacity-90 hover:scale-95'
          }`}
          title="Speak to Noah"
        >
          <div className="relative">
            <CharacterIllustration characterId="noah" expression={characters.noah.currentExpression} size="lg" className="courtroom-character-art h-52 w-40" />
            {selectedCharacterId === 'noah' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-emerald-500 text-black text-[8px] font-display font-black uppercase rounded shadow">
                ACTIVE
              </div>
            )}
          </div>
          <span className={`text-[9px] font-display font-bold uppercase mt-0.5 ${selectedCharacterId === 'noah' ? 'text-emerald-300' : 'text-slate-400'}`}>
            Noah
          </span>
        </button>

        {/* Center Character: Ryan (Host) */}
        <button
          id="room-select-ryan"
          data-active={selectedCharacterId === 'ryan'}
          onClick={() => {
            sound.playClick();
            onSelectCharacter('ryan');
          }}
          className={`courtroom-character-button relative flex flex-col items-center transition-all cursor-pointer ${
            selectedCharacterId === 'ryan'
              ? 'scale-110 z-20 opacity-100 -translate-y-1'
              : 'scale-90 z-10 opacity-55 hover:opacity-90 hover:scale-95'
          }`}
          title="Speak to Ryan"
        >
          <div className="relative">
            <CharacterIllustration characterId="ryan" expression={characters.ryan.currentExpression} size="lg" className="courtroom-character-art h-52 w-40" />
            {selectedCharacterId === 'ryan' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-amber-400 text-black text-[8px] font-display font-black uppercase rounded shadow">
                ACTIVE
              </div>
            )}
          </div>
          <span className={`text-[9px] font-display font-bold uppercase mt-0.5 ${selectedCharacterId === 'ryan' ? 'text-amber-300' : 'text-slate-400'}`}>
            Ryan
          </span>
        </button>

        {/* Right Character: Alyssa */}
        <button
          id="room-select-alyssa"
          data-active={selectedCharacterId === 'alyssa'}
          onClick={() => {
            sound.playClick();
            onSelectCharacter('alyssa');
          }}
          className={`courtroom-character-button relative flex flex-col items-center transition-all cursor-pointer ${
            selectedCharacterId === 'alyssa'
              ? 'scale-110 z-20 opacity-100 -translate-y-1'
              : 'scale-90 z-10 opacity-55 hover:opacity-90 hover:scale-95'
          }`}
          title="Speak to Alyssa"
        >
          <div className="relative">
            <CharacterIllustration characterId="alyssa" expression={characters.alyssa.currentExpression} size="lg" className="courtroom-character-art h-52 w-40" />
            {selectedCharacterId === 'alyssa' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-purple-400 text-black text-[8px] font-display font-black uppercase rounded shadow">
                ACTIVE
              </div>
            )}
          </div>
          <span className={`text-[9px] font-display font-bold uppercase mt-0.5 ${selectedCharacterId === 'alyssa' ? 'text-purple-300' : 'text-slate-400'}`}>
            Alyssa
          </span>
        </button>
      </div>

      {/* Foreground Table & Subtle Objects */}
      <div className="courtroom-table-overlay absolute inset-x-0 bottom-0 z-30 h-7 bg-slate-900/90 border-t border-slate-800 px-3 sm:px-4 flex items-center justify-between text-[10px] font-display text-slate-400 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          {/* Player Presence Tag */}
          <div className="flex items-center gap-1.5 px-1.5 py-0.2 rounded bg-slate-950 border border-slate-700 text-slate-200">
            <CharacterIllustration characterId="player" playerGender={playerProfile.gender} expression="neutral" size="sm" variant="avatar" className="h-6 w-6" />
            <span className="font-bold text-amber-400">{playerProfile.name}</span>
            <span className="text-[9px] text-slate-400">(Your Seat)</span>
          </div>

          <span className="text-slate-500 hidden md:inline">&bull;</span>
          <span className="text-slate-300 font-medium hidden md:inline text-[10px]">Ice Green Tea, Chips & 1 Unverified Pod</span>
        </div>
        <span className="text-slate-400 text-[9px] sm:text-[10px]">
          Click any friend to examine testimony
        </span>
      </div>
    </div>
  );
};

