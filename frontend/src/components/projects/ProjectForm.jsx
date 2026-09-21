import { useState } from "react";

const ProjectForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  submitText = "Create Project",
}) => {
  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    isPublic: initialData.isPublic || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium mb-2">
          Project Name
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter project name"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe your project..."
          className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="isPublic"
          checked={form.isPublic}
          onChange={handleChange}
          className="w-4 h-4"
        />

        <span className="text-sm text-slate-700">
          Make this project publicly shareable
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
};

export default ProjectForm;