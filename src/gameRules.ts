export const TUTORIAL_OBJECT_ID = 'portable_speaker' as const;
export const CRITICAL_BOX_EVIDENCE_ID = 'item_inspected_box' as const;

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
