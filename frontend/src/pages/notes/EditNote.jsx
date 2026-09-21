import { useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import useNotes from "../../hooks/useNotes";
import NoteForm from "../../components/notes/NoteForm";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    note,
    loading,
    getNote,
    updateNote,
  } = useNotes();

  useEffect(() => {
    getNote(id);
  }, [id]);

  const handleSubmit = async (data) => {
    await updateNote(id, data);

    navigate(
      `/projects/${note?.project?._id}/notes`
    );
  };

  if (loading && !note) {
    return (
      <div className="p-10 text-center">
        Loading note...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Edit Note
      </h1>

      <NoteForm
        initialData={note || {}}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default EditNote;