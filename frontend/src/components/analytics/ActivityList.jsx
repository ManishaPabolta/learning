const ActivityList = ({
  activities = [],
}) => {
  if (!activities.length) {
    return (
      <div className="bg-white border rounded-2xl p-6 text-center text-slate-500">
        No activity found.
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-5">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="flex gap-3 border-b last:border-0 pb-4 last:pb-0"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-semibold">
              {(
                activity.user?.name ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <p className="text-sm text-slate-700">
                <strong>
                  {activity.user?.name ||
                    "User"}
                </strong>{" "}
                {activity.description ||
                  activity.action ||
                  "performed an activity"}
              </p>

              {activity.createdAt && (
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(
                    activity.createdAt
                  ).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;