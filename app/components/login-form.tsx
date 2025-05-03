"use client";

import { predefinedUsers } from "@/app/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

async function loginUser(prevState: any, formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const user = predefinedUsers.find(
		(u) => u.email === email && u.password === password
	);

	if (user) {
		localStorage.setItem("user", JSON.stringify(user));
		return { success: true, error: null };
	}

	return { success: false, error: "Invalid email or password" };
}

export function LoginForm() {
	const router = useRouter();
	const [state, formAction] = useActionState(loginUser, {
		success: false,
		error: null,
	});

	if (state.success) {
		router.push("/dashboard");
	}

	return (
		<form action={formAction} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="Enter your email"
					defaultValue="admin@example.com"
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="Enter your password"
					defaultValue="password"
					required
				/>
			</div>
			{state.error && <p className="text-sm text-red-500">{state.error}</p>}
			<Button type="submit" className="w-full">
				Sign in
			</Button>
			<div className="text-sm text-muted-foreground text-center">
				<p>Demo credentials:</p>
				<p>superadministrator@example.com / password</p>
				<p>administrator@example.com / password</p>
				<p>principal@example.com / password</p>
				<p>employee@example.com / password</p>
			</div>
		</form>
	);
}
