"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios"; // Ensure this is set up to use credentials
import { AuthState, User } from "@/lib/types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) =>  Promise<{ success: boolean; message: string; data?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Fetch user on mount if not already set
  useEffect(() => {
    const fetchUser = async () => {
      if (authState.user) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const res = await axios.get("/auth"); // sends cookie automatically
        const user: User = res.data;

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState({ ...initialState, isLoading: false });
      }
    };

    fetchUser();
  }, [authState.user]);

  
 
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string;data?:string;}> => {
  try {
    const res = await axios.post("/login", { email, password }, { withCredentials: true });

    // Destructure custom response
    const { success, message ,data} = res.data;
    if (!success) {
      return { success: false, message };
    }

    // Now get the logged-in user details
    const meRes = await axios.get("/auth", { withCredentials: true });
    const user: User = meRes.data;

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    return { success: true, message,data };
  } catch (error: any) {
    const msg = error.response?.data?.message || "Something went wrong during login";
    return { success: false, message: msg };
  }
};

  const logout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
