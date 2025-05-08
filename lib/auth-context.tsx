"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AuthState, User, UserRole } from "@/lib/types";
import { CloudCog } from "lucide-react";

// Mock users for demonstration purposes
// In a real app, you would fetch this from an API
const MOCK_USERS = [
  {
    id: "1",
    email: "superadmin@example.com",
    password: "password",
    name: "Super Admin",
    role: "superadmin" as UserRole,
    avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "password",
    name: "Admin User",
    role: "admin" as UserRole,
    avatar: "https://images.pexels.com/photos/2216607/pexels-photo-2216607.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "3",
    email: "principal@example.com",
    password: "password",
    name: "Principal User",
    role: "principal" as UserRole,
    avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "4",
    email: "employee@example.com",
    password: "password",
    name: "Employee User",
    role: "employee" as UserRole,
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
  }
];

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
};

// Create the auth context
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = Cookies.get("user");
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error("Failed to parse stored user", error);
        Cookies.remove("user");
        setAuthState({...initialState, isLoading: false});
      }
    } else {
      setAuthState({...initialState, isLoading: false});
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would make an API call to verify credentials
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
			// Create a user object without the password
			const { password: _, ...safeUser } = user;
			console.log("user ", safeUser);

      // Store in state
      setAuthState({
        user: safeUser,
        isAuthenticated: true,
        isLoading: false
      });
      
      // Store in cookie (7 days expiry)
      Cookies.set("user", JSON.stringify(safeUser), { expires: 7 });
      
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    
    Cookies.remove("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}