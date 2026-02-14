import { describe, it, expect, vi } from 'vitest';
import { generateWorkflowRecommendations } from './openai';
import { logAICall } from './ai-logger';

// Mock OpenAI
vi.mock('openai', () => {
    class MockOpenAI {
        chat = {
            completions: {
                create: vi.fn().mockResolvedValue({
                    choices: [{
                        message: {
                            content: JSON.stringify({
                                workflows: [{
                                    name: 'Test Workflow',
                                    description: 'Test Desc',
                                    trigger: 'Test Trigger',
                                    actions: []
                                }]
                            })
                        }
                    }]
                })
            }
        };
    }
    return { OpenAI: MockOpenAI };
});

// Mock Supabase Server Component
vi.mock('./supabase/server', () => ({
    createServerClientComponent: vi.fn().mockImplementation(() => ({
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue({ error: null }),
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })
        }
    }))
}));

describe('AI Integration Utils', () => {
    it('should generate workflow recommendations', async () => {
        const recommendations = await generateWorkflowRecommendations(['Tool A', 'Tool B']);
        expect(recommendations).toHaveLength(1);
        expect(recommendations[0].name).toBe('Test Workflow');
    });

    it('should log AI calls without error', async () => {
        // This is a simple test to ensure it doesn't throw
        await expect(logAICall({
            userId: 'u1',
            prompt: 'test prompt',
            response: 'test response'
        })).resolves.not.toThrow();
    });
});
