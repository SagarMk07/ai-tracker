"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, CloudRain, Waves, Library } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SoundType = "rain" | "waves" | "library" | "off";

const SOUNDS = [
    { id: "rain", label: "Deep Rain", icon: CloudRain, url: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3" }, // Placeholder URL
    { id: "waves", label: "Beta Waves", icon: Waves, url: "https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3" }, // Placeholder (using typing for now as "work" sound) or actual waves
    { id: "library", label: "Library", icon: Library, url: "https://assets.mixkit.co/sfx/preview/mixkit-office-ambience-loop-472.mp3" },
];

// Note: Real "Beta Waves" usually need generated tones. We'll stick to mp3s for MVP.

export function AmbientPlayer() {
    const [activeSound, setActiveSound] = useState<SoundType>("off");
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        if (activeSound === "off") {
            audioRef.current.pause();
            audioRef.current.src = "";
        } else {
            const sound = SOUNDS.find(s => s.id === activeSound);
            if (sound) {
                audioRef.current.src = sound.url;
                audioRef.current.volume = volume;
                audioRef.current.play().catch(e => console.error("Audio play failed", e));
            }
        }
    }, [activeSound]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Player UI */}
            <div className="bg-surface/80 backdrop-blur-md border border-white/10 rounded-full flex items-center p-2 gap-4 shadow-lg active:scale-[0.99] transition-transform">

                {/* Sound Selector */}
                <div className="flex gap-1">
                    {SOUNDS.map((sound) => {
                        const Icon = sound.icon;
                        const isActive = activeSound === sound.id;
                        return (
                            <button
                                key={sound.id}
                                onClick={() => setActiveSound(isActive ? "off" : sound.id as SoundType)}
                                className={cn(
                                    "p-2 rounded-full transition-all duration-300 relative",
                                    isActive ? "bg-indigo-500/20 text-indigo-300" : "hover:bg-white/5 text-slate-400 hover:text-white"
                                )}
                                title={sound.label}
                            >
                                <Icon className="w-5 h-5" />
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Vertical Separator */}
                <div className="w-px h-6 bg-white/10" />

                {/* Volume Control (Simple Toggle for now, or slide) */}
                <div className="flex items-center gap-2 pr-2">
                    <button onClick={() => setVolume(v => v === 0 ? 0.5 : 0)} className="text-slate-400 hover:text-white">
                        {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    {/* Simple Volume Slider */}
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
            </div>

            {/* Hidden Audio Element */}
            <audio ref={audioRef} loop crossOrigin="anonymous" className="hidden" />
        </div>
    );
}
