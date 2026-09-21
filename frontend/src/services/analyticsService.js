import api from "./api";

const analyticsService = {
  getAnalytics: async (projectId) => {
    return api.get(
      `/analytics/project/${projectId}`
    );
  },
};

export default analyticsService;