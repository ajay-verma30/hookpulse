import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// Axios Instance
const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true
});

// Module-level singleton — lives outside React, shared across all concurrent callers
let refreshPromise = null;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessTokenRef = useRef(null);
  const isInitialized = useRef(false); // Prevents StrictMode double-invocation

  // Helper to set user data
  const setAuthData = (token) => {
    setAccessToken(token);
    accessTokenRef.current = token;
    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // Shared refresh function — if a refresh is already in-flight, all callers
  // wait on the same promise instead of firing duplicate requests
  const refreshAccessToken = () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = axios
      .post(
        'http://localhost:3000/api/v1/users/refresh-token',
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const newToken = res.data.accessToken;
        setAuthData(newToken);
        return newToken;
      })
      .finally(() => {
        refreshPromise = null; // Clear so future refreshes can happen normally
      });

    return refreshPromise;
  };

  // Logout function
  const handleLogout = async () => {
    refreshPromise = null; // Kill any pending refresh so it doesn't race with logout
    try {
      await API.post('/users/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    setAuthData(null);
    window.location.href = '/login';
  };

  // Register interceptors once on mount — reads token via ref so no re-registration needed
  useEffect(() => {
    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        const token = accessTokenRef.current;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            // All concurrent 401s share the same refresh call via refreshAccessToken()
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return API(originalRequest);
          } catch {
            await handleLogout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.request.eject(requestInterceptor);
      API.interceptors.response.eject(responseInterceptor);
    };
  }, []); // Empty deps — runs once

  // On app load, attempt to restore session via refresh token cookie
  useEffect(() => {
    // Guard against React StrictMode firing this twice in dev,
    // which would consume the refresh token and cause the second call to fail
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initAuth = async () => {
      try {
        await refreshAccessToken(); // setAuthData is called inside refreshAccessToken
      } catch {
        setAuthData(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/users/login', { email, password });
      setAuthData(res.data.accessToken);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout: handleLogout,
        loading,
        API,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);