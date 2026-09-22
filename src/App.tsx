import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INITIAL_CHARACTERS, 
  INITIAL_PINNED_CLAIMS, 
  TESTIMONY_STEPS, 
  GAME_ENDINGS,
  INVESTIGATION_HOTSPOTS
} from './data/gameData';
import { 
  CharacterId, 
  Character, 
  EvidenceQuote, 
  PinnedClaim, 
  PressInquiry, 
  GameEnding, 
  CaseCard, 
  EndingType, 
  PlayerProfile,
  InvestigationHotspot,
  TutorialStep 
} from './types';
import { TitleScreen } from './components/TitleScreen';
import { CharacterSetup } from './components/CharacterSetup';
import { StoryIntro } from './components/StoryIntro';
import { InvestigationSegment } from './components/InvestigationSegment';
import { RoomBackground } from './components/RoomBackground';
import { Navbar } from './components/Navbar';
import { DialogueBox } from './components/DialogueBox';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { BreakthroughModal } from './components/BreakthroughModal';
import { AhaCutIn } from './components/AhaCutIn';
import { TrustGraphModal } from './components/TrustGraphModal';
import { EndingModal } from './components/EndingModal';
import { CaseBriefingModal } from './components/CaseBriefingModal';
import { LostExchangeModal } from './components/LostExchangeModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CrossExamPractice } from './components/CrossExamPractice';
import { DisplayModePrompt } from './components/DisplayModePrompt';
import { useFullscreen } from './hooks/useFullscreen';
import { canAddObjectToEvidenceInventory, canChallengeFinalGate, canUnlockFinalGate, getFinalGateEvidenceProgress, getInvestigationClueLesson, REQUIRED_INVESTIGATION_EVIDENCE_IDS } from './gameRules';
import { sound } from './utils/sound';
import { music } from './utils/music';
import { AlertTriangle, Network, ShieldCheck, Flame, Info, Sparkles, Pin, Bookmark, Quote, Swords } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<'title' | 'display' | 'setup' | 'intro' | 'investigation' | 'crossexam'>('title');
  const [hasSeenDisplayPrompt,setHasSeenDisplayPrompt]=useState(false);
  const fullscreen=useFullscreen();
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({ name: 'Sam', gender: 'male' });
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(() => music.isEnabled());

  // Tutorial state
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('none');
  const [isTutorialEnabled, setIsTutorialEnabled] = useState<boolean>(true);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isCrossExamPracticeOpen, setIsCrossExamPracticeOpen] = useState(false);
  const [pendingCrossExamPractice, setPendingCrossExamPractice] = useState(false);
  const [hasUsedReconsideration, setHasUsedReconsideration] = useState(false);
  const [canonicalEndingType, setCanonicalEndingType] = useState<EndingType | null>(null);

  useEffect(() => {
    if (gameState === 'investigation') music.play('investigation');
    else if (gameState === 'crossexam') music.play('courtroom');
    else music.play('none');
  }, [gameState]);

  useEffect(() => {
    const resume = () => music.resume();
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
    return () => { window.removeEventListener('pointerdown', resume); window.removeEventListener('keydown', resume); };
  }, [gameState, isMusicEnabled]);

  const [characters, setCharacters] = useState<Record<string, Character>>(INITIAL_CHARACTERS);
  const [pinnedClaims, setPinnedClaims] = useState<PinnedClaim[]>(INITIAL_PINNED_CLAIMS);
  const [activeClaimId, setActiveClaimId] = useState<string>('claim_ryan_appearance');
  const [collectedQuotes, setCollectedQuotes] = useState<EvidenceQuote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [selectedFinalQuoteIds, setSelectedFinalQuoteIds] = useState<string[]>([]);

  const [hotspots, setHotspots] = useState<InvestigationHotspot[]>(INVESTIGATION_HOTSPOTS);

  const [selectedCharacterId, setSelectedCharacterId] = useState<CharacterId>('ryan');
  const [lastReactionText, setLastReactionText] = useState<string | null>(null);
  const [lastDialogueLead, setLastDialogueLead] = useState<string | null>(null);
  const [recentlyCollectedQuote, setRecentlyCollectedQuote] = useState<EvidenceQuote | null>(null);
  const [mismatchFeedback, setMismatchFeedback] = useState<string | null>(null);

  // 3-Attempt Evidence System: Track misses & presented combinations per exchange
  const [exchangeMisses, setExchangeMisses] = useState<Record<string, number>>({});
  const [presentedQuotesByClaim, setPresentedQuotesByClaim] = useState<Record<string, string[]>>({});
  const [isLostExchangeModalOpen, setIsLostExchangeModalOpen] = useState<boolean>(false);
  
  // Modals & Cinematic Triggers
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState<boolean>(false);
  const [activeBreakthrough, setActiveBreakthrough] = useState<{ claim: PinnedClaim } | null>(null);
  const [isAhaCutInActive, setIsAhaCutInActive] = useState<boolean>(false);
  const [cutInCustomText, setCutInCustomText] = useState<string>('AHA!');
  const [cutInSubtitle, setCutInSubtitle] = useState<string | undefined>(undefined);
  const [cutInVariant, setCutInVariant] = useState<'breakthrough' | 'clue'>('breakthrough');
  const [activeEnding, setActiveEnding] = useState<GameEnding | null>(null);
  const [isTrustGraphOpen, setIsTrustGraphOpen] = useState<boolean>(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(false);

  // Check if all primary contradictions are resolved
  const solvedCount = pinnedClaims.filter(c => c.isCorrected).length;
  const canBreakLoop = pinnedClaims.every(c => c.isCorrected);
  const isFinalGateUnlocked = canUnlockFinalGate(pinnedClaims.filter(c => c.isCorrected).map(c => c.id));

  // Handle collecting evidence during the Investigation segment
  const handleCollectInvestigationEvidence = (quote: EvidenceQuote) => {
    if (!canAddObjectToEvidenceInventory(quote.id)) return;
    const clueLesson = getInvestigationClueLesson(quote.id, collectedQuotes.map(item => item.id));
    sound.playPaperSlide();
    setCollectedQuotes(prev => {
      if (prev.some(q => q.id === quote.id)) return prev;
      return [...prev, quote];
    });
    setHotspots(prev =>
      prev.map(h => (h.evidenceId === quote.id ? { ...h, isInspected: true } : h))
    );

    if (clueLesson) {
      setCutInCustomText('AHA!');
      setCutInSubtitle(clueLesson);
      setCutInVariant('clue');
      setIsAhaCutInActive(true);
    }
  };

  // Handle proceeding from Investigation to Cross-Examination
  const handleProceedToCrossExam = () => {
    sound.playObjection();
    setCutInCustomText('CONFRONT THE GROUP!');
    setCutInSubtitle('THE ROOM IS READY TO HEAR THE EVIDENCE');
    setCutInVariant('breakthrough');
    setIsAhaCutInActive(true);
    setGameState('crossexam');
    setSelectedCharacterId('ryan');
    setActiveClaimId('claim_ryan_appearance');
    if (isTutorialEnabled && tutorialStep !== 'crossexam_completed') setPendingCrossExamPractice(true);
  };

  // Handle Pressing an inquiry on a character
  const handlePressInquiry = (inquiry: PressInquiry) => {
    sound.playDramaticHit();

    // Update reaction text & internal thoughts
    setLastReactionText(inquiry.speakerResponse);
    setLastDialogueLead(inquiry.internalThought || null);

    // Update facial expression
    if (inquiry.speakerExpression) {
      setCharacters(prev => ({
        ...prev,
        [selectedCharacterId]: {
          ...prev[selectedCharacterId],
          currentExpression: inquiry.speakerExpression
        }
      }));
    }

    // Check if inquiry awards an exact quote
    if (inquiry.grantsQuote) {
      const quote = inquiry.grantsQuote;
      setCollectedQuotes(prev => {
        const alreadyHas = prev.some(q => q.id === quote.id);
        if (!alreadyHas) {
          sound.playPaperSlide();
          return [...prev, quote];
        }
        return prev;
      });
      setRecentlyCollectedQuote(quote);
    } else {
      setRecentlyCollectedQuote(null);
    }
  };

  // Handle Presenting Evidence against the Pinned Claim
  const handlePresentQuote = () => {
    const claim = pinnedClaims.find(c => c.id === activeClaimId);
    const isFinalGate = claim?.id === 'claim_ryan_confirmations';
    const quote = collectedQuotes.find(q => q.id === selectedQuoteId);

    if (!claim || (!quote && !isFinalGate)) return;
    if (isFinalGate && !isFinalGateUnlocked) {
      setMismatchFeedback('Resolve the first three claims before tracing the final reassurance chain.');
      return;
    }

    if (isFinalGate) {
      const progress = getFinalGateEvidenceProgress(selectedFinalQuoteIds);
      if (!canChallengeFinalGate(selectedFinalQuoteIds)) {
        const missing = [!progress.noah && 'Noah', !progress.alyssa && 'Alyssa', !progress.ryan && 'Ryan'].filter(Boolean).join(', ');
        setMismatchFeedback(`Trace every voice in the claim. Still missing: ${missing}.`);
        return;
      }
    }

    // Guard: Prevent re-submitting an already presented combination in this exchange
    const alreadyPresented = !isFinalGate && quote ? (presentedQuotesByClaim[claim.id] || []).includes(quote.id) : false;
    if (alreadyPresented) {
      sound.playShock();
      setMismatchFeedback(`You already presented this item against "${claim.originalText}". It was insufficient.`);
      return;
    }

    const isTargetMatch = isFinalGate ? true : claim.targetQuoteIds
      ? claim.targetQuoteIds.includes(quote!.id)
      : (quote!.id === claim.targetQuoteId);

    if (isTargetMatch) {
      // SUCCESSFUL CONTRADICTION!
      sound.playTakeThat();
      setIsEvidenceDrawerOpen(false);
      setSelectedQuoteId(null);

      // Mark claim as corrected
      setPinnedClaims(prev =>
        prev.map(c => (c.id === claim.id ? { ...c, isCorrected: true } : c))
      );
      if (isFinalGate) setSelectedFinalQuoteIds([]);

      // Trigger "AHA!" / "OBJECTION!" cut-in animation
      setCutInCustomText('AHA!');
      setCutInSubtitle('CIRCULAR TRUST LOOP DETECTED');
      setCutInVariant('breakthrough');
      setIsAhaCutInActive(true);

      // Change character expression to shocked/defensive
      setCharacters(prev => ({
        ...prev,
        [claim.speakerId]: {
          ...prev[claim.speakerId],
          currentExpression: 'shocked'
        }
      }));

      // Open Breakthrough modal after Aha cut-in
      setTimeout(() => {
        setActiveBreakthrough({ claim });
      }, 700);

      // Reset misses for this claim
      setExchangeMisses(prev => ({ ...prev, [claim.id]: 0 }));
      setMismatchFeedback(null);
    } else {
      // MISMATCH: Record miss and track presented combination
      sound.playBuzzer();

      if (!quote) return;
      const newMissCount = (exchangeMisses[claim.id] || 0) + 1;
      setExchangeMisses(prev => ({ ...prev, [claim.id]: newMissCount }));

      setPresentedQuotesByClaim(prev => ({
        ...prev,
        [claim.id]: [...(prev[claim.id] || []), quote.id]
      }));

      // Generate contextual feedback from the speaker
      const speakerChar = characters[claim.speakerId];
      const feedback =
        claim.mismatchReplies?.[quote.id] ||
        `${speakerChar.name} shakes their head: "That evidence doesn't contradict '${claim.keyWordOriginal}'. Look for an admission that proves where the information actually came from."`;
      setMismatchFeedback(feedback);

      // Check if player exhausted all 3 attempts
      if (newMissCount >= 3) {
        sound.playBuzzer();
        setIsLostExchangeModalOpen(true);
      }
    }
  };

  // Retry exchange: resets miss counter and presented quotes for this specific claim
  const handleRetryExchange = (claimId: string) => {
    sound.playClick();
    setExchangeMisses(prev => ({ ...prev, [claimId]: 0 }));
    setPresentedQuotesByClaim(prev => ({ ...prev, [claimId]: [] }));
    setMismatchFeedback(null);
    setIsLostExchangeModalOpen(false);
  };

  // Close breakthrough modal
  const handleCloseBreakthrough = () => {
    sound.playClick();
    setActiveBreakthrough(null);
    setRecentlyCollectedQuote(null);
    setLastReactionText(null);
    setLastDialogueLead(null);

    // Auto-advance claim if another remains unsolved
    const nextUnsolved = pinnedClaims.find(c => !c.isCorrected);
    if (nextUnsolved) {
      setActiveClaimId(nextUnsolved.id);
      setSelectedCharacterId(nextUnsolved.speakerId);
      setSelectedQuoteId(null);
    }
  };

  // Selecting a character to cross-examine
  const handleSelectCharacter = (id: CharacterId) => {
    sound.playClick();
    setSelectedCharacterId(id);
    setLastReactionText(null);
    setLastDialogueLead(null);
    setRecentlyCollectedQuote(null);
    setMismatchFeedback(null);

    // Auto-select corresponding pinned claim if present
    const matchingClaim = pinnedClaims.find(c => c.speakerId === id);
    if (matchingClaim) {
      if (matchingClaim.id !== activeClaimId) {
        setSelectedQuoteId(null);
        setSelectedFinalQuoteIds([]);
      }
      setActiveClaimId(matchingClaim.id);
    }
  };

  // Selecting a claim to focus on
  const handleSelectClaim = (claimId: string) => {
    if (claimId === 'claim_ryan_confirmations' && !isFinalGateUnlocked) {
      setMismatchFeedback('Final gate locked: resolve the first three claims, then trace each reassurance to its source.');
      return;
    }
    sound.playClick();
    if (claimId !== activeClaimId) {
      setSelectedQuoteId(null);
      setSelectedFinalQuoteIds([]);
    }
    setActiveClaimId(claimId);
    const claim = pinnedClaims.find(c => c.id === claimId);
    if (claim) {
      setSelectedCharacterId(claim.speakerId);
      setLastReactionText(null);
      setLastDialogueLead(null);
      setRecentlyCollectedQuote(null);
    }
  };

  // Return to base statement
  const handleResetToTestimony = () => {
    sound.playClick();
    setLastReactionText(null);
    setLastDialogueLead(null);
    setRecentlyCollectedQuote(null);
  };

  // Final Response Decision
  const handleSelectFinalResponse = (endingType: EndingType) => {
    if (!canonicalEndingType) setCanonicalEndingType(endingType);
    const ending = GAME_ENDINGS[endingType];
    setActiveEnding(ending);
  };

  // Toggle Sound Mute
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Toggle Reduced Motion
  const handleToggleReducedMotion = () => {
    setIsReducedMotion(prev => !prev);
  };

  const handleToggleMusic = () => setIsMusicEnabled(music.setEnabled(!isMusicEnabled));

  const handleAdvanceTutorial = (next: TutorialStep) => {
    setTutorialStep(next);
    if (next === 'investigation_completed') {
      music.duck(true);
      setCutInCustomText('AHA!');
      setCutInSubtitle('PRACTICE COMPLETE — IMPORTANT OBSERVATIONS CAN BE RECORDED');
      setCutInVariant('clue');
      setIsAhaCutInActive(true);
    }
  };

  // Restart Investigation
  const handleRestart = () => {
    sound.playClick();
    setCharacters(INITIAL_CHARACTERS);
    setPinnedClaims(INITIAL_PINNED_CLAIMS);
    setActiveClaimId('claim_ryan_appearance');
    setCollectedQuotes([]);
    setHotspots(INVESTIGATION_HOTSPOTS);
    setSelectedQuoteId(null);
    setSelectedFinalQuoteIds([]);
    setSelectedCharacterId('ryan');
    setLastReactionText(null);
    setLastDialogueLead(null);
    setRecentlyCollectedQuote(null);
    setMismatchFeedback(null);
    setExchangeMisses({});
    setPresentedQuotesByClaim({});
    setSelectedFinalQuoteIds([]);
    setActiveEnding(null);
    setHasUsedReconsideration(false);
    setCanonicalEndingType(null);
    setIsCrossExamPracticeOpen(false);
    setPendingCrossExamPractice(false);
    setIsLostExchangeModalOpen(false);
    setIsTutorialEnabled(true);
    setTutorialStep('none');
    setGameState('title');
  };

  // 1. If on Title Screen, render TitleScreen component
  if (gameState === 'title') {
    return (
      <TitleScreen
        onStartGame={() => {
          sound.playDramaticHit();
          setGameState(hasSeenDisplayPrompt?'setup':'display');
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isReducedMotion={isReducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />
    );
  }

  if(gameState==='display') return <DisplayModePrompt isSupported={fullscreen.isSupported} onEnterFullscreen={fullscreen.enter} onContinue={()=>{setHasSeenDisplayPrompt(true);setGameState('setup');}}/>;

  // 2. Character Setup Screen (Avatar & Name Selection)
  if (gameState === 'setup') {
    return (
      <CharacterSetup
        onComplete={(profile) => {
          setPlayerProfile(profile);
          setGameState('intro');
        }}
        onBackToTitle={() => setGameState('title')}
        isReducedMotion={isReducedMotion}
      />
    );
  }

  // 3. Cinematic Story Introduction (Singapore Social Setting)
  if (gameState === 'intro') {
    return (
      <StoryIntro
        playerProfile={playerProfile}
        onStartInvestigation={() => {
          setGameState('investigation');
          setTutorialStep(isTutorialEnabled ? 'investigation_select_speaker' : 'none');
        }}
        onBackToSetup={() => setGameState('setup')}
        isReducedMotion={isReducedMotion}
      />
    );
  }

  const activeCharacter = characters[selectedCharacterId];
  const activeTestimony = TESTIMONY_STEPS[selectedCharacterId];
  const activePinnedClaim = pinnedClaims.find(c => c.id === activeClaimId) || pinnedClaims[0];

  return (
    <div className="h-dvh overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-body selection:bg-amber-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        onOpenGraph={() => setIsTrustGraphOpen(true)}
        onOpenHelp={() => setIsHowToPlayOpen(true)}
        onReturnToTitle={() => setGameState('title')}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isMusicEnabled={isMusicEnabled}
        onToggleMusic={handleToggleMusic}
        isReducedMotion={isReducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        discoveredCluesCount={gameState === 'investigation'
          ? REQUIRED_INVESTIGATION_EVIDENCE_IDS.filter(id => collectedQuotes.some(quote => quote.id === id)).length
          : solvedCount}
        totalClues={gameState === 'investigation' ? REQUIRED_INVESTIGATION_EVIDENCE_IDS.length : pinnedClaims.length}
        canObject={canBreakLoop}
        isFullscreen={fullscreen.isFullscreen}
        onToggleFullscreen={fullscreen.toggle}
      />

      {/* Main Playable Stage by Segment */}
      <main className="min-h-0 flex-1 max-w-7xl w-full mx-auto px-2 py-2 sm:px-5 sm:py-3 flex flex-col gap-2 overflow-hidden">
        {gameState === 'investigation' ? (
          /* SEGMENT 1: First-Person Investigation */
          <InvestigationSegment
            characters={characters}
            playerProfile={playerProfile}
            hotspots={hotspots}
            collectedEvidence={collectedQuotes}
            onCollectEvidence={handleCollectInvestigationEvidence}
            onProceedToCrossExam={handleProceedToCrossExam}
            onOpenBriefing={() => setIsBriefingOpen(true)}
            isReducedMotion={isReducedMotion}
            tutorialStep={tutorialStep}
            onAdvanceTutorialStep={handleAdvanceTutorial}
          />
        ) : (
          /* SEGMENT 2: Tense Cross-Examination */
          <div className="courtroom-stage-grid grid min-h-0 flex-1 grid-rows-[clamp(220px,34dvh,320px)_minmax(0,1fr)] gap-2">
            {/* Stage Banner: Pinned Living Room Scene with Active Witness Focus */}
            <RoomBackground
              characters={characters}
              selectedCharacterId={selectedCharacterId}
              onSelectCharacter={handleSelectCharacter}
              solvedGatesCount={solvedCount}
              exchangeMisses={exchangeMisses[activePinnedClaim.id] || 0}
              playerProfile={playerProfile}
              isReducedMotion={isReducedMotion}
            />

            {/* Cross-Examination Dialogue & Evidence Presentation Box */}
            <DialogueBox
              activeCharacter={activeCharacter}
              testimony={activeTestimony}
              onPressInquiry={handlePressInquiry}
              canBreakLoop={canBreakLoop}
              lastReactionText={lastReactionText}
              lastDialogueLead={lastDialogueLead}
              recentlyCollectedQuote={recentlyCollectedQuote}
              onResetToTestimony={handleResetToTestimony}
              activeClaim={activePinnedClaim}
              claims={pinnedClaims}
              onSelectClaim={handleSelectClaim}
              onOpenEvidenceDrawer={() => setIsEvidenceDrawerOpen(true)}
              collectedQuotesCount={collectedQuotes.length}
              mismatchFeedback={mismatchFeedback}
              onDismissMismatch={() => setMismatchFeedback(null)}
              exchangeMisses={exchangeMisses[activePinnedClaim.id] || 0}
              onRetryExchange={() => handleRetryExchange(activePinnedClaim.id)}
              tutorialStep={tutorialStep}
              onAdvanceTutorialStep={handleAdvanceTutorial}
            />
          </div>
        )}
      </main>

      {/* Slide-out Evidence & Case Notes Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        claims={pinnedClaims}
        activeClaim={activePinnedClaim}
        onSelectClaim={handleSelectClaim}
        collectedQuotes={collectedQuotes}
        selectedQuoteId={selectedQuoteId}
        onSelectQuote={(id) => setSelectedQuoteId(id)}
        selectedFinalQuoteIds={selectedFinalQuoteIds}
        onToggleFinalQuote={(id) => setSelectedFinalQuoteIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])}
        isFinalGateUnlocked={isFinalGateUnlocked}
        onPresentQuote={handlePresentQuote}
        mismatchFeedback={mismatchFeedback}
        onDismissMismatch={() => setMismatchFeedback(null)}
        presentedQuoteIds={presentedQuotesByClaim[activePinnedClaim.id] || []}
        exchangeMisses={exchangeMisses[activePinnedClaim.id] || 0}
        onRetryExchange={() => handleRetryExchange(activePinnedClaim.id)}
        tutorialStep={tutorialStep}
        onAdvanceTutorialStep={(nextStep) => setTutorialStep(nextStep)}
      />

      {/* Lost Exchange Modal (Shown after 3 failed evidence attempts in an exchange) */}
      <LostExchangeModal
        isOpen={isLostExchangeModalOpen}
        claim={activePinnedClaim}
        onRetry={() => handleRetryExchange(activePinnedClaim.id)}
      />

      {/* Cinematic Breakthrough Modal (Contradiction Payoff) */}
      {activeBreakthrough && (
        <BreakthroughModal
          isOpen={Boolean(activeBreakthrough)}
          onClose={handleCloseBreakthrough}
          title={activeBreakthrough.claim.title}
          claimSpeaker={activeBreakthrough.claim.speakerName}
          oldWording={activeBreakthrough.claim.keyWordOriginal}
          newWording={activeBreakthrough.claim.keyWordCorrected}
          fullSentence={activeBreakthrough.claim.fullCorrectedText}
          dialogueSteps={activeBreakthrough.claim.breakthroughDialogue}
          playerProfile={playerProfile}
        />
      )}

      {/* Full-Screen Cinematic "AHA!" / "CONFRONTATION!" Cut-In */}
      <AhaCutIn
        isOpen={isAhaCutInActive}
        customText={cutInCustomText}
        subtitle={cutInSubtitle}
        variant={cutInVariant}
        isReducedMotion={isReducedMotion}
        onComplete={() => {
          setIsAhaCutInActive(false);
          music.duck(false);
          if (pendingCrossExamPractice) { setPendingCrossExamPractice(false); setIsCrossExamPracticeOpen(true); }
        }}
      />

      {/* Mind Palace: The Trust Graph Modal */}
      <TrustGraphModal
        isOpen={isTrustGraphOpen}
        onClose={() => setIsTrustGraphOpen(false)}
        claims={pinnedClaims}
        quotes={collectedQuotes}
        onTriggerAha={() => {
          setIsTrustGraphOpen(false);
        }}
        canObject={canBreakLoop}
        onSelectFinalResponse={handleSelectFinalResponse}
      />

      {/* Initial Case Briefing / Help Modal */}
      <CaseBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />

      {/* Narrative Ending Debrief Modal */}
      <EndingModal
        ending={activeEnding}
        playerProfile={playerProfile}
        onRestart={handleRestart}
        canReconsider={!hasUsedReconsideration}
        canonicalEnding={canonicalEndingType ? GAME_ENDINGS[canonicalEndingType] : null}
        onSelectDifferentResponse={() => { setHasUsedReconsideration(true); setActiveEnding(null); }}
      />

      {/* How To Play Modal (Accessible anytime via Navbar or TutorialGuide) */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        isReducedMotion={isReducedMotion}
        onReplayInvestigation={gameState==='investigation'?()=>{setIsHowToPlayOpen(false);setTutorialStep('investigation_select_speaker');}:undefined}
        onReplayCrossExam={gameState==='crossexam'?()=>{setIsHowToPlayOpen(false);setIsCrossExamPracticeOpen(true);}:undefined}
      />
      <CrossExamPractice
        isOpen={isCrossExamPracticeOpen}
        onSkip={() => { setIsCrossExamPracticeOpen(false); setTutorialStep('crossexam_completed'); }}
        onComplete={() => {
          setIsCrossExamPracticeOpen(false);
          setTutorialStep('crossexam_completed');
          setCutInCustomText('AHA!'); setCutInSubtitle('CLAIM TESTED — PRACTICE COMPLETE'); setCutInVariant('clue'); setIsAhaCutInActive(true);
        }}
        isReducedMotion={isReducedMotion}
      />
    </div>
  );
}

