export const API_BASE_URL = "http://localhost:5000";

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/user/signin`,
    REGISTER: `${API_BASE_URL}/user/signup`,
    LOGOUT: `${API_BASE_URL}/user/logout`,
    REFRESH: `${API_BASE_URL}/user/refresh`,
  },
  USERS: `${API_BASE_URL}/user`,
  WORKSPACE: `${API_BASE_URL}/workspace`,
  PROJECT: `${API_BASE_URL}/project`,
  TASK: `${API_BASE_URL}/task`,
  SPRINT: `${API_BASE_URL}/sprint`,
  TEAM: `${API_BASE_URL}/team`,
  ATTACHMENT: `${API_BASE_URL}/attachment`,
  NOTIFICATION: `${API_BASE_URL}/notification`,
  MESSAGE: `${API_BASE_URL}/message`,
  CHAT: `${API_BASE_URL}/chat`,
  COMMENT: `${API_BASE_URL}/comment`,
  LABEL: `${API_BASE_URL}/label`,
  ACTIVITY: `${API_BASE_URL}/activity`,
} as const;
