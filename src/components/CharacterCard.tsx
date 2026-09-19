import React from 'react';
import { motion } from 'motion/react';
import { Character, CharacterExpression, PinnedClaim } from '../types';
import { Sparkles, AlertCircle, Eye, ShieldQuestion, Pin } from 'lucide-react';
import { sound } from '../utils/sound';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
  hasDiscoveredKeyClue: boolean;
  characterClaim?: PinnedClaim;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected,
  onSelect,
  hasDiscoveredKeyClue,
  characterClaim
}) => {
  // Render stylized SVG anime faces based on expression
  const renderExpressionAvatar = (expression: CharacterExpression, id: string) => {
    switch (id) {
      case 'ryan':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-600 to-red-800">
            {/* Persona Halftone BG */}
            <div className="absolute inset-0 dot-pattern opacity-20" />
            
            {/* SVG Stylized Avatar */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md">
              {/* Hair */}
              <path d="M 25 35 Q 50 10 75 35 Q 85 50 80 65 L 75 75 L 25 75 L 20 65 Z" fill="#262626" />
              {/* Spiky highlights */}
              <polygon points="30,22 45,8 55,20" fill="#f59e0b" />
              <polygon points="50,15 65,10 70,25" fill="#f59e0b" />
              {/* Face */}
              <circle cx="50" cy="55" r="28" fill="#fcd34d" />
              {/* Eyes */}
              {expression === 'shocked' ? (
                <>
                  <circle cx="40" cy="50" r="5" fill="#000" />
                  <circle cx="60" cy="50" r="5" fill="#000" />
                  <circle cx="41" cy="49" r="1.5" fill="#fff" />
                  <circle cx="61" cy="49" r="1.5" fill="#fff" />
                </>
              ) : expression === 'defensive' ? (
                <>
                  <path d="M 33 46 L 47 52" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 67 46 L 53 52" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="40" cy="52" r="3" fill="#000" />
                  <circle cx="60" cy="52" r="3" fill="#000" />
                </>
              ) : (
                <>
                  {/* Confident / Smiling eyes */}
                  <path d="M 34 50 Q 40 44 46 50" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <path d="M 54 50 Q 60 44 66 50" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </>
              )}
              {/* Mouth */}
              {expression === 'shocked' ? (
                <ellipse cx="50" cy="68" rx="6" ry="8" fill="#000" />
              ) : expression === 'defensive' ? (
                <path d="M 40 68 Q 50 63 60 68" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M 42 64 Q 50 72 58 64" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
              {/* Sweat drop if defensive/shocked */}
              {(expression === 'defensive' || expression === 'shocked') && (
                <path d="M 72 40 Q 77 48 72 52 Q 67 48 72 40" fill="#38bdf8" />
              )}
            </svg>
            
            {/* The Vape in Hand Indicator */}
            <div className="absolute bottom-1 right-2 bg-black/80 px-2 py-0.5 border border-yellow-400 text-[10px] font-display text-yellow-300">
              VAPE IN HAND
            </div>
          </div>
        );

      case 'alyssa':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-600 to-purple-800">
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md">
              {/* Hair long */}
              <path d="M 20 40 Q 50 15 80 40 L 85 85 L 75 90 L 25 90 L 15 85 Z" fill="#3b0764" />
              <path d="M 18 35 Q 50 10 82 35" stroke="#ec4899" strokeWidth="4" fill="none" />
              {/* Face */}
              <circle cx="50" cy="55" r="26" fill="#fde047" />
              {/* Eyes */}
              {expression === 'zoned_out' ? (
                <>
                  {/* Droopy / heavy eyelids */}
                  <ellipse cx="40" cy="52" rx="5" ry="2" fill="#000" />
                  <ellipse cx="60" cy="52" rx="5" ry="2" fill="#000" />
                  <path d="M 33 46 Q 40 48 47 48" stroke="#ec4899" strokeWidth="2" fill="none" />
                  <path d="M 53 48 Q 60 48 67 46" stroke="#ec4899" strokeWidth="2" fill="none" />
                  {/* Spiral/daze mark */}
                  <circle cx="70" cy="40" r="3" stroke="#f43f5e" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
                </>
              ) : expression === 'worried' ? (
                <>
                  <circle cx="40" cy="52" r="4" fill="#000" />
                  <circle cx="60" cy="52" r="4" fill="#000" />
                  <path d="M 35 44 L 46 48" stroke="#000" strokeWidth="2.5" />
                  <path d="M 65 44 L 54 48" stroke="#000" strokeWidth="2.5" />
                </>
              ) : (
                <>
                  <circle cx="40" cy="50" r="3.5" fill="#000" />
                  <circle cx="60" cy="50" r="3.5" fill="#000" />
                  <path d="M 34 44 Q 40 42 46 45" stroke="#000" strokeWidth="2" fill="none" />
                  <path d="M 54 45 Q 60 42 66 44" stroke="#000" strokeWidth="2" fill="none" />
                </>
              )}
              {/* Mouth */}
              {expression === 'zoned_out' ? (
                <path d="M 45 68 L 55 68" stroke="#000" strokeWidth="2" strokeLinecap="round" />
              ) : expression === 'worried' ? (
                <path d="M 43 69 Q 50 63 57 69" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M 44 65 Q 50 71 56 65" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </svg>
            {expression === 'zoned_out' && (
              <div className="absolute top-2 right-2 bg-pink-500 text-white font-display text-[9px] px-1.5 py-0.5 animate-pulse uppercase">
                DISORIENTED
              </div>
            )}
          </div>
        );

      case 'noah':
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-600 to-blue-900">
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md">
              {/* Hair neat */}
              <path d="M 28 35 Q 50 15 72 35 L 75 60 L 25 60 Z" fill="#1e293b" />
              {/* Face */}
              <circle cx="50" cy="55" r="27" fill="#fcd34d" />
              {/* Glasses */}
              <rect x="30" y="45" width="16" height="12" rx="2" fill="rgba(255,255,255,0.4)" stroke="#0f172a" strokeWidth="3" />
              <rect x="54" y="45" width="16" height="12" rx="2" fill="rgba(255,255,255,0.4)" stroke="#0f172a" strokeWidth="3" />
              <line x1="46" y1="51" x2="54" y2="51" stroke="#0f172a" strokeWidth="3" />
              {/* Eyes through glasses */}
              {expression === 'alarmed' ? (
                <>
                  <circle cx="38" cy="51" r="4" fill="#000" />
                  <circle cx="62" cy="51" r="4" fill="#000" />
                  {/* Eyebrows up */}
                  <path d="M 32 40 L 44 42" stroke="#000" strokeWidth="2" />
                  <path d="M 68 40 L 56 42" stroke="#000" strokeWidth="2" />
                </>
              ) : (
                <>
                  <circle cx="38" cy="51" r="2.5" fill="#000" />
                  <circle cx="62" cy="51" r="2.5" fill="#000" />
                  <path d="M 32 42 L 44 43" stroke="#000" strokeWidth="2" />
                  <path d="M 68 42 L 56 43" stroke="#000" strokeWidth="2" />
                </>
              )}
              {/* Mouth */}
              {expression === 'alarmed' ? (
                <ellipse cx="50" cy="68" rx="5" ry="6" fill="#000" />
              ) : (
                <line x1="43" y1="67" x2="57" y2="67" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>
            <div className="absolute bottom-1 right-2 bg-black/80 px-2 py-0.5 border border-cyan-400 text-[10px] font-display text-cyan-300">
              DOES NOT VAPE
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        sound.playClick();
        onSelect();
      }}
      id={`character-card-${character.id}`}
      className={`relative cursor-pointer transition-all border-3 ${
        isSelected
          ? 'border-yellow-400 bg-neutral-900 comic-shadow-yellow'
          : 'border-black bg-neutral-900/90 hover:border-neutral-400 comic-shadow'
      } flex flex-col overflow-hidden`}
    >
      {/* Top Banner */}
      <div className="bg-black text-white px-3 py-1 flex items-center justify-between border-b-2 border-black">
        <span className="font-heading text-sm font-black uppercase tracking-wider text-yellow-300">
          {character.name}
        </span>
        <span className="font-display text-[10px] uppercase tracking-wider bg-neutral-800 text-neutral-300 px-1.5 py-0.2 border border-neutral-700">
          {character.badge}
        </span>
      </div>

      {/* Avatar Container */}
      <div className="h-32 sm:h-36 w-full relative border-b-2 border-black">
        {renderExpressionAvatar(character.currentExpression, character.id)}

        {/* Clue discovered indicator badge */}
        {hasDiscoveredKeyClue && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black font-display font-black text-[10px] px-1.5 py-0.5 border border-black comic-shadow flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> CLUE UNLOCKED
          </div>
        )}

        {/* Selected arrow pointer */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black font-display font-black text-[10px] px-2 py-0.5 uppercase tracking-wider border border-black animate-bounce">
            INTERROGATING
          </div>
        )}
      </div>

      {/* Card Footer Info */}
      <div className="p-3 bg-neutral-950 flex flex-col justify-between flex-1">
        <div>
          <div className="text-[11px] font-display uppercase tracking-wider text-neutral-400 mb-1">
            {character.role}
          </div>
          <p className="font-body text-xs text-neutral-300 italic line-clamp-2">
            "{character.initialStatement}"
          </p>

          {/* Dedicated Pinned Claim Badge on the Card */}
          {characterClaim && (
            <div
              className={`mt-2.5 p-2 border-2 text-[11px] font-body transition-colors ${
                characterClaim.isCorrected
                  ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200'
                  : isSelected
                  ? 'bg-neutral-900 border-yellow-400 text-yellow-100'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-display font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 text-yellow-400">
                  <Pin className="w-2.5 h-2.5 fill-yellow-400" />
                  PREMISE:
                </span>
                <span
                  className={`text-[8px] font-display font-black px-1.5 py-0.2 uppercase border ${
                    characterClaim.isCorrected
                      ? 'bg-emerald-900 text-emerald-300 border-emerald-400'
                      : 'bg-red-950 text-red-300 border-red-700'
                  }`}
                >
                  {characterClaim.isCorrected ? '✓ EXPOSED' : 'UNREFUTED'}
                </span>
              </div>
              <p className="line-clamp-2 font-display text-xs leading-tight">
                {characterClaim.isCorrected ? (
                  <span className="text-emerald-300">
                    <span className="line-through text-neutral-400 mr-1">{characterClaim.keyWordOriginal}</span>
                    <strong className="text-emerald-300">{characterClaim.keyWordCorrected}</strong>
                  </span>
                ) : (
                  <span>
                    Holds claim: <strong className="text-yellow-300 font-heading">[{characterClaim.keyWordOriginal}]</strong>
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[10px] font-display text-neutral-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-yellow-500" />
            <span>Click card to Question</span>
          </span>
          <span
            className={`text-[11px] font-display font-bold px-2 py-0.5 uppercase border ${
              isSelected
                ? 'bg-yellow-400 text-black border-black font-black'
                : 'bg-neutral-800 text-neutral-200 border-neutral-700'
            }`}
          >
            {isSelected ? 'INTERROGATING' : 'SELECT & PRESS'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
