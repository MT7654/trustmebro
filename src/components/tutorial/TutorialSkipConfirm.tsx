import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, SkipForward } from 'lucide-react';

interface Props {
  isOpen: boolean;
  destination: 'investigation' | 'cross-examination';
  onCancel: () => void;
  onConfirm: () => void;
  isReducedMotion?: boolean;
}

export const TutorialSkipConfirm: React.FC<Props> = ({
  isOpen,
  destination,
  onCancel,
  onConfirm,
  isReducedMotion = false
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = window.setTimeout(() => continueRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(focusTimer);
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const destinationLabel = destination === 'investigation' ? 'Investigation' : 'Cross-Examination';
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])') || []);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      data-tutorial-skip-confirm
      className="pointer-events-auto fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
      onKeyDownCapture={handleKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={`w-full max-w-md overflow-hidden rounded-2xl border border-cyan-300/50 bg-[#0b1224] shadow-[0_30px_100px_rgba(0,0,0,.75)] ${isReducedMotion ? '' : 'animate-in fade-in zoom-in-95 duration-150'}`}
      >
        <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,.12),transparent_60%)] px-5 py-5 sm:px-6">
          <p className="font-display text-[10px] font-black uppercase tracking-[.24em] text-cyan-300">Guided practice</p>
          <h2 id={titleId} className="mt-1 font-heading text-2xl font-black uppercase text-white">Skip this tutorial?</h2>
          <p id={descriptionId} className="mt-2 font-body text-sm leading-relaxed text-slate-300">
            You can replay this guided practice anytime from <strong className="font-semibold text-white">Guided Help</strong>.
          </p>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
          <button
            ref={continueRef}
            type="button"
            onClick={onCancel}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-heading text-sm font-black uppercase tracking-wide text-slate-950 transition hover:bg-cyan-200"
          >
            <Play className="h-4 w-4 fill-current" /> Continue tutorial
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-slate-950 px-4 py-3 font-heading text-sm font-black uppercase tracking-wide text-slate-200 transition hover:border-yellow-400 hover:text-white"
          >
            <SkipForward className="h-4 w-4" /> Skip to {destinationLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
