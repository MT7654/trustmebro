import React from 'react';
import { CharacterId, CharacterExpression, PlayerGender } from '../types';

interface CharacterIllustrationProps {
  characterId: CharacterId;
  expression: CharacterExpression;
  playerGender?: PlayerGender;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({
  characterId,
  expression,
  playerGender = 'male',
  className = '',
  size = 'md'
}) => {
  // Dimension classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28 sm:w-36 sm:h-36',
    lg: 'w-48 h-48 sm:w-64 sm:h-64',
    full: 'w-full h-full'
  }[size];

  // Helper expression color accents
  const getExpressionAura = () => {
    switch (expression) {
      case 'defensive':
      case 'shocked':
      case 'alarmed':
        return 'drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]';
      case 'skeptical':
      case 'worried':
        return 'drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]';
      case 'smiling':
        return 'drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]';
      default:
        return 'drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]';
    }
  };

  // 1. RYAN - Confident Host & Supplier (Spiky textured hair, collared jacket, athletic build)
  if (characterId === 'ryan') {
    return (
      <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className} ${getExpressionAura()}`}>
        <svg viewBox="0 0 200 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ryanSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7d0b5" />
              <stop offset="100%" stopColor="#e2b192" />
            </linearGradient>
            <linearGradient id="ryanHair" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2d3748" />
              <stop offset="50%" stopColor="#1a202c" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="ryanShirt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
            <linearGradient id="ryanJacket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          {/* Shoulders & Jacket */}
          <path d="M40 240 L45 185 C45 170 65 155 100 155 C135 155 155 170 155 185 L160 240 Z" fill="url(#ryanJacket)" />
          {/* Inner Shirt V-neck */}
          <path d="M80 155 L100 195 L120 155 Z" fill="url(#ryanShirt)" />
          {/* Collar Details */}
          <path d="M65 160 L85 185 L75 195 Z" fill="#475569" />
          <path d="M135 160 L115 185 L125 195 Z" fill="#475569" />

          {/* Neck */}
          <path d="M85 130 L85 160 L115 160 L115 130 Z" fill="#deb498" />

          {/* Face Base */}
          <path d="M60 70 C60 50 140 50 140 70 C140 105 130 140 100 145 C70 140 60 105 60 70 Z" fill="url(#ryanSkin)" />
          {/* Jaw Shadow */}
          <path d="M75 125 C90 140 110 140 125 125 C115 142 85 142 75 125 Z" fill="#cf9d7c" />

          {/* Hair Back & Top (Layered Anime Spikes) */}
          <path d="M50 75 C45 50 65 25 100 20 C135 25 155 50 150 75 L155 90 L145 80 L148 105 L138 95 C140 65 135 45 100 40 C65 45 60 65 62 95 L52 105 L55 80 L45 90 Z" fill="url(#ryanHair)" />
          {/* Front Bangs */}
          <path d="M65 55 L80 75 L88 58 L105 80 L115 55 L135 70 L125 45 C110 40 90 40 65 55 Z" fill="#1e293b" />
          <path d="M92 42 L102 62 L112 44 Z" fill="#3b82f6" opacity="0.3" />

          {/* Ears */}
          <path d="M55 85 C52 75 52 95 58 102 Z" fill="#e2b192" />
          <path d="M145 85 C148 75 148 95 142 102 Z" fill="#e2b192" />

          {/* EXPRESSION SPECIFIC FEATURES */}
          {/* Eyebrows */}
          {expression === 'smiling' && (
            <>
              <path d="M72 78 Q85 74 95 80" stroke="#1a202c" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M128 78 Q115 74 105 80" stroke="#1a202c" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
          {expression === 'defensive' && (
            <>
              <path d="M70 85 L95 78" stroke="#1a202c" strokeWidth="4" strokeLinecap="round" />
              <path d="M130 85 L105 78" stroke="#1a202c" strokeWidth="4" strokeLinecap="round" />
              <path d="M98 82 L102 82" stroke="#dc2626" strokeWidth="2" />
            </>
          )}
          {expression === 'shocked' && (
            <>
              <path d="M70 72 Q85 68 95 74" stroke="#1a202c" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M130 72 Q115 68 105 74" stroke="#1a202c" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
          {(expression === 'neutral' || expression === 'skeptical' || expression === 'worried' || expression === 'zoned_out' || expression === 'alarmed') && (
            <>
              <path d="M72 80 Q85 76 95 80" stroke="#1a202c" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M128 80 Q115 76 105 80" stroke="#1a202c" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {/* Eyes */}
          {expression === 'smiling' && (
            <>
              <path d="M72 90 Q82 82 92 90" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M108 90 Q118 82 128 90" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          )}
          {expression === 'defensive' && (
            <>
              <ellipse cx="82" cy="90" rx="9" ry="8" fill="#1e293b" />
              <ellipse cx="118" cy="90" rx="9" ry="8" fill="#1e293b" />
              <circle cx="80" cy="88" r="2.5" fill="#fff" />
              <circle cx="116" cy="88" r="2.5" fill="#fff" />
              <path d="M70 86 L94 88" stroke="#1e293b" strokeWidth="2.5" />
              <path d="M130 86 L106 88" stroke="#1e293b" strokeWidth="2.5" />
            </>
          )}
          {expression === 'shocked' && (
            <>
              <circle cx="82" cy="88" r="10" fill="#fff" stroke="#1e293b" strokeWidth="2.5" />
              <circle cx="118" cy="88" r="10" fill="#fff" stroke="#1e293b" strokeWidth="2.5" />
              <circle cx="82" cy="88" r="4" fill="#0f172a" />
              <circle cx="118" cy="88" r="4" fill="#0f172a" />
            </>
          )}
          {(expression === 'neutral' || expression === 'skeptical' || expression === 'worried' || expression === 'zoned_out' || expression === 'alarmed') && (
            <>
              <ellipse cx="82" cy="90" rx="8" ry="7" fill="#1e293b" />
              <ellipse cx="118" cy="90" rx="8" ry="7" fill="#1e293b" />
              <circle cx="80" cy="88" r="2.5" fill="#fff" />
              <circle cx="116" cy="88" r="2.5" fill="#fff" />
            </>
          )}

          {/* Nose */}
          <path d="M98 95 L96 108 L103 108" stroke="#c08560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Mouth */}
          {expression === 'smiling' && (
            <path d="M85 120 Q100 132 115 120" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" fill="#b91c1c" />
          )}
          {expression === 'defensive' && (
            <path d="M86 122 L114 118" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" />
          )}
          {expression === 'shocked' && (
            <ellipse cx="100" cy="124" rx="7" ry="9" fill="#7f1d1d" stroke="#991b1b" strokeWidth="2" />
          )}
          {(expression === 'neutral' || expression === 'skeptical' || expression === 'worried' || expression === 'zoned_out' || expression === 'alarmed') && (
            <path d="M88 122 Q100 124 112 122" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}

          {/* Sweat drop on pressure */}
          {(expression === 'defensive' || expression === 'shocked' || expression === 'alarmed') && (
            <path d="M140 70 C140 65 145 60 145 60 C145 60 150 65 150 70 C150 73 148 76 145 76 C142 76 140 73 140 70 Z" fill="#38bdf8" />
          )}
        </svg>
      </div>
    );
  }

  // 2. ALYSSA - First-Hand Witness (Dark bob haircut with purple tint, hoodie jacket, cool attitude)
  if (characterId === 'alyssa') {
    return (
      <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className} ${getExpressionAura()}`}>
        <svg viewBox="0 0 200 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="alyssaSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fae2d5" />
              <stop offset="100%" stopColor="#ecc0ab" />
            </linearGradient>
            <linearGradient id="alyssaHair" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="40%" stopColor="#2e1065" />
              <stop offset="100%" stopColor="#170836" />
            </linearGradient>
            <linearGradient id="alyssaHoodie" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b21a8" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>
          </defs>

