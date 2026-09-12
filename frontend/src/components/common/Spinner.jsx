import React from "react";

const Spinner = ({
  size = "md",
  className = "",
}) => {
  const sizes = {
    xs: "h-3 w-3 border-2",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4",
    xl: "h-14 w-14 border-4",
  };

  return (
    <span
      className={`
        relative
        inline-block
        animate-spin
        rounded-full
        border-emerald-100
        border-t-emerald-600
        border-r-green-500
        shadow-sm
        shadow-emerald-500/10
        ${sizes[size]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;