/** Tiny 8-bit sound effects made with a square-wave oscillator (no audio files). */
let ctx: AudioContext | null = null;

function tone(freq: number, ms: number, volume: number, delayMs = 0) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = ctx ?? new AC();
    const start = ctx.currentTime + delayMs / 1000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + ms / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + ms / 1000 + 0.02);
  } catch {
    /* audio blocked or unsupported: stay silent */
  }
}

/** One text character appearing. */
export const blip = () => tone(560 + Math.random() * 80, 30, 0.035);
/** Guide appears. */
export const chime = () => {
  tone(660, 90, 0.05);
  tone(880, 120, 0.05, 90);
};
/** A menu choice picked. */
export const select = () => tone(740, 70, 0.05);