          {/* Shoulders & Hoodie */}
          <path d="M42 240 L48 180 C48 165 70 150 100 150 C130 150 152 165 152 180 L158 240 Z" fill="url(#alyssaHoodie)" />
          {/* Hoodie Collar & Drawstrings */}
          <path d="M75 150 C85 170 115 170 125 150 Z" fill="#2e1065" />
          <line x1="88" y1="165" x2="88" y2="195" stroke="#e9d5ff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="112" y1="165" x2="112" y2="195" stroke="#e9d5ff" strokeWidth="2.5" strokeLinecap="round" />

          {/* Neck */}
          <path d="M88 130 L88 155 L112 155 L112 130 Z" fill="#deb498" />

          {/* Hair Back */}
          <path d="M50 70 C45 110 50 145 65 155 L135 155 C150 145 155 110 150 70 C145 35 55 35 50 70 Z" fill="url(#alyssaHair)" />

          {/* Face Base */}
          <path d="M65 75 C65 55 135 55 135 75 C135 105 125 138 100 142 C75 138 65 105 65 75 Z" fill="url(#alyssaSkin)" />

          {/* Hair Front Bob & Bangs */}
          <path d="M52 65 C52 40 75 25 100 25 C125 25 148 40 148 65 C148 85 142 120 138 135 L126 95 C120 65 80 65 74 95 L62 135 C58 120 52 85 52 65 Z" fill="url(#alyssaHair)" />
          {/* Hair highlight */}
          <path d="M75 40 Q100 35 125 40 Q100 45 75 40" fill="#a855f7" opacity="0.4" />

