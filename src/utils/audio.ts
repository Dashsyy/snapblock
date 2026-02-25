/**
 * Audio Utility for SnapBlocks
 * Handles pre-loading and playing sound effects with safe fallbacks.
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
  private sounds: Map<SoundName, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Only initialize in browser
    if (typeof window !== 'undefined') {
      this.preloadSounds();
    }
  }

  private preloadSounds() {
    const soundFiles: Record<SoundName, string> = {
      pickup: '/sfx/pickup.wav',
      snap_correct: '/sfx/snap_correct.wav',
      wobble_error: '/sfx/wobble_error.wav',
      tray_shuffle: '/sfx/tray_shuffle.wav',
      lesson_success: '/sfx/lesson_success.wav',
      module_complete: '/sfx/module_complete.wav',
      timer_tick: '/sfx/timer_tick.wav',
      timer_expired: '/sfx/timer_expired.wav',
      select: '/sfx/select.wav',
      switch: '/sfx/switch.wav',
      clear: '/sfx/clear.wav',
    };

    (Object.entries(soundFiles) as [SoundName, string][]).forEach(([name, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    });
  }

  public play(name: SoundName, volume: number = 0.5) {
    if (!this.enabled) return;

    const sound = this.sounds.get(name);
    if (sound) {
      // Create a clone to allow overlapping sounds of the same type
      const playSound = sound.cloneNode() as HTMLAudioElement;
      playSound.volume = volume;
      playSound.play().catch(() => {
        // Silent fail if audio hasn't been interacted with yet or file missing
        // console.log(`Audio ${name} could not play. Make sure files exist in /public/sfx/`);
      });
    }
  }

  public toggle(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const audio = new AudioManager();
