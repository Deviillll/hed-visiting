import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - Billing Workflow Management",
  description: "Login to access your dashboard",
};

export default function LoginPage() {
  return <LoginForm />;
}