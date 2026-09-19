import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume1, Volume2, X } from 'lucide-react';
import { TutorialStep } from '../../types';
import { sound } from '../../utils/sound';

interface SpeakerTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorialStep: TutorialStep;
  onAdvanceTutorialStep: (step: TutorialStep) => void;
  isReducedMotion?: boolean;
}

const VIEWS = ['front', 'side', 'back'] as const;

export const SpeakerTutorialModal: React.FC<SpeakerTutorialModalProps> = ({
  isOpen,
  onClose,
  tutorialStep,
  onAdvanceTutorialStep,
  isReducedMotion = false
}) => {
  const [viewIndex, setViewIndex] = useState(0);
  const [volumeFound, setVolumeFound] = useState(false);
  const [volumeDown, setVolumeDown] = useState(false);
  const dragStart = useRef<number | null>(null);

  const rotate = (direction: number) => {
    sound.playBoxRotate();
    setViewIndex(prev => (prev + direction + VIEWS.length) % VIEWS.length);
    if (tutorialStep === 'investigation_rotate_speaker') {
      onAdvanceTutorialStep('investigation_find_volume');
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') rotate(-1);
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') rotate(1);
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, tutorialStep]);

  if (!isOpen) return null;

  const findVolume = () => {
    sound.playClick();
    setVolumeFound(true);
    onAdvanceTutorialStep('investigation_lower_volume');
  };

  const lowerVolume = () => {
    sound.playClick();
    setVolumeDown(true);
    onAdvanceTutorialStep('investigation_completed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#050812]/92 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="speaker-tutorial-title">
      <motion.div
        initial={isReducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-cyan-300/40 bg-[#0a1020] shadow-[0_30px_100px_rgba(0,0,0,.7)]"
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-display font-bold uppercase tracking-[.28em] text-cyan-300">Practice object · nothing recorded</p>
            <h2 id="speaker-tutorial-title" className="font-heading text-xl font-black text-white sm:text-2xl">Turn down the music</h2>
          </div>
          <button onClick={onClose} aria-label="Close speaker inspection" className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid gap-0 sm:grid-cols-[1.35fr_.65fr]">
          <div
            className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,.18),transparent_55%),linear-gradient(#111a30,#070b14)]"
            onPointerDown={event => { dragStart.current = event.clientX; }}
            onPointerUp={event => {
              if (dragStart.current !== null && Math.abs(event.clientX - dragStart.current) > 35) rotate(event.clientX > dragStart.current ? -1 : 1);
              dragStart.current = null;
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
            <button onClick={() => rotate(-1)} aria-label="Rotate speaker left" className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white hover:border-cyan-300"><ChevronLeft /></button>
            <button onClick={() => rotate(1)} aria-label="Rotate speaker right" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white hover:border-cyan-300"><ChevronRight /></button>

            <motion.div
              key={viewIndex}
              initial={isReducedMotion ? false : { opacity: 0, rotateY: 24 }}
              animate={{ opacity: 1, rotateY: 0 }}
              className="absolute left-1/2 top-1/2 h-52 w-72 -translate-x-1/2 -translate-y-1/2 rounded-[2.2rem] border border-cyan-200/40 bg-gradient-to-br from-slate-700 via-slate-900 to-black shadow-[0_35px_45px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.18)]"
            >
              <div className="absolute inset-5 rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle,rgba(255,255,255,.13)_1px,transparent_1.5px)] [background-size:7px_7px]" />
              <div className="absolute left-6 top-5 text-[10px] font-display tracking-[.25em] text-cyan-200/80">ROOMBEAT</div>
              {viewIndex === 2 && (
                <button
                  onClick={findVolume}
                  aria-label="Inspect volume control"
                  className={`absolute right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full border-2 bg-slate-950 shadow-lg transition ${tutorialStep === 'investigation_find_volume' ? 'animate-pulse border-yellow-300 ring-4 ring-yellow-300/30' : 'border-cyan-300/60'}`}
                >
                  <Volume2 className="m-auto h-6 w-6 text-cyan-200" />
                </button>
              )}
              <div className="absolute inset-x-16 -bottom-4 h-5 rounded-full bg-black/70 blur-md" />
            </motion.div>
            <div className="absolute bottom-5 inset-x-0 text-center text-xs text-slate-400">Drag, swipe, use A/D or arrow keys to rotate</div>
          </div>

          <div className="flex flex-col justify-between border-l border-white/10 bg-slate-950/70 p-5 sm:p-6">
            <div className="space-y-5">
              <div className="rounded-2xl bg-white/[.04] p-4">
                <p className="text-[10px] font-display font-bold uppercase tracking-[.2em] text-cyan-300">What to do</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  {volumeDown ? 'The music drops to a murmur. Now everyone can hear one another.' : volumeFound ? 'You found the volume dial. Turn it down.' : 'Rotate the portable speaker and find its volume control.'}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="rounded-full border border-slate-700 px-3 py-1">View {viewIndex + 1}/3</span>
                <span>No case evidence</span>
              </div>
            </div>

            {volumeFound && !volumeDown && (
              <button onClick={lowerVolume} className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-heading text-sm font-black uppercase tracking-wide text-slate-950 hover:bg-cyan-200">
                <Volume1 className="h-5 w-5" /> Turn music down
              </button>
            )}
            {volumeDown && (
              <button onClick={onClose} className="mt-6 min-h-12 rounded-xl bg-yellow-300 px-4 py-3 font-heading text-sm font-black uppercase tracking-wide text-slate-950 hover:bg-yellow-200">
                Look around the room
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
