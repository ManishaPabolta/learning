const {
  chatWithAI,
} = require("../services/chatbotService");

const {
  generateAssignmentFeedback,
} = require("../services/feedbackService");

const {
  generateCourseContent,
} = require("../services/contentGenerationService");

const {
  generateAssignment,
} = require("../services/assignmentGenerationService");

const {
  summarizeContent,
} = require("../services/summarizationService");

const {
  generateRecommendations,
} = require("../services/recommendationService");

const {
  searchCoursesWithAI,
} = require("../services/searchService");


// ======================================================
// COLLABSPHERE AI SERVICES
// ======================================================

const {
  explainNote,
  improveNote,
  explainCode,
  generateDocumentation,
  generateReadme,
} = require("../services/aiService");


// ======================================================
// AI CHATBOT
// ======================================================

const chat = async (req, res) => {
  try {
    const {
      message,
      courseContext,
      assignmentContext,
    } = req.body;

    if (
      !message ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response =
      await chatWithAI({
        message,
        courseContext,
        assignmentContext,
      });

    return res.status(200).json({
      success: true,
      message:
        "AI response generated successfully",

      data: {
        response,
      },
    });
  } catch (error) {
    console.error(
      "AI Chat Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "AI chat failed",
    });
  }
};


// ======================================================
// AI ASSIGNMENT FEEDBACK
// ======================================================

const generateFeedback = async (
  req,
  res
) => {
  try {
    const {
      assignmentTitle,
      assignmentDescription,
      requirements,
      studentSubmission,
    } = req.body;

    if (!studentSubmission) {
      return res.status(400).json({
        success: false,
        message:
          "Student submission is required",
      });
    }

    const feedback =
      await generateAssignmentFeedback({
        assignmentTitle,
        assignmentDescription,
        requirements,
        studentSubmission,
      });

    return res.status(200).json({
      success: true,
      message:
        "AI feedback generated successfully",

      data: {
        feedback,
      },
    });
  } catch (error) {
    console.error(
      "AI Feedback Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate feedback",
    });
  }
};


// ======================================================
// AI COURSE GENERATOR
// ======================================================

const generateCourse = async (
  req,
  res
) => {
  try {
    const {
      topic,
      difficulty,
      audience,
      duration,
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message:
          "Course topic is required",
      });
    }

    const course =
      await generateCourseContent({
        topic,
        difficulty,
        audience,
        duration,
      });

    return res.status(200).json({
      success: true,
      message:
        "Course content generated successfully",

      data: {
        course,
      },
    });
  } catch (error) {
    console.error(
      "AI Course Generation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate course",
    });
  }
};


// ======================================================
// AI ASSIGNMENT GENERATOR
// ======================================================

const createAssignmentWithAI = async (
  req,
  res
) => {
  try {
    const {
      topic,
      difficulty,
      courseName,
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message:
          "Assignment topic is required",
      });
    }

    const assignment =
      await generateAssignment({
        topic,
        difficulty,
        courseName,
      });

    return res.status(200).json({
      success: true,
      message:
        "Assignment generated successfully",

      data: {
        assignment,
      },
    });
  } catch (error) {
    console.error(
      "AI Assignment Generation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate assignment",
    });
  }
};


// ======================================================
// AI SUMMARIZATION
// ======================================================

const summarize = async (
  req,
  res
) => {
  try {
    const {
      content,
    } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message:
          "Content is required",
      });
    }

    const summary =
      await summarizeContent(
        content
      );

    return res.status(200).json({
      success: true,
      message:
        "Content summarized successfully",

      data: {
        summary,
      },
    });
  } catch (error) {
    console.error(
      "AI Summary Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to summarize content",
    });
  }
};


// ======================================================
// AI RECOMMENDATIONS
// ======================================================

const recommendations = async (
  req,
  res
) => {
  try {
    const {
      studentProfile,
      enrolledCourses,
      completedCourses,
      availableCourses,
      performance,
    } = req.body;

    const result =
      await generateRecommendations({
        studentProfile,
        enrolledCourses,
        completedCourses,
        availableCourses,
        performance,
      });

    return res.status(200).json({
      success: true,
      message:
        "Recommendations generated successfully",

      data: {
        recommendations: result,
      },
    });
  } catch (error) {
    console.error(
      "AI Recommendation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate recommendations",
    });
  }
};


