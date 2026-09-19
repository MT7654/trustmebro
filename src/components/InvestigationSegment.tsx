import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Package, 
  Smartphone, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  BookOpen, 
  ArrowRight, 
  FileText, 
  X, 
  BookmarkCheck,
  Eye,
  AlertTriangle,
  Pin,
  Volume2
} from 'lucide-react';
import { Character, EvidenceQuote, InvestigationHotspot, PlayerProfile, TutorialStep } from '../types';
import { CharacterIllustration } from './CharacterIllustration';
import { EvidenceThumbnail } from './EvidenceThumbnail';
import { sound } from '../utils/sound';
import { BoxAndPodInspectionModal } from './inspection/BoxAndPodInspectionModal';
import { PhoneInspectionModal } from './inspection/PhoneInspectionModal';
import { CharacterQuestionModal } from './inspection/CharacterQuestionModal';
import { SpeakerTutorialModal } from './inspection/SpeakerTutorialModal';
import { isInvestigationReady } from '../gameRules';

interface InvestigationSegmentProps {
  characters: Record<string, Character>;
  playerProfile: PlayerProfile;
  hotspots: InvestigationHotspot[];
  collectedEvidence: EvidenceQuote[];
  onCollectEvidence: (quote: EvidenceQuote) => void;
  onProceedToCrossExam: () => void;
  onOpenBriefing?: () => void;
  isReducedMotion?: boolean;
  tutorialStep?: TutorialStep;
  onAdvanceTutorialStep?: (nextStep: TutorialStep) => void;
}

