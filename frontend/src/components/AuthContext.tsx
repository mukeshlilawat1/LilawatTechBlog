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
  profile: UserProfile | null; // ✅ name, email, totalPosts
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  isAdmin: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [role, setRole] = useState<UserRole | null>(
    localStorage.getItem("role") as UserRole | null,
  );
  const [profile, setProfile] = useState<UserProfile | null>(null); // ✅

  // ✅ Profile fetch helper
  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiService.getUserProfile();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as UserRole | null;
    if (storedToken && storedRole) {
      setIsAuthenticated(true);
      setToken(storedToken);
      setRole(storedRole);
      fetchProfile(); // ✅ page refresh pe bhi profile load ho
    }
  }, []);

  // Axios header sync
  useEffect(() => {
    if (token) {
      const axiosInstance = apiService["api"];
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    }
  }, [token]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiService.login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      setToken(response.token);
      setRole(response.role as UserRole);
      setIsAuthenticated(true);
      await fetchProfile(); // ✅ login ke baad turant profile lo
    },
    [fetchProfile],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    setToken(null);
    setProfile(null); // ✅ clear
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

export default AuthContext;
