import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onLoginCallbacks] = useState(() => new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    api.get('/users/profile').then((res) => setUser(res.data)).catch(() => {
      localStorage.removeItem('token');
      setUser(null);
    }).finally(() => setLoading(false));
  }, []);

  // Allow other contexts (e.g. CartContext) to register a callback to run after login
  const registerOnLogin = useCallback((cb) => {
    onLoginCallbacks.add(cb);
    return () => onLoginCallbacks.delete(cb);
  }, [onLoginCallbacks]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      // Run post-login callbacks (e.g. cart sync)
      for (const cb of onLoginCallbacks) {
        try { await cb(); } catch (e) { console.error('Post-login callback error:', e); }
      }
      toast.success('Logged in successfully');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/users/register', { name, email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      // Run post-login callbacks (e.g. cart sync)
      for (const cb of onLoginCallbacks) {
        try { await cb(); } catch (e) { console.error('Post-login callback error:', e); }
      }
      toast.success('Registered successfully');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out');
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, registerOnLogin }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
