import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY_PREFIX = "focus_guardian_timer";

interface UseFocusTimerProps {
    sessionId: string;
    durationSeconds: number;
    onComplete?: () => void;
}

export function useFocusTimer({ sessionId, durationSeconds, onComplete }: UseFocusTimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true); // Start paused until explicit start
    const endTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    // Load state on mount
    useEffect(() => {
        const storageKey = `${STORAGE_KEY_PREFIX}:${sessionId}`;
        const cached = localStorage.getItem(storageKey);

        if (cached) {
            try {
                const { endTime, pausedTime, paused, lastUpdated } = JSON.parse(cached);

                if (paused) {
                    setTimeLeft(pausedTime);
                    setIsPaused(true);
                    setIsActive(false);
                } else {
                    // It was running. Calculate drift.
                    const now = Date.now();
                    // If it was running, endTime is the target.
                    const remaining = Math.max(0, Math.round((endTime - now) / 1000));

                    if (remaining === 0) {
                        setTimeLeft(0);
                        if (onComplete) onComplete();
                    } else {
                        setTimeLeft(remaining);
                        endTimeRef.current = endTime;
                        setIsActive(true);
                        setIsPaused(false);
                    }
                }
            } catch (e) {
                console.error("Failed to parse timer state", e);
            }
        }
    }, [sessionId, onComplete]);

    // Timer loop using requestAnimationFrame for smoothness
    useEffect(() => {
        if (!isActive || isPaused) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            return;
        }

        const tick = () => {
            if (!endTimeRef.current) return;
            const now = Date.now();
            const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));

            setTimeLeft(remaining);

            if (remaining <= 0) {
                setIsActive(false);
                setIsPaused(true);
                localStorage.removeItem(`${STORAGE_KEY_PREFIX}:${sessionId}`);
                if (onComplete) onComplete();
            } else {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isActive, isPaused, sessionId, onComplete]);

    // Persist state
    useEffect(() => {
        const storageKey = `${STORAGE_KEY_PREFIX}:${sessionId}`;
        if (timeLeft <= 0 && !isActive) {
            // Only clear if actually done
            return;
        }

        const state = {
            endTime: endTimeRef.current,
            pausedTime: timeLeft,
            paused: isPaused,
            lastUpdated: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [timeLeft, isPaused, isActive, sessionId]);

    const start = useCallback(() => {
        if (timeLeft <= 0) return;
        setIsActive(true);
        setIsPaused(false);
        // Set end time relative to now
        endTimeRef.current = Date.now() + timeLeft * 1000;
    }, [timeLeft]);

    const pause = useCallback(() => {
        setIsActive(false);
        setIsPaused(true);
        endTimeRef.current = null;
    }, []);

    const toggle = useCallback(() => {
        if (isActive) pause();
        else start();
    }, [isActive, pause, start]);

    const stop = useCallback(() => {
        setIsActive(false);
        setIsPaused(true);
        endTimeRef.current = null;
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}:${sessionId}`);
    }, [sessionId]);

    const formatTime = () => {
        const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
        const s = Math.floor(timeLeft % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const progress = Math.min(100, Math.max(0, ((durationSeconds - timeLeft) / durationSeconds) * 100));

    return {
        timeLeft,
        isActive,
        isPaused,
        start,
        pause,
        toggle,
        stop,
        formatTime,
        progress
    };
}
