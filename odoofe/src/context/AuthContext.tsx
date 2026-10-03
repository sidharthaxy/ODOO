import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

/* ---------- Types ---------- */

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  points: number;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getToken: () => string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

/* ---------- Context ---------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

/* ---------- Provider ---------- */

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getToken = () => localStorage.getItem("rewear_token");

  const fetchMe = useCallback(async () => {
    try {
      const token = localStorage.getItem("rewear_token");
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/api/v1/auth/authCheck`, {
        credentials: "include",
        headers,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Login failed");
    }

    if (data.token) {
      localStorage.setItem("rewear_token", data.token);
    }
    if (data.user) {
      setUser(data.user);
    } else {
      await fetchMe();
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to create account");
    }

    if (data.token) {
      localStorage.setItem("rewear_token", data.token);
    }
    if (data.user) {
      setUser(data.user);
    } else {
      await fetchMe();
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem("rewear_token");
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await fetchMe();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        login,
        signup,
        logout,
        refreshUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};