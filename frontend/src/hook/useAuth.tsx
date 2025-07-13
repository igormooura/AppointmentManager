import { useState } from "react";
import axios from "axios";

interface User {
  email: string;
  token: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email: string, code: string) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("http://localhost:3000/login", { email, code });
      if (data.authenticated && data.token) {
        const newUser = { email, token: data.token };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        setError("Invalid code");
      }
    } catch (error) {
      setError("Login failed" + error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return { user, login, logout, loading, error };
};

export default useAuth;
