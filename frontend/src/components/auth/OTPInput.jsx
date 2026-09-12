import React, {
  useEffect,
  useRef,
} from "react";

const OTPInput = ({
  length = 6,
  value,
  onChange,
}) => {
  const inputsRef = useRef([]);

  const otpArray =
    value?.split("").slice(0, length) ||
    Array(length).fill("");

  const handleChange = (index, inputValue) => {
    const digit = inputValue
      .replace(/\D/g, "")
      .slice(-1);

    const newOTP = [...otpArray];

    newOTP[index] = digit;

    onChange(newOTP.join(""));

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otpArray[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < length - 1
    ) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    onChange(pasted);

    const focusIndex = Math.min(
      pasted.length,
      length - 1
    );

    inputsRef.current[focusIndex]?.focus();
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div
      className="flex justify-center gap-2 sm:gap-3"
      onPaste={handlePaste}
    >
      {Array.from({ length }).map(
        (_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] =
                element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otpArray[index] || ""}
            onChange={(e) =>
              handleChange(
                index,
                e.target.value
              )
            }
            onKeyDown={(e) =>
              handleKeyDown(index, e)
            }
            className="
              h-13 w-11
              rounded-xl
              border border-slate-200
              bg-slate-50
              text-center
              text-xl
              font-black
              text-slate-800
              outline-none
              transition-all
              duration-300

              hover:border-emerald-300
              hover:bg-emerald-50

              focus:border-emerald-500
              focus:bg-emerald-50
              focus:ring-4
              focus:ring-emerald-500/10
              focus:shadow-lg
              focus:shadow-emerald-500/10

              sm:h-14
              sm:w-14
            "
          />
        )
      )}
    </div>
  );
};

export default OTPInput;