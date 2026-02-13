
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Necitamos service role para inspeccionar esquema si es necesario, o solo intentaremos un select.

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking columns for 'lecturas'...");
    const { data, error } = await supabase
        .from('lecturas')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching from lecturas:", error);
    } else {
        console.log("Columns found in 'lecturas':", Object.keys(data[0] || {}));
    }

    console.log("\nChecking costs in 'reading_types'...");
    const { data: costs, error: costError } = await supabase
        .from('reading_types')
        .select('code, name, credit_cost');

    if (costError) {
        console.error("Error fetching costs:", costError);
    } else {
        console.table(costs);
    }
}

checkSchema();
