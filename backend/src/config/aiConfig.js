const OpenAI = require("openai");

if (!process.env.GROQ_API_KEY) {
  console.warn(
    "⚠️ GROQ_API_KEY is not configured in .env"
  );
}

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const AI_MODEL =
  process.env.GROQ_MODEL ||
  "openai/gpt-oss-20b";

module.exports = {
  client,
  AI_MODEL,
};