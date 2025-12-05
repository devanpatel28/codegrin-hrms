import axios from "axios";

// ✅ Create axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_PUBLIC_API_URL}/api`,
  timeout: 30000,
});

// ✅ Handle Unauthorized (401) responses safely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAdminLoginPage =
        currentPath === "/admin" ||
        currentPath === "/admin/login" ||
        currentPath.includes("/admin/login");
      const isLoginRequest = error.config?.url?.includes("/admin/login");
      const hasToken = localStorage.getItem("adminToken");

      // Prevent redirect loops & clear auth if necessary
      if (!isAdminLoginPage && !isLoginRequest && hasToken) {
        console.warn("401 detected — clearing admin token and redirecting to login");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Admin Authentication API
export const adminAuthAPI = {
  // Login with email and password
  login: (admin_email, admin_password) => 
    api.post("/admin/login", { admin_email, admin_password }),

  // Get admin profile
  getProfile: (token) => 
    api.get("/admin/profile", { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Update admin profile
  updateProfile: (payload, token) => 
    api.put("/admin/profile", payload, { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Logout (optional - clears local storage)
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      window.location.href = "/admin/login";
    }
  }
};

export default api;
