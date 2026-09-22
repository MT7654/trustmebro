import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SkipForward } from 'lucide-react';

interface Props {
  target:string; title:string; instruction:string; step:number; total:number;
  onSkip:()=>void; isReducedMotion?:boolean; scopeSelector?:string;
}
interface Box { top:number; left:number; width:number; height:number; }
interface Point { top:number; left:number; }

const CARD_WIDTH=360;
const CARD_HEIGHT=150;
const GAP=14;

export const GuidedSpotlight:React.FC<Props> = ({target,title,instruction,step,total,onSkip,isReducedMotion=false,scopeSelector}) => {
  const [box,setBox]=useState<Box|null>(null);
  const [card,setCard]=useState<Point>({top:80,left:12});
  const [attempts,setAttempts]=useState(0);

  const locate=()=>{
    const scope=(scopeSelector ? document.querySelector(scopeSelector) : document) || document;
    const selector=target.startsWith('#')?target:`[data-tutorial-target="${target}"]`;
    const candidates=Array.from(scope.querySelectorAll<HTMLElement>(selector));
    const el=candidates.find(node=>{const r=node.getBoundingClientRect();const style=getComputedStyle(node);return r.width>0&&r.height>0&&style.visibility!=='hidden'&&style.display!=='none';});
    if(!el){setBox(null);setAttempts(value=>value+1);return;}
    const firstRect=el.getBoundingClientRect();
    if(firstRect.top<72||firstRect.bottom>innerHeight-24) el.scrollIntoView({block:'center',inline:'nearest',behavior:isReducedMotion?'auto':'smooth'});
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const r=el.getBoundingClientRect();
      const top=Math.max(8,r.top-8),left=Math.max(8,r.left-8),right=Math.min(innerWidth-8,r.right+8),bottom=Math.min(innerHeight-8,r.bottom+8);
      if(right<=left||bottom<=top){setBox(null);return;}
      const next={top,left,width:right-left,height:bottom-top};
      setBox(next);
      const cardWidth=Math.min(CARD_WIDTH,innerWidth-24);
      const alignedLeft=Math.min(Math.max(12,next.left),innerWidth-cardWidth-12);
      if(next.top+next.height+GAP+CARD_HEIGHT<=innerHeight-12) setCard({top:next.top+next.height+GAP,left:alignedLeft});
      else if(next.top-CARD_HEIGHT-GAP>=70) setCard({top:next.top-CARD_HEIGHT-GAP,left:alignedLeft});
      else if(next.left+next.width+GAP+cardWidth<=innerWidth-12) setCard({top:Math.min(innerHeight-CARD_HEIGHT-12,Math.max(70,next.top)),left:next.left+next.width+GAP});
      else setCard({top:Math.min(innerHeight-CARD_HEIGHT-12,Math.max(70,next.top)),left:Math.max(12,next.left-cardWidth-GAP)});
      setAttempts(0);
      if(document.activeElement===document.body||document.activeElement===null) el.focus({preventScroll:true});
    }));
  };

  useLayoutEffect(locate,[target,scopeSelector]);
  useEffect(()=>{
    let frame=0;
    const update=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;locate();});};
    locate();
    window.addEventListener('resize',update); window.addEventListener('scroll',update,true);
    const scope=scopeSelector ? document.querySelector(scopeSelector) : null;
    const observer=new ResizeObserver(update); if(scope)observer.observe(scope);
    const mutation=new MutationObserver(update); if(scope)mutation.observe(scope,{childList:true,subtree:true,characterData:true});
    const settleInterval=window.setInterval(update,50);
    const settleTimer=window.setTimeout(()=>window.clearInterval(settleInterval),900);
    return()=>{window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true);cancelAnimationFrame(frame);window.clearInterval(settleInterval);window.clearTimeout(settleTimer);observer.disconnect();mutation.disconnect();};
  },[target,scopeSelector,isReducedMotion]);

  if(typeof document==='undefined')return null;
  return createPortal(<div className="pointer-events-none fixed inset-0 z-[90]" aria-live="polite" aria-label={`Guided practice step ${step} of ${total}: ${title}`}>
    {box?<><div className="pointer-events-auto fixed bg-slate-950/80" style={{left:0,top:0,width:'100%',height:box.top}}/><div className="pointer-events-auto fixed bg-slate-950/80" style={{left:0,top:box.top,width:box.left,height:box.height}}/><div className="pointer-events-auto fixed bg-slate-950/80" style={{left:box.left+box.width,top:box.top,right:0,height:box.height}}/><div className="pointer-events-auto fixed bg-slate-950/80" style={{left:0,top:box.top+box.height,width:'100%',bottom:0}}/><div className={`pointer-events-none fixed rounded-xl border-2 border-cyan-300 ring-4 ring-cyan-300/25 ${isReducedMotion?'':'animate-pulse'}`} style={box}/></>:<div className="pointer-events-auto fixed inset-0 bg-slate-950/80"/>}
    <button onClick={()=>{if(window.confirm('Skip the guided tutorial? You can replay it from Guided Help.'))onSkip();}} className="pointer-events-auto fixed right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-slate-950 px-4 py-2 text-xs font-bold uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><SkipForward className="h-4 w-4"/>Skip tutorial</button>
    <div className="pointer-events-auto fixed z-20 w-[min(360px,calc(100vw-24px))] rounded-2xl border border-cyan-300/60 bg-slate-900 p-4 shadow-2xl" style={card}><p className="text-[10px] font-display font-black uppercase tracking-[.2em] text-cyan-300">Guided practice · {step}/{total}</p><h3 className="mt-1 font-heading text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-200">{box?instruction:'Preparing the next control…'}</p>{!box&&attempts>3&&<button onClick={locate} className="mt-3 rounded-lg border border-cyan-300 px-3 py-2 text-xs font-bold uppercase text-cyan-200">Retry step</button>}</div>
  </div>,document.body);
};
