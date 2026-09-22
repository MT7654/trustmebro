import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EVIDENCE_VISUALS } from '../src/data/evidenceVisuals.ts';
import {
  CRITICAL_BOX_EVIDENCE_ID,
  REQUIRED_INVESTIGATION_EVIDENCE_IDS,
  TUTORIAL_OBJECT_ID,
  canResolveAppearanceGate,
  isInvestigationReady,
  canAddObjectToEvidenceInventory,
  getInvestigationClueLesson,
  canUnlockFinalGate,
  canChallengeFinalGate,
  getFinalGateEvidenceProgress,
  FINAL_OUTCOME_IDS,
  INQUIRY_DECISIVE_INDEXES,
  nextInquiryPhase
} from '../src/gameRules.ts';

test('portable speaker is practice-only and never enters the evidence catalogue', () => {
  assert.equal(canAddObjectToEvidenceInventory(TUTORIAL_OBJECT_ID), false);
  assert.equal(REQUIRED_INVESTIGATION_EVIDENCE_IDS.includes(TUTORIAL_OBJECT_ID as never), false);
});

test('new investigation evidence triggers an Aha lesson, while practice and repeat interactions do not', () => {
  assert.equal(getInvestigationClueLesson(CRITICAL_BOX_EVIDENCE_ID, []), 'APPEARANCE IS NOT VERIFICATION');
  assert.equal(getInvestigationClueLesson('quote_alyssa_only_tried', []), 'TRYING IS EXPOSURE — NOT TESTING');
  assert.equal(getInvestigationClueLesson(TUTORIAL_OBJECT_ID, []), null);
  assert.equal(getInvestigationClueLesson(CRITICAL_BOX_EVIDENCE_ID, [CRITICAL_BOX_EVIDENCE_ID]), null);
});

test('sealed box remains discoverable as critical physical evidence', () => {
  assert.equal(REQUIRED_INVESTIGATION_EVIDENCE_IDS.includes(CRITICAL_BOX_EVIDENCE_ID), true);
  assert.equal(canAddObjectToEvidenceInventory(CRITICAL_BOX_EVIDENCE_ID), true);
});

test('tutorial completion cannot solve or skip an evidence gate', () => {
  const tutorialOnly = [TUTORIAL_OBJECT_ID];
  assert.equal(isInvestigationReady(tutorialOnly), false);
  assert.equal(canResolveAppearanceGate(tutorialOnly), false);

  const almostComplete = REQUIRED_INVESTIGATION_EVIDENCE_IDS.filter(id => id !== CRITICAL_BOX_EVIDENCE_ID);
  assert.equal(isInvestigationReady([...almostComplete, TUTORIAL_OBJECT_ID]), false);
  assert.equal(canResolveAppearanceGate([...almostComplete, TUTORIAL_OBJECT_ID]), false);
});

test('the final gate unlocks only after the first three real gates are resolved', () => {
  assert.equal(canUnlockFinalGate(['claim_ryan_appearance', 'claim_noah_alyssa']), false);
  assert.equal(canUnlockFinalGate(['claim_ryan_appearance', 'claim_noah_alyssa', 'claim_alyssa_ryan']), true);
});

test('the final gate uses the three earned reliance findings directly', () => {
  assert.equal(canChallengeFinalGate(['quote_noah_relied_ryan', 'quote_alyssa_only_tried']), false);
  assert.equal(canChallengeFinalGate(['quote_noah_relied_ryan', 'quote_alyssa_only_tried', 'item_telegram_chat_log']), true);
  assert.equal(canChallengeFinalGate(['quote_noah_relied_ryan', 'quote_alyssa_only_tried', 'quote_ryan_trusted_seller']), true);
  assert.deepEqual(getFinalGateEvidenceProgress(['quote_noah_relied_ryan']), {noah:true,alyssa:false,ryan:false});
  assert.equal(canChallengeFinalGate(['card_one_origin_three_voices']), false);
  assert.equal(canChallengeFinalGate([TUTORIAL_OBJECT_ID]), false);
});

test('the final deliberation exposes exactly four distinct outcome families', () => {
  assert.deepEqual([...FINAL_OUTCOME_IDS], [
    'BREAK_THE_CHAIN', 'FALSE_CONSENSUS', 'THE_GUESS', 'THE_NEXT_VOICE'
  ]);
});

