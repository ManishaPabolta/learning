
import React, { useState } from "react";
import {
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const EnrollButton = ({ courseId }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEnroll = async () => {
    if (!courseId) return;

    try {
      setLoading(true);

      await api.post(`/courses/enroll/${courseId}`);

      setSuccess(true);
    } catch (error) {
      console.error(error);

      if (error?.response?.status === 401) {
        navigate("/login");
        return;
      }

      alert(
        error?.response?.data?.message ||
          "Unable to enroll in course"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <button
        disabled
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-emerald-200
          bg-emerald-50
          px-6
          py-3.5
          text-sm
          font-bold
          text-emerald-700
          shadow-sm
        "
      >
        <CheckCircle size={18} />
        Enrolled Successfully
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-gradient-to-r
        from-emerald-600
        via-green-500
        to-lime-400
        px-6
        py-3.5
        text-sm
        font-bold
        text-white
        shadow-lg
        shadow-emerald-500/20
        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:shadow-xl
        hover:shadow-emerald-500/30

        active:translate-y-0

        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      <GraduationCap
        size={19}
        className="transition-transform duration-300 group-hover:-translate-y-1"
      />

      {loading ? "Enrolling..." : "Enroll in Course"}
    </button>
  );
};

export default EnrollButton;
