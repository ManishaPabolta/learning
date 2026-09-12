const config = {
  API_URL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  APP_NAME: "NGSkillForge",

  APP_DESCRIPTION:
    "A modern learning platform for courses, assignments and skill development.",

  TOKEN_KEY: "ngskillforge_access_token",

  REFRESH_TOKEN_KEY: "ngskillforge_refresh_token",

  USER_KEY: "ngskillforge_user",
};

export default config;