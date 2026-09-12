import React from "react";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="text-center">
        {/* Icon */}
        <div
          className={`
            relative
            mx-auto
            mb-5
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            text-2xl
            shadow-sm
            transition-all
            duration-500
            hover:scale-110
            hover:-rotate-2

            ${
              danger
                ? `
                  bg-red-50
                  text-red-600
                  ring-1
                  ring-red-100
                  shadow-red-500/10
                `
                : `
                  bg-emerald-50
                  text-emerald-600
                  ring-1
                  ring-emerald-100
                  shadow-emerald-500/10
                `
            }
          `}
        >
          <span
            className={`
              absolute
              inset-0
              rounded-2xl
              blur-xl
              opacity-30
              animate-pulse
              ${
                danger
                  ? "bg-red-300"
                  : "bg-emerald-300"
              }
            `}
          />

          <span className="relative z-10 animate-[confirmIcon_2s_ease-in-out_infinite]">
            {danger ? "⚠️" : "❓"}
          </span>
        </div>

        {/* Message */}
        <p
          className="
            mx-auto
            max-w-sm
            text-sm
            leading-6
            text-slate-500
            animate-[confirmText_350ms_ease-out]
          "
        >
          {message}
        </p>

        {/* Buttons */}
        <div
          className="
            mt-7
            flex
            justify-center
            gap-3
            animate-[confirmButtons_450ms_ease-out]
          "
        >
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>

      <style>
        {`
          @keyframes confirmIcon {
            0%,
            100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform: translateY(-3px) rotate(-3deg);
            }
          }

          @keyframes confirmText {
            0% {
              opacity: 0;
              transform: translateY(6px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes confirmButtons {
            0% {
              opacity: 0;
              transform: translateY(8px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Modal>
  );
};

export default ConfirmModal;