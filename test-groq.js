const Groq = require('groq-sdk');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const key = envContent.match(/GROQ_API_KEY=(.+)/)?.[1]?.trim();
console.log('Key found:', !!key, 'starts with:', key?.substring(0,8));

const g = new Groq({ apiKey: key, timeout: 15000 });

async function test() {
  try {
    const r = await g.chat.completions.create({
      messages: [{ role: 'user', content: 'Reply with valid JSON: {"test":"ok"}' }],
      model: 'openai/gpt-oss-120b',
      response_format: { type: 'json_object' },
      max_tokens: 50
    });
    console.log('SUCCESS primary model:', r.choices[0]?.message?.content);
  } catch(e) {
    console.error('ERROR primary model:', e.status, e.message);
    try {
      const r2 = await g.chat.completions.create({
        messages: [{ role: 'user', content: 'Reply with valid JSON: {"test":"ok"}' }],
        model: 'openai/gpt-oss-20b',
        response_format: { type: 'json_object' },
        max_tokens: 50
      });
      console.log('SUCCESS fallback model:', r2.choices[0]?.message?.content);
    } catch(e2) {
      console.error('ERROR fallback model:', e2.status, e2.message);
    }
  }
}

test();
