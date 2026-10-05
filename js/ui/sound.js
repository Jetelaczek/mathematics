/**
 * Minimal Web Audio based sound effects (no audio file assets needed).
 */

function getAudioContext() {
  if (!window.__mathAppAudioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    window.__mathAppAudioCtx = new Ctx();
  }
  return window.__mathAppAudioCtx;
}

/**
 * Plays a short tone.
 * @param {number} frequency
 * @param {number} durationMs
 * @param {OscillatorType} [type]
 */
function playTone(frequency, durationMs, type = 'sine') {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.15;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    oscillator.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Audio isn't critical to functionality; ignore failures silently.
  }
}

export function playCorrectSound() {
  playTone(880, 180);
}

export function playIncorrectSound() {
  playTone(220, 250, 'sawtooth');
}

export function playCelebrationSound() {
  playTone(660, 150);
  window.setTimeout(() => playTone(880, 150), 150);
  window.setTimeout(() => playTone(1100, 220), 300);
}
