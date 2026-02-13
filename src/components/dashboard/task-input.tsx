"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskInputProps {
    onAdd: (title: string, zone: "todo" | "wishlist") => void;
    onCancel: () => void;
    zone: "todo" | "wishlist";
}

export function TaskInput({ onAdd, onCancel, zone }: TaskInputProps) {
    const [title, setTitle] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && title.trim()) {
            onAdd(title, zone);
        } else if (e.key === "Escape") {
            onCancel();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/50 bg-surface/60"
        >
            <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>

            <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={zone === "todo" ? "What needs focus?" : "Add to wishlist..."}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500"
            />

            <div className="flex items-center gap-1">
                <button onClick={() => onAdd(title, zone)} disabled={!title.trim()} className="p-1 hover:text-indigo-400 text-slate-500 transition-colors">
                    <Check className="w-4 h-4" />
                </button>
                <button onClick={onCancel} className="p-1 hover:text-red-400 text-slate-500 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}
