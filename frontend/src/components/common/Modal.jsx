import React, { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-950/60
        p-4
        backdrop-blur-md
        animate-[modalOverlay_200ms_ease-out]
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Background Glow */}
      <div
        className="
          pointer-events-none
          absolute
          h-80
          w-80
          rounded-full
          bg-emerald-400/10
          blur-3xl
        "
      />

      <div
        className={`
          relative
          w-full
          ${sizes[size]}
          overflow-hidden
          rounded-3xl
          border
          border-emerald-100/80
          bg-white
          shadow-2xl
          shadow-emerald-950/20
          animate-[modalContent_300ms_ease-out]
        `}
      >
        {/* Top Green Accent */}
        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-1
            bg-gradient-to-r
            from-emerald-400
            via-green-500
            to-emerald-600
          "
        />

        {title && (
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-100
              bg-gradient-to-r
              from-emerald-50/50
              via-white
              to-green-50/30
              px-6
              py-4
            "
          >
            <h2
              className="
                text-lg
                font-extrabold
                tracking-tight
                text-slate-900
              "
            >
              {title}
            </h2>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-transparent
                  text-xl
                  leading-none
                  text-slate-400
                  transition-all
                  duration-300
                  hover:rotate-90
                  hover:border-emerald-100
                  hover:bg-emerald-50
                  hover:text-emerald-600
                  active:scale-90
                "
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className="max-h-[75vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalOverlay {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes modalContent {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;