          {/* EXPRESSION SPECIFIC FEATURES */}
          {/* Eyebrows */}
          {expression === 'skeptical' && (
            <>
              <path d="M72 82 Q82 76 92 80" stroke="#170836" strokeWidth="3" strokeLinecap="round" />
              <path d="M128 76 Q118 72 108 78" stroke="#170836" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {expression === 'shocked' && (
            <>
              <path d="M70 74 Q82 70 92 74" stroke="#170836" strokeWidth="3" strokeLinecap="round" />
              <path d="M130 74 Q118 70 108 74" stroke="#170836" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {(expression !== 'skeptical' && expression !== 'shocked') && (
            <>
              <path d="M72 78 Q82 76 92 79" stroke="#170836" strokeWidth="3" strokeLinecap="round" />
              <path d="M128 78 Q118 76 108 79" stroke="#170836" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {/* Eyes (Almond shaped with purple iris) */}
          {expression === 'shocked' ? (
            <>
              <circle cx="82" cy="88" r="9" fill="#fff" stroke="#170836" strokeWidth="2" />
              <circle cx="118" cy="88" r="9" fill="#fff" stroke="#170836" strokeWidth="2" />
              <circle cx="82" cy="88" r="4" fill="#7e22ce" />
              <circle cx="118" cy="88" r="4" fill="#7e22ce" />
            </>
          ) : expression === 'zoned_out' ? (
            <>
              <ellipse cx="82" cy="89" rx="7" ry="5" fill="#7e22ce" />
              <ellipse cx="118" cy="89" rx="7" ry="5" fill="#7e22ce" />
              <path d="M72 86 Q82 82 92 86" stroke="#170836" strokeWidth="2.5" />
              <path d="M108 86 Q118 82 128 86" stroke="#170836" strokeWidth="2.5" />
            </>
          ) : (
            <>
              <ellipse cx="82" cy="88" rx="7" ry="6" fill="#7e22ce" />
              <ellipse cx="118" cy="88" rx="7" ry="6" fill="#7e22ce" />
              <circle cx="80" cy="86" r="2" fill="#fff" />
              <circle cx="116" cy="86" r="2" fill="#fff" />
              {/* Eyelash line */}
              <path d="M72 84 Q82 80 92 85" stroke="#170836" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M128 84 Q118 80 108 85" stroke="#170836" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Blush */}
          <ellipse cx="73" cy="98" rx="6" ry="3" fill="#f43f5e" opacity="0.25" />
          <ellipse cx="127" cy="98" rx="6" ry="3" fill="#f43f5e" opacity="0.25" />

          {/* Nose */}
          <path d="M98 94 L96 104 L101 104" stroke="#c08560" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Mouth */}
          {expression === 'shocked' ? (
            <ellipse cx="100" cy="120" rx="5" ry="7" fill="#881337" stroke="#be123c" strokeWidth="1.5" />
          ) : expression === 'smiling' ? (
            <path d="M88 118 Q100 126 112 118" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M90 119 Q100 120 110 119" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}

          {/* Sweat drop on shock */}
          {(expression === 'shocked' || expression === 'worried') && (
            <path d="M135 65 C135 60 140 55 140 55 C140 55 145 60 145 65 C145 68 143 71 140 71 C137 71 135 68 135 65 Z" fill="#38bdf8" />
          )}
        </svg>
      </div>
    );
  }

  // 3. NOAH - Peer Follower (Round glasses, oversized knit sweater, hesitant expression)
  if (characterId === 'noah') {
    return (
      <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className} ${getExpressionAura()}`}>
        <svg viewBox="0 0 200 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="noahSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fae5d8" />
              <stop offset="100%" stopColor="#e5ba9e" />
            </linearGradient>
            <linearGradient id="noahHair" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="50%" stopColor="#291102" />
              <stop offset="100%" stopColor="#1c0b02" />
            </linearGradient>
            <linearGradient id="noahSweater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
          </defs>

          {/* Shoulders & Cozy Sweater */}
          <path d="M38 240 L45 185 C45 170 65 155 100 155 C135 155 155 170 155 185 L162 240 Z" fill="url(#noahSweater)" />
          {/* Ribbed Knit Crewneck */}
          <path d="M75 155 C85 168 115 168 125 155 Z" fill="#065f46" stroke="#047857" strokeWidth="3" />

          {/* Neck */}
          <path d="M85 130 L85 158 L115 158 L115 130 Z" fill="#deb498" />

          {/* Hair Back */}
          <path d="M52 70 C48 45 68 25 100 22 C132 25 152 45 148 70 L152 100 L140 90 C142 60 135 40 100 38 C65 40 58 60 60 90 L48 100 Z" fill="url(#noahHair)" />

          {/* Face Base */}
          <path d="M62 70 C62 50 138 50 138 70 C138 105 128 140 100 144 C72 140 62 105 62 70 Z" fill="url(#noahSkin)" />

          {/* Fluffy Messy Bangs */}
          <path d="M55 60 C65 40 85 35 100 35 C115 35 135 40 145 60 C145 75 135 85 125 80 C115 75 110 88 95 82 C85 88 75 75 65 82 C58 75 55 70 55 60 Z" fill="url(#noahHair)" />

          {/* Ears */}
          <path d="M56 85 C52 75 52 95 58 102 Z" fill="#e2b192" />
          <path d="M144 85 C148 75 148 95 142 102 Z" fill="#e2b192" />

          {/* Glasses Frame (Signature aesthetic round frames) */}
          <circle cx="80" cy="90" r="14" fill="none" stroke="#d97706" strokeWidth="2.5" />
          <circle cx="120" cy="90" r="14" fill="none" stroke="#d97706" strokeWidth="2.5" />
          <line x1="94" y1="90" x2="106" y2="90" stroke="#d97706" strokeWidth="2.5" />
          {/* Glass Lens Tint/Glare */}
          <path d="M72 82 L88 98" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
          <path d="M112 82 L128 98" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />

          {/* Eyebrows (visible above glasses) */}
          {expression === 'worried' || expression === 'defensive' || expression === 'shocked' ? (
            <>
              <path d="M70 74 L90 78" stroke="#291102" strokeWidth="3" strokeLinecap="round" />
              <path d="M130 74 L110 78" stroke="#291102" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M70 76 Q80 73 90 76" stroke="#291102" strokeWidth="3" strokeLinecap="round" />
              <path d="M130 76 Q120 73 110 76" stroke="#291102" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {/* Eyes inside glasses */}
          {expression === 'shocked' ? (
            <>
              <circle cx="80" cy="90" r="7" fill="#fff" stroke="#1c0b02" strokeWidth="2" />
              <circle cx="120" cy="90" r="7" fill="#fff" stroke="#1c0b02" strokeWidth="2" />
              <circle cx="80" cy="90" r="3" fill="#1c0b02" />
              <circle cx="120" cy="90" r="3" fill="#1c0b02" />
            </>
          ) : (
            <>
              <ellipse cx="80" cy="90" rx="6" ry="5.5" fill="#1c0b02" />
              <ellipse cx="120" cy="90" rx="6" ry="5.5" fill="#1c0b02" />
              <circle cx="78" cy="88" r="2" fill="#fff" />
              <circle cx="118" cy="88" r="2" fill="#fff" />
            </>
          )}

          {/* Nose */}
          <path d="M98 96 L97 106 L102 106" stroke="#c08560" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Mouth */}
          {expression === 'shocked' ? (
            <ellipse cx="100" cy="122" rx="6" ry="8" fill="#7f1d1d" stroke="#991b1b" strokeWidth="1.5" />
          ) : expression === 'defensive' || expression === 'worried' ? (
            <path d="M88 122 Q100 118 112 122" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M90 120 Q100 123 110 120" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}

          {/* Sweat drop on anxiety */}
          {(expression === 'worried' || expression === 'shocked' || expression === 'defensive') && (
            <path d="M142 68 C142 63 147 58 147 58 C147 58 152 63 152 68 C152 71 150 74 147 74 C144 74 142 71 142 68 Z" fill="#38bdf8" />
          )}
        </svg>
      </div>
    );
  }

  // 4. PLAYER AVATAR (Male or Female)
  if (playerGender === 'male') {
    return (
      <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className} ${getExpressionAura()}`}>
        <svg viewBox="0 0 200 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="playerMaleSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdf0e7" />
              <stop offset="100%" stopColor="#dfa78b" />
            </linearGradient>
            <linearGradient id="playerMaleHair" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="40%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="playerMaleBomber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9f1239" />
              <stop offset="60%" stopColor="#881337" />
              <stop offset="100%" stopColor="#4c0519" />
            </linearGradient>
            <linearGradient id="playerMaleInner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <linearGradient id="glassesGlint" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Shoulders & Crimson Bomber Jacket */}
          <path d="M38 240 L44 180 C44 165 66 150 100 150 C134 150 156 165 156 180 L162 240 Z" fill="url(#playerMaleBomber)" />
          {/* Ribbed Bomber Collar */}
          <path d="M68 152 C80 144 120 144 132 152 L124 165 C114 159 86 159 76 165 Z" fill="#27272a" />
          {/* Inner Obsidian Shirt */}
          <path d="M76 162 C88 174 112 174 124 162 L120 200 L80 200 Z" fill="url(#playerMaleInner)" />
          {/* Silver Chain Pendant */}
          <path d="M86 168 Q100 186 114 168" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <polygon points="100,188 97,183 103,183" fill="#e2e8f0" />
          {/* Bomber Front Metal Zipper Line */}
          <path d="M100 198 L100 240" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,1" />

          {/* Neck */}
          <path d="M86 126 L86 156 L114 156 L114 126 Z" fill="#d3977c" />

          {/* Hair Back Silhouette */}
          <path d="M52 64 C48 38 68 16 100 14 C132 16 152 38 148 64 L152 92 L142 84 C144 56 136 34 100 32 C64 34 56 56 58 84 L48 92 Z" fill="url(#playerMaleHair)" />

          {/* Face Base */}
          <path d="M62 66 C62 46 138 46 138 66 C138 100 128 138 100 142 C72 138 62 100 62 66 Z" fill="url(#playerMaleSkin)" />
          {/* Jaw Contour Shade */}
          <path d="M76 126 C90 140 110 140 124 126 C114 142 86 142 76 126 Z" fill="#c98a6e" />

          {/* Tapered Modern Textured Quiff Hair */}
          <path d="M48 54 C56 22 84 10 108 8 C136 6 156 22 152 50 C146 32 128 22 104 22 C80 22 62 34 56 58 Z" fill="url(#playerMaleHair)" />
          <path d="M52 62 C62 40 85 28 116 26 C144 24 155 38 148 62 C142 54 130 48 114 48 C92 48 74 56 64 74 Z" fill="url(#playerMaleHair)" />
          <path d="M78 20 Q106 12 134 22" stroke="#94a3b8" strokeWidth="2.5" opacity="0.4" strokeLinecap="round" />

          {/* Ears with clean profile */}
          <path d="M56 82 C52 72 52 92 58 98 Z" fill="#dfa78b" />
          <path d="M144 82 C148 72 148 92 142 98 Z" fill="#dfa78b" />

          {/* Eyebrows (visible above glasses) */}
          {expression === 'skeptical' ? (
            <>
              <path d="M68 70 L92 76" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M132 68 L108 73" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : expression === 'shocked' ? (
            <>
              <path d="M66 65 Q80 60 94 66" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M134 65 Q120 60 106 66" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M68 72 Q82 67 94 71" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M132 72 Q118 67 106 71" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {/* Eyes behind lenses */}
          {expression === 'shocked' ? (
            <>
              <circle cx="80" cy="86" r="8" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx="120" cy="86" r="8" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx="80" cy="86" r="3.5" fill="#0f172a" />
              <circle cx="120" cy="86" r="3.5" fill="#0f172a" />
            </>
          ) : (
            <>
              <ellipse cx="80" cy="86" rx="7" ry="6" fill="#0f172a" />
              <ellipse cx="120" cy="86" rx="7" ry="6" fill="#0f172a" />
              <circle cx="78" cy="84" r="2.2" fill="#fff" />
              <circle cx="118" cy="84" r="2.2" fill="#fff" />
              <circle cx="82" cy="87" r="1.2" fill="#38bdf8" />
              <circle cx="122" cy="87" r="1.2" fill="#38bdf8" />
            </>
          )}

          {/* DISTINCTIVE ACCESSORY: Sleek Modern Wireframe Glasses */}
          {/* Left Frame */}
          <rect x="66" y="74" width="28" height="23" rx="4" fill="url(#glassesGlint)" stroke="#94a3b8" strokeWidth="2.2" />
          {/* Right Frame */}
          <rect x="106" y="74" width="28" height="23" rx="4" fill="url(#glassesGlint)" stroke="#94a3b8" strokeWidth="2.2" />
          {/* Bridge */}
          <path d="M94 82 Q100 80 106 82" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Temples / Arms to ears */}
          <path d="M66 80 L56 79" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <path d="M134 80 L144 79" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          {/* Lens Glint Reflection */}
          <path d="M70 78 L80 78 L72 90 Z" fill="#ffffff" opacity="0.35" />
          <path d="M110 78 L120 78 L112 90 Z" fill="#ffffff" opacity="0.35" />

          {/* Nose */}
          <path d="M98 94 L96 104 L102 104" stroke="#b97c5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Mouth */}
          {expression === 'smiling' ? (
            <path d="M88 120 Q100 128 112 120" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : expression === 'shocked' ? (
            <ellipse cx="100" cy="122" rx="5" ry="7" fill="#7f1d1d" stroke="#881337" strokeWidth="1.5" />
          ) : (
            <path d="M88 120 Q100 122 112 120" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}
        </svg>
      </div>
    );
  }

  // Female Player Avatar (Alexis)
  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className} ${getExpressionAura()}`}>
      <svg viewBox="0 0 200 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="playerFemSkin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff1ea" />
            <stop offset="100%" stopColor="#eec8b6" />
          </linearGradient>
          <linearGradient id="playerFemHair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="35%" stopColor="#78350f" />
            <stop offset="70%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#292524" />
          </linearGradient>
          <linearGradient id="playerFemJacket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b21a8" />
            <stop offset="60%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
          <linearGradient id="playerFemTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="100%" stopColor="#d8b4fe" />
          </linearGradient>
        </defs>

        {/* High Topknot Bun (Distinct Head Silhouette) */}
        <circle cx="100" cy="18" r="19" fill="url(#playerFemHair)" />
        <ellipse cx="100" cy="24" rx="14" ry="7" fill="#c2410c" opacity="0.5" />
        {/* Bun Hair Tie / Scrunchie */}
        <ellipse cx="100" cy="30" rx="12" ry="4" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />

        {/* Shoulders & Plum-Violet Denim/Moto Jacket */}
        <path d="M40 240 L46 178 C46 164 68 148 100 148 C132 148 154 164 154 178 L160 240 Z" fill="url(#playerFemJacket)" />
        {/* Inner Lavender Top */}
        <path d="M76 148 C86 168 114 168 124 148 L120 192 L80 192 Z" fill="url(#playerFemTop)" />
        
        {/* Minimalist Velvet Choker & Silver Charm */}
        <path d="M86 138 Q100 144 114 138" stroke="#1e1b4b" strokeWidth="3" fill="none" />
        <circle cx="100" cy="142" r="2.5" fill="#facc15" />

        {/* Denim Jacket Lapels & Silver Snaps */}
        <path d="M62 156 L82 188 L72 240 Z" fill="#4c1d95" />
        <path d="M138 156 L118 188 L128 240 Z" fill="#4c1d95" />
        <circle cx="70" cy="172" r="2.5" fill="#e2e8f0" />
        <circle cx="130" cy="172" r="2.5" fill="#e2e8f0" />

        {/* Neck */}
        <path d="M88 124 L88 152 L112 152 L112 124 Z" fill="#dfb39d" />

        {/* Hair Back Silhouette */}
        <path d="M50 68 C46 96 48 132 58 144 L142 144 C152 132 154 96 150 68 C148 32 52 32 50 68 Z" fill="url(#playerFemHair)" />

        {/* Face Base */}
        <path d="M64 70 C64 50 136 50 136 70 C136 102 126 136 100 140 C74 136 64 102 64 70 Z" fill="url(#playerFemSkin)" />

        {/* Copper-Balayage Layered Fringe & Face-framing Tendrils */}
        <path d="M52 58 C50 36 72 24 100 24 C128 24 150 36 148 58 C144 76 138 98 136 118 L126 84 C120 56 80 56 74 84 L64 118 C62 98 56 76 52 58 Z" fill="url(#playerFemHair)" />
        {/* Balayage streaks */}
        <path d="M68 36 Q98 28 124 34" stroke="#ea580c" strokeWidth="2.8" opacity="0.7" strokeLinecap="round" />
        <path d="M58 84 Q62 108 66 126" stroke="#f97316" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        <path d="M142 84 Q138 108 134 126" stroke="#f97316" strokeWidth="2" opacity="0.6" strokeLinecap="round" />

        {/* EARS & DISTINCTIVE SILVER HOOP EARRINGS */}
        <path d="M58 84 C54 74 54 94 60 98 Z" fill="#eec8b6" />
        <path d="M142 84 C146 74 146 94 140 98 Z" fill="#eec8b6" />
        {/* Silver Hoop Left */}
        <circle cx="56" cy="98" r="6" stroke="#e2e8f0" strokeWidth="2" fill="none" />
        {/* Silver Hoop Right */}
        <circle cx="144" cy="98" r="6" stroke="#e2e8f0" strokeWidth="2" fill="none" />

        {/* Cheek Blush */}
        <ellipse cx="74" cy="96" rx="6" ry="3" fill="#f43f5e" opacity="0.3" />
        <ellipse cx="126" cy="96" rx="6" ry="3" fill="#f43f5e" opacity="0.3" />

        {/* Eyebrows */}
        {expression === 'skeptical' ? (
          <>
            <path d="M70 73 Q82 68 92 72" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
            <path d="M130 69 Q118 66 108 72" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : expression === 'shocked' ? (
          <>
            <path d="M68 66 Q82 62 94 68" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
            <path d="M132 66 Q118 62 106 68" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M70 74 Q82 70 92 74" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
            <path d="M130 74 Q118 70 108 74" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* Eyes (Perceptive with subtle cat-eye wing) */}
        {expression === 'shocked' ? (
          <>
            <circle cx="80" cy="86" r="8" fill="#fff" stroke="#1e1b4b" strokeWidth="2" />
            <circle cx="120" cy="86" r="8" fill="#fff" stroke="#1e1b4b" strokeWidth="2" />
            <circle cx="80" cy="86" r="3.5" fill="#701a75" />
            <circle cx="120" cy="86" r="3.5" fill="#701a75" />
          </>
        ) : (
          <>
            <ellipse cx="80" cy="86" rx="7" ry="6" fill="#1c1917" />
            <ellipse cx="120" cy="86" rx="7" ry="6" fill="#1c1917" />
            <circle cx="78" cy="84" r="2.2" fill="#fff" />
            <circle cx="118" cy="84" r="2.2" fill="#fff" />
            {/* Winged Eyeliner */}
            <path d="M68 83 Q80 79 90 84" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M68 83 L64 80" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M132 83 Q120 79 110 84" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M132 83 L136 80" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}

        {/* Nose */}
        <path d="M98 92 L96 102 L101 102" stroke="#be8462" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Mouth */}
        {expression === 'smiling' ? (
          <path d="M88 118 Q100 126 112 118" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : expression === 'shocked' ? (
          <ellipse cx="100" cy="119" rx="5" ry="7" fill="#881337" stroke="#be123c" strokeWidth="1.5" />
        ) : (
          <path d="M88 118 Q100 120 112 118" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </div>
  );
};
