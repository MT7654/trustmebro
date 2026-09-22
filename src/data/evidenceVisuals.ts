import type { CharacterExpression, EvidenceThumbnailType } from '../types.ts';

export interface EvidenceVisual { thumbnailSrc?:string; heroSrc?:string; kind:'character'|'object'|'device'|'diagram'; characterId?:'ryan'|'noah'|'alyssa'; expression?:CharacterExpression; cropVariant:'portrait'|'object-closeup'|'wide-context'; alt:string; }

export const EVIDENCE_VISUALS:Record<string,EvidenceVisual>={
  item_inspected_box:{thumbnailSrc:'/art/evidence/sealed-box-hero.png',heroSrc:'/art/evidence/sealed-box-hero.png',kind:'object',cropVariant:'object-closeup',alt:'Sealed black packaging box with a sliced outer seal and blank verification fields'},
  item_unmarked_foil_pod:{thumbnailSrc:'/art/evidence/v2/unmarked-pod.png',heroSrc:'/art/evidence/v2/unmarked-pod.png',kind:'object',cropVariant:'object-closeup',alt:'Unmarked dark cartridge exterior viewed as an evidence object'},
  item_telegram_chat_log:{thumbnailSrc:'/art/evidence/v2/phone-frame.png',heroSrc:'/art/evidence/v2/phone-frame.png',kind:'device',cropVariant:'object-closeup',alt:'Generic dark smartphone used to display locally rendered chat evidence'},
  quote_telegram_anonymous:{thumbnailSrc:'/art/evidence/v2/phone-frame.png',heroSrc:'/art/evidence/v2/phone-frame.png',kind:'device',cropVariant:'object-closeup',alt:'Generic dark smartphone associated with an unidentified source'},
  quote_alyssa_only_tried:{thumbnailSrc:'/art/characters/v3/alyssa-expression-sheet.png',heroSrc:'/art/characters/v3/alyssa-expression-sheet.png',kind:'character',characterId:'alyssa',expression:'worried',cropVariant:'portrait',alt:'Alyssa looking worried while reconsidering her assumption'},
  quote_ryan_trusted_seller:{thumbnailSrc:'/art/characters/v3/ryan-expression-sheet.png',heroSrc:'/art/characters/v3/ryan-expression-sheet.png',kind:'character',characterId:'ryan',expression:'defensive',cropVariant:'portrait',alt:'Ryan responding defensively about the source he trusted'},
  quote_noah_relied_ryan:{thumbnailSrc:'/art/characters/v3/noah-expression-sheet.png',heroSrc:'/art/characters/v3/noah-expression-sheet.png',kind:'character',characterId:'noah',expression:'skeptical',cropVariant:'portrait',alt:'Noah thoughtfully reconsidering whose judgment he relied on'},
  source_map_fallback:{kind:'diagram',cropVariant:'wide-context',alt:'A live relationship diagram connecting repeated reassurances to their sources'}
};

export const TYPE_FALLBACK_VISUAL:Record<EvidenceThumbnailType,EvidenceVisual>={
  box:EVIDENCE_VISUALS.item_inspected_box,pod:EVIDENCE_VISUALS.item_unmarked_foil_pod,phone:EVIDENCE_VISUALS.item_telegram_chat_log,
  alyssa:EVIDENCE_VISUALS.quote_alyssa_only_tried,ryan:EVIDENCE_VISUALS.quote_ryan_trusted_seller,noah:EVIDENCE_VISUALS.quote_noah_relied_ryan,source_map:EVIDENCE_VISUALS.source_map_fallback
};

export const getEvidenceVisual=(evidenceId:string|undefined,type:EvidenceThumbnailType)=>evidenceId&&EVIDENCE_VISUALS[evidenceId]?EVIDENCE_VISUALS[evidenceId]:TYPE_FALLBACK_VISUAL[type];
