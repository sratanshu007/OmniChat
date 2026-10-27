// Web Audio API synthesizer for authentic WeChat sound effects
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.ringInterval = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Classic WeChat "Pop/Ding" incoming message tone
  playMessage() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // WeChat Red Packet (Hongbao) Gold Coin Chime
  playRedPacketCoin() {
    try {
      this.init();
      if (!this.ctx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch (e) {
      console.warn("Red packet audio error", e);
    }
  }

  // Voice note recorded "Chirp"
  playVoiceRecord() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  // WeChat Call Ringtone loop
  startRingtone() {
    try {
      this.init();
      if (this.ringInterval) clearInterval(this.ringInterval);
      const ringOnce = () => {
        if (!this.ctx) return;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(480, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(this.ctx.currentTime + 1.2);
        osc2.stop(this.ctx.currentTime + 1.2);
      };
      ringOnce();
      this.ringInterval = setInterval(ringOnce, 2400);
    } catch (e) {
      console.warn("Ringtone error", e);
    }
  }

  stopRingtone() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }
}

export const sounds = new SoundEffects();
