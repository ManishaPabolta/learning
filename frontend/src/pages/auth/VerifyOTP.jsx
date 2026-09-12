import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyOTP, loading, error } =
    useAuth();

  const email =
    location.state?.email || "";

  const [otp, setOtp] = useState(
    new Array(6).fill("")
  );

  const [formError, setFormError] =
    useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOTP = [...otp];
    updatedOTP[index] = value;

    setOtp(updatedOTP);
    setFormError("");

    if (
      value &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      setFormError(
        "Please enter the complete 6-digit OTP."
      );
      return;
    }

    if (!email) {
      setFormError(
        "Email information is missing. Please register again."
      );
      return;
    }

    try {
      await verifyOTP(email, code);

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Email verified successfully. Please login.",
        },
      });
    } catch (err) {
      setFormError(
        err.message ||
          "Invalid or expired OTP."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-green-300/20 rounded-full blur-3xl animate-pulse [animation-duration:5s]" />

        <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-emerald-500 rounded-full animate-ping" />

        <div className="absolute bottom-[20%] right-[15%] w-3 h-3 bg-green-500 rounded-full animate-bounce" />

      </div>

      <div className="relative w-full max-w-md rounded-[2rem] border border-emerald-100 bg-white/85 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_25px_80px_rgba(16,185,129,0.13)] animate-[fadeIn_0.7s_ease-out] overflow-hidden">

        {/* Accent */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 rounded-b-full" />

        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">

          <div className="text-center">

            <div className="relative mx-auto w-16 h-16">

              <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 animate-ping [animation-duration:2.5s]" />

              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/10 transition duration-500 hover:scale-110 hover:rotate-3">
                ✉️
              </div>

            </div>

            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mt-7">
              Email verification
            </p>

            <h1 className="text-3xl font-bold mt-2 text-slate-800">
              Verify your email
            </h1>

            <p className="text-slate-500 mt-3 leading-6">
              Enter the 6-digit OTP sent to
            </p>

            <p className="text-slate-800 font-semibold mt-1 break-all">
              {email || "your email"}
            </p>

          </div>

          {(formError || error) && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-center animate-[shake_0.4s_ease-in-out]">
              {formError || error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8"
          >

            <div className="flex justify-center gap-2 sm:gap-3">

              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] =
                      element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(
                      e.target.value,
                      index
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  className="w-11 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border border-emerald-100 bg-white text-slate-800 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10 hover:border-emerald-200"
                />
              ))}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full mt-8 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading
                ? "Verifying..."
                : (
                  <>
                    Verify OTP
                    <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
            </button>

          </form>

          <div className="text-center mt-7">

            <Link
              to="/register"
              className="group text-sm text-slate-500 hover:text-emerald-600 transition"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>{" "}
              Back to registration
            </Link>

          </div>

        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }
        `}
      </style>

    </div>
  );
};

export default VerifyOTP;