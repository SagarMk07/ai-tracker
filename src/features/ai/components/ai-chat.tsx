"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, sendMessage, status } = useChat({
        api: "/api/ai/chat",
    } as any);
    const isLoading = status === "streaming" || status === "submitted";
    const [inputVal, setInputVal] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    async function handleSend(e?: React.FormEvent) {
        e?.preventDefault();
        if (!inputVal.trim()) return;

        const content = inputVal;
        setInputVal(""); // Optimistic clear

        try {
            await sendMessage({
                role: 'user',
                content: content
            } as any); // Cast to avoid strict type checks if Message type is mismatch
        } catch (err) {
            console.error("Failed to send message", err);
        }
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-secondary)]/95 shadow-2xl backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[var(--border-soft)] bg-[var(--bg-primary)]/50 p-4 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-[var(--text-primary)]">Focus Guardian</h3>
                                    <p className="text-xs text-[var(--text-muted)]">Always online</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full px-0" onClick={() => setIsOpen(false)}>
                                <Minimize2 size={16} />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="flex h-full flex-col items-center justify-center text-center text-[var(--text-muted)] opacity-60">
                                    <Sparkles size={32} className="mb-2" />
                                    <p className="text-sm">How can I help you focus today?</p>
                                </div>
                            )}

                            {messages.map((m: any) => (
                                <div
                                    key={m.id}
                                    className={cn(
                                        "flex flex-col max-w-[85%] space-y-1",
                                        m.role === "user" ? "self-end items-end" : "self-start items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "rounded-2xl px-4 py-2 text-sm",
                                            m.role === "user"
                                                ? "bg-[var(--accent)] text-white"
                                                : "bg-[var(--bg-primary)] border border-[var(--border-soft)] text-[var(--text-secondary)]"
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="self-start rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-soft)] px-4 py-2">
                                    <Loader2 size={16} className="animate-spin text-[var(--text-muted)]" />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="border-t border-[var(--border-soft)] p-3 bg-[var(--bg-primary)]/30 backdrop-blur-md">
                            <div className="relative flex items-center gap-2">
                                <Input
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    placeholder="Ask for help..."
                                    className="rounded-full bg-[var(--bg-primary)] pr-10 focus-visible:ring-[var(--accent)]"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isLoading || !inputVal.trim()}
                                    className="absolute right-1 top-1 h-8 w-8 rounded-full px-0 bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90"
                                >
                                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 transition-colors hover:bg-[var(--accent)]/90"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>
        </>
    );
}
