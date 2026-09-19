import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CRITICAL_BOX_EVIDENCE_ID,
  REQUIRED_INVESTIGATION_EVIDENCE_IDS,
  TUTORIAL_OBJECT_ID,
  canResolveAppearanceGate,
  isInvestigationReady,
  canAddObjectToEvidenceInventory,
  getInvestigationClueLesson
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
