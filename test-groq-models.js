const Groq = require('groq-sdk');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const key = envContent.match(/GROQ_API_KEY=(.+)/)?.[1]?.trim();

const g = new Groq({ apiKey: key, timeout: 20000 });

// All models from the list
const models = [
  'openai/gpt-oss-safeguard-20b',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
  'qwen/qwen3.8-27b',
  'groq/compound-mini',
  'groq/compound',
  'allam-2-7b',
  'whisper-large-v3',
  'whisper-large-v3-turbo',
];

async function testModel(model) {
  try {
    const r = await g.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Always respond with valid JSON.' },
        { role: 'user', content: 'Give me a JSON object with key "status" set to "ok"' }
      ],
      model,
      response_format: { type: 'json_object' },
      max_tokens: 100
    });
    const content = r.choices[0]?.message?.content;
    console.log(`✅ ${model}: ${content?.substring(0,60)}`);
    return true;
  } catch(e) {
    // Try without json_object mode
    try {
      const r2 = await g.chat.completions.create({
        messages: [
          { role: 'system', content: 'Always respond with valid JSON only. No extra text.' },
          { role: 'user', content: 'Give me exactly this JSON: {"status":"ok"}' }
        ],
        model,
        max_tokens: 100
      });
      const content = r2.choices[0]?.message?.content;
      console.log(`⚠️  ${model} (no json mode): ${content?.substring(0,60)}`);
      return 'noJsonMode';
    } catch(e2) {
      console.log(`❌ ${model}: ${e.status} - ${String(e.message).substring(0,80)}`);
      return false;
    }
  }
}

async function main() {
  for (const m of models) {
    await testModel(m);
  }
}

main().catch(console.error);
