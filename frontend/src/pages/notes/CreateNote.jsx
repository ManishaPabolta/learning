import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useNotes from "../../hooks/useNotes";
import NoteForm from "../../components/notes/NoteForm";

const CreateNote = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { createNote, error } = useNotes(projectId);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);

      await createNote({
        ...data,
        project: projectId,
      });

      navigate(`/projects/${projectId}/notes`);
    } catch (error) {
      console.error(
        "Create note failed:",
        error?.response?.data || error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Create Note
      </h1>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <NoteForm
        onSubmit={handleSubmit}
        loading={saving}
        submitting={saving}
      />

    </div>
  );
};

export default CreateNote;