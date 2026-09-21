import { useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import useProjects from "../../hooks/useProjects";
import ProjectForm from "../../components/projects/ProjectForm";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    project,
    loading,
    getProject,
    updateProject,
  } = useProjects();

  useEffect(() => {
    getProject(id);
  }, [id, getProject]);

  const handleSubmit = async (data) => {
    await updateProject(id, data);
    navigate(`/projects/${id}`);
  };

  if (loading && !project) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Edit Project
      </h1>

      <ProjectForm
        initialData={project || {}}
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Update Project"
      />
    </div>
  );
};

export default EditProject;