test('inquiry clues occupy distinct fixed positions and hearing ends before deduction',()=>{
  assert.deepEqual(INQUIRY_DECISIVE_INDEXES,{ryan:0,alyssa:1,noah:2});
  assert.equal(nextInquiryPhase(0,3),'hearing');
  assert.equal(nextInquiryPhase(2,3),'review_intro');
});

test('every production clue resolves to a visual manifest entry with local files',()=>{
  const productionIds=['item_inspected_box','item_unmarked_foil_pod','item_telegram_chat_log','quote_telegram_anonymous','quote_alyssa_only_tried','quote_ryan_trusted_seller','quote_noah_relied_ryan'];
  for(const id of productionIds){const visual=EVIDENCE_VISUALS[id];assert.ok(visual,`missing visual for ${id}`);for(const src of [visual.thumbnailSrc,visual.heroSrc].filter(Boolean) as string[])assert.equal(existsSync(join(process.cwd(),'public',src.replace(/^\//,''))),true,`missing file ${src}`);}
  assert.equal('portable_speaker' in EVIDENCE_VISUALS,false);
});

test('courtroom keeps narrative and commands on separate responsive surfaces',()=>{
  const dialogue=readFileSync(join(process.cwd(),'src/components/DialogueBox.tsx'),'utf8');
  const app=readFileSync(join(process.cwd(),'src/App.tsx'),'utf8');
  assert.match(dialogue,/courtroom-narrative-body/);
  assert.match(dialogue,/courtroom-command-surface/);
  assert.match(dialogue,/lg:grid-cols-3/);
  assert.match(app,/courtroom-stage-grid/);
  assert.match(dialogue,/text-readable-gold/);
});

test('outcome body owns scrolling and compact portraits use avatar crops',()=>{
  const ending=readFileSync(join(process.cwd(),'src/components/EndingModal.tsx'),'utf8');
  const illustration=readFileSync(join(process.cwd(),'src/components/CharacterIllustration.tsx'),'utf8');
  assert.match(ending,/outcome-scroll-region[^\"]*overflow-y-auto/);
  assert.match(ending,/variant="avatar"/);
  assert.match(ending,/font-body text-sm leading-snug/);
  assert.match(illustration,/variant\?: 'figure' \| 'avatar'/);
  assert.match(illustration,/characterNames\[characterId\]\.slice\(0, 1\)/);
});

test('courtroom preserves cinematic height without double-scaling characters',()=>{
  const css=readFileSync(join(process.cwd(),'src/index.css'),'utf8');
  const app=readFileSync(join(process.cwd(),'src/App.tsx'),'utf8');
  assert.match(app,/clamp\(220px,34dvh,320px\)/);
  assert.match(css,/clamp\(210px, 33dvh, 250px\)/);
  assert.doesNotMatch(css,/courtroom-character-button \{ scale:/);
});

test('recording a quote does not preselect evidence for presentation',()=>{
  const app=readFileSync(join(process.cwd(),'src/App.tsx'),'utf8');
  assert.doesNotMatch(app,/setSelectedQuoteId\(quote\.id\)/);
  assert.match(app,/if \(claimId !== activeClaimId\)[\s\S]{0,180}setSelectedQuoteId\(null\)/);
  assert.match(app,/setIsEvidenceDrawerOpen\(false\);\s*setSelectedQuoteId\(null\)/);
});

test('tutorial skips use the shared in-game confirmation instead of browser dialogs',()=>{
  const spotlight=readFileSync(join(process.cwd(),'src/components/tutorial/GuidedSpotlight.tsx'),'utf8');
  const speaker=readFileSync(join(process.cwd(),'src/components/inspection/SpeakerTutorialModal.tsx'),'utf8');
  const crossExam=readFileSync(join(process.cwd(),'src/components/CrossExamPractice.tsx'),'utf8');
  const confirmation=readFileSync(join(process.cwd(),'src/components/tutorial/TutorialSkipConfirm.tsx'),'utf8');
  for(const source of [spotlight,speaker,crossExam]){
    assert.doesNotMatch(source,/window\.(?:confirm|alert)\s*\(/);
    assert.match(source,/TutorialSkipConfirm/);
  }
  assert.match(confirmation,/role="dialog"/);
  assert.match(confirmation,/aria-modal="true"/);
  assert.match(confirmation,/Continue tutorial/);
  assert.match(confirmation,/data-tutorial-skip-confirm/);
  assert.match(confirmation,/event\.key === 'Escape'/);
});
