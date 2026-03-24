"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";

interface User {
  userId: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          username: decoded.username,
          role: decoded.role,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        Cookies.remove("accessToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    Cookies.set("accessToken", token, { expires: 1 }); // 1 day
    const decoded: any = jwtDecode(token);
    setUser({
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    });
    router.push("/");
  };

  const logout = () => {
    Cookies.remove("accessToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
