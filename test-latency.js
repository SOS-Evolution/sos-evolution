import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLatency() {
    console.log("Testing Supabase auth latency...");

    console.time('Generic Select');
    await supabase.from('system_prompts').select('code').limit(1);
    console.timeEnd('Generic Select');

    // Test getUser network hop
    console.time('getUser (first call)');
    await supabase.auth.getUser();
    console.timeEnd('getUser (first call)');

    console.time('getUser (second call)');
    await supabase.auth.getUser();
    console.timeEnd('getUser (second call)');

    // Testing RPC without auth
    console.time('RPC call');
    await supabase.rpc('get_admin_stats');
    console.timeEnd('RPC call');
}

testLatency();
