"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, X, Mic, Minimize2, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat, ChatContext } from "@/hooks/use-chat";

interface AIChatCoachProps {
    context: ChatContext;
}

export function AIChatCoach({ context }: AIChatCoachProps) {
    const { messages, input, handleInputChange, handleSubmit, isLoading, isListening, toggleListening } = useChat(context);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-[calc(100vw-3rem)] md:w-80 h-96 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-sm font-medium text-white">Strategy Assistant</span>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 && (
                                    <div className="text-center text-slate-500 mt-10 text-sm space-y-2">
                                        <p>Ready to optimize your stack?</p>
                                        <p className="text-xs text-slate-600">
                                            I've analyzed your {context.tools?.length || 0} tools and {context.workflows?.length || 0} workflows.
                                        </p>
                                    </div>
                                )}
                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={cn(
                                            "flex w-full",
                                            m.role === "user" ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                                m.role === "user"
                                                    ? "bg-indigo-600 text-white rounded-br-none"
                                                    : "bg-slate-800 text-slate-200 rounded-bl-none"
                                            )}
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-2 flex gap-1 items-center">
                                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-100" />
                                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-black/20">
                                <div className="flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder={isListening ? "Listening..." : "Ask for strategy..."}
                                        className={cn(
                                            "h-9 bg-slate-900/50 border-white/10 text-xs focus-visible:ring-indigo-500/50",
                                            isListening && "ring-2 ring-red-500/50 border-red-500/30"
                                        )}
                                    />

                                    {/* Voice Button */}
                                    <Button
                                        size="icon"
                                        type="button"
                                        variant="ghost"
                                        onClick={toggleListening}
                                        className={cn("h-9 w-9 text-slate-400", isListening ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" : "hover:text-white")}
                                    >
                                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </Button>

                                    <Button
                                        size="icon"
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-9 w-9 bg-indigo-600 hover:bg-indigo-500"
                                    >
                                        <Send className="w-3 h-3" />
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Toggle Button */}
            <div className="pointer-events-auto">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-colors"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                </motion.button>
            </div>
        </div>
    );
}
