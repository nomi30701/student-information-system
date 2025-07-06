import axios from "../utils/axiosConfig";

const authService = {
  register: async (userData) => {
    const response = await axios.post(`/auth/register`, userData);

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }

    return response.data;
  },

  login: async (username, password) => {
    const response = await axios.post(`/auth/login`, {
      username,
      password,
    });
    // 儲存 JWT token
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }

    return response.data;
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // 清除本地儲存的 tokens
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
    }
  },

  getCurrentUser: async () => {
    const response = await axios.get(`/auth/current`);
    return response.data;
  },

  // 檢查是否已登入
  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  },

  // 獲取當前 token
  getToken: () => {
    return localStorage.getItem("authToken");
  },
};

export default authService;
