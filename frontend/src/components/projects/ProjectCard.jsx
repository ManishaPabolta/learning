import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  ArrowRight,
} from "lucide-react";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
          <FolderKanban className="text-indigo-600" />
        </div>

        {project?.isPublic && (
          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Public
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        {project?.name}
      </h3>

      <p className="mt-2 text-sm text-slate-500 line-clamp-3">
        {project?.description ||
          "No project description"}
      </p>

      <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <Users size={16} />
          {project?.members?.length || 0} members
        </span>
      </div>

      <Link
        to={`/projects/${project?._id}`}
        className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Open Project
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default ProjectCard;