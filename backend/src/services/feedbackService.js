const { generateAIResponse } = require("./aiService");
const { FEEDBACK_PROMPT } = require("../utils/aiPrompts");

const generateAssignmentFeedback = async ({
  assignmentTitle,
  assignmentDescription,
  requirements,
  studentSubmission,
}) => {
  const input = `
ASSIGNMENT TITLE:
${assignmentTitle || "Not provided"}

ASSIGNMENT DESCRIPTION:
${assignmentDescription || "Not provided"}

ASSIGNMENT REQUIREMENTS:
${requirements || "Not provided"}

STUDENT SUBMISSION:
${studentSubmission || "Not provided"}
`;

  return await generateAIResponse(FEEDBACK_PROMPT, input);
};

module.exports = {
  generateAssignmentFeedback,
};