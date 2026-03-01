import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { apiService, UserProfile } from "../services/apiService";

export type UserRole = "USER" | "ADMIN";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  isAdmin: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [role, setRole] = useState<UserRole | null>(
    localStorage.getItem("role") as UserRole | null,
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiService.getUserProfile();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as UserRole | null;
    if (storedToken && storedRole) {
      setIsAuthenticated(true);
      setToken(storedToken);
      setRole(storedRole);
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (token) {
      const axiosInstance = (apiService as any)["api"];
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    }
  }, [token]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiService.login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("email", email); // ✅ ADDED
      setToken(response.token);
      setRole(response.role as UserRole);
      setIsAuthenticated(true);
      await fetchProfile();
    },
    [fetchProfile],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email"); // ✅ ADDED
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setRole(null);
    setToken(null);
    setProfile(null);
    apiService.logout();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    role,
    profile,
    login,
    logout,
    token,
    isAdmin: role === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
