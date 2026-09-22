import React from 'react';
import { CharacterExpression, CharacterId, PlayerGender } from '../types';

interface CharacterIllustrationProps {
  characterId: CharacterId;
  expression: CharacterExpression;
  playerGender?: PlayerGender;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  variant?: 'figure' | 'avatar';
}

const sheets:Record<CharacterId,string>={ryan:'/art/characters/v3/ryan-expression-sheet.png',noah:'/art/characters/v3/noah-expression-sheet.png',alyssa:'/art/characters/v3/alyssa-expression-sheet.png',player:'/art/characters/v3/player-male-expression-sheet.png'};
const expressionFrame:Record<CharacterId,Record<CharacterExpression,number>>={
  ryan:{neutral:0,smiling:0,defensive:1,skeptical:1,shocked:2,alarmed:2,worried:3,zoned_out:4},
  noah:{neutral:0,smiling:0,skeptical:1,alarmed:2,shocked:2,defensive:3,worried:4,zoned_out:4},
  alyssa:{neutral:0,zoned_out:0,skeptical:1,worried:2,alarmed:2,defensive:3,shocked:3,smiling:4},
  player:{neutral:0,smiling:0,skeptical:1,zoned_out:1,defensive:2,alarmed:3,shocked:3,worried:4}
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
  size = 'md',
  variant = 'figure'
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-32 sm:w-40 sm:h-44',
    lg: 'w-48 h-56 sm:w-64 sm:h-72',
    full: 'w-full h-full'
  }[size];

  const isIntense = intenseExpressions.includes(expression);
  const source=characterId==='player'?`/art/characters/v3/player-${playerGender}-expression-sheet.png`:sheets[characterId];
  const frame=expressionFrame[characterId][expression];

  const aura = isIntense
    ? 'drop-shadow-[0_0_18px_rgba(251,113,133,0.48)]'
    : expression === 'skeptical'
      ? 'drop-shadow-[0_0_16px_rgba(250,204,21,0.35)]'
      : 'drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]';

  if (variant === 'avatar') {
    const avatarSizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-11 w-11',
      lg: 'h-16 w-16',
      full: 'h-full w-full'
    }[size];

    return (
      <div
        className={`relative shrink-0 select-none overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-600 ${avatarSizeClasses} ${className}`}
        data-character={characterId}
        data-expression={expression}
        aria-label={`${characterNames[characterId]}, ${expression}`}
        role="img"
      >
        <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-black text-slate-300">
          {characterNames[characterId].slice(0, 1)}
        </span>
        <div
          aria-hidden="true"
          className={`absolute left-1/2 top-[-24%] h-[178%] w-[178%] -translate-x-1/2 bg-no-repeat ${aura}`}
          style={{ backgroundImage: `url(${source})`, backgroundSize: '500% 100%', backgroundPosition: `${frame * 25}% 50%` }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-end justify-center select-none overflow-visible ${sizeClasses} ${className}`}
      data-character={characterId}
      data-expression={expression}
      aria-label={`${characterNames[characterId]}, ${expression}`}
      role="img"
    >
      <div className={`absolute inset-x-[8%] bottom-[4%] h-[58%] rounded-full blur-2xl ${isIntense ? 'bg-rose-500/22' : 'bg-cyan-400/10'}`} />
      <div aria-hidden="true" className={`relative z-10 h-full aspect-[3/5] max-w-full bg-no-repeat transition-[filter,transform] duration-300 ${aura} ${expression==='zoned_out'?'saturate-50 brightness-75':''} ${expression==='skeptical'?'-translate-y-0.5':''}`} style={{backgroundImage:`url(${source})`,backgroundSize:'500% 100%',backgroundPosition:`${frame*25}% 50%`}}/>
      {isIntense && (
        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(118deg,transparent_35%,rgba(255,255,255,.13)_49%,transparent_61%)] mix-blend-screen" />
      )}
    </div>
  );
};
