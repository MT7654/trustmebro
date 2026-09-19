import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, X, ChevronRight, Info, AlertCircle, Eye, ArrowRight } from 'lucide-react';
import { TutorialStep } from '../types';
import { sound } from '../utils/sound';

interface TutorialGuideProps {
  step: TutorialStep;
  onSkip: () => void;
  onOpenHowToPlay?: () => void;
  isReducedMotion?: boolean;
}

interface StepConfig {
  segment: 'INVESTIGATION TUTORIAL' | 'CROSS-EXAMINATION TUTORIAL';
  stepNumber: number;
  totalSteps: number;
  instruction: string;
  hint: string;
  badgeColor: string;
}

const STEP_CONFIGS: Record<string, StepConfig> = {
  investigation_select_box: {
    segment: 'INVESTIGATION TUTORIAL',
    stepNumber: 1,
    totalSteps: 5,
    instruction: 'Select the Packaging Box on the coffee table to begin physical inspection.',
    hint: 'Hint: Click the yellow "Packaging Box" button on the glass coffee table in front of Ryan.',
    badgeColor: 'bg-amber-400 text-slate-950'
  },
  investigation_rotate_box: {
    segment: 'INVESTIGATION TUTORIAL',
    stepNumber: 2,
    totalSteps: 5,
    instruction: 'Rotate the box by dragging left/right or clicking the arrow controls to view all angles.',
    hint: 'Hint: Click the left or right arrow buttons below the box preview to switch sides.',
    badgeColor: 'bg-amber-400 text-slate-950'
  },
  investigation_click_point: {
    segment: 'INVESTIGATION TUTORIAL',
    stepNumber: 3,
    totalSteps: 5,
    instruction: 'Click an inspection area (e.g. Front Face, Side Panel, or Tamper Seal) to examine details.',
    hint: 'Hint: Click one of the highlighted inspection buttons on the left, such as "Front Face" or "Left Panel".',
    badgeColor: 'bg-amber-400 text-slate-950'
  },
  investigation_open_box: {
    segment: 'INVESTIGATION TUTORIAL',
    stepNumber: 4,
    totalSteps: 5,
    instruction: 'Click "Break Tamper Seal & Open Box" to inspect the interior contents.',
    hint: 'Hint: Click the yellow "Break Tamper Seal & Open Box" button inside the inspection view.',
    badgeColor: 'bg-amber-400 text-slate-950'
  },
  investigation_record_clue: {
    segment: 'INVESTIGATION TUTORIAL',
    stepNumber: 5,
    totalSteps: 5,
    instruction: 'You\'ve identified an observation! Click "Record Clue in Case File" to save this evidence.',
    hint: 'Hint: Click the yellow "Record Clue in Case File" button at the bottom of the modal.',
    badgeColor: 'bg-amber-400 text-slate-950'
  },
  crossexam_press_statement: {
    segment: 'CROSS-EXAMINATION TUTORIAL',
    stepNumber: 1,
    totalSteps: 5,
    instruction: 'Press Ryan\'s claim statement to question where his confidence originates.',
    hint: 'Hint: Click on Ryan or select his statement to scrutinize his reasoning.',
    badgeColor: 'bg-cyan-400 text-slate-950'
  },
  crossexam_pin_sentence: {
    segment: 'CROSS-EXAMINATION TUTORIAL',
    stepNumber: 2,
    totalSteps: 5,
    instruction: 'Pin Ryan\'s active claim ("Gate 1: The Normal Appearance") for scrutiny.',
    hint: 'Hint: Select "#1 Ryan\'s Claim" in the PINNED CLAIM FOR SCRUTINY header.',
    badgeColor: 'bg-cyan-400 text-slate-950'
  },
  crossexam_open_casefile: {
    segment: 'CROSS-EXAMINATION TUTORIAL',
    stepNumber: 3,
    totalSteps: 5,
    instruction: 'Open your Case File or select a collected evidence card to prepare for presentation.',
    hint: 'Hint: Click the "Case File" button or look at your Collected Quotes section.',
    badgeColor: 'bg-cyan-400 text-slate-950'
  },
  crossexam_select_evidence: {
    segment: 'CROSS-EXAMINATION TUTORIAL',
    stepNumber: 4,
    totalSteps: 5,
    instruction: 'Select your inspected Packaging Box evidence card in your collected notes.',
    hint: 'Hint: Click the "Packaging Box (Sealed Aesthetic)" evidence card card below.',
    badgeColor: 'bg-cyan-400 text-slate-950'
  },
  crossexam_present_evidence: {
    segment: 'CROSS-EXAMINATION TUTORIAL',
    stepNumber: 5,
    totalSteps: 5,
    instruction: 'Click "PRESENT EVIDENCE! [TAKE THAT!]" to confront Ryan and expose the contradiction.',
    hint: 'Hint: Click the yellow "PRESENT EVIDENCE! [TAKE THAT!]" button at the bottom right.',
    badgeColor: 'bg-cyan-400 text-slate-950'
  }
};

export const TutorialGuide: React.FC<TutorialGuideProps> = ({
  step,
  onSkip,
  onOpenHowToPlay,
  isReducedMotion = false
}) => {
  const [showHint, setShowHint] = useState<boolean>(false);

  // 15-second inactivity hint timer
  useEffect(() => {
    setShowHint(false);
    if (step === 'none' || step === 'structure_overview' || step.endsWith('_completed')) {
      return;
    }

    const timer = setTimeout(() => {
      setShowHint(true);
    }, 15000); // 15 seconds of inactivity

    return () => clearTimeout(timer);
  }, [step]);

  const config = STEP_CONFIGS[step];
  if (!config) return null;

  return (
    <div className="w-full max-w-5xl mx-auto my-2 z-40 relative select-none">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: isReducedMotion ? 0.05 : 0.2 }}
        className="p-3 sm:p-3.5 bg-slate-900/95 border-2 border-amber-400 rounded-lg shadow-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center font-black text-amber-400 text-xs shrink-0 mt-0.5">
            {config.stepNumber}/{config.totalSteps}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-display font-black uppercase tracking-wider px-2 py-0.2 rounded ${config.badgeColor}`}>
                {config.segment}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Step {config.stepNumber} of {config.totalSteps}
              </span>
            </div>

            <p className="font-heading font-black text-xs sm:text-sm text-slate-100 leading-snug">
              {config.instruction}
            </p>

            <AnimatePresence>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-amber-300 font-body italic pt-1 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{config.hint}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons: How to Play & Skip Guidance */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {onOpenHowToPlay && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenHowToPlay();
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-[11px] font-display font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1 cursor-pointer"
              title="Open full How to Play guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>How to Play</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onSkip();
            }}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-display font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Disable step-by-step tutorial assistance"
          >
            <span>Skip Guidance</span>
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
