import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for HttpOnly cookies
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops if refresh fails
    // Only skip refresh for Password Verification if the error is explicitly "Incorrect password"
    // This allows genuine token expiry on this endpoint (or others) to still trigger refresh/logout
    const isIncorrectPassword =
      originalRequest.url?.includes("/verify-master-password") &&
      error.response?.data?.message === "Incorrect password";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isIncorrectPassword
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        // Assumes /auth/refresh sets a new HttpOnly cookie if successful
        // Or returns a new accessToken if you want to store it in memory/storage
        // Adjust based on your backend. Here we assume backend sends new accessToken.
        const { data } = await api.post("/auth/refresh");

        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - Logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
