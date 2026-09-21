const { generateAIResponse } = require("./aiService");
const {
  RECOMMENDATION_PROMPT,
} = require("../utils/aiPrompts");

const generateRecommendations = async ({
  studentProfile,
  enrolledCourses,
  completedCourses,
  availableCourses,
  performance,
}) => {
  const input = `
STUDENT PROFILE:
${JSON.stringify(studentProfile || {}, null, 2)}

ENROLLED COURSES:
${JSON.stringify(enrolledCourses || [], null, 2)}

COMPLETED COURSES:
${JSON.stringify(completedCourses || [], null, 2)}

STUDENT PERFORMANCE:
${JSON.stringify(performance || {}, null, 2)}

AVAILABLE COURSES:
${JSON.stringify(availableCourses || [], null, 2)}
`;

  return await generateAIResponse(
    RECOMMENDATION_PROMPT,
    input
  );
};

module.exports = {
  generateRecommendations,
};