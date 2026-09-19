import React from 'react';
import { CharacterExpression, CharacterId, PlayerGender } from '../types';

interface CharacterIllustrationProps {
  characterId: CharacterId;
  expression: CharacterExpression;
  playerGender?: PlayerGender;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const basePortraits: Record<Exclude<CharacterId, 'player'>, string> = {
  ryan: '/art/characters/v2/ryan.png',
  noah: '/art/characters/v2/noah.png',
  alyssa: '/art/characters/v2/alyssa.png'
};

const reactionPortraits: Partial<Record<Exclude<CharacterId, 'player'>, string>> = {
  ryan: '/art/characters/v2/ryan-shocked.png',
  noah: '/art/characters/v2/noah-alarmed.png',
  alyssa: '/art/characters/v2/alyssa-worried.png'
};

const characterNames: Record<CharacterId, string> = {
  ryan: 'Ryan',
  noah: 'Noah',
  alyssa: 'Alyssa',
  player: 'Player'
};

const intenseExpressions: CharacterExpression[] = ['defensive', 'shocked', 'alarmed', 'worried'];

export const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({
  characterId,
  expression,
  playerGender = 'male',
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-32 sm:w-40 sm:h-44',
    lg: 'w-48 h-56 sm:w-64 sm:h-72',
    full: 'w-full h-full'
  }[size];

  const isIntense = intenseExpressions.includes(expression);
  const source = characterId === 'player'
    ? `/art/characters/v2/player-${playerGender}.png`
    : isIntense
      ? reactionPortraits[characterId] || basePortraits[characterId]
      : basePortraits[characterId];

  const aura = isIntense
    ? 'drop-shadow-[0_0_18px_rgba(251,113,133,0.48)]'
    : expression === 'skeptical'
      ? 'drop-shadow-[0_0_16px_rgba(250,204,21,0.35)]'
      : 'drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]';

  return (
    <div
      className={`relative flex items-end justify-center select-none overflow-visible ${sizeClasses} ${className}`}
      data-character={characterId}
      data-expression={expression}
      aria-label={`${characterNames[characterId]}, ${expression}`}
      role="img"
    >
      <div className={`absolute inset-x-[8%] bottom-[4%] h-[58%] rounded-full blur-2xl ${isIntense ? 'bg-rose-500/22' : 'bg-cyan-400/10'}`} />
      <img
        src={source}
        alt=""
        draggable={false}
        className={`relative z-10 h-full w-full object-contain object-bottom transition-[filter,transform] duration-300 ${aura} ${
          expression === 'zoned_out' ? 'saturate-50 brightness-75' : ''
        } ${expression === 'skeptical' ? '-translate-y-0.5' : ''}`}
      />
      {isIntense && (
        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(118deg,transparent_35%,rgba(255,255,255,.13)_49%,transparent_61%)] mix-blend-screen" />
      )}
    </div>
  );
};
