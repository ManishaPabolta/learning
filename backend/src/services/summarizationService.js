const { generateAIResponse } = require("./aiService");
const { SUMMARY_PROMPT } = require("../utils/aiPrompts");

const summarizeContent = async (content) => {
  if (!content || !content.trim()) {
    throw new Error("Content is required for summarization");
  }

  return await generateAIResponse(
    SUMMARY_PROMPT,
    content
  );
};

module.exports = {
  summarizeContent,
};