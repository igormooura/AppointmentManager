import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserInfo {
  email: string;
}

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        logout();
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/auth/verify-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.authenticated) {
          setIsAuthenticated(true);
          setUserInfo(response.data.user);
        } else {
          logout();
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Authentication failed");
        } else {
          setError("An unexpected error occurred");
        }
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [logout]);

  return { isAuthenticated, userInfo, loading, error, logout };
}

export default useAuth;