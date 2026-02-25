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

    (Object.entries(soundFiles) as [SoundName, string][]).forEach(([name, path]) => {
      const audio = new Audio();
      audio.src = path;
      audio.preload = 'auto';
      // Load the audio to memory
      audio.load();
      this.sounds.set(name, audio);
    });
  }

  public play(name: SoundName, volume: number = 0.5) {
    if (!this.enabled) return;

    const sound = this.sounds.get(name);
    if (sound) {
      try {
        // Create a clone to allow overlapping sounds of the same type
        const playSound = sound.cloneNode() as HTMLAudioElement;
        playSound.volume = volume;
        
        const playPromise = playSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn(`Audio playback failed for ${name}:`, error);
            // If it failed, try to unlock (though this is only effective during direct user interaction)
            this.unlock();
          });
        }
      } catch (e) {
        console.error(`Error playing sound ${name}:`, e);
      }
    }
  }

  public toggle(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Unlocks audio on mobile browsers.
   * Call this during a user interaction (like a button click).
   */
  public unlock() {
    const silentAudio = new Audio();
    silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
    silentAudio.play().catch(() => {});
    
    // Resume audio context if it exists (for Web Audio API, though we use HTMLAudioElement)
    // This is just a safety measure for some browsers
    this.sounds.forEach(sound => {
      sound.load();
    });
  }
}

export const audio = new AudioManager();
