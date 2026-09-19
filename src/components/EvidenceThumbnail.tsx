import React from 'react';
import { EvidenceThumbnailType } from '../types';

interface EvidenceThumbnailProps {
  type: EvidenceThumbnailType;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  className?: string;
  isInspected?: boolean;
}

export const EvidenceThumbnail: React.FC<EvidenceThumbnailProps> = ({
  type,
  size = 'md',
  className = '',
  isInspected = true
}) => {
  // Dimension presets
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    giant: 'w-44 h-44 sm:w-52 sm:h-52'
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`relative rounded-lg overflow-hidden flex items-center justify-center select-none shrink-0 border border-slate-700 bg-slate-950 ${currentSizeClass} ${className}`}
    >
      {/* Background subtle radial texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 opacity-90" />

      {/* RENDER ILLUSTRATED ARTWORK BY TYPE */}
      {type === 'box' && (
        <svg viewBox="0 0 160 160" className="w-full h-full p-1.5 drop-shadow-md">
          <defs>
            <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="foilGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="tamperGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>

          {/* Box Drop Shadow */}
          <rect x="36" y="24" width="88" height="116" rx="8" fill="#000000" opacity="0.5" transform="translate(4, 4)" />

          {/* Main Box Outer Body */}
          <rect x="36" y="22" width="88" height="116" rx="6" fill="url(#boxGrad)" stroke="#ffedd5" strokeWidth="1.5" />

          {/* Top Foil Accent Bar */}
          <rect x="36" y="22" width="88" height="18" rx="4" fill="url(#foilGrad)" stroke="#ffffff" strokeWidth="0.75" />
          <text x="80" y="34" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
            ORIGINAL FLAVOR
          </text>

          {/* Holographic Tamper Seal (Sliced on side) */}
          <rect x="116" y="34" width="12" height="16" rx="2" fill="url(#tamperGrad)" opacity="0.9" />
          <line x1="116" y1="42" x2="128" y2="42" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2,1" />

          {/* Graphic Emblem on Center */}
          <circle cx="80" cy="74" r="22" fill="#fff7ed" stroke="#fdba74" strokeWidth="1.5" />
          <path d="M80 62 C72 62 66 70 66 77 C66 87 80 93 80 93 C80 93 94 87 94 77 C94 70 88 62 80 62 Z" fill="#fb923c" />
          <path d="M80 62 C82 58 87 56 90 57" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Subtext Branding */}
          <text x="80" y="106" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
            SWEET PEACH
          </text>

          {/* Blank Compliance Box (Crucial Discovery) */}
          <rect x="44" y="114" width="72" height="16" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="0.75" />
          <text x="80" y="122" textAnchor="middle" fill="#f87171" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
            BATCH: UNMARKED
          </text>
          <text x="80" y="127" textAnchor="middle" fill="#94a3b8" fontSize="4.5" fontFamily="sans-serif">
            [NO CERTIFICATE QR]
          </text>
        </svg>
      )}

      {type === 'pod' && (
        <svg viewBox="0 0 160 160" className="w-full h-full p-1.5 drop-shadow-md">
          <defs>
            <linearGradient id="podLiquid" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="podPlastic" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="20%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="80%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Pod Mouthpiece */}
          <path d="M56 22 C56 16 64 12 80 12 C96 12 104 16 104 22 L102 44 L58 44 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <ellipse cx="80" cy="18" rx="8" ry="2.5" fill="#020617" />

          {/* Translucent Reservoir Chamber */}
          <rect x="52" y="44" width="56" height="74" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />

          {/* Liquid Reservoir Fill */}
          <rect x="54" y="58" width="52" height="58" rx="2" fill="url(#podLiquid)" />
          <ellipse cx="80" cy="58" rx="26" ry="3" fill="#fde68a" />

          {/* Glass Plastic Reflections */}
          <rect x="52" y="44" width="56" height="74" rx="4" fill="url(#podPlastic)" pointerEvents="none" />
          <line x1="58" y1="48" x2="58" y2="112" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />

          {/* Internal Atomizer Chimney */}
          <rect x="76" y="44" width="8" height="68" fill="#94a3b8" stroke="#475569" strokeWidth="0.75" />
          <circle cx="80" cy="88" r="4" fill="#cbd5e1" stroke="#475569" strokeWidth="0.75" />

          {/* Base Connection with Brass Contacts */}
          <rect x="52" y="118" width="56" height="18" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <circle cx="68" cy="127" r="4" fill="url(#brassGrad)" stroke="#451a03" strokeWidth="0.75" />
          <circle cx="92" cy="127" r="4" fill="url(#brassGrad)" stroke="#451a03" strokeWidth="0.75" />
          <rect x="78" y="124" width="4" height="6" fill="#64748b" rx="1" />
        </svg>
      )}

      {type === 'phone' && (
        <svg viewBox="0 0 160 160" className="w-full h-full p-1.5 drop-shadow-md">
          <defs>
            <linearGradient id="phoneScreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#090d16" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="chatSeller" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="chatRyan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>

          {/* Phone Frame Bezel */}
          <rect x="36" y="12" width="88" height="136" rx="14" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          
          {/* Inner Display Screen */}
          <rect x="42" y="18" width="76" height="124" rx="8" fill="url(#phoneScreen)" />

          {/* Top Notch / Camera Bar */}
          <rect x="68" y="21" width="24" height="4" rx="2" fill="#020617" />

          {/* Chat Header */}
          <rect x="42" y="28" width="76" height="16" fill="#0b1329" />
          <circle cx="52" cy="36" r="5" fill="#f59e0b" />
          <text x="61" y="38" fill="#e2e8f0" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">
            UNKNOWN SELLER
          </text>

          {/* Message 1: Ryan asking */}
          <rect x="56" y="48" width="56" height="16" rx="4" fill="url(#chatRyan)" />
          <text x="60" y="55" fill="#ffffff" fontSize="4.5" fontFamily="sans-serif">
            "Got batch test sheets?"
          </text>
          <text x="60" y="60" fill="#e0f2fe" fontSize="4" fontFamily="sans-serif">
            "Safe for the gathering?"
          </text>

          {/* Message 2: Seller answering (Highlighted critical proof) */}
          <rect x="46" y="68" width="66" height="24" rx="4" fill="url(#chatSeller)" stroke="#f59e0b" strokeWidth="1" />
          <text x="50" y="76" fill="#fcd34d" fontSize="5" fontWeight="bold" fontFamily="sans-serif">
            "100% normal bro"
          </text>
          <text x="50" y="82" fill="#f8fafc" fontSize="4.5" fontFamily="sans-serif">
            "Trust me. Senior supplier."
          </text>
          <text x="50" y="88" fill="#ef4444" fontSize="4" fontWeight="bold" fontFamily="sans-serif">
            [No test certificates]
          </text>

          {/* Message 3: Ryan confirming */}
          <rect x="62" y="96" width="50" height="14" rx="4" fill="url(#chatRyan)" opacity="0.85" />
          <text x="66" y="104" fill="#ffffff" fontSize="4.5" fontFamily="sans-serif">
            "Alright bro, trust you."
          </text>

          {/* Bottom Chat Bar */}
          <rect x="46" y="122" width="68" height="12" rx="4" fill="#1e293b" />
          <text x="52" y="130" fill="#64748b" fontSize="4.5" fontFamily="sans-serif">
            Message...
          </text>
        </svg>
      )}

      {type === 'alyssa' && (
        <svg viewBox="0 0 160 160" className="w-full h-full p-2 drop-shadow-md">
          <defs>
            <linearGradient id="alyssaHalo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r="64" fill="#1e1b4b" stroke="url(#alyssaHalo)" strokeWidth="3" />
          
          {/* Stylized Avatar Illustration */}
          {/* Hair back */}
          <ellipse cx="80" cy="74" rx="38" ry="42" fill="#4c0519" />
          
          {/* Head & Face */}
          <ellipse cx="80" cy="78" rx="26" ry="30" fill="#fce7f3" />
          
          {/* Hair bangs */}
          <path d="M54 70 C60 52 100 52 106 70 C96 64 88 64 80 68 C72 64 64 64 54 70 Z" fill="#831843" />
          
          {/* Eyes (Worried/Thoughtful) */}
          <ellipse cx="70" cy="78" rx="3" ry="4" fill="#374151" />
          <ellipse cx="90" cy="78" rx="3" ry="4" fill="#374151" />
          <path d="M66 72 Q70 70 74 73" stroke="#831843" strokeWidth="1.5" fill="none" />
          <path d="M86 73 Q90 70 94 72" stroke="#831843" strokeWidth="1.5" fill="none" />
          
          {/* Small mouth */}
          <ellipse cx="80" cy="92" rx="3" ry="2" fill="#db2777" />

          {/* Shoulders */}
          <path d="M44 136 C48 116 64 110 80 110 C96 110 112 116 116 136 Z" fill="#86198f" />

          {/* Quote bubble indicator */}
          <circle cx="118" cy="42" r="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
          <text x="118" y="47" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
            💬
          </text>
        </svg>
      )}

      {type === 'ryan' && (
        <svg viewBox="0 0 160 160" className="w-full h-full p-2 drop-shadow-md">
          <defs>
            <linearGradient id="ryanHalo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r="64" fill="#451a03" stroke="url(#ryanHalo)" strokeWidth="3" />
          
          {/* Short Dark Hair */}
          <ellipse cx="80" cy="62" rx="32" ry="32" fill="#1c1917" />

          {/* Head & Face */}
          <ellipse cx="80" cy="78" rx="26" ry="28" fill="#ffedd5" />

          {/* Side hair & fringe */}
          <path d="M54 62 C62 48 98 48 106 62 C96 56 86 58 80 58 C74 58 64 56 54 62 Z" fill="#292524" />

          {/* Eyes (Guarded/Casual) */}
          <ellipse cx="70" cy="76" rx="3.5" ry="3" fill="#292524" />
          <ellipse cx="90" cy="76" rx="3.5" ry="3" fill="#292524" />
          <path d="M66 70 Q70 68 74 71" stroke="#292524" strokeWidth="2" fill="none" />
          <path d="M86 71 Q90 68 94 70" stroke="#292524" strokeWidth="2" fill="none" />

          {/* Smirk/Mouth */}
          <path d="M74 92 Q80 96 88 91" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Shoulders / Hoodie */}
          <path d="M42 136 C48 116 64 108 80 108 C96 108 112 116 118 136 Z" fill="#b45309" />

          {/* Admission Badge */}
          <circle cx="118" cy="42" r="14" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
          <text x="118" y="47" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="900">
            ⚠️
          </text>
        </svg>
      )}

      {type === 'noah' && (
        <svg viewBox="0 0 160 160" className="w-full h-full p-2 drop-shadow-md">
          <defs>
            <linearGradient id="noahHalo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r="64" fill="#082f49" stroke="url(#noahHalo)" strokeWidth="3" />

          {/* Head & Face */}
          <ellipse cx="80" cy="76" rx="26" ry="28" fill="#f0fdf4" />

          {/* Wavy Brown Hair */}
          <path d="M52 64 C56 46 104 46 108 64 C98 54 84 56 80 56 C76 56 62 54 52 64 Z" fill="#3f2e23" />
          <circle cx="56" cy="62" r="6" fill="#3f2e23" />
          <circle cx="104" cy="62" r="6" fill="#3f2e23" />

          {/* Glasses */}
          <rect x="62" y="70" width="14" height="12" rx="3" fill="none" stroke="#0284c7" strokeWidth="2" />
          <rect x="84" y="70" width="14" height="12" rx="3" fill="none" stroke="#0284c7" strokeWidth="2" />
          <line x1="76" y1="76" x2="84" y2="76" stroke="#0284c7" strokeWidth="2" />

          {/* Calm eyes */}
          <circle cx="69" cy="76" r="2.5" fill="#0f172a" />
          <circle cx="91" cy="76" r="2.5" fill="#0f172a" />

          {/* Neutral mouth */}
          <line x1="74" y1="92" x2="86" y2="92" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />

          {/* Shoulders */}
          <path d="M42 136 C48 116 64 108 80 108 C96 108 112 116 118 136 Z" fill="#0369a1" />

          {/* Quote badge */}
          <circle cx="118" cy="42" r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
          <text x="118" y="47" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
            💬
          </text>
        </svg>
      )}

      {type === 'source_map' && (
        <svg viewBox="0 0 160 160" className="w-full h-full p-2 drop-shadow-md">
          <defs>
            <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#083344" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="nodeSeller" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Blueprint map background */}
          <rect x="16" y="16" width="128" height="128" rx="8" fill="url(#mapBg)" stroke="#06b6d4" strokeWidth="1.5" />

          {/* Grid lines */}
          <line x1="16" y1="56" x2="144" y2="56" stroke="#0e7490" strokeWidth="0.5" strokeDasharray="4,4" />
          <line x1="16" y1="96" x2="144" y2="96" stroke="#0e7490" strokeWidth="0.5" strokeDasharray="4,4" />
          <line x1="80" y1="16" x2="80" y2="144" stroke="#0e7490" strokeWidth="0.5" strokeDasharray="4,4" />

          {/* Dependency Connecting Lines */}
          <line x1="80" y1="42" x2="80" y2="78" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="80" y1="78" x2="48" y2="114" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
          <line x1="80" y1="78" x2="112" y2="114" stroke="#c084fc" strokeWidth="2" strokeDasharray="3,2" />

          {/* Top Node: Unknown Seller */}
          <circle cx="80" cy="42" r="14" fill="url(#nodeSeller)" stroke="#ffffff" strokeWidth="1.5" />
          <text x="80" y="47" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
            ?
          </text>

          {/* Middle Node: Ryan */}
          <circle cx="80" cy="78" r="12" fill="#d97706" stroke="#fde68a" strokeWidth="1.5" />
          <text x="80" y="82" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
            RYAN
          </text>

          {/* Bottom Left Node: Noah */}
          <circle cx="48" cy="114" r="11" fill="#0284c7" stroke="#bae6fd" strokeWidth="1" />
          <text x="48" y="117" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
            NOAH
          </text>

          {/* Bottom Right Node: Alyssa */}
          <circle cx="112" cy="114" r="11" fill="#9333ea" stroke="#f5d0fe" strokeWidth="1" />
          <text x="112" y="117" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
            ALYSSA
          </text>

          {/* Collapse Banner */}
          <rect x="32" y="128" width="96" height="12" rx="3" fill="#0f172a" stroke="#22d3ee" strokeWidth="1" />
          <text x="80" y="136" textAnchor="middle" fill="#67e8f9" fontSize="6.5" fontWeight="900" letterSpacing="0.5">
            3 ECHOES ➔ 1 SOURCE
          </text>
        </svg>
      )}
    </div>
  );
};
