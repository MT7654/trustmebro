export const TUTORIAL_OBJECT_ID = 'portable_speaker' as const;
export const CRITICAL_BOX_EVIDENCE_ID = 'item_inspected_box' as const;
export const FINAL_OUTCOME_IDS = ['BREAK_THE_CHAIN', 'FALSE_CONSENSUS', 'THE_GUESS', 'THE_NEXT_VOICE'] as const;
export const INQUIRY_DECISIVE_INDEXES = { ryan: 0, alyssa: 1, noah: 2 } as const;

export function nextInquiryPhase(currentIndex:number,total:number):'hearing'|'review_intro' {
  return currentIndex < total - 1 ? 'hearing' : 'review_intro';
}

export const REQUIRED_INVESTIGATION_EVIDENCE_IDS = [
  CRITICAL_BOX_EVIDENCE_ID,
  'item_telegram_chat_log',
  'quote_alyssa_only_tried',
  'quote_noah_relied_ryan'
] as const;

export function isInvestigationReady(evidenceIds: readonly string[]): boolean {
  return REQUIRED_INVESTIGATION_EVIDENCE_IDS.every(id => evidenceIds.includes(id));
}

export function canAddObjectToEvidenceInventory(objectId: string): boolean {
  return objectId !== TUTORIAL_OBJECT_ID;
}

export function canResolveAppearanceGate(evidenceIds: readonly string[]): boolean {
  return evidenceIds.includes('item_inspected_box') || evidenceIds.includes('item_unmarked_foil_pod');
}

export const FINAL_GATE_PREREQUISITE_CLAIM_IDS = [
  'claim_ryan_appearance', 'claim_noah_alyssa', 'claim_alyssa_ryan'
] as const;

export function canUnlockFinalGate(correctedClaimIds: readonly string[]): boolean {
  return FINAL_GATE_PREREQUISITE_CLAIM_IDS.every(id => correctedClaimIds.includes(id));
}

export const FINAL_GATE_EVIDENCE_GROUPS = {
  noah: ['quote_noah_relied_ryan'],
  alyssa: ['quote_alyssa_only_tried'],
  ryan: ['quote_ryan_trusted_seller', 'item_telegram_chat_log']
} as const;

export function getFinalGateEvidenceProgress(evidenceIds: readonly string[]) {
  return {
    noah: FINAL_GATE_EVIDENCE_GROUPS.noah.some(id => evidenceIds.includes(id)),
    alyssa: FINAL_GATE_EVIDENCE_GROUPS.alyssa.some(id => evidenceIds.includes(id)),
    ryan: FINAL_GATE_EVIDENCE_GROUPS.ryan.some(id => evidenceIds.includes(id))
  };
}

export function canChallengeFinalGate(evidenceIds: readonly string[]): boolean {
  return Object.values(getFinalGateEvidenceProgress(evidenceIds)).every(Boolean);
}

const INVESTIGATION_CLUE_LESSONS: Record<string, string> = {
  item_inspected_box: 'APPEARANCE IS NOT VERIFICATION',
  item_unmarked_foil_pod: 'HARDWARE CANNOT VERIFY THE CONTENTS',
  item_telegram_chat_log: 'SELLER REASSURANCE IS NOT INDEPENDENT EVIDENCE',
  quote_alyssa_only_tried: 'TRYING IS EXPOSURE — NOT TESTING',
  quote_noah_relied_ryan: 'REPEATED TRUST IS NOT AN INDEPENDENT CHECK',
  quote_ryan_trusted_seller: 'CONFIDENCE IS NOT VERIFICATION'
};

export function getInvestigationClueLesson(
  evidenceId: string,
  alreadyCollectedIds: readonly string[]
): string | null {
  if (!canAddObjectToEvidenceInventory(evidenceId) || alreadyCollectedIds.includes(evidenceId)) return null;
  return INVESTIGATION_CLUE_LESSONS[evidenceId] || 'OBSERVATION RECORDED — CASE FILE UPDATED';
}
