import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: string;
  message?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (userData: UserSession) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const sessionStr = await AsyncStorage.getItem("userSession");
      if (sessionStr) {
        setUser(JSON.parse(sessionStr));
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: UserSession) => {
    try {
      await AsyncStorage.setItem("userSession", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to save session:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userSession");
      setUser(null);
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
