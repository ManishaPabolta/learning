import React, { useState } from "react";

import AIChatMessage from "./AIChatMessage";
import AIInput from "./AIInput";
import AIThinking from "./AIThinking";

import useAI from "../../hooks/useAI";

const AIChatbot = ({
  courseContext = "",
  assignmentContext = "",
}) => {
  const { chat, loading, error } = useAI();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      message:
        "Hi! 👋 I'm your AI learning assistant. Ask me anything about programming, courses, assignments, or technology.",
    },
  ]);

  const handleSend = async (message) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        message,
      },
    ]);

    try {
      const result = await chat({
        message,
        courseContext,
        assignmentContext,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message:
            result?.data?.response ||
            "I couldn't generate a response.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message:
            "Sorry, something went wrong while contacting the AI.",
        },
      ]);
    }
  };

  return (
    <div className="flex h-[650px] w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* HEADER */}

      <div className="flex items-center gap-3 border-b bg-white px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xl">
          🤖
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            AI Learning Assistant
          </h2>

          <p className="text-xs text-slate-500">
            Ask your learning questions
          </p>
        </div>
      </div>

      {/* MESSAGES */}

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
        {messages.map((item, index) => (
          <AIChatMessage
            key={index}
            role={item.role}
            message={item.message}
          />
        ))}

        {loading && <AIThinking />}

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* INPUT */}

      <AIInput
        onSend={handleSend}
        loading={loading}
        placeholder="Ask about JavaScript, React, Node.js..."
      />
    </div>
  );
};

export default AIChatbot;