import {
  FolderKanban,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProjectHeader = ({ project }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FolderKanban className="text-indigo-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                {project?.name}
              </h1>

              <p className="text-sm text-slate-500">
                {project?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/projects/${project?._id}/notes`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            <FileText size={16} />
            Notes
          </Link>

          <Link
            to={`/projects/${project?._id}/members`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            <Users size={16} />
            Members
          </Link>

          <Link
            to={`/projects/${project?._id}/analytics`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            <BarChart3 size={16} />
            Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;