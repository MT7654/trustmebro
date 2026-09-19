import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  BookmarkCheck, 
  HelpCircle, 
  Sparkles, 
  Check, 
  ChevronRight,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { Character, CharacterExpression, EvidenceQuote, PlayerProfile } from '../../types';
import { CharacterIllustration } from '../CharacterIllustration';
import { sound } from '../../utils/sound';

interface CharacterQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onRecordClue: (quote: EvidenceQuote) => void;
  isAlreadyRecorded: boolean;
  playerProfile: PlayerProfile;
  isReducedMotion?: boolean;
}

interface QuestionOption {
  id: string;
  questionLabel: string;
  responseDialogue: string;
  expression: CharacterExpression;
  isKeyTestimony?: boolean;
  targetQuoteId: string;
  playerReflection: string;
}

const CHARACTER_QUESTIONS: Record<string, QuestionOption[]> = {
  noah: [
    {
      id: 'noah_q1',
      questionLabel: '“Why did you tell everyone Alyssa verified what was inside?”',
      responseDialogue: '“Well... she took two puffs right in front of us and didn’t cough. I don’t vape myself, so I just figured if she took a hit and Ryan was chill, it must be safe.”',
      expression: 'skeptical',
      isKeyTestimony: true,
      targetQuoteId: 'quote_noah_relied_ryan',
      playerReflection: '“Notice what Noah just admitted: he has zero firsthand knowledge. He assumed Alyssa checked it, but Alyssa only took a puff because she assumed Ryan checked it!”'
    },
    {
      id: 'noah_q2',
      questionLabel: '“Do you know what chemical compounds are in this vape liquid?”',
      responseDialogue: '“Zero idea, bro. I know as much chemistry as my cat. That’s why I was just backing Ryan’s judgment.”',
      expression: 'neutral',
      targetQuoteId: '',
      playerReflection: '“Noah openly admits he knows nothing about the liquid contents. He is purely repeating social trust.”'
    },
    {
      id: 'noah_q3',
      questionLabel: '“How long have you known Ryan?”',
      responseDialogue: '“Since secondary school! We’ve hung out every weekend. That’s why I didn’t question him when he brought the pod over.”',
      expression: 'smiling',
      targetQuoteId: '',
      playerReflection: '“Their long friendship explains why Noah feels comfortable, but personal friendship is not chemical verification.”'
    }
  ],
  alyssa: [
    {
      id: 'alyssa_q1',
      questionLabel: '“Did you actually check or inspect what was inside before taking a puff?”',
      responseDialogue: '“No, I didn’t inspect or test anything! Ryan handed it to me saying it was sweet peach, so I just took two hits. I assumed Ryan checked it beforehand!”',
      expression: 'worried',
      isKeyTestimony: true,
      targetQuoteId: 'quote_alyssa_only_tried',
      playerReflection: '“Critical admission: Alyssa never inspected the cartridge. Taking two puffs is not verification—she relied entirely on the assumption that Ryan verified it.”'
    },
    {
      id: 'alyssa_q2',
      questionLabel: '“How are you feeling physically right now?”',
      responseDialogue: '“Actually... my forehead feels super heavy, and my fingertips are tingling. It took about 10 minutes to kick in. I don’t feel like myself.”',
      expression: 'worried',
      isKeyTestimony: false,
      targetQuoteId: 'quote_alyssa_onset_chill',
      playerReflection: '“Delayed physical sensation. The latency of untested synthetic compounds can fool people into thinking they feel normal for the first few minutes.”'
    },
    {
      id: 'alyssa_q3',
      questionLabel: '“Did Ryan mention where he acquired this cartridge?”',
      responseDialogue: '“He just said he got it through a contact online. He didn’t show me any brand name or paperwork.”',
      expression: 'neutral',
      targetQuoteId: '',
      playerReflection: '“Alyssa confirms Ryan provided no paperwork or verifiable merchant details.”'
    }
  ],
  ryan: [
    {
      id: 'ryan_q1',
      questionLabel: '“What specific lab results or certificates did your seller show you?”',
      responseDialogue: '“Look, I went by what he told me in chat! He said \'100% legit pure peach bro trust me\'. He didn’t show me any lab sheet or certificate for this batch, but why would he lie to a repeat customer?”',
      expression: 'defensive',
      isKeyTestimony: true,
      targetQuoteId: 'quote_ryan_trusted_seller',
      playerReflection: '“Direct admission: Ryan has zero test sheets, zero batch verification, and zero lab results. He relied solely on a one-line casual chat text from an anonymous seller.”'
    },
    {
      id: 'ryan_q2',
      questionLabel: '“Why did you claim there are \'three separate confirmations\'?”',
      responseDialogue: '“Because Noah backed me up, Alyssa tried it without complaints, and my seller vouched for it! That’s three people saying it’s good, right?!”',
      expression: 'smiling',
      targetQuoteId: '',
      playerReflection: '“Ryan is treating Alyssa and Noah as independent confirmations, ignoring that both were simply relying on his own word!”'
    },
    {
      id: 'ryan_q3',
      questionLabel: '“Can you contact this seller if someone has an adverse reaction?”',
      responseDialogue: '“It was an unverified handle with no real name attached... but come on, nobody’s having an adverse reaction!”',
      expression: 'alarmed',
      targetQuoteId: 'quote_telegram_anonymous',
      playerReflection: '“The seller is completely anonymous and unaccountable. There is no recourse if the substance is adulterated.”'
    }
  ]
};

