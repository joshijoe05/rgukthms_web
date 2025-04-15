import axios from "axios";


const api = axios.create({
  baseURL: "https://rgukt-hms.vercel.app/api/v1", // API Base URL
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, try to refresh token
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post("https://rgukt-hms.vercel.app/api/v1/auth/refresh", 
          { refreshToken },
          { withCredentials: true } 
        );

        const { accessToken } = res.data;
        localStorage.setItem("accessToken", accessToken);

        //  Retry the failed request with new token
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return axios(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        localStorage.clear();
        window.location.href = "/login"; // Redirect to login if refresh fails
      }
    }
    return Promise.reject(error);
  }
);

export default api;
