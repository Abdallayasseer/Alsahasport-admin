import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "./context";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to verify token with backend
    const verifyToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validate session with backend
        const { data } = await api.post("/auth/validate");
        if (data.success) {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          setUser({ ...storedUser, role: data.data.role, ...data.data });
        } else {
          throw new Error("Validation failed");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // We need to access logout logic here, but since logout is defined below,
        // we can just implement the cleanup logic directly or restructure.
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = useCallback(async (identifier, password, clientPublicIp) => {
    try {
      const response = await api.post("/admin/login", {
        identifier,
        password,
        clientPublicIp,
      });
      const { accessToken, user: userData, data } = response.data;

      const targetUser = userData || data?.user || data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(targetUser));
        setUser(targetUser);
        return { success: true };
      } else {
        return { success: false, message: "No access token received" };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    try {
      if (token) {
        await api.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/admin/login");
    }
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
    }),
    [user, login, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
