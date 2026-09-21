import {
  FileText,
  Upload,
  Users,
} from "lucide-react";

const ContributionSummary = ({
  analytics = {},
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-white border rounded-2xl p-5">
        <FileText className="text-indigo-600" />

        <p className="text-sm text-slate-500 mt-3">
          Notes Created
        </p>

        <h2 className="text-3xl font-bold mt-1">
          {analytics.totalNotes || 0}
        </h2>
      </div>

      <div className="bg-white border rounded-2xl p-5">
        <Upload className="text-green-600" />

        <p className="text-sm text-slate-500 mt-3">
          Files Uploaded
        </p>

        <h2 className="text-3xl font-bold mt-1">
          {analytics.totalFiles || 0}
        </h2>
      </div>

      <div className="bg-white border rounded-2xl p-5">
        <Users className="text-purple-600" />

        <p className="text-sm text-slate-500 mt-3">
          Members
        </p>

        <h2 className="text-3xl font-bold mt-1">
          {analytics.totalMembers || 0}
        </h2>
      </div>
    </div>
  );
};

export default ContributionSummary;