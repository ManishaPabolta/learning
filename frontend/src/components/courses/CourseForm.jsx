
import React, { useEffect, useState } from "react";
import {
  Save,
  X,
  BookOpen,
} from "lucide-react";

const CourseForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-emerald-100
        bg-white
        p-6
        shadow-xl
        shadow-emerald-900/5
        sm:p-8
      "
    >

      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Heading */}
      <div className="relative mb-7 flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-600 shadow-sm transition-transform duration-300 hover:scale-105">
          <BookOpen size={23} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {initialData
              ? "Update Course"
              : "Create New Course"}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {initialData
              ? "Update course information"
              : "Add a new learning course"}
          </p>
        </div>

      </div>

      {/* Title */}
      <div className="relative mb-5">

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Course Title
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Full Stack Web Development"
          required
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-sm
            text-slate-800
            outline-none
            placeholder:text-slate-400
            transition-all
            duration-300

            hover:border-emerald-200

            focus:border-emerald-500
            focus:bg-white
            focus:ring-4
            focus:ring-emerald-500/10
          "
        />

      </div>

      {/* Description */}
      <div className="relative">

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Course Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe what students will learn..."
          rows={7}
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-sm
            leading-6
            text-slate-800
            outline-none
            placeholder:text-slate-400
            transition-all
            duration-300

            hover:border-emerald-200

            focus:border-emerald-500
            focus:bg-white
            focus:ring-4
            focus:ring-emerald-500/10
          "
        />

      </div>

      {/* Buttons */}
      <div className="relative mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              text-sm
              font-medium
              text-slate-600
              transition-all
              duration-300

              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600

              disabled:opacity-50
            "
          >
            <X size={17} />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            group
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-emerald-600
            via-green-500
            to-lime-400
            px-6
            py-3
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-emerald-500/20
            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:shadow-xl
            hover:shadow-emerald-500/30

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Save
            size={17}
            className="transition-transform duration-300 group-hover:scale-110"
          />

          {loading
            ? "Saving..."
            : initialData
            ? "Update Course"
            : "Create Course"}
        </button>

      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

    </form>
  );
};

export default CourseForm;
