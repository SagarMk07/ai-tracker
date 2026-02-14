import { describe, it, expect, vi } from "vitest";
import { getTools } from "../src/lib/db";

// Mock Supabase client
vi.mock("../src/lib/supabaseClient", () => ({
    supabaseClient: {
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
            data: [{ id: "123", user_id: "fakeid123", name: "Test Tool" }],
            error: null
        }),
    },
}));

describe("Tools Database Access", () => {
    it("fetches tools for a user", async () => {
        const fakeUser = "fakeid123";
        const tools = await getTools(fakeUser);
        expect(tools[0].name).toBe("Test Tool");
    });
});
