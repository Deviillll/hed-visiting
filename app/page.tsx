import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to login page from root
  redirect("/login");
}