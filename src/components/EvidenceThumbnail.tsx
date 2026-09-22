import React from 'react';
import { Network } from 'lucide-react';
import { EvidenceThumbnailType } from '../types';
import { getEvidenceVisual } from '../data/evidenceVisuals';

interface Props { type:EvidenceThumbnailType; evidenceId?:string; size?:'sm'|'md'|'lg'|'xl'|'giant'; className?:string; isInspected?:boolean; }
const characterFrame:Record<string,Record<string,number>>={ryan:{defensive:1,shocked:2},noah:{skeptical:1,alarmed:2},alyssa:{worried:2,defensive:3}};

export const EvidenceThumbnail:React.FC<Props>=({type,evidenceId,size='md',className=''})=>{
  const visual=getEvidenceVisual(evidenceId,type);
  const sizeClass={sm:'w-10 h-10',md:'w-16 h-16',lg:'w-24 h-24',xl:'w-32 h-32',giant:'w-44 h-44 sm:w-52 sm:h-52'}[size];
  const frame=visual.characterId&&visual.expression?characterFrame[visual.characterId]?.[visual.expression]??0:0;
  return <div role="img" aria-label={visual.alt} className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-[radial-gradient(circle_at_50%_30%,#1e293b,#020617)] ${sizeClass} ${className}`}>
    {visual.kind==='diagram'
      ? <div className="grid h-full w-full place-items-center bg-[linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] [background-size:12px_12px]"><Network className="h-1/2 w-1/2 text-cyan-300"/></div>
      : visual.kind==='character'
        ? <div className="h-full aspect-[3/5] bg-no-repeat" style={{backgroundImage:`url(${visual.thumbnailSrc})`,backgroundSize:'500% 100%',backgroundPosition:`${frame*25}% 50%`}}/>
        : <img src={visual.thumbnailSrc} alt="" draggable={false} className={`h-full w-full ${visual.kind==='device'?'object-contain p-1':'object-cover'} ${visual.cropVariant==='object-closeup'?'object-center':''}`}/>
    }
  </div>;
};
