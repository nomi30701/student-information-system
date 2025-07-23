import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 在每個請求中添加 Authorization 標頭
    // token 存儲在 localStorage 中
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url;

      // 排除登入相關的 API
      const isAuthRequest =
        requestUrl?.includes("/auth/login") ||
        requestUrl?.includes("/auth/register");

      if (!isAuthRequest) {
        // 清除 tokens
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
