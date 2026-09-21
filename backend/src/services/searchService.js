const { generateAIResponse } = require("./aiService");
const { SEARCH_PROMPT } = require("../utils/aiPrompts");

const searchCoursesWithAI = async ({
  query,
  courses,
}) => {
  if (!query || !query.trim()) {
    throw new Error("Search query is required");
  }

  const input = `
USER QUERY:
${query}

AVAILABLE COURSES:
${JSON.stringify(courses || [], null, 2)}
`;

  return await generateAIResponse(
    SEARCH_PROMPT,
    input
  );
};

module.exports = {
  searchCoursesWithAI,
};