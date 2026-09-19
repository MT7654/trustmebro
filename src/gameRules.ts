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
