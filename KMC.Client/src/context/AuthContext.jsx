import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('kmc_token');
    const storedUser = localStorage.getItem('kmc_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user session', err);
        localStorage.removeItem('kmc_token');
        localStorage.removeItem('kmc_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, id, fullName, email: userEmail, role } = response.data;
    
    const userData = { id, fullName, email: userEmail, role };
    
    localStorage.setItem('kmc_token', token);
    localStorage.setItem('kmc_user', JSON.stringify(userData));

    setToken(token);
    setUser(userData);
    return userData;
  };

  const register = async (fullName, email, password, role) => {
    const response = await api.post('/auth/register', { fullName, email, password, role });
    const { token, id, email: userEmail, role: userRole } = response.data;

    const userData = { id, fullName, email: userEmail, role: userRole };

    localStorage.setItem('kmc_token', token);
    localStorage.setItem('kmc_user', JSON.stringify(userData));

    setToken(token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('kmc_token');
    localStorage.removeItem('kmc_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
