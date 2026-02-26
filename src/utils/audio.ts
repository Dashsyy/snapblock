/**
 * Audio Utility for SnapBlocks
 * Handles pre-loading and playing sound effects with Web Audio API for low latency.
 */

type SoundName = 
  | 'pickup' 
  | 'snap_correct' 
  | 'wobble_error' 
  | 'tray_shuffle' 
  | 'lesson_success' 
  | 'module_complete' 
  | 'timer_tick' 
  | 'timer_expired' 
  | 'select' 
  | 'switch' 
  | 'clear';

class AudioManager {
  private context: AudioContext | null = null;
  private buffers: Map<SoundName, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private isLoaded: boolean = false;

  constructor() {
    // Context is created on first user interaction to satisfy browser policies
  }

  private initContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public async preloadSounds(): Promise<void> {
    if (this.isLoaded) return;
    
    this.initContext();
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const soundFiles: Record<SoundName, string> = {
      pickup: `${baseUrl}/sfx/pickup.wav`,
      snap_correct: `${baseUrl}/sfx/snap_correct.wav`,
      wobble_error: `${baseUrl}/sfx/wobble_error.wav`,
      tray_shuffle: `${baseUrl}/sfx/tray_shuffle.wav`,
      lesson_success: `${baseUrl}/sfx/lesson_success.wav`,
      module_complete: `${baseUrl}/sfx/module_complete.wav`,
      timer_tick: `${baseUrl}/sfx/timer_tick.wav`,
      timer_expired: `${baseUrl}/sfx/timer_expired.wav`,
      select: `${baseUrl}/sfx/select.wav`,
      switch: `${baseUrl}/sfx/switch.wav`,
      clear: `${baseUrl}/sfx/clear.wav`,
    };

    const loadPromises = (Object.entries(soundFiles) as [SoundName, string][]).map(async ([name, path]) => {
      try {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context!.decodeAudioData(arrayBuffer);
        this.buffers.set(name, audioBuffer);
      } catch (e) {
        console.error(`Failed to load sound: ${name}`, e);
      }
    });

    await Promise.all(loadPromises);
    this.isLoaded = true;
    console.log("All sounds loaded and decoded.");
  }

  public play(name: SoundName, volume: number = 0.5) {
    if (!this.enabled || !this.context || !this.isLoaded) {
      // Fallback for immediate play if not loaded (though we should wait)
      return;
    }

    this.initContext();
    const buffer = this.buffers.get(name);
    if (buffer) {
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      
      const gainNode = this.context.createGain();
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(this.context.destination);
      
      source.start(0);
    }
  }

  public toggle(enabled: boolean) {
    this.enabled = enabled;
  }

  public async unlock() {
    this.initContext();
    await this.preloadSounds();
  }
}

export const audio = new AudioManager();
