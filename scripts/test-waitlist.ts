
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Manually parse .env.local to avoid dotenv dependency issues
const envPath = path.resolve(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = envContent.split("\n").reduce((acc, line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim(); // Handle values with =
        if (key && value) {
            acc[key] = value;
        }
    }
    return acc;
}, {} as Record<string, string>);

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("Missing environment variables in .env.local");
    process.exit(1);
}

const supabase = createClient(url, key);

async function testWaitlist() {
    console.log("Testing connection...");
    const testEmail = `test-${Date.now()}@example.com`;

    const { data, error } = await supabase
        .from("waitlist")
        .insert({ email: testEmail })
        .select();

    if (error) {
        console.error("❌ Insertion Failed:", error);
        if (error.code === '42P01') {
            console.error("Cause: Table 'waitlist' does not exist.");
        } else if (error.code === '42501') {
            console.error("Cause: RLS Policy violation (Permission denied).");
        }
    } else {
        console.log("✅ Insertion Successful:", data);
    }
}

testWaitlist();
