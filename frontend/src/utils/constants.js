export const APP_NAME = "NGSkillForge";

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const ROUTES = {
  HOME: "/",
  COURSES: "/courses",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",

  DASHBOARD: "/dashboard",
  MY_COURSES: "/my-courses",
  ASSIGNMENTS: "/assignments",
  PROFILE: "/profile",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_COURSES: "/admin/courses",
  ADMIN_ADD_COURSE: "/admin/courses/add",
  ADMIN_EDIT_COURSE: "/admin/courses/edit",

  NOT_FOUND: "*",
};

export const FILE_TYPES = {
  PDF: "application/pdf",

  JPEG: "image/jpeg",

  JPG: "image/jpg",

  PNG: "image/png",

  WEBP: "image/webp",

  DOC: "application/msword",

  DOCX:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const DEFAULT_PAGE = 1;

export const DEFAULT_LIMIT = 10;