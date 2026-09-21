import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ShieldCheck,
  Users,
} from "lucide-react";

import projectService from "../../services/projectService";
import ProjectMembers from "../../components/projects/ProjectMembers";
import AddMemberModal from "../../components/projects/AddMemberModal";
import useAuth from "../../hooks/useAuth";

const ProjectMembersPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const ownerId =
    project?.owner?._id ||
    project?.owner?.id ||
    project?.owner ||
    null;

  const currentUserId =
    user?._id ||
    user?.id ||
    null;

  const isOwner =
    ownerId &&
    currentUserId &&
    ownerId.toString() ===
      currentUserId.toString();

  // ONLY OWNER CAN MANAGE MEMBERS
  const canManageMembers =
    isOwner && !isAdmin;

  const loadData = async () => {
    if (!id) return;

    setLoading(true);

    try {
      const [
        projectResult,
        membersResult,
      ] = await Promise.all([
        projectService.getProject(id),
        projectService.getMembers(id),
      ]);

      const projectData =
        projectResult?.data?.data ||
        projectResult?.data?.project ||
        projectResult?.project ||
        projectResult?.data ||
        null;

      const membersData =
        membersResult?.data?.data?.members ||
        membersResult?.data?.members ||
        membersResult?.members ||
        [];

      setProject(projectData);

      setMembers(
        Array.isArray(membersData)
          ? membersData
          : []
      );
    } catch (error) {
      console.error(
        "Load Project Members Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const addMember = async (email) => {
    if (!canManageMembers) return;

    try {
      await projectService.addMember(
        id,
        email
      );

      setModalOpen(false);

      await loadData();
    } catch (error) {
      console.error(
        "Add Member Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to add member."
      );
    }
  };

  const removeMember = async (userId) => {
    if (!canManageMembers) return;

    const confirmed = window.confirm(
      "Remove this member from project?"
    );

    if (!confirmed) return;

    try {
      await projectService.removeMember(
        id,
        userId
      );

      await loadData();
    } catch (error) {
      console.error(
        "Remove Member Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to remove member."
      );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />

            <h1 className="text-3xl font-bold">
              Project Members
            </h1>
          </div>

          <p className="text-slate-500 mt-1">
            {project?.name || "Project"}
          </p>
        </div>

        {/* ADMIN VIEW ONLY */}
        {isAdmin && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            Admin View Only
          </div>
        )}

        {/* OWNER ONLY */}
        {canManageMembers && (
          <button
            type="button"
            onClick={() =>
              setModalOpen(true)
            }
            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Add Member
          </button>
        )}
      </div>

      {/* ADMIN MESSAGE */}
      {isAdmin && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Admin can view project members but
          cannot add or remove members.
        </div>
      )}

      {/* MEMBERS */}
      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Loading members...
        </div>
      ) : (
        <ProjectMembers
          members={members}
          canManage={canManageMembers}
          onRemove={
            canManageMembers
              ? removeMember
              : undefined
          }
        />
      )}

      {/* OWNER ONLY */}
      {canManageMembers && (
        <AddMemberModal
          open={modalOpen}
          onClose={() =>
            setModalOpen(false)
          }
          onAdd={addMember}
        />
      )}
    </div>
  );
};

export default ProjectMembersPage;