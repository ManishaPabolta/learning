const ContributionChart = ({
  contributions = [],
}) => {
  if (!contributions.length) {
    return (
      <div className="bg-white border rounded-2xl p-6 text-center text-slate-500">
        No contribution data available.
      </div>
    );
  }

  const maxValue = Math.max(
    ...contributions.map(
      (item) =>
        Number(item.notes || 0) +
        Number(item.files || 0)
    ),
    1
  );

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h2 className="font-semibold text-lg mb-6">
        Member Contributions
      </h2>

      <div className="space-y-5">
        {contributions.map((item) => {
          const total =
            Number(item.notes || 0) +
            Number(item.files || 0);

          const width =
            (total / maxValue) * 100;

          return (
            <div key={item.user?._id || item._id}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">
                  {item.user?.name ||
                    item.name ||
                    "Member"}
                </span>

                <span className="text-slate-500">
                  {total} contributions
                </span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{
                    width: `${width}%`,
                  }}
                />
              </div>

              <div className="flex gap-4 mt-1 text-xs text-slate-500">
                <span>
                  Notes: {item.notes || 0}
                </span>

                <span>
                  Files: {item.files || 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContributionChart;