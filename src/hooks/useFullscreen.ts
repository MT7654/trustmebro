import { useCallback, useEffect, useState } from 'react';

export const useFullscreen=()=>{
  const [isFullscreen,setIsFullscreen]=useState(Boolean(document.fullscreenElement));
  useEffect(()=>{const change=()=>setIsFullscreen(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',change);return()=>document.removeEventListener('fullscreenchange',change);},[]);
  const enter=useCallback(async()=>{try{await document.documentElement.requestFullscreen();return true;}catch{return false;}},[]);
  const exit=useCallback(async()=>{if(document.fullscreenElement)await document.exitFullscreen();},[]);
  const toggle=useCallback(async()=>{if(document.fullscreenElement)await exit();else await enter();},[enter,exit]);
  return {isFullscreen,enter,exit,toggle,isSupported:Boolean(document.fullscreenEnabled)};
};
