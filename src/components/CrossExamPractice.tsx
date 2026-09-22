import React, { useEffect, useState } from 'react';
import { SkipForward } from 'lucide-react';
import { Character, EvidenceQuote, PinnedClaim, PressInquiry, TestimonyStep, TutorialStep } from '../types';
import { DialogueBox } from './DialogueBox';
import { EvidenceDrawer } from './EvidenceDrawer';
import { GuidedSpotlight } from './tutorial/GuidedSpotlight';

interface Props { isOpen:boolean; onComplete:()=>void; onSkip:()=>void; isReducedMotion?:boolean; }
const character:Character={id:'noah',name:'Noah',role:'Practice witness',avatarColor:'cyan',badge:'Practice',currentExpression:'skeptical',initialStatement:'The music was fine.',statusText:'Practice only'};
const evidence:EvidenceQuote={id:'practice_speaker_volume',speakerId:'player',speakerName:'Practice observation',title:'Speaker volume was lowered',quote:'The loud speaker masked the conversation until its volume was lowered.',neutralDescription:'A direct observation from the harmless speaker exercise.',thumbnailType:'source_map',context:'Tutorial practice only',contradictsClaimId:'practice_music_claim',tag:'PRACTICE — NOT SAVED',category:'physical',itemDetails:'This item never enters the real case file.'};
const claim:PinnedClaim={id:'practice_music_claim',speakerId:'noah',speakerName:'Noah',title:'Practice claim',originalText:'The music was fine. Everyone could hear.',keyWordOriginal:'everyone could hear',keyWordCorrected:'the volume masked the conversation',fullCorrectedText:'The music was too loud for everyone to hear until the speaker was turned down.',isCorrected:false,targetQuoteIds:[evidence.id],targetQuoteId:evidence.id,description:'Test a precise statement with a direct observation.',mismatchReplies:{},breakthroughDialogue:[]};
const inquiry:PressInquiry={id:'practice_press',label:'Could everyone actually hear over the music?',speakerResponse:'“I suppose we had to turn it down before the conversation was clear.”',speakerExpression:'worried',internalThought:'That narrows the exact claim I need to test.'};
const testimony:TestimonyStep={id:'practice_testimony',characterId:'noah',statement:'“The music was fine. Everyone could hear what was being said.”',subtext:'Practice statement',inquiries:[inquiry]};
const order:TutorialStep[]=['crossexam_press_statement','crossexam_pin_sentence','crossexam_open_casefile','crossexam_select_evidence','crossexam_present_evidence'];
const copy:Record<string,{target:string;title:string;instruction:string}>={
  crossexam_press_statement:{target:'press-inquiry-0',title:'Press the statement',instruction:'Ask a focused follow-up to learn what this claim is based on.'},
  crossexam_pin_sentence:{target:'claim-tab-practice_music_claim',title:'Pin the exact claim',instruction:'Select the precise statement you want to test. Challenge the claim, not the person.'},
  crossexam_open_casefile:{target:'open-evidence-drawer-from-dialogue',title:'Open Case Notes',instruction:'Now compare the pinned claim with a concrete observation.'},
  crossexam_select_evidence:{target:'evidence-card-practice_speaker_volume',title:'Select relevant evidence',instruction:'Choose the observation that directly tests whether everyone could hear.'},
  crossexam_present_evidence:{target:'drawer-present-quote-btn',title:'Present the contradiction',instruction:'Make the relationship explicit by presenting the selected evidence.'}
};

export const CrossExamPractice:React.FC<Props>=({isOpen,onComplete,onSkip,isReducedMotion=false})=>{
  const [step,setStep]=useState<TutorialStep>('crossexam_press_statement');
  const [drawer,setDrawer]=useState(false); const [selected,setSelected]=useState<string|null>(null); const [reaction,setReaction]=useState<string|null>(null);
  useEffect(()=>{if(isOpen){setStep('crossexam_press_statement');setDrawer(false);setSelected(null);setReaction(null);}},[isOpen]);
  if(!isOpen)return null;
  const advance=(next:TutorialStep)=>setStep(next);
  const config=copy[step]; const stepIndex=Math.max(0,order.indexOf(step));
  return <div id="cross-exam-practice-root" className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-slate-950 p-2 sm:p-4" role="dialog" aria-modal="true" aria-label="Interactive cross-examination practice">
    <div className="mb-2 flex shrink-0 items-center justify-between"><div><p className="text-[10px] font-display font-black uppercase tracking-[.22em] text-cyan-300">Isolated practice · nothing is saved</p><h2 className="font-heading text-xl font-black">Test a claim on the real controls</h2></div><button onClick={onSkip} className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase"><SkipForward className="h-4 w-4"/>Skip tutorial</button></div>
    <div className="min-h-0 flex-1"><DialogueBox activeCharacter={character} testimony={testimony} onPressInquiry={inq=>{setReaction(inq.speakerResponse);advance('crossexam_pin_sentence');}} canBreakLoop={false} lastReactionText={reaction} onResetToTestimony={()=>setReaction(null)} activeClaim={claim} claims={[claim]} onSelectClaim={()=>advance('crossexam_open_casefile')} onOpenEvidenceDrawer={()=>{setDrawer(true);advance('crossexam_select_evidence');}} collectedQuotesCount={1} exchangeMisses={0} tutorialStep={step} onAdvanceTutorialStep={advance}/></div>
    <EvidenceDrawer isOpen={drawer} onClose={()=>setDrawer(false)} claims={[claim]} activeClaim={claim} collectedQuotes={[evidence]} selectedQuoteId={selected} onSelectClaim={()=>{}} onSelectQuote={id=>{setSelected(id);advance('crossexam_present_evidence');}} onPresentQuote={()=>{}} mismatchFeedback={null} onDismissMismatch={()=>{}} tutorialStep={step} onAdvanceTutorialStep={next=>{if(next==='crossexam_completed')onComplete();else advance(next);}}/>
    {config&&<GuidedSpotlight target={config.target} scopeSelector="#cross-exam-practice-root" title={config.title} instruction={config.instruction} step={stepIndex+1} total={order.length} onSkip={onSkip} isReducedMotion={isReducedMotion}/>} 
  </div>;
};
