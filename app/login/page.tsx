import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - Role-Based Admin Dashboard",
  description: "Login to access your role-based dashboard",
};

export default function LoginPage() {
  return <LoginForm />;
}