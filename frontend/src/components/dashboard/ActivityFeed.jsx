import React from "react";
import {
  CheckCircle2,
  Upload,
  BookOpen,
  UserPlus,
} from "lucide-react";

const ActivityFeed = ({ activities = [] }) => {
  const defaultActivities = [
    {
      type: "course",
      title: "Started a new course",
      description:
        "Keep learning and improving your skills.",
    },
    {
      type: "assignment",
      title: "Assignment uploaded",
      description:
        "Your submission was successfully uploaded.",
    },
    {
      type: "completed",
      title: "Course progress updated",
      description:
        "Great work! Keep going.",
    },
  ];

  const data =
    activities.length > 0
      ? activities
      : defaultActivities;

  const getIcon = (type) => {
    switch (type) {
      case "assignment":
        return Upload;

      case "completed":
        return CheckCircle2;

      case "user":
        return UserPlus;

      default:
        return BookOpen;
    }
  };

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-emerald-100
        bg-gradient-to-br
        from-white
        via-white
        to-emerald-50/40
        p-5
        shadow-sm
        shadow-emerald-500/5
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-emerald-200
        hover:shadow-xl
        hover:shadow-emerald-500/10
      "
    >
      {/* Decorative Glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-emerald-100/50
          blur-3xl
          transition-transform
          duration-700
          group-hover:scale-125
        "
      />

      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-2">
          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-emerald-50
              text-sm
              shadow-sm
              ring-1
              ring-emerald-100
            "
          >
            ✨
          </span>

          <h2 className="font-extrabold tracking-tight text-slate-800">
            Recent Activity
          </h2>
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Your latest platform activity
        </p>
      </div>

      <div className="relative z-10 space-y-5">
        {/* Timeline */}
        <div
          className="
            absolute
            bottom-3
            left-5
            top-3
            w-px
            bg-gradient-to-b
            from-emerald-200
            via-emerald-100
            to-transparent
          "
        />

        {data.map((activity, index) => {
          const Icon = getIcon(activity.type);

          return (
            <div
              key={activity._id || index}
              className="
                group/item
                relative
                flex
                gap-4
                animate-[activityEnter_400ms_ease-out]
              "
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Icon */}
              <div
                className="
                  relative
                  z-10
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-100
                  bg-white
                  text-emerald-600
                  shadow-md
                  shadow-emerald-500/10
                  ring-4
                  ring-emerald-50/70
                  transition-all
                  duration-300
                  group-hover/item:scale-110
                  group-hover/item:-rotate-3
                  group-hover/item:bg-emerald-50
                "
              >
                <Icon size={17} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-1">
                <h3
                  className="
                    text-sm
                    font-bold
                    text-slate-700
                    transition-colors
                    duration-300
                    group-hover/item:text-emerald-700
                  "
                >
                  {activity.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {activity.description}
                </p>

                {activity.createdAt && (
                  <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                    {new Date(
                      activity.createdAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Accent */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          h-1
          w-16
          -translate-x-1/2
          rounded-t-full
          bg-gradient-to-r
          from-emerald-400
          to-green-600
          opacity-50
          transition-all
          duration-500
          group-hover:w-28
          group-hover:opacity-100
        "
      />

      <style>{`
        @keyframes activityEnter {
          0% {
            opacity: 0;
            transform: translateX(-8px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityFeed;