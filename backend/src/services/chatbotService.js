const { generateAIResponse } = require("./aiService");
const { CHATBOT_PROMPT } = require("../utils/aiPrompts");

const chatWithAI = async ({
  message,
  courseContext = "",
  assignmentContext = "",
}) => {
  const context = `
COURSE CONTEXT:
${courseContext || "No specific course context provided."}

ASSIGNMENT CONTEXT:
${assignmentContext || "No specific assignment context provided."}

STUDENT MESSAGE:
${message}
`;

  return await generateAIResponse(CHATBOT_PROMPT, context);
};

module.exports = {
  chatWithAI,
};