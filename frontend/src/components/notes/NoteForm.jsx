import { useState } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";

const NoteForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const [title, setTitle] = useState(
    initialData.title || ""
  );

  const [content, setContent] = useState(
    initialData.content || ""
  );

  const [showPreview, setShowPreview] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    try {
      await onSubmit({
        title: cleanTitle,
        content: content || "",
      });
    } catch (error) {
      console.error(
        "Note form submit error:",
        error?.response?.data || error
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Note Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Enter note title"
          disabled={loading}
          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100"
          required
        />
      </div>

      {/* EDIT / PREVIEW */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => setShowPreview(false)}
          className={`px-4 py-2 rounded-lg transition ${
            !showPreview
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Edit
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => setShowPreview(true)}
          className={`px-4 py-2 rounded-lg transition ${
            showPreview
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Preview
        </button>
      </div>

      {/* CONTENT */}
      {showPreview ? (
        <div className="min-h-[300px] border border-slate-200 rounded-xl p-5 bg-white">
          <MarkdownPreview content={content} />
        </div>
      ) : (
        <MarkdownEditor
          value={content}
          onChange={setContent}
        />
      )}

      {/* SAVE */}
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Note"}
      </button>
    </form>
  );
};

export default NoteForm;