export const InvestigationSegment: React.FC<InvestigationSegmentProps> = ({
  characters,
  playerProfile,
  hotspots,
  collectedEvidence,
  onCollectEvidence,
  onProceedToCrossExam,
  onOpenBriefing,
  isReducedMotion = false,
  tutorialStep = 'none',
  onAdvanceTutorialStep
}) => {
  const [activeModalHotspot, setActiveModalHotspot] = useState<InvestigationHotspot | null>(null);
  const [isCaseFileExpanded, setIsCaseFileExpanded] = useState(false);
  const [isSpeakerOpen, setIsSpeakerOpen] = useState(false);

  const inspectedIds = collectedEvidence.map(e => e.id);
  const essentialCount = collectedEvidence.length;
  const isReadyToConfront = isInvestigationReady(inspectedIds);

  const handleOpenHotspot = (hotspot: InvestigationHotspot) => {
    sound.playClick();
    setActiveModalHotspot(hotspot);
  };

  const handleRecordEvidenceFromModal = (evidence: EvidenceQuote) => {
    onCollectEvidence(evidence);
    setActiveModalHotspot(null);
  };

  return (
    <div className="flex-1 flex flex-col space-y-3 w-full max-w-5xl mx-auto select-none">
      {/* Objective & Investigation Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/55 to-transparent p-3 sm:p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
            <Search className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-display font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                SEGMENT 1: INVESTIGATION
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {essentialCount}/5 Proof Items Discovered
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-heading font-black text-slate-100 mt-1">
              Objective: Find out what everyone is relying on.
            </h2>
            <p className="text-xs text-slate-300 font-body">
              Explore the room from your seat. Inspect objects on the table and question Ryan, Alyssa, and Noah to uncover what they treat as confirmation.
            </p>
          </div>
        </div>

        {/* Case file quick drawer button & status */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => {
              sound.playPaperSlide();
              setIsCaseFileExpanded(!isCaseFileExpanded);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs font-display font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Case File ({essentialCount})</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Room Exploration Stage */}
      <div className="relative w-full h-[470px] sm:h-[540px] bg-slate-950 rounded-[2rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,.55)] flex flex-col justify-between ring-1 ring-white/10">
        {/* Atmospheric Living Room Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950/90 to-black">
          {/* City Window Silhouette */}
          <div className="absolute top-0 right-12 sm:right-24 w-48 sm:w-72 h-32 bg-indigo-950/30 border-b border-x border-slate-800/80 rounded-b flex items-center justify-around opacity-40">
            <div className="w-1 h-full bg-slate-800/40" />
            <div className="w-1 h-full bg-slate-800/40" />
            <div className="absolute bottom-2 left-4 w-2 h-6 bg-yellow-400/20" />
            <div className="absolute bottom-2 left-12 w-3 h-10 bg-blue-400/20" />
            <div className="absolute bottom-2 right-8 w-2 h-8 bg-amber-400/20" />
          </div>

          {/* Ambient Lighting Glows */}
          <div className="absolute top-6 left-8 w-36 h-36 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 h-40 bg-yellow-400/5 blur-[45px] rounded-full pointer-events-none" />
        </div>

        {/* Scene Indicator & Location */}
        <div className="relative z-10 px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xs flex items-center justify-between text-xs font-display">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 uppercase tracking-wider font-bold text-xs">
              RYAN'S HDB LIVING ROOM &bull; 23:00 SGT
            </span>
          </div>
          <span className="text-[11px] text-amber-400/90 font-mono">
            Click glowing hotspots to investigate
          </span>
        </div>

        {/* First-Person Interactive Gathering (Cast & Objects) */}
          <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-10 pb-4">
          {/* Character Staging Tier */}
          <div className="flex items-end justify-around w-full max-w-3xl mx-auto pb-4 gap-4 sm:gap-8">
            {/* Noah (Left Armchair) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenHotspot(hotspots.find(h => h.id === 'talk_noah')!)}
              className="relative flex flex-col items-center group cursor-pointer"
            >
              <div className="relative">
                <CharacterIllustration characterId="noah" expression={characters.noah.currentExpression} size="md" />
                {inspectedIds.includes('quote_noah_relied_ryan') ? (
                  <div className="absolute -top-1 -right-1 bg-emerald-500 text-black p-0.5 rounded-full shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="absolute -top-1 -right-1 bg-amber-400 text-black p-0.5 rounded-full shadow animate-bounce">
                    <MessageCircle className="w-3.5 h-3.5 fill-black" />
                  </div>
                )}
              </div>
              <div className="mt-1 px-2 py-0.5 bg-slate-900/90 border border-slate-700 group-hover:border-amber-400 rounded text-[11px] font-display font-bold text-cyan-300 transition-colors">
                Noah (Armchair)
              </div>
            </motion.button>

            {/* Ryan (Host, Center) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenHotspot(hotspots.find(h => h.id === 'talk_ryan')!)}
              className="relative flex flex-col items-center group cursor-pointer"
            >
              <div className="relative">
                <CharacterIllustration characterId="ryan" expression={characters.ryan.currentExpression} size="md" />
                {inspectedIds.includes('quote_ryan_trusted_seller') ? (
                  <div className="absolute -top-1 -right-1 bg-emerald-500 text-black p-0.5 rounded-full shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="absolute -top-1 -right-1 bg-amber-400 text-black p-0.5 rounded-full shadow animate-bounce">
                    <MessageCircle className="w-3.5 h-3.5 fill-black" />
                  </div>
                )}
              </div>
              <div className="mt-1 px-2.5 py-0.5 bg-slate-900/90 border border-slate-700 group-hover:border-amber-400 rounded text-[11px] font-display font-bold text-amber-300 transition-colors">
                Ryan (Holding Vape)
              </div>
            </motion.button>

            {/* Alyssa (Right Sofa) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenHotspot(hotspots.find(h => h.id === 'talk_alyssa')!)}
              className="relative flex flex-col items-center group cursor-pointer"
            >
              <div className="relative">
                <CharacterIllustration characterId="alyssa" expression={characters.alyssa.currentExpression} size="md" />
                {inspectedIds.includes('quote_alyssa_only_tried') ? (
                  <div className="absolute -top-1 -right-1 bg-emerald-500 text-black p-0.5 rounded-full shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="absolute -top-1 -right-1 bg-amber-400 text-black p-0.5 rounded-full shadow animate-bounce">
                    <MessageCircle className="w-3.5 h-3.5 fill-black" />
                  </div>
                )}
              </div>
              <div className="mt-1 px-2 py-0.5 bg-slate-900/90 border border-slate-700 group-hover:border-purple-400 rounded text-[11px] font-display font-bold text-purple-300 transition-colors">
                Alyssa (On Sofa)
              </div>
            </motion.button>
          </div>

          {/* Foreground Glass Coffee Table with Object Hotspots */}
          <div className="relative w-full bg-gradient-to-b from-slate-700/65 to-slate-950/95 border border-white/10 rounded-[1.4rem] p-2.5 flex items-center justify-around gap-2 shadow-[0_20px_35px_rgba(0,0,0,.45)] overflow-x-auto">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (tutorialStep === 'investigation_select_speaker') onAdvanceTutorialStep?.('investigation_rotate_speaker');
                setIsSpeakerOpen(true);
              }}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left transition shrink-0 ${
                tutorialStep === 'investigation_select_speaker'
                  ? 'bg-cyan-300 text-slate-950 ring-4 ring-cyan-300/30 animate-pulse'
                  : tutorialStep === 'investigation_completed'
                  ? 'bg-slate-800/80 text-slate-400'
                  : 'bg-cyan-950/60 text-cyan-100 hover:bg-cyan-900/70'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <div>
                <div className="text-[11px] font-display font-black uppercase">Portable speaker</div>
                <div className="text-[9px] opacity-75">{tutorialStep === 'investigation_completed' ? 'Music lowered · practice complete' : 'Music is masking the conversation'}</div>
              </div>
            </motion.button>
            {/* Object Hotspot 1: Vape Packaging Box */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                handleOpenHotspot(hotspots.find(h => h.id === 'vape_box') || hotspots.find(h => h.id === 'vape_pod')!);
              }}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded border transition-all cursor-pointer shrink-0 ${
                inspectedIds.includes('item_inspected_box')
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                  : 'bg-amber-950/60 hover:bg-amber-900/80 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              }`}
            >
              <Package className="w-4 h-4 shrink-0 text-amber-400" />
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-display font-black uppercase">
                  Packaging Box
                </div>
                <div className="text-[9px] text-slate-400">
                  {inspectedIds.includes('item_inspected_box') ? '✓ Inspected' : 'Inspect box & seals'}
                </div>
              </div>
            </motion.button>

            {/* Object Hotspot 2: Vape Cartridge Pod */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenHotspot(hotspots.find(h => h.id === 'vape_pod')!)}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded border transition-all cursor-pointer shrink-0 ${
                inspectedIds.includes('item_unmarked_foil_pod')
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                  : 'bg-amber-950/60 hover:bg-amber-900/80 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              }`}
            >
              <Eye className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-display font-black uppercase">
                  Vape Cartridge Pod
                </div>
                <div className="text-[9px] text-slate-400">
                  {inspectedIds.includes('item_unmarked_foil_pod') ? '✓ Examined' : 'Examine pod hardware'}
                </div>
              </div>
            </motion.button>

            {/* Object Hotspot 3: Ryan's seller chat */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenHotspot(hotspots.find(h => h.id === 'telegram_phone')!)}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded border transition-all cursor-pointer shrink-0 ${
                inspectedIds.includes('item_telegram_chat_log')
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                  : 'bg-cyan-950/60 hover:bg-cyan-900/80 border-cyan-500 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
              }`}
            >
              <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-display font-black uppercase">
                  Ryan's Phone Screen
                </div>
                <div className="text-[9px] text-slate-400">
                  {inspectedIds.includes('item_telegram_chat_log') ? '✓ Checked' : 'Read seller chat'}
                </div>
              </div>
            </motion.button>
          </div>

        </div>

        {/* Bottom Status bar with player badge & confrontation trigger */}
        <div className="relative z-10 h-10 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between text-xs font-display">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">
              <div className="w-3.5 h-3.5 rounded-full overflow-hidden bg-slate-800 shrink-0">
                <CharacterIllustration
                  characterId="player"
                  playerGender={playerProfile.gender}
                  expression="neutral"
                  size="sm"
                  className="w-3.5 h-3.5"
                />
              </div>
              <span className="font-bold text-amber-400">{playerProfile.name}</span>
              <span className="text-[10px] text-slate-400">(Your Seat)</span>
            </div>
            <span className="text-slate-500 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Examining the group's source chain before speaking up
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-300">
            {isReadyToConfront ? (
              <span className="text-emerald-400 font-bold animate-pulse">
                ✓ Ready to confront the room
              </span>
            ) : (
              <span>Need {Math.max(0, 4 - essentialCount)} more clue{4 - essentialCount > 1 ? 's' : ''} to confront</span>
            )}
          </div>
        </div>
      </div>

      {/* Challenge / Confrontation Transition Callout when ready */}
      {isReadyToConfront && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 sm:p-4 bg-amber-950/90 border-2 border-amber-400 rounded-lg shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0 font-black text-base shadow">
              !
            </div>
            <div>
              <div className="font-heading font-black text-xs sm:text-sm text-amber-300 uppercase tracking-wide">
                Ryan & Noah notice you looking closely at the table...
              </div>
              <div className="text-xs text-slate-200 font-body">
                “Bro, you've been checking your phone and staring at the pod for two minutes. Found something to say or are you just stalling?”
              </div>
            </div>
          </div>

          <button
            id="proceed-to-cross-examination-btn"
            onClick={() => {
              sound.playObjection();
              onProceedToCrossExam();
            }}
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-xs sm:text-sm uppercase tracking-wider rounded border border-white shadow-lg transition-transform hover:scale-103 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Flame className="w-4 h-4 fill-black" />
            <span>Confront the Group (Cross-Examination)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Case File Expanded Drawer / Panel */}
      <AnimatePresence>
        {isSpeakerOpen && (
          <SpeakerTutorialModal
            isOpen
            onClose={() => setIsSpeakerOpen(false)}
            tutorialStep={tutorialStep}
            onAdvanceTutorialStep={step => onAdvanceTutorialStep?.(step)}
            isReducedMotion={isReducedMotion}
          />
        )}
        {isCaseFileExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 shadow-xl space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading font-black text-sm uppercase text-slate-100">
                  Current Case File: What the Group is Relying On
                </h3>
              </div>
              <button
                onClick={() => setIsCaseFileExpanded(false)}
                className="text-slate-400 hover:text-white text-xs font-display uppercase cursor-pointer"
              >
                Close File ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {collectedEvidence.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded flex gap-3"
                >
                  <div className="shrink-0">
                    <EvidenceThumbnail
                      type={item.thumbnailType || (item.category === 'physical' ? 'pod' : item.category === 'digital' ? 'phone' : 'ryan')}
                      size="sm"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9px] font-display font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                          {item.category?.toUpperCase() || 'EVIDENCE'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.speakerName}
                        </span>
                      </div>
                      <h4 className="text-xs font-heading font-black text-slate-200 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-body mt-1 line-clamp-2">
                        {item.neutralDescription || item.quote}
                      </p>
                    </div>
                    {item.itemDetails && (
                      <div className="text-[9px] text-amber-300/90 font-display bg-slate-900/90 p-1 rounded border border-slate-800 mt-1.5">
                        {item.itemDetails}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2.5D Interactive Inspection & Inquiry Modals */}
      <AnimatePresence>
        {activeModalHotspot && (activeModalHotspot.id === 'vape_pod' || activeModalHotspot.id === 'vape_box') && (
          <BoxAndPodInspectionModal
            isOpen={true}
            onClose={() => setActiveModalHotspot(null)}
            onRecordClue={handleRecordEvidenceFromModal}
            isAlreadyRecorded={inspectedIds.includes(activeModalHotspot.evidenceId)}
            playerProfile={playerProfile}
            isReducedMotion={isReducedMotion}
          />
        )}

        {activeModalHotspot && activeModalHotspot.id === 'telegram_phone' && (
          <PhoneInspectionModal
            isOpen={true}
            onClose={() => setActiveModalHotspot(null)}
            onRecordClue={handleRecordEvidenceFromModal}
            isAlreadyRecorded={inspectedIds.includes('item_telegram_chat_log')}
            playerProfile={playerProfile}
            isReducedMotion={isReducedMotion}
          />
        )}

        {activeModalHotspot && activeModalHotspot.id.startsWith('talk_') && (
          <CharacterQuestionModal
            isOpen={true}
            onClose={() => setActiveModalHotspot(null)}
            character={
              activeModalHotspot.id === 'talk_noah'
                ? characters.noah
                : activeModalHotspot.id === 'talk_alyssa'
                ? characters.alyssa
                : characters.ryan
            }
            onRecordClue={handleRecordEvidenceFromModal}
            isAlreadyRecorded={inspectedIds.includes(activeModalHotspot.evidenceId)}
            playerProfile={playerProfile}
            isReducedMotion={isReducedMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
