import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  token: string;
  userId: string;
  fullName: string;
  userName: string;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: NonNullable<User>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const fullName = localStorage.getItem("fullName");
    const userName = localStorage.getItem("userName");

    if (token && userId) {
      setUser({ token, userId, fullName: fullName || "", userName: userName || "" });
    }
  }, []);

  const login = (userData: NonNullable<User>) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("fullName", userData.fullName);
    localStorage.setItem("userName", userData.userName);
    setUser(userData);
    navigate("/dashboard"); // Redirect to dashboard after login
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/"); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};