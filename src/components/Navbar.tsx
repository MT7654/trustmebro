import React from 'react';
import { Volume2, VolumeX, Network, HelpCircle, Home, Eye, EyeOff, Music2, Expand, Minimize } from 'lucide-react';
import { sound } from '../utils/sound';

interface NavbarProps {
  onOpenGraph: () => void;
  onOpenHelp: () => void;
  onReturnToTitle?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMusicEnabled: boolean;
  onToggleMusic: () => void;
  isReducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
  discoveredCluesCount: number;
  totalClues: number;
  canObject: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGraph,
  onOpenHelp,
  onReturnToTitle,
  isMuted,
  onToggleMute,
  isMusicEnabled,
  onToggleMusic,
  isReducedMotion = false,
  onToggleReducedMotion,
  discoveredCluesCount,
  totalClues,
  canObject,
  isFullscreen=false,
  onToggleFullscreen
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 border-b border-slate-800 select-none text-white backdrop-blur-md">
      {/* Top micro bar */}
      <div className="bg-slate-900 text-slate-300 font-display font-bold text-[11px] px-4 py-1 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="bg-yellow-400 text-slate-950 px-1.5 py-0.2 rounded-xs font-black text-[10px]">
            CASE #01
          </span>
          <span className="text-slate-200">
            THE CIRCULAR ASSURANCE EXPERIMENT &bull; SINGAPORE
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
          Social Proof & Information Cascade Study
        </span>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Title & Return to Title */}
        <div className="flex items-center gap-3">
          {onReturnToTitle && (
            <button
              id="nav-return-title-btn"
              onClick={() => {
                sound.playClick();
                onReturnToTitle();
              }}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Return to Title Screen"
              aria-label="Return to Title Screen"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          <div className="cursor-pointer" onClick={onOpenHelp}>
            <h1 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 leading-none">
              <span>TRUST ME BRO</span>
            </h1>
            <span className="text-[10px] font-display text-amber-400 font-bold tracking-wider">
              A SOCIAL INVESTIGATION
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Source Map Button */}
          <button
            id="nav-mind-palace-btn"
            onClick={() => {
              sound.playClick();
              onOpenGraph();
            }}
            className={`px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider rounded border transition-all flex items-center gap-1.5 cursor-pointer ${
              canObject
                ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow animate-pulse font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Case Progress</span>
            <span className="bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {discoveredCluesCount}/{totalClues}
            </span>
          </button>

          {/* Reduced Motion Toggle */}
          {onToggleReducedMotion && (
            <button
              id="nav-reduced-motion-btn"
              onClick={() => {
                sound.playClick();
                onToggleReducedMotion();
              }}
              title={isReducedMotion ? "Enable animations" : "Reduce motion"}
              className={`w-8 h-8 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                isReducedMotion
                  ? 'bg-purple-950 text-purple-300 border-purple-600'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {isReducedMotion ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Sound Mute Toggle */}
          {onToggleFullscreen&&<button onClick={onToggleFullscreen} title={isFullscreen?'Exit full screen':'Enter full screen'} className="hidden h-8 w-8 items-center justify-center rounded border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 sm:flex">{isFullscreen?<Minimize className="h-4 w-4"/>:<Expand className="h-4 w-4"/>}</button>}

          {/* Sound Mute Toggle */}
          <button id="nav-music-toggle-btn" onClick={onToggleMusic} title={isMusicEnabled?'Turn music off':'Turn music on'} aria-pressed={isMusicEnabled} className={`w-8 h-8 rounded flex items-center justify-center border transition-colors ${isMusicEnabled?'bg-cyan-950 text-cyan-300 border-cyan-700':'bg-slate-900 text-slate-500 border-slate-800'}`}>
            <Music2 className="w-4 h-4" />
          </button>

          {/* Sound effects toggle */}
          <button
            id="nav-sound-toggle-btn"
            onClick={onToggleMute}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* How to Play / Help button */}
          <button
            id="nav-case-brief-btn"
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }}
            title="Guided Help"
            className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer text-xs font-display font-bold uppercase"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Guided Help</span>
          </button>
        </div>
      </div>
    </header>
  );
};
