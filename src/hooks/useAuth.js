// hooks/useAuth.js - Hook d'authentification avec cookies

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../scripts';

const TOKEN_COOKIE_NAME = 'auth_token';
const TOKEN_EXPIRY_DAYS = 7;

// Helpers cookies
const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Vérifier token dans cookies
      const cookieToken = getCookie(TOKEN_COOKIE_NAME);
      if (!cookieToken) {
        setIsAuthenticated(false);
        setUser(null);
        // Rediriger vers login si pas de token
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
        return;
      }

      // Vérifier token dans localStorage (sync)
      const localToken = localStorage.getItem('auth_token');
      if (!localToken) {
        // Token cookie existe mais pas en local, le restaurer
        localStorage.setItem('auth_token', cookieToken);
      }

      // Vérifier validité du token via API
      const userData = await auth.getMe();
      setIsAuthenticated(true);
      setUser(userData);
      
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      // Rediriger vers login en cas d'erreur
      if (window.location.pathname !== '/login') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await auth.login(email, password);
      
      // Sauver token en cookie ET localStorage
      setCookie(TOKEN_COOKIE_NAME, response.access_token, TOKEN_EXPIRY_DAYS);
      localStorage.setItem('auth_token', response.access_token);
      
      setIsAuthenticated(true);
      await checkAuth(); // Récupérer données utilisateur
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    deleteCookie(TOKEN_COOKIE_NAME);
    localStorage.removeItem('auth_token');
    auth.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    loading,
    user,
    isAdmin: user?.is_admin || false,
    login,
    logout,
    requireAuth,
    checkAuth
  };
};