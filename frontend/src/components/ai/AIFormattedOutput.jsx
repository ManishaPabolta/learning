import {
  BookOpen,
  FileText,
  Target,
  ListChecks,
  Upload,
  ClipboardCheck,
  BarChart3,
  Sparkles,
} from "lucide-react";

const sectionConfig = {
  TITLE: {
    icon: BookOpen,
    label: "Assignment Title",
    color: "emerald",
  },

  DESCRIPTION: {
    icon: FileText,
    label: "Description",
    color: "blue",
  },

  DIFFICULTY: {
    icon: BarChart3,
    label: "Difficulty",
    color: "amber",
  },

  OBJECTIVES: {
    icon: Target,
    label: "Learning Objectives",
    color: "purple",
  },

  LEARNING_OBJECTIVES: {
    icon: Target,
    label: "Learning Objectives",
    color: "purple",
  },

  REQUIREMENTS: {
    icon: ListChecks,
    label: "Requirements",
    color: "indigo",
  },

  SUBMISSION_REQUIREMENTS: {
    icon: Upload,
    label: "Submission Requirements",
    color: "cyan",
  },

  EVALUATION_CRITERIA: {
    icon: ClipboardCheck,
    label: "Evaluation Criteria",
    color: "rose",
  },
};

const colorClasses = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    title: "text-emerald-700",
  },

  blue: {
    icon: "bg-blue-50 text-blue-600",
    title: "text-blue-700",
  },

  amber: {
    icon: "bg-amber-50 text-amber-600",
    title: "text-amber-700",
  },

  purple: {
    icon: "bg-purple-50 text-purple-600",
    title: "text-purple-700",
  },

  indigo: {
    icon: "bg-indigo-50 text-indigo-600",
    title: "text-indigo-700",
  },

  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    title: "text-cyan-700",
  },

  rose: {
    icon: "bg-rose-50 text-rose-600",
    title: "text-rose-700",
  },
};


/* =========================================================
   NORMALIZE AI RESPONSE
========================================================= */

function normalizeContent(content) {
  if (!content) return "";

  // Already a string
  if (typeof content === "string") {
    return content;
  }

  // Object / Array
  if (typeof content === "object") {
    try {
      return JSON.stringify(content, null, 2);
    } catch {
      return String(content);
    }
  }

  return String(content);
}


/* =========================================================
   CLEAN TEXT
========================================================= */

function cleanText(text) {
  const value = normalizeContent(text);

  return value
    .replace(/\*\*/g, "")
    .replace(/^["']|["']$/g, "")
    .trim();
}


/* =========================================================
   PARSE AI RESPONSE
========================================================= */

function parseAIResponse(text) {
  const normalized = normalizeContent(text);

  if (!normalized) return [];

  const cleaned = normalized
    .replace(/\r/g, "")
    .trim();

  /*
    Handle:
    
    **TITLE:**
    *Build Todo API*
    
    TITLE:
    Build Todo API
  */

  const sectionRegex =
    /(?:^|\n)\s*\**([A-Z][A-Z_ ]+):\**\s*/g;

  const matches = [];
  let match;

  while (
    (match = sectionRegex.exec(cleaned)) !== null
  ) {
    matches.push({
      name: match[1].trim(),
      index: match.index,
      contentStart: sectionRegex.lastIndex,
    });
  }

  /*
    If AI didn't return structured sections
  */
  if (!matches.length) {
    return [
      {
        name: "CONTENT",
        content: cleaned,
      },
    ];
  }

  return matches.map((item, index) => {
    const next = matches[index + 1];

    const content = cleaned
      .slice(
        item.contentStart,
        next ? next.index : cleaned.length
      )
      .trim();

    return {
      name: item.name,
      content,
    };
  });
}


/* =========================================================
   RENDER CONTENT
========================================================= */

function renderContent(content, sectionName) {
  const cleaned = cleanText(content);

  if (!cleaned) return null;

  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const listSections = [
    "OBJECTIVES",
    "LEARNING_OBJECTIVES",
    "REQUIREMENTS",
    "SUBMISSION_REQUIREMENTS",
    "EVALUATION_CRITERIA",
  ];

  const hasList = lines.some(
    (line) =>
      /^[-•*]\s+/.test(line) ||
      /^\d+[.)]\s+/.test(line)
  );

  if (hasList || listSections.includes(sectionName)) {
    return (
      <ul className="space-y-2.5">
        {lines.map((line, index) => {
          const cleanedLine = line
            .replace(/^[-•*]\s+/, "")
            .replace(/^\d+[.)]\s+/, "")
            .replace(/\*\*/g, "")
            .replace(/^["']|["']$/g, "")
            .trim();

          if (!cleanedLine) return null;

          return (
            <li
              key={index}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 transition hover:border-emerald-100 hover:bg-emerald-50/40"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

              <span className="text-sm leading-6 text-slate-700">
                {cleanedLine}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
      {cleaned}
    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AIFormattedOutput({
  content,
}) {
  const sections = parseAIResponse(content);

  return (
    <div className="space-y-4">

      {/* AI HEADER */}
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
            AI Generated Draft
          </p>

          <p className="mt-0.5 text-sm font-medium text-slate-600">
            Review and edit before publishing
          </p>
        </div>

      </div>


      {/* SECTIONS */}
      {sections.map((section, index) => {

        const config =
          sectionConfig[section.name] || {
            icon: FileText,
            label: section.name
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) =>
                char.toUpperCase()
              ),
            color: "emerald",
          };

        const Icon = config.icon;

        const colors =
          colorClasses[config.color] ||
          colorClasses.emerald;

        return (
          <div
            key={`${section.name}-${index}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >

            {/* SECTION HEADER */}
            <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.icon}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <h3
                  className={`text-sm font-extrabold ${colors.title}`}
                >
                  {config.label}
                </h3>

                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  AI Generated
                </p>
              </div>

            </div>


            {/* CONTENT */}
            <div className="p-5">

              {section.name === "TITLE" ? (
                <h2 className="text-xl font-black leading-8 text-slate-900">
                  {cleanText(section.content)}
                </h2>
              ) : section.name === "DIFFICULTY" ? (
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
                  {cleanText(section.content)}
                </span>
              ) : (
                renderContent(
                  section.content,
                  section.name
                )
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
}