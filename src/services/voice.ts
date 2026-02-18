"use client";

class VoiceService {
    private synthesis: SpeechSynthesis | null = null;
    private voice: SpeechSynthesisVoice | null = null;

    constructor() {
        if (typeof window !== "undefined") {
            this.synthesis = window.speechSynthesis;
        }
    }

    private loadVoice() {
        if (!this.synthesis) return;

        const voices = this.synthesis.getVoices();
        // Prefer a premium sounding voice if available (e.g., Google US English, Samantha, etc.)
        this.voice =
            voices.find(v => v.name.includes("Google US English")) ||
            voices.find(v => v.name.includes("Samantha")) ||
            voices.find(v => v.lang === "en-US") ||
            voices[0];
    }

    speak(text: string) {
        if (!this.synthesis) return;

        // Retry loading voice if not yet available (voices load asynchronously in some browsers)
        if (!this.voice) {
            this.loadVoice();
            if (!this.voice && this.synthesis.getVoices().length === 0) {
                // Wait for voiceschanged event
                this.synthesis.onvoiceschanged = () => {
                    this.loadVoice();
                    this.doSpeak(text);
                };
                return;
            }
        }

        this.doSpeak(text);
    }

    private doSpeak(text: string) {
        if (!this.synthesis) return;

        // Cancel current speech to avoid queue buildup
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (this.voice) utterance.voice = this.voice;

        utterance.rate = 0.9; // Slightly slower for more gravitas
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        this.synthesis.speak(utterance);
    }
}

export const voice = new VoiceService();
