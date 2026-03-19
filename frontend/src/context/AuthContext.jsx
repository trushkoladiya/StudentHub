import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create the context
const AuthContext = createContext(null);

// Provider component — wraps the entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Load user from localStorage on app start ──────────
  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // ─── Login ─────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    const userData = data.data;
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // ─── Register ──────────────────────────────────────────
  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    const userData = data.data;
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // ─── Logout ────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // ─── Update user after profile edit ───────────────────
  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem('userInfo', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;