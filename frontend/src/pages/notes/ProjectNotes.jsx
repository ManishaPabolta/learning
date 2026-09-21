import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Plus,
  ShieldCheck,
} from "lucide-react";

import useNotes from "../../hooks/useNotes";
import NoteList from "../../components/notes/NoteList";
import useAuth from "../../hooks/useAuth";

const ProjectNotes = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const {
    notes,
    loading,
    getNotes,
    deleteNote,
  } = useNotes(projectId);

  useEffect(() => {
    if (!projectId) return;

    getNotes();
  }, [projectId, getNotes]);

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-bold">
            Project Notes
          </h1>

          <p className="text-slate-500 mt-1">
            Notes created by project members
          </p>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            Admin View Only
          </div>
        ) : (
          <Link
            to={`/projects/${projectId}/notes/create`}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <Plus size={18} />
            Create Note
          </Link>
        )}
      </div>

      {/* ADMIN INFO */}
      {isAdmin && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Admin can view notes created by project members but cannot create,
          edit, or delete notes.
        </div>
      )}

      {/* NOTES */}
      <NoteList
        notes={notes}
        loading={loading}
        onDelete={isAdmin ? undefined : deleteNote}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectNotes;