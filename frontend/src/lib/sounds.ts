const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

// Helper to create a simple tone
const playTone = (ctx: AudioContext, freq: number, type: OscillatorType, startTime: number, duration: number, vol: number = 0.1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
};

export const playRandomMotivatingSound = () => {
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // 3 Variations of "Success"
    const variants = [
        // 1. Bright Rising Triad (C5)
        () => {
            playTone(ctx, 523.25, 'sine', now, 0.4, 0.1);
            playTone(ctx, 659.25, 'triangle', now + 0.1, 0.4, 0.1);
            playTone(ctx, 783.99, 'sine', now + 0.2, 0.6, 0.1);
        },
        // 2. Quick Pentatonic Run (F5)
        () => {
            playTone(ctx, 698.46, 'sine', now, 0.3, 0.1); // F5
            playTone(ctx, 880.00, 'sine', now + 0.08, 0.3, 0.1); // A5
            playTone(ctx, 1046.50, 'triangle', now + 0.16, 0.5, 0.1); // C6
        },
        // 3. Gentle "Bubble" Pop (Synth-like)
        () => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);

            // Echo
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.frequency.setValueAtTime(600, ctx.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                gain2.gain.setValueAtTime(0.1, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start(ctx.currentTime);
                osc2.stop(ctx.currentTime + 0.2);
            }, 100);
        }
    ];

    // Pick one randomly
    const pick = variants[Math.floor(Math.random() * variants.length)];
    pick();
};

export const playCompletionSound = () => {
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Grand Fanfare - Climbing Scale
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.05, now + (i * 0.15));
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.15) + 0.4);

        osc.start(now + (i * 0.15));
        osc.stop(now + (i * 0.15) + 0.4);
    });

    // Final Chord (C6 Major)
    const finalStart = now + 0.6;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.1, finalStart);
        gain.gain.linearRampToValueAtTime(0.2, finalStart + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, finalStart + 2.0);

        osc.start(finalStart);
        osc.stop(finalStart + 2.0);
    });
};
