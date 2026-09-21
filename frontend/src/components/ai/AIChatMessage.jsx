import React from "react";
import { Bot, User, Sparkles, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AIChatMessage({
  role,
  message,
}) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Simple formatting for AI response
  const formatMessage = (text) => {
    if (!text) return null;

    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // CODE BLOCK
      if (part.startsWith("```")) {
        const lines = part.split("\n");

        let language = lines[0]
          .replace("```", "")
          .trim();

        const code = lines
          .slice(1, -1)
          .join("\n");

        return (
          <div
            key={index}
            className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-950"
          >
            {/* Code header */}
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-2">
              <span className="text-xs font-medium text-slate-400">
                {language || "code"}
              </span>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(code)
                }
                className="flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-white"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>

            {/* Code */}
            <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-200">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // NORMAL TEXT
      return (
        <div
          key={index}
          className="whitespace-pre-wrap"
        >
          {formatText(part)}
        </div>
      );
    });
  };

  // Basic markdown-like formatting
  const formatText = (text) => {
    const lines = text.split("\n");

    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Heading ##
      if (trimmed.startsWith("### ")) {
        return (
          <h4
            key={index}
            className="mb-2 mt-4 text-base font-bold text-slate-900"
          >
            {trimmed.replace("### ", "")}
          </h4>
        );
      }

      // Heading ##
      if (trimmed.startsWith("## ")) {
        return (
          <h3
            key={index}
            className="mb-2 mt-5 text-lg font-bold text-emerald-700"
          >
            {trimmed.replace("## ", "")}
          </h3>
        );
      }

      // Bullet -
      if (trimmed.startsWith("- ")) {
        return (
          <div
            key={index}
            className="my-1 flex gap-2"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

            <span>
              {formatBold(
                trimmed.replace("- ", "")
              )}
            </span>
          </div>
        );
      }

      // Numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        const number = trimmed.match(/^\d+/)[0];
        const content = trimmed.replace(
          /^\d+\.\s/,
          ""
        );

        return (
          <div
            key={index}
            className="my-2 flex gap-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {number}
            </span>

            <span className="pt-0.5">
              {formatBold(content)}
            </span>
          </div>
        );
      }

      // Empty line
      if (!trimmed) {
        return (
          <div
            key={index}
            className="h-2"
          />
        );
      }

      return (
        <p
          key={index}
          className="leading-7"
        >
          {formatBold(line)}
        </p>
      );
    });
  };

  // Bold text **something**
  const formatBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (
        part.startsWith("**") &&
        part.endsWith("**")
      ) {
        return (
          <strong
            key={index}
            className="font-semibold text-slate-900"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {/* AI AVATAR */}
      {!isUser && (
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-emerald-400 opacity-20 blur-md" />

          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md">
            <Bot className="h-5 w-5" />
          </div>
        </div>
      )}

      {/* MESSAGE */}
      <div
        className={`group relative max-w-[88%] ${
          isUser ? "order-first" : ""
        }`}
      >
        <div
          className={`rounded-2xl px-5 py-4 text-sm shadow-sm ${
            isUser
              ? "rounded-br-md bg-gradient-to-r from-emerald-600 to-green-600 text-white"
              : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
          }`}
        >
          {/* AI HEADER */}
          {!isUser && (
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                </div>

                <span className="text-xs font-bold text-emerald-700">
                  AI Learning Assistant
                </span>
              </div>

              {/* Copy whole response */}
              <button
                onClick={copyMessage}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          )}

          {/* CONTENT */}
          <div
            className={`${
              isUser
                ? "text-white"
                : "text-slate-700"
            }`}
          >
            {formatMessage(message)}
          </div>
        </div>
      </div>

      {/* USER AVATAR */}
      {isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm">
          <User className="h-5 w-5" />
        </div>
      )}
    </motion.div>
  );
}