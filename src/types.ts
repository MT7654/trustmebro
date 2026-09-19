export type CharacterId = 'ryan' | 'alyssa' | 'noah' | 'player';

export type PlayerGender = 'male' | 'female';

export interface PlayerProfile {
  name: string;
  gender: PlayerGender;
}

export type CharacterExpression = 
  | 'neutral' 
  | 'smiling' 
  | 'defensive' 
  | 'shocked' 
  | 'zoned_out' 
  | 'worried' 
  | 'skeptical' 
  | 'alarmed';

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  avatarColor: string;
  badge: string;
  currentExpression: CharacterExpression;
  initialStatement: string;
  statusText: string;
}

export type EvidenceCategory = 'physical' | 'digital' | 'verbal' | 'source_map';

export type EvidenceThumbnailType = 'box' | 'pod' | 'phone' | 'alyssa' | 'ryan' | 'noah' | 'source_map';

export interface EvidenceQuote {
  id: string;
  speakerId: CharacterId;
  speakerName: string;
  title: string;
  quote: string;
  neutralDescription: string;
  thumbnailType: EvidenceThumbnailType;
  context: string;
  contradictsClaimId: string;
  tag: string;
  category: EvidenceCategory;
  itemDetails?: string;
}

export interface InvestigationHotspot {
  id: 'vape_box' | 'vape_pod' | 'telegram_phone' | 'talk_noah' | 'talk_alyssa' | 'talk_ryan';
  title: string;
  category: EvidenceCategory;
  label: string;
  shortDesc: string;
  evidenceId: string;
  isInspected: boolean;
  x: number; // percentage in room
  y: number; // percentage in room
}

export interface BreakthroughDialogue {
  speaker: string;
  characterId: CharacterId;
  expression: CharacterExpression;
  text: string;
}

export interface PinnedClaim {
  id: string;
  speakerId: CharacterId;
  speakerName: string;
  title: string;
  originalText: string;
  keyWordOriginal: string;
  keyWordCorrected: string;
  fullCorrectedText: string;
  isCorrected: boolean;
  targetQuoteIds: string[]; // Supports multiple valid matching items (e.g. box or pod)
  targetQuoteId: string; // Primary match
  description: string;
  mismatchReplies: Record<string, string>; // fallback character dialogue if mismatched
  breakthroughDialogue: BreakthroughDialogue[];
}

export interface PressInquiry {
  id: string;
  label: string;
  speakerResponse: string;
  speakerExpression: CharacterExpression;
  internalThought: string;
  grantsQuote?: EvidenceQuote;
  tensionChange?: number;
}

export interface TestimonyStep {
  id: string;
  characterId: CharacterId;
  statement: string;
  subtext: string;
  inquiries: PressInquiry[];
}

export type EndingType = 
  | 'BREAK_THE_CHAIN' 
  | 'RIGHT_BUT_ALONE' 
  | 'FALSE_CONSENSUS' 
  | 'THE_GUESS'
  | 'THE_NEXT_VOICE';

export type SourcePersonId = 'unknown_seller' | 'ryan' | 'alyssa' | 'noah' | 'player' | 'next_friend';

export interface SourceDependency {
  personId: 'ryan' | 'alyssa' | 'noah';
  reliedOn: SourcePersonId | null;
}

export interface CaseCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  isMapCard?: boolean;
  category?: EvidenceCategory;
}

export interface FinalResponseOption {
  id: EndingType;
  promptText: string;
  subtext: string;
  leadsToTitle: string;
}

export interface GameEnding {
  type: EndingType;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  narrativeText: string;
  extendedSourceChain?: {
    seller: string;
    ryan: string;
    group: string;
    player: string;
    nextFriend: string;
  };
  educationalDebrief: {
    psychologicalPrinciple: string;
    realWorldContext: string;
    actionableTakeaway: string;
  };
}

export type TutorialStep = 
  | 'none'
  | 'structure_overview'
  | 'investigation_select_box'
  | 'investigation_rotate_box'
  | 'investigation_click_point'
  | 'investigation_open_box'
  | 'investigation_record_clue'
  | 'investigation_completed'
  | 'crossexam_press_statement'
  | 'crossexam_pin_sentence'
  | 'crossexam_open_casefile'
  | 'crossexam_select_evidence'
  | 'crossexam_present_evidence'
  | 'crossexam_completed';


