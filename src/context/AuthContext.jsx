import React, { createContext, useState, useEffect } from 'react';
import { authClient } from '../auth';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (e) {
      console.error('Neon auth sign out error:', e);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }

      try {
        const { data } = await authClient.getSession();
        if (data?.session && data?.user) {
          const { name, email, id } = data.user;
          const [firstName, ...lastNameArr] = (name || "Google User").split(" ");
          const lastName = lastNameArr.length ? lastNameArr.join(" ") : "User";

          const socialPassword = `GAuth@1${id ? id.substring(0, 8) : "2345678"}`;

          try {
            const res = await api.post('/auth/login', { email, password: socialPassword });
            login(res.data.token, res.data.user);
          } catch (err) {
            try {
              const regRes = await api.post('/auth/register', {
                firstName,
                lastName,
                email,
                password: socialPassword
              });
              login(regRes.data.token, regRes.data.user);
            } catch (regErr) {
              console.error("Backend sync failed", regErr);
              toast.error("Social login sync failed: " + (regErr.message || "Unknown error"));
              // Optional: log them out of Neon Auth if backend fails so they aren't stuck in a half-logged-in state
              await authClient.signOut().catch(() => { });
            }
          }
        }
      } catch (error) {
        console.error("Neon Auth session check failed", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
