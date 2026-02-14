const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debug() {
    console.log("Checking Supabase connection to:", supabaseUrl);

    // 1. Check Auth session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log("Current Session:", session ? "ACTIVE" : "NONE");

    // 2. Check Tables
    const tables = ['tools', 'workflows', 'ai_logs', 'users'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`- Table "${table}": ERROR [${error.code}] ${error.message}`);
        } else {
            console.log(`- Table "${table}": OK`);
        }
    }
}

debug();
