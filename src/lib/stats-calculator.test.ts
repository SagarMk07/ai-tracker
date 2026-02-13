import { describe, it, expect } from 'vitest';
import { calculateStats } from './stats-calculator';
import { FocusSession } from '@/types';

describe('Stats Calculator', () => {
    it('should return zeros for empty sessions', () => {
        const stats = calculateStats([]);
        expect(stats).toEqual({
            totalFocusMinutes: 0,
            sessionsCompleted: 0,
            streakDays: 0
        });
    });

    it('should calculate total minutes correctly', () => {
        const sessions: FocusSession[] = [
            { id: '1', user_id: 'u1', duration_seconds: 1500, completed: true, started_at: '2023-01-01T10:00:00Z', intent: 'test' }, // 25 min
            { id: '2', user_id: 'u1', duration_seconds: 1500, completed: true, started_at: '2023-01-01T11:00:00Z', intent: 'test' }, // 25 min
        ];
        const stats = calculateStats(sessions);
        expect(stats.totalFocusMinutes).toBe(50);
        expect(stats.sessionsCompleted).toBe(2);
    });

    it('should ignore uncompleted sessions', () => {
        const sessions: FocusSession[] = [
            { id: '1', user_id: 'u1', duration_seconds: 1500, completed: true, started_at: '2023-01-01T10:00:00Z', intent: 'test' },
            { id: '2', user_id: 'u1', duration_seconds: 3000, completed: false, started_at: '2023-01-01T11:00:00Z', intent: 'test' },
        ];
        const stats = calculateStats(sessions);
        expect(stats.totalFocusMinutes).toBe(25);
        expect(stats.sessionsCompleted).toBe(1);
    });

    it('should calculate unique active days correctly', () => {
        const sessions: FocusSession[] = [
            { id: '1', user_id: 'u1', duration_seconds: 60, completed: true, started_at: '2023-01-01T10:00:00Z', intent: 'test' },
            { id: '2', user_id: 'u1', duration_seconds: 60, completed: true, started_at: '2023-01-01T15:00:00Z', intent: 'test' }, // Same day
            { id: '3', user_id: 'u1', duration_seconds: 60, completed: true, started_at: '2023-01-02T10:00:00Z', intent: 'test' }, // Next day
        ];
        const stats = calculateStats(sessions);
        expect(stats.streakDays).toBe(2);
    });
});
