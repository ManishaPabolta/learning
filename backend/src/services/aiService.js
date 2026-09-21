const {
  client,
  AI_MODEL,
} = require("../config/aiConfig");

/**
 * =========================================================
 * GENERIC GROQ AI RESPONSE
 * =========================================================
 */
const generateAIResponse = async (
  instructions,
  input
) => {
  if (
    !instructions ||
    typeof instructions !== "string" ||
    !instructions.trim()
  ) {
    throw new Error(
      "AI instructions are required"
    );
  }

  if (
    !input ||
    typeof input !== "string" ||
    !input.trim()
  ) {
    throw new Error("AI input is required");
  }

  try {
    const response =
      await client.chat.completions.create({
        model: AI_MODEL,

        messages: [
          {
            role: "system",
            content: instructions.trim(),
          },
          {
            role: "user",
            content: input.trim(),
          },
        ],

        temperature: 0.3,
      });

    const content =
      response?.choices?.[0]?.message
        ?.content;

    if (!content) {
      throw new Error(
        "Groq returned an empty response"
      );
    }

    return content.trim();
  } catch (error) {
    console.error(
      "Groq AI Service Error:",
      error
    );

    throw new Error(
      error?.message ||
        "Failed to generate AI response"
    );
  }
};


/**
 * =========================================================
 * COLLABSPHERE - EXPLAIN NOTE
 * =========================================================
 */
const explainNote = async (content) => {
  return generateAIResponse(
    `
You are an expert software engineer
and technical teacher.

Explain the provided Markdown note.

Your response must cover:

1. Main idea
2. Important concepts
3. How it works
4. Step-by-step explanation
5. Simple examples when useful
6. Potential problems
7. Practical improvements

Use clear and beginner-friendly language.

Do not invent information that is not
supported by the provided note.
    `,
    content
  );
};


/**
 * =========================================================
 * COLLABSPHERE - IMPROVE NOTE
 * =========================================================
 */
const improveNote = async (content) => {
  return generateAIResponse(
    `
You are an expert technical documentation
reviewer.

Review the provided Markdown note.

Analyze:

1. Clarity
2. Structure
3. Technical accuracy
4. Missing information
5. Examples
6. Readability
7. Organization
8. Possible confusing sections

Provide practical suggestions.

Do not rewrite the entire note unless
necessary.

Separate important problems from
optional improvements.
    `,
    content
  );
};


/**
 * =========================================================
 * COLLABSPHERE - EXPLAIN CODE
 * =========================================================
 */
const explainCode = async (code) => {
  return generateAIResponse(
    `
You are a senior software engineer
and code reviewer.

Explain the provided source code.

Cover:

1. Overall purpose
2. How the code works
3. Important functions
4. Important classes
5. Variables and logic
6. Inputs
7. Outputs
8. Dependencies
9. Data flow
10. Potential bugs
11. Security concerns
12. Improvement suggestions

Explain difficult sections step by step.

Do not claim functionality that does
not exist in the provided code.
    `,
    code
  );
};


/**
 * =========================================================
 * COLLABSPHERE - GENERATE DOCUMENTATION
 * =========================================================
 */
const generateDocumentation = async (
  code
) => {
  return generateAIResponse(
    `
You are an expert software documentation
writer.

Generate professional technical
documentation for the provided code.

Include:

# Overview

# Purpose

# Functions / Classes

# Inputs

# Outputs

# Dependencies

# Usage

# Important Notes

# Potential Issues

Use Markdown formatting.

Only document behavior that can reasonably
be determined from the provided code.
    `,
    code
  );
};


/**
 * =========================================================
 * COLLABSPHERE - GENERATE README
 * =========================================================
 */
const generateReadme = async ({
  projectName,
  description = "",
  overview = "",
}) => {
  if (
    !projectName ||
    typeof projectName !== "string" ||
    !projectName.trim()
  ) {
    throw new Error(
      "Project name is required"
    );
  }

  const input = `
Project Name:
${projectName.trim()}

Project Description:
${description || "Not provided"}

Project Overview:
${overview || "Not provided"}
`;

  return generateAIResponse(
    `
You are an expert open-source
documentation writer.

Generate a professional README.md.

Include:

# Project Title

# Description

# Features

# Tech Stack

# Project Structure

# Installation

# Environment Variables

# Running Locally

# Usage

# API Overview

# Development

# Future Improvements

# License

Return ONLY valid Markdown.

Do not invent exact dependencies,
commands, APIs, credentials, or
configuration values when they were
not provided.
    `,
    input
  );
};


/**
 * =========================================================
 * EXISTING GENERIC EXPORT
 * =========================================================
 */
module.exports = {
  generateAIResponse,

  explainNote,
  improveNote,
  explainCode,
  generateDocumentation,
  generateReadme,
};