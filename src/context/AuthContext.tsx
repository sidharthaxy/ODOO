interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  avatar?: string;
  searchHistory?: SearchHistoryItem[];
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const value = {
  user,
  login,
  adminLogin,
  signup,
  logout,
  isAuthenticated: !!user,
  isAdmin: user?.role === 'admin',
  loading,
  error,
};