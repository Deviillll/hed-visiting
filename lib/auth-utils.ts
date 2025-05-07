"use client";

// This middleware component checks if the user is authenticated
// and has the required role to access a page
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";

// Hook to protect routes based on authentication state
export function useAuthProtection() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isLoading };
}

// Hook to protect routes based on user role
export function useRoleProtection(allowedRoles: UserRole[]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        router.push("/dashboard"); // Redirect to main dashboard if role not allowed
      }
    }
  }, [user, isAuthenticated, isLoading, router, allowedRoles]);

  return { isLoading, user };
}