export const CharacterQuestionModal: React.FC<CharacterQuestionModalProps> = ({
  isOpen,
  onClose,
  character,
  onRecordClue,
  isAlreadyRecorded,
  playerProfile,
  isReducedMotion = false
}) => {
  const questions = CHARACTER_QUESTIONS[character.id] || [];
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [currentExpression, setCurrentExpression] = useState<CharacterExpression>(character.currentExpression);
  const [currentResponse, setCurrentResponse] = useState<string>(character.initialStatement);
  const [currentReflection, setCurrentReflection] = useState<string>(
    `“Let me ask ${character.name} a few targeted questions to understand what they're basing their confidence on.”`
  );
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedQuestionId(null);
      setCurrentExpression(character.currentExpression);
      setCurrentResponse(character.initialStatement);
      setCurrentReflection(
        `“Let me ask ${character.name} a few targeted questions to understand what they're basing their confidence on.”`
      );
      setActiveQuoteId(null);
    }
  }, [isOpen, character]);

  if (!isOpen) return null;

  const handleSelectQuestion = (q: QuestionOption) => {
    sound.playClick();
    setSelectedQuestionId(q.id);
    setCurrentExpression(q.expression);
    setCurrentResponse(q.responseDialogue);
    setCurrentReflection(q.playerReflection);
    setActiveQuoteId(q.targetQuoteId || null);
  };

  const handleRecordClueClick = () => {
    if (!activeQuoteId) return;
    sound.playRecordClue();
    import('../../data/gameData').then(({ ALL_DISCOVERABLE_QUOTES }) => {
      const evidence = ALL_DISCOVERABLE_QUOTES[activeQuoteId];
      if (evidence) {
        onRecordClue(evidence);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        transition={{ duration: isReducedMotion ? 0.05 : 0.2 }}
        className="bg-slate-900 border-2 border-purple-400 text-slate-100 rounded-xl max-w-xl w-full p-4 sm:p-5 shadow-2xl flex flex-col space-y-3.5 max-h-[95vh] overflow-y-auto"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-400 shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-display font-black uppercase px-2 py-0.5 rounded bg-purple-400 text-slate-950">
                  VERBAL INQUIRY
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {character.role}
                </span>
              </div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-100">
                Questioning {character.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Inquiry"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Character Visual & Dialogue Bubble */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-start gap-4 shadow-inner">
          <div className="flex flex-col items-center shrink-0">
            <CharacterIllustration
              characterId={character.id}
              expression={currentExpression}
              size="md"
            />
            <span className="mt-1 px-2 py-0.5 rounded text-[10px] font-display font-bold bg-slate-900 border border-slate-700 text-purple-300">
              {character.name}
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              {character.name}'s Response:
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-body leading-relaxed">
              {currentResponse}
            </p>
          </div>
        </div>

        {/* Question Selector List */}
        <div className="space-y-2">
          <div className="text-[11px] font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Select a question to ask:</span>
          </div>

          <div className="space-y-1.5">
            {questions.map((q) => {
              const isSelected = selectedQuestionId === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-purple-950/80 border-purple-400 text-purple-100 shadow-md ring-1 ring-purple-400/40'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="font-body leading-snug">{q.questionLabel}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-purple-300 translate-x-0.5' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Player Character Reflection Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-3 shadow-inner">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-amber-400/50 shrink-0 mt-0.5">
            <CharacterIllustration
              characterId="player"
              playerGender={playerProfile.gender}
              expression={activeQuoteId ? 'skeptical' : 'neutral'}
              size="sm"
              className="w-8 h-8"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-black text-amber-400">
                {playerProfile.name}'s Deductive Take:
              </span>
              {activeQuoteId && (
                <span className="text-[10px] font-mono font-bold bg-purple-400 text-slate-950 px-1.5 py-0.2 rounded">
                  KEY TESTIMONY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 font-body mt-0.5 leading-relaxed italic">
              {currentReflection}
            </p>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-display uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer"
          >
            Finished Talking
          </button>

          {/* Active Record Clue Button */}
          {activeQuoteId ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRecordClueClick}
              className="px-4 py-2 bg-purple-400 hover:bg-purple-300 text-slate-950 font-heading font-black text-xs uppercase tracking-wider rounded border border-white flex items-center gap-2 shadow-[0_0_15px_rgba(192,132,252,0.4)] cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-slate-950" />
              <span>RECORD TESTIMONY IN CASE FILE</span>
            </motion.button>
          ) : (
            <div className="text-[11px] text-slate-400 font-mono italic">
              Ask questions to reveal what {character.name} is relying on...
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
