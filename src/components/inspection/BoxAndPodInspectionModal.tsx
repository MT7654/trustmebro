import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { BookmarkCheck, Check, ChevronLeft, ChevronRight, Lock, Package, Unlock, X } from 'lucide-react';
import { EvidenceQuote, PlayerProfile } from '../../types';
import { ALL_DISCOVERABLE_QUOTES } from '../../data/gameData';
import { CharacterIllustration } from '../CharacterIllustration';
import { sound } from '../../utils/sound';

interface Props {
  isOpen:boolean; onClose:()=>void; onRecordClue:(quote:EvidenceQuote)=>void;
  recordedEvidenceIds:string[]; playerProfile:PlayerProfile; isReducedMotion?:boolean;
}
type Target='box'|'pod';
const BOX_VIEWS=['Front angle','Left side','Back panel','Verification side','Top'];
const POD_VIEWS=['Front','Side profile','Rear profile','Connection end'];

export const BoxAndPodInspectionModal:React.FC<Props>=({isOpen,onClose,onRecordClue,recordedEvidenceIds,playerProfile,isReducedMotion=false})=>{
  const [target,setTarget]=useState<Target>('box');
  const [boxView,setBoxView]=useState(0);
  const [podView,setPodView]=useState(0);
  const [sealChecked,setSealChecked]=useState(false);
  const [lidOpen,setLidOpen]=useState(false);
  const [meaningful,setMeaningful]=useState<Target|null>(null);
  const [thought,setThought]=useState('The box looks commercial, but appearance alone cannot verify what is inside. I should inspect it carefully.');
  const dragX=useRef<number|null>(null);
  const boxRecorded=recordedEvidenceIds.includes('item_inspected_box');
  const podRecorded=recordedEvidenceIds.includes('item_unmarked_foil_pod');
  const count=target==='box'?BOX_VIEWS.length:POD_VIEWS.length;
  const view=target==='box'?boxView:podView;

  const rotate=(direction:number)=>{
    sound.playBoxRotate();
    if(target==='box')setBoxView(value=>(value+direction+BOX_VIEWS.length)%BOX_VIEWS.length);
    else setPodView(value=>(value+direction+POD_VIEWS.length)%POD_VIEWS.length);
    setMeaningful(null);
  };
  useEffect(()=>{
    if(!isOpen)return;
    const key=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose();else if(event.key==='ArrowLeft'||event.key.toLowerCase()==='a')rotate(-1);else if(event.key==='ArrowRight'||event.key.toLowerCase()==='d')rotate(1);};
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[isOpen,target]);
  if(!isOpen)return null;

  const inspect=()=>{
    sound.playBlip();setMeaningful(target);
    setThought(target==='box'?'The verification fields are blank. The polished packaging still provides no independent support for its contents or safety.':'The exterior has no traceable batch or verification marking. Hardware appearance cannot establish what the pod contains.');
  };
  const record=()=>{
    const id=target==='box'?'item_inspected_box':'item_unmarked_foil_pod';
    if(!recordedEvidenceIds.includes(id)){sound.playRecordClue();onRecordClue(ALL_DISCOVERABLE_QUOTES[id]);}
  };
  const pointerDown=(clientX:number)=>{dragX.current=clientX;};
  const pointerMove=(clientX:number)=>{if(dragX.current===null)return;const delta=clientX-dragX.current;if(Math.abs(delta)>44){rotate(delta>0?-1:1);dragX.current=clientX;}};

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 backdrop-blur-sm">
    <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:isReducedMotion?.05:.2}} className="flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-2 border-amber-400 bg-slate-900 shadow-2xl">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><div className="flex items-center gap-3"><div className="rounded-lg border border-amber-400/50 bg-amber-500/15 p-2 text-amber-300"><Package className="h-5 w-5"/></div><div><p className="font-display text-[10px] font-black uppercase tracking-[.18em] text-amber-300">Physical inspection · turn object</p><h2 className="font-heading text-xl font-black">{target==='box'?'Packaging box':'Sealed pod exterior'}</h2></div></div><button onClick={onClose} aria-label="Close inspection" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><X className="h-5 w-5"/></button></header>

      <div className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 p-2">
        <div className="flex gap-2"><button onClick={()=>setTarget('box')} className={`rounded-lg px-3 py-2 text-xs font-bold ${target==='box'?'bg-amber-400 text-slate-950':'bg-slate-800 text-slate-300'}`}>Box {boxRecorded&&'✓'}</button><button onClick={()=>{if(lidOpen)setTarget('pod');else setThought('The pod is still inside. Inspect the seal, then open the lid.');}} aria-disabled={!lidOpen} className={`rounded-lg px-3 py-2 text-xs font-bold ${target==='pod'?'bg-cyan-300 text-slate-950':lidOpen?'bg-slate-800 text-slate-200':'bg-slate-900 text-slate-600'}`}>{lidOpen?<Unlock className="mr-1 inline h-3 w-3"/>:<Lock className="mr-1 inline h-3 w-3"/>}Pod {podRecorded&&'✓'}</button></div>
        <span className="hidden text-xs text-slate-400 sm:block">Drag or swipe · Arrow keys / A D · View {view+1}/{count}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        <div onMouseDown={e=>pointerDown(e.clientX)} onMouseMove={e=>pointerMove(e.clientX)} onMouseUp={()=>dragX.current=null} onMouseLeave={()=>dragX.current=null} onTouchStart={e=>pointerDown(e.touches[0].clientX)} onTouchMove={e=>pointerMove(e.touches[0].clientX)} className="relative h-[min(48dvh,430px)] min-h-[300px] overflow-hidden rounded-2xl border border-slate-700 bg-[radial-gradient(circle_at_50%_38%,#24324b_0%,#07101f_62%,#020617_100%)] cursor-grab active:cursor-grabbing">
          <button onClick={()=>rotate(-1)} aria-label={`Turn ${target} left`} className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full border border-slate-500 bg-slate-950/80 p-3 hover:border-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><ChevronLeft className="h-5 w-5"/></button><button onClick={()=>rotate(1)} aria-label={`Turn ${target} right`} className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full border border-slate-500 bg-slate-950/80 p-3 hover:border-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><ChevronRight className="h-5 w-5"/></button>
          {target==='box'?<motion.div key={boxView} initial={isReducedMotion?false:{opacity:.55,rotateY:boxView%2?14:-14}} animate={{opacity:1,rotateY:0}} transition={{duration:isReducedMotion?0:.22}} className="absolute inset-8 m-auto bg-contain bg-center bg-no-repeat drop-shadow-[0_25px_30px_rgba(0,0,0,.75)]" role="img" aria-label={`Sealed packaging box, ${BOX_VIEWS[boxView]} view`} style={{backgroundImage:"url('/art/evidence/v2/sealed-box-turnaround.png')",backgroundSize:'500% 100%',backgroundPosition:`${boxView*25}% 50%`,perspective:1200}}>{boxView===3&&<button onClick={inspect} className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-amber-300 bg-slate-950/90 px-4 py-3 text-xs font-black uppercase text-amber-200 shadow-[0_0_25px_rgba(251,191,36,.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">Inspect blank verification panel</button>}</motion.div>:<motion.div key={podView} initial={isReducedMotion?false:{opacity:.4,rotateY:24}} animate={{opacity:1,rotateY:0}} transition={{duration:isReducedMotion?0:.22}} className="absolute inset-10 bg-contain bg-center bg-no-repeat drop-shadow-[0_25px_30px_rgba(0,0,0,.75)]" role="img" aria-label={`Unmarked sealed pod exterior, ${POD_VIEWS[podView]} view`} style={{backgroundImage:"url('/art/evidence/v2/unmarked-pod-turnaround.png')",backgroundSize:'400% 100%',backgroundPosition:`${podView*(100/3)}% 50%`,perspective:1000}}>{podView===3&&<button onClick={inspect} className="absolute bottom-[8%] left-1/2 z-20 -translate-x-1/2 rounded-xl border-2 border-cyan-300 bg-slate-950/90 px-4 py-3 text-xs font-black uppercase text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">Inspect unmarked connection end</button>}</motion.div>}
          <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/85 px-3 py-1 text-xs font-bold text-slate-200">{target==='box'?BOX_VIEWS[boxView]:POD_VIEWS[podView]}</div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3"><CharacterIllustration characterId="player" playerGender={playerProfile.gender} expression="skeptical" size="sm" className="h-12 w-12"/><div><div className="font-heading text-sm font-black text-amber-300">{playerProfile.name}'s observation</div><p className="text-sm text-slate-300">{thought}</p></div></div>
          <div className="flex min-w-[230px] flex-col gap-2">
            {target==='box'&&!sealChecked&&<button onClick={()=>{sound.playPaperSlide();setSealChecked(true);setThought('The seal can be disturbed. A seal and polished packaging still cannot verify the contents.');}} className="rounded-xl border border-amber-400 bg-amber-950/40 px-4 py-3 text-xs font-black uppercase text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">Inspect seal</button>}
            {target==='box'&&sealChecked&&!lidOpen&&<button onClick={()=>{sound.playBoxOpen();setLidOpen(true);setThought('The lid is open. The pod is now available to inspect; opening it does not reveal or verify its contents.');}} className="rounded-xl bg-emerald-400 px-4 py-3 text-xs font-black uppercase text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><Unlock className="mr-1 inline h-4 w-4"/>Open lid</button>}
            <button onClick={record} disabled={meaningful!==target||(target==='box'?boxRecorded:podRecorded)} className="rounded-xl bg-yellow-400 px-4 py-3 text-xs font-black uppercase text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><BookmarkCheck className="mr-1 inline h-4 w-4"/>{target==='box'?(boxRecorded?'Recorded in case file':'Record observation'):(podRecorded?'Recorded in case file':'Record observation')}</button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3 text-xs"><span className={target==='box'&&boxRecorded&&!lidOpen?'text-amber-300':'text-slate-400'}>{boxRecorded&&!lidOpen?'Exterior recorded · lid still closed':lidOpen?'Lid open · pod available':'Explore the object to find a verifiable observation.'}</span><button onClick={onClose} className="rounded-lg border border-slate-700 px-4 py-2 font-bold uppercase text-slate-300 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><Check className="mr-1 inline h-4 w-4"/>Finished inspecting</button></div>
      </div>
    </motion.div>
  </div>;
};
