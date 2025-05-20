import { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register - Billing Workflow Management",
  description: "Create an account ",
};

export default function RegisterPage() {
  return <RegisterForm />;
}