const SOUND_PREF_KEY = "spaceShooterGame:soundEnabled";

function canUseAudio() {
  return typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
}

function readSoundPreference() {
  if (typeof window === "undefined") return true;

  try {
    return window.localStorage.getItem(SOUND_PREF_KEY) !== "false";
  } catch {
    return true;
  }
}

function writeSoundPreference(enabled) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(SOUND_PREF_KEY, enabled ? "true" : "false");
  } catch {
    // Sound remains usable for this session even if localStorage is blocked.
  }
}

export class SoundSystem {
  constructor() {
    this.enabled = readSoundPreference();
    this.context = null;
    this.masterGain = null;
  }

  prime() {
    if (!this.enabled || !canUseAudio()) return null;

    try {
      if (!this.context) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContextClass();
        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = 0.12;
        this.masterGain.connect(this.context.destination);
      }

      if (this.context.state === "suspended") {
        this.context.resume();
      }

      return this.context;
    } catch {
      return null;
    }
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    writeSoundPreference(this.enabled);

    if (this.enabled) {
      this.prime();
      this.playTone({ frequency: 620, endFrequency: 880, duration: 0.08, gain: 0.11, type: "triangle" });
    }

    return this.enabled;
  }

  toggle() {
    return this.setEnabled(!this.enabled);
  }

  close() {
    if (!this.context) return;
    this.context.close();
    this.context = null;
    this.masterGain = null;
  }

  playTone({ frequency, endFrequency, duration, gain = 0.08, type = "sine", delay = 0 }) {
    const context = this.prime();
    if (!context || !this.masterGain) return;

    const startAt = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);

    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), startAt + duration);
    }

    envelope.gain.setValueAtTime(0.0001, startAt);
    envelope.gain.exponentialRampToValueAtTime(gain, startAt + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    oscillator.connect(envelope);
    envelope.connect(this.masterGain);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  }

  playNoise({ duration = 0.18, gain = 0.08, frequency = 900 } = {}) {
    const context = this.prime();
    if (!context || !this.masterGain) return;

    const sampleCount = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < sampleCount; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / sampleCount);
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    const now = context.currentTime;

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(frequency, now);
    envelope.gain.setValueAtTime(gain, now);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.masterGain);
    source.start(now);
    source.stop(now + duration + 0.02);
  }

  shoot() {
    this.playTone({ frequency: 980, endFrequency: 1320, duration: 0.055, gain: 0.06, type: "square" });
  }

  enemyShoot() {
    this.playTone({ frequency: 520, endFrequency: 360, duration: 0.07, gain: 0.035, type: "square" });
  }

  hit() {
    this.playTone({ frequency: 360, endFrequency: 220, duration: 0.075, gain: 0.055, type: "triangle" });
  }

  destroy() {
    this.playNoise({ duration: 0.16, gain: 0.07, frequency: 1200 });
    this.playTone({ frequency: 180, endFrequency: 80, duration: 0.18, gain: 0.055, type: "sawtooth" });
  }

  damage() {
    this.playTone({ frequency: 260, endFrequency: 120, duration: 0.2, gain: 0.09, type: "sawtooth" });
  }

  pause() {
    this.playTone({ frequency: 520, endFrequency: 390, duration: 0.07, gain: 0.045, type: "triangle" });
  }

  win() {
    [520, 660, 780, 1040].forEach((frequency, index) => {
      this.playTone({
        frequency,
        endFrequency: frequency * 1.08,
        duration: 0.13,
        gain: 0.06,
        type: "triangle",
        delay: index * 0.08
      });
    });
  }

  gameOver() {
    [280, 210, 140].forEach((frequency, index) => {
      this.playTone({
        frequency,
        endFrequency: frequency * 0.75,
        duration: 0.16,
        gain: 0.07,
        type: "sawtooth",
        delay: index * 0.09
      });
    });
  }
}
