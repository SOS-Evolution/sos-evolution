
const supabaseUrl = "https://agwutifvhdhbgawfhsix.supabase.co";
const supabaseKey = "sb_publishable_WfH57BNId1JKi19-MROoaA_dBmtR8K9"; // Anon key

async function testInsert() {
    console.log("Testing insert into 'lecturas' to see error...");
    const dummyData = {
        card_name: "El Loco",
        keywords: ["inicio", "aventura", "libertad"],
        description: "Test description",
        action: "Test action",
        user_id: "00000000-0000-0000-0000-000000000000" // Dummy ID
    };

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/lecturas`, {
            method: "POST",
            headers: {
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify(dummyData)
        });
        const result = await response.json();
        console.log("Insert result status:", response.status);
        console.log("Insert result body:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testInsert();
