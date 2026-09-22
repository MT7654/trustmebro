import React from 'react';
import { motion } from 'motion/react';
import { Eye, Hand, HelpCircle, Keyboard, Search, Swords, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface Props { isOpen:boolean; onClose:()=>void; onReplayInvestigation?:()=>void; onReplayCrossExam?:()=>void; isReducedMotion?:boolean; }
export const HowToPlayModal:React.FC<Props>=({isOpen,onClose,onReplayInvestigation,onReplayCrossExam,isReducedMotion=false})=>{
  if(!isOpen)return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/90 p-4 backdrop-blur-sm">
    <motion.section initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:isReducedMotion?.01:.18}} className="w-[min(92vw,760px)] overflow-hidden rounded-2xl border border-amber-400/70 bg-slate-900 shadow-2xl">
      <header className="flex items-center justify-between border-b border-slate-700 p-5"><div className="flex items-center gap-3"><HelpCircle className="text-amber-300"/><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-amber-300">Guided help</p><h2 className="font-heading text-2xl font-black">Learn by doing</h2></div></div><button onClick={onClose} aria-label="Close help" className="rounded-lg p-2 hover:bg-slate-800"><X/></button></header>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-950 p-5"><Search className="mb-3 text-amber-300"/><h3 className="font-heading text-lg font-black">Investigation practice</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">Select and rotate a harmless object, then interact with its hotspot. Nothing from this practice enters the case file.</p>{onReplayInvestigation&&<button onClick={onReplayInvestigation} className="mt-4 w-full rounded-lg border border-amber-400 px-3 py-2 text-xs font-bold uppercase text-amber-200">Replay guided practice</button>}</div>
        <div className="rounded-2xl bg-slate-950 p-5"><Swords className="mb-3 text-cyan-300"/><h3 className="font-heading text-lg font-black">Cross-examination practice</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">Press, pin, open Case Notes, select evidence and present it using the real controls in isolated practice state.</p>{onReplayCrossExam&&<button onClick={onReplayCrossExam} className="mt-4 w-full rounded-lg border border-cyan-400 px-3 py-2 text-xs font-bold uppercase text-cyan-200">Replay guided practice</button>}</div>
        <div className="sm:col-span-2 grid grid-cols-3 gap-3 text-center text-xs text-slate-300"><div className="rounded-xl border border-slate-700 p-3"><Hand className="mx-auto mb-2 text-purple-300"/>Pointer & touch</div><div className="rounded-xl border border-slate-700 p-3"><Keyboard className="mx-auto mb-2 text-purple-300"/>Keyboard focus</div><div className="rounded-xl border border-slate-700 p-3"><Eye className="mx-auto mb-2 text-purple-300"/>Reduced motion</div></div>
      </div>
      <footer className="border-t border-slate-700 p-4"><button onClick={()=>{sound.playClick();onClose();}} className="w-full rounded-xl bg-yellow-300 px-5 py-3 font-heading font-black uppercase text-slate-950">Return to the game</button></footer>
    </motion.section>
  </div>;
};
