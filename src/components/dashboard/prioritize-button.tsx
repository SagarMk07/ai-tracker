"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function PrioritizeButton() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handlePrioritize = () => {
        setIsAnalyzing(true);
        // Mock analysis delay
        setTimeout(() => {
            setIsAnalyzing(false);
            // In future: trigger reorder
        }, 2000);
    };

    return (
        <Button
            onClick={handlePrioritize}
            disabled={isAnalyzing}
            className="relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white border-0"
        >
            <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {isAnalyzing ? "Analyzing..." : "AI Prioritize"}
            </span>
            {isAnalyzing && (
                <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
            )}
        </Button>
    );
}
