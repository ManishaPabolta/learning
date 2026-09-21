import { Link } from "react-router-dom";
import {
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";

const NoteCard = ({
  note,
  onDelete,
  projectId,
}) => {
  if (!note) {
    return null;
  }

  const authorName =
    note?.author?.name ||
    note?.createdBy?.name ||
    "Unknown author";

  const formattedDate = note?.createdAt
    ? new Date(note.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex gap-3 min-w-0">

          <div className="w-10 h-10 shrink-0 rounded-lg bg-indigo-100 flex items-center justify-center">
            <FileText
              size={18}
              className="text-indigo-600"
            />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {note.title || "Untitled Note"}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {authorName}
            </p>

            {formattedDate && (
              <p className="text-xs text-slate-400 mt-0.5">
                {formattedDate}
              </p>
            )}
          </div>

        </div>

        {/* DELETE */}
        {typeof onDelete === "function" && (
          <button
            type="button"
            onClick={() => onDelete(note._id)}
            className="shrink-0 text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
            title="Delete note"
          >
            <Trash2 size={17} />
          </button>
        )}

      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {note.content ? (
          <p className="text-sm text-slate-600 line-clamp-4 whitespace-pre-wrap">
            {note.content}
          </p>
        ) : (
          <p className="text-sm text-slate-400 italic">
            No content
          </p>
        )}
      </div>

      {/* EDIT */}
      {projectId && (
        <Link
          to={`/projects/${projectId}/notes/${note._id}/edit`}
          className="mt-4 inline-flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-700"
        >
          <Pencil size={15} />
          Edit Note
        </Link>
      )}

    </div>
  );
};

export default NoteCard;