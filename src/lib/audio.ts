/** Lightweight synthesized interaction sound; no audio downloads or external service. */
let sharedAudioContext: AudioContext | null = null;
export function getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined')
        return null;
    const AudioContextClass = window.AudioContext || (window as unknown as {
        webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    if (!AudioContextClass)
        return null;
    try {
        if (!sharedAudioContext || sharedAudioContext.state === 'closed')
            sharedAudioContext = new AudioContextClass();
        return sharedAudioContext;
    }
    catch {
        return null;
    }
}
export function isAudioSupported(): boolean {
    if (typeof window === 'undefined')
        return false;
    return Boolean(window.AudioContext || (window as unknown as {
        webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext);
}
export interface CheckClickSoundOptions {
    isCompleting?: boolean;
    volume?: number;
    audioContext?: AudioContext | null;
}
export function playCheckClickSound(options: CheckClickSoundOptions = {}): boolean {
    try {
        const ctx = options.audioContext !== undefined ? options.audioContext : getAudioContext();
        if (!ctx || options.volume === 0)
            return false;
        if (ctx.state === 'suspended')
            ctx.resume().catch(() => { });
        const { isCompleting = true, volume = 0.7 } = options;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        if (isCompleting) {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(620, now);
            osc.frequency.exponentialRampToValueAtTime(320, now + 0.038);
            const peakGain = Math.max(0.01, Math.min(0.12, 0.07 * volume));
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(peakGain, now + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.045);
        }
        else {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(420, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.028);
            const peakGain = Math.max(0.01, Math.min(0.1, 0.05 * volume));
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(peakGain, now + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.035);
        }
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        return true;
    }
    catch {
        return false;
    }
}
