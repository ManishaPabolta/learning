import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectService from "../../services/projectService";
import MarkdownPreview from "../../components/notes/MarkdownPreview";

const PublicProject = () => {
  const { slug } = useParams();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);

        const result =
          await projectService.getPublicProject(
            slug
          );

        setProject(
          result?.data?.project ||
            result?.project ||
            result?.data
        );
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            "Project not found"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading project...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Project Not Found
          </h1>

          <p className="text-slate-500 mt-2">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold">
            {project.name}
          </h1>

          <p className="text-slate-500 mt-3">
            {project.description}
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border p-7">
          <h2 className="text-2xl font-bold mb-5">
            README
          </h2>

          <MarkdownPreview
            content={
              project.readme ||
              project.description ||
              "No README available."
            }
          />
        </div>
      </main>
    </div>
  );
};

export default PublicProject;