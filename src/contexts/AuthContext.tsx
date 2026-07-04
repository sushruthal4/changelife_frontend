import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import authApi from "@/lib/api/auth";
import { getApiErrorMessage, LoginRequest, LoginResponse, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  saveSession: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(() => {
    const storedUser = authApi.getCurrentUser();
    const token = authApi.getAuthToken();
    setUser(storedUser && token ? storedUser : null);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const saveSession = (token: string, nextUser: User) => {
    authApi.saveSession(token, nextUser);
    setUser(nextUser);
    setError(null);
  };

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data?.token) {
        saveSession(response.data.token, response.data.user);
      }
      return response;
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, "Login failed");
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    saveSession,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
