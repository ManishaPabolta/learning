import { useCallback, useState } from "react";
import api from "../services/api";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projects");

      const data = response?.data?.data ?? response?.data ?? [];

      setProjects(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error("Get Projects Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load projects"
      );

      setProjects([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/projects/${projectId}`);

      const data = response?.data?.data ?? response?.data;

      setProject(data);
      return data;
    } catch (err) {
      console.error("Get Project Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load project"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/projects", projectData);

      const data = response?.data?.data ?? response?.data;

      setProjects((prev) => [data, ...prev]);

      return data;
    } catch (err) {
      console.error("Create Project Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create project"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (projectId, projectData) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.put(
        `/projects/${projectId}`,
        projectData
      );

      const data = response?.data?.data ?? response?.data;

      setProject(data);

      setProjects((prev) =>
        prev.map((item) =>
          item._id === projectId ? data : item
        )
      );

      return data;
    } catch (err) {
      console.error("Update Project Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update project"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError("");

      await api.delete(`/projects/${projectId}`);

      setProjects((prev) =>
        prev.filter((item) => item._id !== projectId)
      );

      if (project?._id === projectId) {
        setProject(null);
      }

      return true;
    } catch (err) {
      console.error("Delete Project Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete project"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, [project]);

  const addMember = useCallback(async (projectId, email) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        `/projects/${projectId}/members`,
        { email }
      );

      const data = response?.data?.data ?? response?.data;

      if (project?._id === projectId) {
        setProject(data);
      }

      return data;
    } catch (err) {
      console.error("Add Member Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add member"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, [project]);

  const removeMember = useCallback(async (projectId, userId) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.delete(
        `/projects/${projectId}/members/${userId}`
      );

      const data = response?.data?.data ?? response?.data;

      if (project?._id === projectId && data) {
        setProject(data);
      }

      return data;
    } catch (err) {
      console.error("Remove Member Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to remove member"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, [project]);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    projects,
    project,
    loading,
    error,

    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
    clearError,
  };
};

export default useProjects;