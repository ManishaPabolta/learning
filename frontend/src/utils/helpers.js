export const getInitials = (name = "") => {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

export const formatDate = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const truncateText = (
  text = "",
  maxLength = 100
) => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
};

export const getFileExtension = (fileName = "") => {
  const parts = fileName.split(".");

  return parts.length > 1
    ? parts.pop().toLowerCase()
    : "";
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";

  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${(
    bytes / Math.pow(1024, index)
  ).toFixed(2)} ${sizes[index]}`;
};

export const getErrorMessage = (
  error,
  fallback = "Something went wrong"
) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.append(key, value);
      }
    }
  );

  return searchParams.toString();
};