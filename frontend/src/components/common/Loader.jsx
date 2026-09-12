import React from "react";

const Loader = ({
  fullScreen = false,
  text = "Loading...",
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative h-16 w-16">
        {/* Outer Glow */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            bg-emerald-300/30
            blur-xl
            animate-pulse
          "
        />

        {/* Spinner */}
        <div
          className="
            absolute
            inset-0
            animate-spin
            rounded-full
            border-4
            border-emerald-100
            border-t-emerald-600
            border-r-green-500
          "
        />

        {/* Inner Circle */}
        <div
          className="
            absolute
            inset-3
            flex
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-emerald-50
            to-green-100
            shadow-inner
          "
        >
          <span className="text-sm animate-pulse">
            🎓
          </span>
        </div>
      </div>

      <div className="text-center">
        <p
          className="
            animate-pulse
            text-sm
            font-bold
            text-slate-600
          "
        >
          {text}
        </p>

        <div className="mt-2 flex justify-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[loaderDot_1.2s_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[loaderDot_1.2s_200ms_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[loaderDot_1.2s_400ms_infinite]" />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-white/80
          backdrop-blur-md
        "
      >
        {/* Background Glow */}
        <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="relative z-10">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[250px] items-center justify-center">
      {content}

      <style>{`
        @keyframes loaderDot {
          0%, 100% {
            opacity: 0.25;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;