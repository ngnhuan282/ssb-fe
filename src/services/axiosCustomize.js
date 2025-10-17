import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log('Request URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Bỏ qua retry cho /auth/me để tránh vòng lặp
    if (originalRequest.url.includes('/auth/me')) {
      return Promise.reject(error);
    }

    // Nếu token hết hạn (410 GONE) và chưa retry
    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        await axiosInstance.post("/auth/refresh-token");
        
        // Retry request ban đầu
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn, chuyển về login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Nếu unauthorized (401), chỉ redirect nếu không ở login page
    if (error.response?.status === 401) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;