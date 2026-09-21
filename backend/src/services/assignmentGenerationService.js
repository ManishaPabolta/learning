const { generateAIResponse } = require("./aiService");
const {
  ASSIGNMENT_GENERATION_PROMPT,
} = require("../utils/aiPrompts");

const generateAssignment = async ({
  topic,
  difficulty = "Beginner",
  courseName = "",
}) => {
  const input = `
COURSE:
${courseName || "Not specified"}

TOPIC:
${topic}

DIFFICULTY:
${difficulty}
`;

  return await generateAIResponse(
    ASSIGNMENT_GENERATION_PROMPT,
    input
  );
};

module.exports = {
  generateAssignment,
};