// ======================================================
// AI SEARCH
// ======================================================

const aiSearch = async (
  req,
  res
) => {
  try {
    const {
      query,
      courses,
    } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message:
          "Search query is required",
      });
    }

    const result =
      await searchCoursesWithAI({
        query,
        courses,
      });

    return res.status(200).json({
      success: true,
      message:
        "AI search completed successfully",

      data: {
        results: result,
      },
    });
  } catch (error) {
    console.error(
      "AI Search Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "AI search failed",
    });
  }
};


// ======================================================
// COLLABSPHERE - EXPLAIN NOTE
// POST /api/ai/explain-note
// ======================================================

const explainProjectNote = async (
  req,
  res
) => {
  try {
    const {
      content,
    } = req.body;

    if (
      !content ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Note content is required",
      });
    }

    const result =
      await explainNote(content);

    return res.status(200).json({
      success: true,
      message:
        "Note explanation generated successfully",

      data: {
        explanation: result,
      },
    });
  } catch (error) {
    console.error(
      "AI NOTE EXPLANATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to explain note",
    });
  }
};


// ======================================================
// COLLABSPHERE - IMPROVE NOTE
// POST /api/ai/improve-note
// ======================================================

const improveProjectNote = async (
  req,
  res
) => {
  try {
    const {
      content,
    } = req.body;

    if (
      !content ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Note content is required",
      });
    }

    const result =
      await improveNote(content);

    return res.status(200).json({
      success: true,
      message:
        "Note improvement suggestions generated successfully",

      data: {
        suggestions: result,
      },
    });
  } catch (error) {
    console.error(
      "AI NOTE IMPROVEMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to improve note",
    });
  }
};


// ======================================================
// COLLABSPHERE - EXPLAIN CODE
// POST /api/ai/explain-code
// ======================================================

const explainProjectCode = async (
  req,
  res
) => {
  try {
    const {
      code,
    } = req.body;

    if (
      !code ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Code is required",
      });
    }

    const result =
      await explainCode(code);

    return res.status(200).json({
      success: true,
      message:
        "Code explanation generated successfully",

      data: {
        explanation: result,
      },
    });
  } catch (error) {
    console.error(
      "AI CODE EXPLANATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to explain code",
    });
  }
};


// ======================================================
// COLLABSPHERE - GENERATE DOCUMENTATION
// POST /api/ai/docs
// ======================================================

const generateProjectDocs = async (
  req,
  res
) => {
  try {
    const {
      code,
    } = req.body;

    if (
      !code ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Code is required",
      });
    }

    const result =
      await generateDocumentation(
        code
      );

    return res.status(200).json({
      success: true,
      message:
        "Documentation generated successfully",

      data: {
        documentation: result,
      },
    });
  } catch (error) {
    console.error(
      "AI DOCUMENTATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate documentation",
    });
  }
};


// ======================================================
// COLLABSPHERE - GENERATE README
// POST /api/ai/readme
// ======================================================

const generateProjectReadme = async (
  req,
  res
) => {
  try {
    const {
      projectName,
      description,
      overview,
    } = req.body;

    if (
      !projectName ||
      !projectName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project name is required",
      });
    }

    const result =
      await generateReadme({
        projectName,
        description,
        overview,
      });

    return res.status(200).json({
      success: true,
      message:
        "README generated successfully",

      data: {
        readme: result,
      },
    });
  } catch (error) {
    console.error(
      "AI README ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate README",
    });
  }
};


// ======================================================
// EXPORT ALL CONTROLLERS
// ======================================================

module.exports = {
  // Existing LMS AI
  chat,
  generateFeedback,
  generateCourse,
  createAssignmentWithAI,
  summarize,
  recommendations,
  aiSearch,

  // CollabSphere AI
  explainProjectNote,
  improveProjectNote,
  explainProjectCode,
  generateProjectDocs,
  generateProjectReadme,
};