"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, CloudRain, Wind, BookOpen, Music } from "lucide-react";

const SOUNDS = [
    { id: "rain", name: "Rain", icon: CloudRain, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }, // Placeholders
    { id: "waves", name: "Beta Waves", icon: Wind, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: "library", name: "Library", icon: BookOpen, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export function AudioController() {
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [volume, setVolume] = useState(0.3);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleSound = (soundId: string) => {
        if (activeSound === soundId) {
            setActiveSound(null);
            audioRef.current?.pause();
        } else {
            setActiveSound(soundId);
            const sound = SOUNDS.find(s => s.id === soundId);
            if (sound && audioRef.current) {
                audioRef.current.src = sound.url;
                audioRef.current.play().catch(e => console.error("Audio playback failed", e));
            }
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.loop = true;
        }
    }, [volume]);

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl">
            <audio ref={audioRef} />

            <div className="flex gap-4">
                {SOUNDS.map((sound) => (
                    <Button
                        key={sound.id}
                        variant="ghost"
                        size="icon"
                        className={`w-12 h-12 rounded-2xl transition-all ${activeSound === sound.id
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                : "text-slate-500 hover:text-white"
                            }`}
                        onClick={() => toggleSound(sound.id)}
                    >
                        <sound.icon className="w-5 h-5" />
                    </Button>
                ))}
            </div>

            <div className="flex items-center gap-3 w-40">
                <VolumeX className="w-4 h-4 text-slate-500" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <Volume2 className="w-4 h-4 text-slate-500" />
            </div>
        </div>
    );
}
