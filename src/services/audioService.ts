// services/audioService.ts

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
      return null;
    }
  }
  return audioContext;
};

const playSound = (frequency: number, type: OscillatorType, duration: number, volume: number = 1) => {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === 'suspended') {
    context.resume();
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  
  gainNode.gain.setValueAtTime(volume, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration);
};

export const playHighlightSound = () => {
  playSound(800, 'sine', 0.1, 0.5);
};

export const playSelectSound = () => {
  playSound(1200, 'triangle', 0.15, 0.6);
};

export const playBackSound = () => {
    playSound(400, 'sawtooth', 0.2, 0.4);
};

export const playTransitionSound = () => {
    const context = getAudioContext();
    if (!context) return;

    if (context.state === 'suspended') {
        context.resume();
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, context.currentTime);

    oscillator.frequency.setValueAtTime(300, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, context.currentTime + 0.15);
    
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.15);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.15);
}
