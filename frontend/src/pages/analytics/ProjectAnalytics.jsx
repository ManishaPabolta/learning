import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { useParams } from "react-router-dom";

import useAnalytics from "../../hooks/useAnalytics";
import useAuth from "../../hooks/useAuth";

import ContributionSummary from "../../components/analytics/ContributionSummary";
import ContributionChart from "../../components/analytics/ContributionChart";
import ActivityList from "../../components/analytics/ActivityList";

const ProjectAnalytics = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const {
    analytics,
    activities,
    loading,
    getAnalytics,
    getActivity,
  } = useAnalytics(projectId);

  useEffect(() => {
    getAnalytics();
    getActivity();
  }, [
    getAnalytics,
    getActivity,
  ]);

  if (loading && !analytics) {
    return (
      <div className="p-10 text-center">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold">
            Project Analytics
          </h1>

          <p className="text-slate-500 mt-1">
            View project contributions and
            activity.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            Admin View Only
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Admin can monitor project activity
          and contributions but cannot modify
          project data.
        </div>
      )}

      <ContributionSummary
        analytics={analytics || {}}
      />

      <ContributionChart
        contributions={
          analytics?.contributions || []
        }
      />

      <ActivityList
        activities={activities || []}
      />
    </div>
  );
};

export default ProjectAnalytics;