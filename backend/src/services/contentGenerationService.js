const { generateAIResponse } = require("./aiService");
const {
  COURSE_GENERATION_PROMPT,
} = require("../utils/aiPrompts");

const generateCourseContent = async ({
  topic,
  difficulty = "Beginner",
  audience = "Students",
  duration = "",
}) => {
  const input = `
TOPIC:
${topic}

DIFFICULTY:
${difficulty}

TARGET AUDIENCE:
${audience}

EXPECTED DURATION:
${duration || "Not specified"}
`;

  return await generateAIResponse(
    COURSE_GENERATION_PROMPT,
    input
  );
};

module.exports = {
  generateCourseContent,
};