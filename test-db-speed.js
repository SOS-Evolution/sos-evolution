import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Use anon key to simulate client/middleware behavior through RLS
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    // 1. First we need to log in to get a session
    // We'll just do a general select first to see if it's the network or RLS
    console.time('Generic Select');
    await supabase.from('system_prompts').select('code').limit(1);
    console.timeEnd('Generic Select');

    // We don't have user credentials here, so let's try calling RPC as anon and see if it's slow
    console.time('Admin RPC get_admin_stats (anonymous)');
    const res1 = await supabase.rpc('get_admin_stats');
    console.timeEnd('Admin RPC get_admin_stats (anonymous)');
    console.log('RPC result (expect error):', res1.error?.message);

}

test();
