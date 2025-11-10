import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  activeRole: string | null;
  currentUserRole: string | null;
  setAuth: (user: User, token: string) => void; // called after login success
  logout: () => void;
  setActiveRole: (role: string) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRoleState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Derive current user role directly from user.type
  const currentUserRole = user?.type || activeRole;

  // ✅ Load auth data from localStorage (on app load)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("pepperloyal_user");
      const storedRole = localStorage.getItem("pepperloyal_active_role");
      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setActiveRoleState(JSON.parse(storedRole));
      }
    } catch (err) {
      console.error("Error restoring auth:", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Called by useLogin() after successful login
  const setAuth = (userData: User, token: string) => {
    const role = userData.type || "member";
    localStorage.setItem("pepperloyal_token", token);
    localStorage.setItem("pepperloyal_user", JSON.stringify(userData));
    localStorage.setItem("pepperloyal_active_role", JSON.stringify(role));
    setUser(userData);
    setActiveRoleState(role);
  };

  const logout = () => {
    localStorage.removeItem("pepperloyal_token");
    localStorage.removeItem("pepperloyal_user");
    localStorage.removeItem("pepperloyal_active_role");
    setUser(null);
    setActiveRoleState(null);
  };

  const setActiveRole = (role: string) => {
    setActiveRoleState(role);
    localStorage.setItem("pepperloyal_active_role", JSON.stringify(role));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        currentUserRole,
        setAuth,
        logout,
        setActiveRole,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
