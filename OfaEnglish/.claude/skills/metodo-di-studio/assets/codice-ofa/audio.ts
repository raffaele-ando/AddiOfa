import confetti from 'canvas-confetti';

// Audio Context singleton for zero-latency Web Audio sound synthesis
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('sound_muted') === 'true';
}

export function setAudioMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sound_muted', muted ? 'true' : 'false');
}

/**
 * Gentle haptic feedback on devices that support vibration
 */
export function triggerHaptic(type: 'light' | 'success' | 'error' | 'celebration' = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    if (type === 'light') {
      navigator.vibrate(10);
    } else if (type === 'success') {
      navigator.vibrate([15, 30, 25]);
    } else if (type === 'error') {
      navigator.vibrate([30, 40, 30]);
    } else if (type === 'celebration') {
      navigator.vibrate([40, 40, 60, 40, 100]);
    }
  } catch {
    // Ignore unsupported devices
  }
}

/**
 * Plays a light, crisp tap/pop sound for UI interactions (e.g. option clicks)
 */
export function playTapSound() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

/**
 * Addictive, uplifting Duolingo-style major chord chime for correct answers
 */
export function playCorrectSound(streak: number = 0) {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Base frequencies: C5, E5, G5, C6 (add pitch boost on streak)
  const baseFreqs = [523.25, 659.25, 783.99, 1046.50];
  const pitchMultiplier = streak > 2 ? 1 + Math.min(0.2, (streak - 2) * 0.04) : 1;

  baseFreqs.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // warm, cheerful chime tone
    osc.frequency.setValueAtTime(freq * pitchMultiplier, now + index * 0.06);

    const startTime = now + index * 0.06;
    const duration = 0.35 + index * 0.04;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  });

  // Add subtle high sparkle
  const sparkle = ctx.createOscillator();
  const sparkleGain = ctx.createGain();
  sparkle.type = 'sine';
  sparkle.frequency.setValueAtTime(1567.98 * pitchMultiplier, now + 0.18);
  sparkleGain.gain.setValueAtTime(0.08, now + 0.18);
  sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
  sparkle.connect(sparkleGain);
  sparkleGain.connect(ctx.destination);
  sparkle.start(now + 0.18);
  sparkle.stop(now + 0.5);

  triggerHaptic('success');
}

/**
 * Soft, gentle "thud" for incorrect answers (instructive, not discouraging)
 */
export function playIncorrectSound() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(260, now);
  osc1.frequency.exponentialRampToValueAtTime(180, now + 0.12);

  gain1.gain.setValueAtTime(0.18, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.16);

  // Second low-pitch bump
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(190, now + 0.08);
  osc2.frequency.exponentialRampToValueAtTime(120, now + 0.22);

  gain2.gain.setValueAtTime(0.14, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc2.start(now + 0.08);
  osc2.stop(now + 0.25);

  triggerHaptic('error');
}

/**
 * Triumphant fanfare for finishing a practice session or passing an exam
 */
export function playVictorySound() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, time: 0, dur: 0.12 },     // C5
    { freq: 659.25, time: 0.12, dur: 0.12 },  // E5
    { freq: 783.99, time: 0.24, dur: 0.14 },  // G5
    { freq: 1046.50, time: 0.38, dur: 0.4 },  // C6
    { freq: 1318.51, time: 0.48, dur: 0.5 }   // E6
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0, now + time);
    gain.gain.linearRampToValueAtTime(0.2, now + time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + time);
    osc.stop(now + time + dur + 0.05);
  });

  triggerHaptic('celebration');
}

/**
 * Vibrant Confetti Triggers for rewarding progress and addictive feedback
 */
export function triggerConfetti(type: 'burst' | 'cannon' | 'celebration' | 'mini' = 'burst') {
  if (typeof window === 'undefined') return;

  const polimiColors = ['#1CB0F6', '#58CC02', '#FFC800', '#CE82FF', '#FF4B4B', '#2DD4BF'];

  if (type === 'mini') {
    // Quick burst on single correct answer
    confetti({
      particleCount: 28,
      spread: 55,
      origin: { y: 0.75 },
      colors: polimiColors,
      ticks: 120,
      gravity: 1.2,
      scalar: 0.85,
      disableForReducedMotion: true
    });
  } else if (type === 'burst') {
    // Joyful medium burst (e.g. 3+ streak)
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.65 },
      colors: polimiColors,
      ticks: 180,
      gravity: 1,
      scalar: 1,
      disableForReducedMotion: true
    });
  } else if (type === 'cannon') {
    // Two side cannons for big streaks or exam success
    const end = Date.now() + 600;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: polimiColors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: polimiColors
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  } else if (type === 'celebration') {
    // Full grand celebration (session complete / exam passed)
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: polimiColors,
      ticks: 250
    });
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: polimiColors
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors: polimiColors
      });
    }, 200);
  }
}
