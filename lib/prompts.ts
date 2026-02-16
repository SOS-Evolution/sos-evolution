import { createClient } from '@/lib/supabase/server';

/**
 * Retrieves a system prompt from the database and interpolates variables.
 * @param code The unique code of the prompt (e.g., 'tarot_user')
 * @param variables An object containing variable names and their values
 * @returns The processed prompt string
 */
export async function getPrompt(code: string, variables: Record<string, string | number> = {}): Promise<string> {
    const supabase = await createClient();

    // 1. Fetch from DB
    const { data: promptData, error } = await supabase
        .from('system_prompts')
        .select('template')
        .eq('code', code)
        .single();

    if (error || !promptData) {
        console.error(`PromptManager Error: Could not fetch prompt '${code}'`, error);
        // Fallback strategy could be implemented here, but for now we throw to alert dev
        throw new Error(`System Prompt '${code}' not found or database error.`);
    }

    let template = promptData.template;

    // 2. Interpolate
    // Replaces {{variableName}} with value
    Object.entries(variables).forEach(([key, value]) => {
        // Use a more robust regex to handle potential spaces inside {{ key }}
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        template = template.replace(regex, String(value));
    });

    // 3. (Optional) Safety check for unreplaced variables
    // We log a warning but don't fail, as some prompts might have optional sections
    if (template.match(/{{.*?}}/)) {
        console.warn(`PromptManager Warning: Unreplaced variables remaining in '${code}'`);
    }

    return template;
}
