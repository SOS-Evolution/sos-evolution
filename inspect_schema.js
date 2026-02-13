
const supabaseUrl = "https://agwutifvhdhbgawfhsix.supabase.co";
const supabaseKey = "sb_publishable_WfH57BNId1JKi19-MROoaA_dBmtR8K9"; // Anon key

async function inspectTable() {
    console.log("Inspecting 'lecturas' table columns via REST API...");
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/lecturas?select=*&limit=1`, {
            headers: {
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`
            }
        });
        const data = await response.json();
        if (data.length > 0) {
            console.log("Columns found:", Object.keys(data[0]));
        } else {
            console.log("No data found in 'lecturas', but table exists if we got here.");
            // Si la tabla no tuviera datos, intentamos ver el esquema vía OPTIONS si Supabase lo soporta
            const optionsRes = await fetch(`${supabaseUrl}/rest/v1/lecturas`, {
                method: "OPTIONS",
                headers: {
                    "apikey": supabaseKey
                }
            });
            console.log("Table exists check:", optionsRes.status);
        }
    } catch (e) {
        console.error("Inspection failed:", e);
    }
}

inspectTable();
