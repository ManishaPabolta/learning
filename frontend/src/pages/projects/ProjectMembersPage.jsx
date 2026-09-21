import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
  XCircle,
  ShieldCheck,
  User,
  Clock3,
  UserCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import projectService from "../../services/projectService";
import useAuth from "../../hooks/useAuth";

const ProjectMembersPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const auth = useAuth();
  const user = auth?.user;

  // =========================================================
  // STATE
  // =========================================================

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);

  // Registered users available for invitation
  const [invitationUsers, setInvitationUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [pageError, setPageError] = useState("");

  // Add member modal
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [invitationLoading, setInvitationLoading] = useState(false);
  const [invitationError, setInvitationError] = useState("");
  const [invitingUserId, setInvitingUserId] = useState(null);

  // Remove member
  const [removeLoadingId, setRemoveLoadingId] = useState(null);

  // =========================================================
  // CURRENT USER
  // =========================================================

  const currentUserId =
    user?._id ||
    user?.id ||
    null;

  // =========================================================
  // ROLE
  // =========================================================

  const isAdmin =
    user?.role === "admin";

  const isUser =
    user?.role === "user" ||
    user?.role === "student";

  // =========================================================
  // PROJECT OWNER
  // =========================================================

  const ownerId =
    project?.owner?._id ||
    project?.owner?.id ||
    project?.owner ||
    null;

  const isOwner =
    Boolean(ownerId) &&
    Boolean(currentUserId) &&
    ownerId.toString() ===
      currentUserId.toString();

  /*
    ===========================================================
    MEMBER MANAGEMENT

    PROJECT OWNER
        -> View Members       ✅
        -> Invite Members     ✅
        -> Remove Members     ✅

    NORMAL PROJECT MEMBER
        -> View Members       ✅
        -> Invite Members     ❌
        -> Remove Members     ❌

    ADMIN
        -> View Members       ✅
        -> Invite Members     ❌
        -> Remove Members     ❌
    ===========================================================
  */

  const canManageMembers =
    isUser &&
    isOwner &&
    !isAdmin;

  // =========================================================
  // LOAD PROJECT + MEMBERS + INVITATION USERS
  // =========================================================

  const loadData = async (showRefresh = false) => {
    if (!id) {
      setPageError("Project ID is missing.");
      setLoading(false);
      return;
    }

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setPageError("");

      // -----------------------------------------------------
      // PROJECT
      // -----------------------------------------------------

      const projectResult =
        await projectService.getProject(id);

      const projectData =
        projectResult?.data?.project ||
        projectResult?.data?.data ||
        projectResult?.project ||
        projectResult?.data ||
        null;

      setProject(projectData);

      // -----------------------------------------------------
      // MEMBERS
      // -----------------------------------------------------

      const membersResult =
        await projectService.getMembers(id);

      const membersData =
        membersResult?.data?.members ||
        membersResult?.data?.data?.members ||
        membersResult?.members ||
        membersResult?.data ||
        [];

      setMembers(
        Array.isArray(membersData)
          ? membersData
          : []
      );

      // -----------------------------------------------------
      // REGISTERED USERS
      //
      // Only project owner needs this list.
      // -----------------------------------------------------

      const projectOwnerId =
        projectData?.owner?._id ||
        projectData?.owner?.id ||
        projectData?.owner ||
        null;

      const userIsOwner =
        Boolean(projectOwnerId) &&
        Boolean(currentUserId) &&
        projectOwnerId.toString() ===
          currentUserId.toString();

      if (
        userIsOwner &&
        isUser &&
        !isAdmin
      ) {
        try {
          const invitationResult =
            await projectService.getInvitationUsers(
              id
            );

          const usersData =
            invitationResult?.data?.users ||
            invitationResult?.data?.data?.users ||
            invitationResult?.users ||
            invitationResult?.data ||
            [];

          setInvitationUsers(
            Array.isArray(usersData)
              ? usersData
              : []
          );
        } catch (invitationError) {
          console.error(
            "Load invitation users error:",
            invitationError
          );

          setInvitationUsers([]);
        }
      } else {
        setInvitationUsers([]);
      }
    } catch (error) {
      console.error(
        "Load project members error:",
        error
      );

      setPageError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load project members."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadData();
  }, [id, currentUserId]);

  // =========================================================
  // NORMALIZE MEMBERS
  // =========================================================

  const normalizedMembers = useMemo(() => {
    const result = [];

    // -------------------------------------------------------
    // OWNER
    // -------------------------------------------------------

    if (project?.owner) {
      const ownerObject =
        typeof project.owner === "object"
          ? project.owner
          : {
              _id: project.owner,
            };

      const ownerObjectId =
        ownerObject?._id ||
        ownerObject?.id ||
        ownerObject;

      result.push({
        ...ownerObject,
        _id: ownerObjectId,
        isOwner: true,
      });
    }

    // -------------------------------------------------------
    // MEMBERS
    // -------------------------------------------------------

    if (Array.isArray(members)) {
      members.forEach((member) => {
        if (!member) {
          return;
        }

        const memberObject =
          typeof member === "object"
            ? member
            : {
                _id: member,
              };

        const memberId =
          memberObject?._id ||
          memberObject?.id ||
          memberObject;

        // Avoid owner duplicate
        if (
          ownerId &&
          memberId &&
          ownerId.toString() ===
            memberId.toString()
        ) {
          return;
        }

        // Avoid duplicate members
        const alreadyExists =
          result.some((item) => {
            const itemId =
              item?._id ||
              item?.id;

            return (
              itemId &&
              memberId &&
              itemId.toString() ===
                memberId.toString()
            );
          });

        if (!alreadyExists) {
          result.push({
            ...memberObject,
            _id: memberId,
            isOwner: false,
          });
        }
      });
    }

    return result;
  }, [
    project,
    members,
    ownerId,
  ]);

  // =========================================================
  // FILTER REGISTERED USERS
  // =========================================================

  const filteredInvitationUsers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return invitationUsers;
    }

    return invitationUsers.filter(
      (candidate) => {
        const name =
          candidate?.name?.toLowerCase() || "";

        const email =
          candidate?.email?.toLowerCase() || "";

        return (
          name.includes(query) ||
          email.includes(query)
        );
      }
    );
  }, [
    invitationUsers,
    search,
  ]);

  // =========================================================
  // OPEN ADD MEMBER MODAL
  // =========================================================

  const openAddModal = async () => {
    if (!canManageMembers) {
      return;
    }

    setSearch("");
    setInvitationError("");
    setModalOpen(true);

    // Refresh registered users when opening modal
    try {
      setInvitationLoading(true);

      const response =
        await projectService.getInvitationUsers(
          id
        );

      const usersData =
        response?.data?.users ||
        response?.data?.data?.users ||
        response?.users ||
        response?.data ||
        [];

      setInvitationUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );
    } catch (error) {
      console.error(
        "Load invitation users error:",
        error
      );

      setInvitationError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load registered users."
      );
    } finally {
      setInvitationLoading(false);
    }
  };

  // =========================================================
  // CLOSE ADD MEMBER MODAL
  // =========================================================

  const closeAddModal = () => {
    if (invitingUserId) {
      return;
    }

    setModalOpen(false);
    setSearch("");
    setInvitationError("");
  };

  // =========================================================
  // SEND INVITATION
  // =========================================================

  const handleSendInvitation = async (
    invitedUserId
  ) => {
    if (!canManageMembers) {
      return;
    }

    if (!invitedUserId) {
      return;
    }

    try {
      setInvitingUserId(invitedUserId);
      setInvitationError("");

      await projectService.sendInvitation(
        id,
        invitedUserId
      );

      // -----------------------------------------------------
      // Immediately update UI
      // -----------------------------------------------------

      setInvitationUsers((previous) =>
        previous.map((candidate) =>
          candidate?._id === invitedUserId
            ? {
                ...candidate,
                status: "pending",
              }
            : candidate
        )
      );
    } catch (error) {
      console.error(
        "Send project invitation error:",
        error
      );

      setInvitationError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send project invitation."
      );
    } finally {
      setInvitingUserId(null);
    }
  };

  // =========================================================
  // REMOVE MEMBER
  // =========================================================

  const handleRemoveMember = async (
    memberId,
    memberName
  ) => {
    if (!canManageMembers) {
      return;
    }

    if (!memberId) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to remove ${
          memberName || "this member"
        } from the project?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setRemoveLoadingId(memberId);
      setPageError("");

      await projectService.removeMember(
        id,
        memberId
      );

      // Immediately update UI
      setMembers((previous) =>
        previous.filter((member) => {
          const currentId =
            member?._id ||
            member?.id ||
            member;

          return (
            currentId?.toString() !==
            memberId.toString()
          );
        })
      );

      // Reload server data
      await loadData(true);
    } catch (error) {
      console.error(
        "Remove member error:",
        error
      );

      setPageError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to remove member."
      );
    } finally {
      setRemoveLoadingId(null);
    }
  };

  // =========================================================
  // MEMBER NAME
  // =========================================================

  const getMemberName = (member) => {
    return (
      member?.name ||
      member?.username ||
      member?.fullName ||
      member?.email ||
      "Unknown User"
    );
  };

  // =========================================================
  // MEMBER EMAIL
  // =========================================================

  const getMemberEmail = (member) => {
    return member?.email || "";
  };

  // =========================================================
  // MEMBER INITIAL
  // =========================================================

  const getInitial = (member) => {
    const name =
      getMemberName(member);

    return name
      .charAt(0)
      .toUpperCase();
  };

  // =========================================================
  // INVITATION USER NAME
  // =========================================================

  const getInvitationUserName = (
    candidate
  ) => {
    return (
      candidate?.name ||
      candidate?.username ||
      candidate?.fullName ||
      candidate?.email ||
      "Unknown User"
    );
  };

  // =========================================================
  // INVITATION STATUS
  // =========================================================

  const getInvitationStatus =
    (candidate) => {
      return (
        candidate?.status ||
        "available"
      );
    };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={42}
            className="mx-auto animate-spin text-emerald-600"
          />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading project members...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (
    pageError &&
    !project
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <XCircle
              size={28}
              className="text-red-600"
            />
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load members
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {pageError}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => loadData()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/projects/${id}`)
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="relative min-h-full space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate(`/projects/${id}`)
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            <ArrowLeft size={17} />
            Back to Project
          </button>

          {/* TITLE */}

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <Users
                size={24}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Project Members
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {project?.name || "Project"}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            HEADER ACTIONS
        =================================================== */}

        <div className="flex flex-wrap gap-3">
          {/* REFRESH */}

          <button
            type="button"
            disabled={refreshing}
            onClick={() => loadData(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {/* ADD MEMBER */}

          {canManageMembers && (
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <UserPlus size={18} />
              Add Member
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          PAGE ERROR
      ===================================================== */}

      {pageError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <XCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="text-sm font-semibold text-red-800">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-red-700">
              {pageError}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          ADMIN BANNER
      ===================================================== */}

      {isAdmin && (
        <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <ShieldCheck
            size={22}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <p className="font-semibold text-blue-900">
              Admin View Only
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-700">
              You can view this project and its
              members. Admin accounts cannot add
              or remove project members.
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          NORMAL USER BANNER
      ===================================================== */}

      {isUser && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <UserPlus
            size={22}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <div>
            <p className="font-semibold text-emerald-900">
              Member Management
            </p>

            <p className="mt-1 text-sm leading-6 text-emerald-700">
              {isOwner
                ? "You can invite registered users to join this project."
                : "Only the project owner can invite or remove project members."}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TOTAL MEMBERS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
              <Users
                size={21}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Members
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {normalizedMembers.length}
              </p>
            </div>
          </div>
        </div>

        {/* PROJECT OWNER */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
              <User
                size={21}
                className="text-indigo-600"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Project Owner
              </p>

              <p className="max-w-[180px] truncate text-base font-bold text-slate-900">
                {getMemberName(
                  project?.owner
                )}
              </p>
            </div>
          </div>
        </div>

        {/* YOUR ACCESS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
              <ShieldCheck
                size={21}
                className="text-purple-600"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Your Access
              </p>

              <p className="text-base font-bold capitalize text-slate-900">
                {isAdmin
                  ? "Admin"
                  : isOwner
                  ? "Owner"
                  : "Member"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MEMBERS LIST
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Members
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                People collaborating on this
                project
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {normalizedMembers.length}
            </span>
          </div>
        </div>

        {normalizedMembers.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Users
                size={30}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No members found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              This project does not have any
              members yet.
            </p>

            {canManageMembers && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <UserPlus size={17} />
                Add First Member
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {normalizedMembers.map(
              (member, index) => {
                const memberId =
                  member?._id ||
                  member?.id;

                const memberName =
                  getMemberName(member);

                const memberEmail =
                  getMemberEmail(member);

                const isMemberOwner =
                  Boolean(member?.isOwner);

                const isRemoving =
                  removeLoadingId ===
                  memberId;

                return (
                  <div
                    key={
                      memberId ||
                      `member-${index}`
                    }
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                          isMemberOwner
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {getInitial(member)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-semibold text-slate-900">
                            {memberName}
                          </h3>

                          {isMemberOwner && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                              <ShieldCheck
                                size={12}
                              />
                              Owner
                            </span>
                          )}

                          {memberId &&
                            currentUserId &&
                            memberId.toString() ===
                              currentUserId.toString() && (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                You
                              </span>
                            )}
                        </div>

                        {memberEmail && (
                          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                            <Mail size={14} />

                            <span className="truncate">
                              {memberEmail}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* REMOVE - OWNER ONLY */}

                    {canManageMembers &&
                      !isMemberOwner && (
                        <button
                          type="button"
                          disabled={isRemoving}
                          onClick={() =>
                            handleRemoveMember(
                              memberId,
                              memberName
                            )
                          }
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isRemoving ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}

                          {isRemoving
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          ADD MEMBER / INVITE MODAL
      ===================================================== */}

      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddModal();
            }
          }}
        >
          <div
            className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="border-b border-slate-100 p-6">
              <button
                type="button"
                disabled={Boolean(invitingUserId)}
                onClick={closeAddModal}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={19} />
              </button>

              <div className="pr-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                  <UserPlus
                    size={24}
                    className="text-indigo-600"
                  />
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Add Project Member
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Select a registered student to
                  send a project invitation.
                </p>
              </div>

              {/* =================================================
                  SEARCH
              ================================================= */}

              <div className="relative mt-5">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search by name or email..."
                  autoFocus
                  disabled={Boolean(invitingUserId)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {invitationError && (
              <div className="mx-6 mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <XCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <p className="text-sm text-red-700">
                  {invitationError}
                </p>
              </div>
            )}

            {/* =================================================
                USERS LIST
            ================================================= */}

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              {invitationLoading ? (
                <div className="flex min-h-[260px] items-center justify-center">
                  <div className="text-center">
                    <Loader2
                      size={34}
                      className="mx-auto animate-spin text-emerald-600"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      Loading registered users...
                    </p>
                  </div>
                </div>
              ) : filteredInvitationUsers.length ===
                0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <Users
                      size={26}
                      className="text-slate-400"
                    />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-slate-800">
                    No users found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {search
                      ? "Try another name or email."
                      : "There are no registered users available to invite."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInvitationUsers.map(
                    (candidate) => {
                      const candidateId =
                        candidate?._id ||
                        candidate?.id;

                      const candidateName =
                        getInvitationUserName(
                          candidate
                        );

                      const candidateEmail =
                        candidate?.email ||
                        "";

                      const status =
                        getInvitationStatus(
                          candidate
                        );

                      const isInviting =
                        invitingUserId ===
                        candidateId;

                      return (
                        <div
                          key={candidateId}
                          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/30 sm:flex-row sm:items-center sm:justify-between"
                        >
                          {/* USER INFO */}

                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                              {candidateName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-800">
                                {candidateName}
                              </p>

                              {candidateEmail && (
                                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
                                  <Mail
                                    size={13}
                                  />

                                  {candidateEmail}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* STATUS / ACTION */}

                          {status === "member" ? (
                            <span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
                              <UserCheck
                                size={14}
                              />
                              Already Member
                            </span>
                          ) : status ===
                            "pending" ? (
                            <span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700">
                              <Clock3
                                size={14}
                              />
                              Request Pending
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                Boolean(
                                  invitingUserId
                                )
                              }
                              onClick={() =>
                                handleSendInvitation(
                                  candidateId
                                )
                              }
                              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isInviting ? (
                                <>
                                  <Loader2
                                    size={16}
                                    className="animate-spin"
                                  />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <UserPlus
                                    size={16}
                                  />
                                  Send Request
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="border-t border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  The user must accept the invitation
                  before becoming a project member.
                </p>

                <button
                  type="button"
                  disabled={Boolean(invitingUserId)}
                  onClick={closeAddModal}
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMembersPage;