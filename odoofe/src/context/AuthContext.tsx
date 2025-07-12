import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
const API_BASE = import .meta.env.VITE_API_BASE;

interface SearchHistoryItem {
  _id: string;
  product_image: string;
  title: string;
  description: string;
  points: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  avatar?: string;
  searchHistory?: SearchHistoryItem[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/v1/auth/authCheck`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Transform backend data to match frontend interface
        const transformedUser = {
          id: userData.user._id,
          name: userData.user.username,
          email: userData.user.email,
          points: userData.user.searchHistory?.reduce((total: number, item: any) => total + item.points, 0) || 0,
          avatar: userData.user.image || undefined,
          searchHistory: userData.user.searchHistory || []
        };
        setUser(transformedUser);
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Transform backend data to match frontend interface
      const transformedUser = {
        id: data.user._id,
        name: data.user.username,
        email: data.user.email,
        points: data.user.searchHistory?.reduce((total: number, item: any) => total + item.points, 0) || 0,
        avatar: data.user.image || undefined,
        searchHistory: data.user.searchHistory || []
      };

      setUser(transformedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Transform backend data to match frontend interface
      const transformedUser = {
        id: data.user._id,
        name: data.user.username,
        email: data.user.email,
        points: data.user.searchHistory?.reduce((total: number, item: any) => total + item.points, 0) || 0,
        avatar: data.user.image || undefined,
        searchHistory: data.user.searchHistory || []
      };

      setUser(transformedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (token) {
        await fetch(`${API_BASE}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear local state even if API call fails
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};