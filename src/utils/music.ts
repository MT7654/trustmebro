type MusicScene = 'none' | 'investigation' | 'courtroom';

const TRACKS: Record<Exclude<MusicScene,'none'>,{src:string;volume:number}> = {
  investigation:{src:'/audio/investigation-calm-gaming-flow.mp3',volume:.13},
  courtroom:{src:'/audio/courtroom-retro-gaming.mp3',volume:.1}
};

class MusicController {
  private audio: HTMLAudioElement | null = null;
  private scene: MusicScene = 'none';
  private enabled = typeof localStorage === 'undefined' || localStorage.getItem('tmb_music_enabled') !== 'false';
  isEnabled(){ return this.enabled; }
  setEnabled(next:boolean){ this.enabled=next; if(typeof localStorage!=='undefined') localStorage.setItem('tmb_music_enabled',String(next)); if(!next) this.stop(); else if(this.scene!=='none') this.play(this.scene); return next; }
  play(scene:MusicScene){
    if(scene==='none'){ this.scene='none'; this.stop(); return; }
    const previous=this.scene; this.scene=scene;
    if(!this.enabled) return;
    const track=TRACKS[scene];
    if(previous===scene&&this.audio) { void this.audio.play().catch(()=>{}); return; }
    this.stop();
    const audio=new Audio(track.src); audio.loop=true; audio.volume=track.volume; audio.preload='auto'; this.audio=audio;
    void audio.play().catch(()=>{ /* browsers permit playback after the next player gesture */ });
  }
  resume(){ if(this.enabled&&this.scene!=='none') this.play(this.scene); }
  duck(active=true){ if(!this.audio||this.scene==='none') return; this.audio.volume=TRACKS[this.scene].volume*(active?.3:1); }
  stop(){ if(this.audio){ this.audio.pause(); this.audio.currentTime=0; this.audio=null; } }
}
export const music = new MusicController();
