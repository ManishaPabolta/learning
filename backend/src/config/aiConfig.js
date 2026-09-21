const OpenAI = require("openai");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const AI_MODEL =
  process.env.GROQ_MODEL ||
  "openai/gpt-oss-20b";

let client = null;

if (GROQ_API_KEY) {
  client = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  console.log("✅ Groq AI configured successfully");
  console.log(`🤖 AI Model: ${AI_MODEL}`);
} else {
  console.warn(
    "⚠️ GROQ_API_KEY is not configured. AI features are disabled."
  );
}

module.exports = {
  client,
  AI_MODEL,
};