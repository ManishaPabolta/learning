import NoteCard from "./NoteCard";

const NoteList = ({
  notes = [],
  onDelete,
  loading = false,
  projectId,
}) => {
  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
          Loading notes...
        </div>
      </div>
    );
  }

  if (!Array.isArray(notes) || notes.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl">
        <div className="text-slate-400 text-sm">
          No notes found.
        </div>

        <p className="text-xs text-slate-400 mt-1">
          Create your first project note to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          onDelete={onDelete}
          projectId={projectId}
        />
      ))}
    </div>
  );
};

export default NoteList;