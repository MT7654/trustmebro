import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Circle, GitBranch, ShieldAlert, X } from 'lucide-react';
import { EndingType, EvidenceQuote, PinnedClaim } from '../types';
import { FINAL_RESPONSE_OPTIONS } from '../data/gameData';
import { sound } from '../utils/sound';

interface Props {
  isOpen:boolean; onClose:()=>void; claims:PinnedClaim[]; quotes:EvidenceQuote[];
  canObject:boolean; onTriggerAha?:()=>void; onSelectFinalResponse:(ending:EndingType)=>void;
}

const findingFor=(claim:PinnedClaim)=>{
  if(claim.id==='claim_ryan_appearance') return 'Commercial appearance cannot verify contents or safety.';
  if(claim.id==='claim_noah_alyssa') return 'Noah relied on Alyssa’s experience, not an independent check.';
  if(claim.id==='claim_alyssa_ryan') return 'Alyssa relied on Ryan, who had no independent verification.';
  return 'Noah and Alyssa relied on Ryan; Ryan relied on one unknown seller.';
};

export const TrustGraphModal:React.FC<Props>=({isOpen,onClose,claims,quotes,canObject,onSelectFinalResponse})=>{
  const [assembled,setAssembled]=useState(false);
  useEffect(()=>{if(!isOpen)setAssembled(false);},[isOpen]);
  if(!isOpen)return null;
  const solved=claims.filter(claim=>claim.isCorrected).length;
  return <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm" onClick={onClose}>
    <motion.div initial={{scale:.96,opacity:0,y:16}} animate={{scale:1,opacity:1,y:0}} onClick={event=>event.stopPropagation()} className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-2 border-amber-400 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
        <div><p className="font-display text-[10px] font-black uppercase tracking-[.22em] text-amber-300">Case progress · {solved}/{claims.length}</p><h2 className="font-heading text-2xl font-black uppercase">{canObject?'Review the case & decide':'What has been established'}</h2></div>
        <button onClick={onClose} className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300" aria-label="Close case progress"><X className="h-5 w-5"/></button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {claims.map((claim,index)=><div key={claim.id} className={`rounded-xl border p-4 ${claim.isCorrected?'border-emerald-500/60 bg-emerald-950/25':'border-slate-800 bg-slate-900/60'}`}>
            <div className="flex items-center justify-between gap-2"><span className="font-heading text-sm font-black uppercase">Gate {index+1}: {claim.speakerName}</span>{claim.isCorrected?<CheckCircle2 className="h-5 w-5 text-emerald-400"/>:<Circle className="h-5 w-5 text-slate-600"/>}</div>
            <p className="mt-2 text-sm text-slate-300">{claim.isCorrected?findingFor(claim):'This premise has not been tested yet.'}</p>
          </div>)}
        </div>

        {!canObject&&<div className="mt-5 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300"><ShieldAlert className="mr-2 inline h-4 w-4 text-amber-300"/>Return to the testimony and resolve the remaining gate. Case Progress records findings; it does not solve them for you.</div>}

        {canObject&&!assembled&&<section className="mt-5 rounded-2xl border border-cyan-400/50 bg-gradient-to-br from-cyan-950/50 to-slate-900 p-5 text-center">
          <GitBranch className="mx-auto h-8 w-8 text-cyan-300"/><h3 className="mt-2 font-heading text-xl font-black uppercase">Assemble the whole case</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">Review how each reassurance depended on another person. This recap uses the evidence you already earned; it is not another puzzle or a new piece of evidence.</p><button onClick={()=>{sound.playTakeThat();setAssembled(true);}} className="mt-4 rounded-xl bg-yellow-400 px-6 py-3 font-heading text-sm font-black uppercase text-slate-950 hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">Gather the findings</button>
        </section>}

        {canObject&&assembled&&<section className="mt-5 space-y-4">
          <div className="rounded-2xl border border-amber-400/60 bg-amber-950/25 p-5">
            <p className="font-display text-[10px] font-black uppercase tracking-[.2em] text-amber-300">The pattern you established</p><div className="mt-3 flex flex-wrap items-center justify-center gap-2 font-heading text-sm font-black"><span className="rounded bg-slate-900 px-3 py-2">Unknown seller</span><ArrowRight className="h-4 w-4 text-amber-300"/><span className="rounded bg-slate-900 px-3 py-2">Ryan</span><ArrowRight className="h-4 w-4 text-amber-300"/><span className="rounded bg-slate-900 px-3 py-2">Alyssa + Noah</span></div><p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-slate-200">Several confident voices can still repeat one unsupported claim. Nobody here independently verified what was inside. You do not need to guess the contents—or decide that Ryan is lying—to refuse an unknown device.</p><p className="mt-3 text-center text-[11px] text-slate-400">{quotes.length} case-file records reviewed · four premises resolved</p>
          </div>
          <div><h3 className="font-heading text-lg font-black uppercase text-white">What do you do next?</h3><p className="mt-1 text-sm text-slate-400">Choose how you respond to the room. The consequences will follow your decision.</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{FINAL_RESPONSE_OPTIONS.map((option,index)=><button key={option.id} onClick={()=>{sound.playDramaticHit();onClose();onSelectFinalResponse(option.id);}} className="group rounded-xl border border-slate-700 bg-slate-900 p-4 text-left hover:border-amber-400 hover:bg-amber-950/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"><div className="flex gap-3"><span className="rounded bg-slate-950 px-2 py-1 font-display text-xs font-black text-amber-300">{index+1}</span><div><div className="font-heading text-sm font-black text-white group-hover:text-amber-200">{option.promptText}</div><div className="mt-1 text-xs text-slate-400">{option.subtext}</div></div></div></button>)}</div></div>
        </section>}
      </div>
    </motion.div>
  </div>;
};
