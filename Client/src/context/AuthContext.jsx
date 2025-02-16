import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(response => {
        setUser(response.data.user);
      }).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);  // Make sure this line is present
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
