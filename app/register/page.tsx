"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaLeaf, FaUser, FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/contexts/AuthContext";
import { NextPage } from "next";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import api from "@/lib/backend/api/axiosConfig";

const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
	location: z.string().min(0, "Location must be at least 2 characters"),
	password: z.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
	passwordConfirm: z.string().min(8, "Please confirm your password"),
	acceptTerms: z.boolean().refine(val => val === true, {
		message: "You must accept the terms and privacy policy"
	}),
}).refine((data) => data.password === data.passwordConfirm, {
	message: "Passwords do not match",
	path: ["passwordConfirm"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: NextPage = () => {
	const { register } = useAuth()
	const router = useRouter();
	const [formData, setFormData] = useState<RegisterFormData>({
		name: "",
		email: "",
		location: "",
		password: "",
		passwordConfirm: "",
		acceptTerms: false,
	});
	const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [registerError, setRegisterError] = useState("");
	const [passwordStrength, setPasswordStrength] = useState(0);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		// Clear error when user types
		if (errors[name as keyof RegisterFormData]) {
			setErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}

		// Calculate password strength
		if (name === "password") {
			let strength = 0;
			if (value.length >= 8) strength += 1;
			if (/[A-Z]/.test(value)) strength += 1;
			if (/[a-z]/.test(value)) strength += 1;
			if (/[0-9]/.test(value)) strength += 1;
			if (/[^A-Za-z0-9]/.test(value)) strength += 1;
			setPasswordStrength(strength);
		}
	};

	const validateForm = () => {
		try {
			registerSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
				error.errors.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0] as keyof RegisterFormData] = err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setRegisterError("");

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			// Call your registration API
			await register(formData.name, formData.email, formData.password, formData.location);

			// Registration successful - Redirect to dashboard.
			router.push("/account?registered=true");

		} catch (error) {
			// Convert error to a strongly-typed AppError if possible
			let errorMessage = "An unexpected error occurred. Please try again.";

			// Extract meaningful error message if available
			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			}

			// Log in development, use proper error tracking in production
			if (process.env.NODE_ENV !== 'production') {
				console.error("Registration error:", error);
			} else {
				// In production, this would use a service like Sentry
				// Example: Sentry.captureException(error);
			}

			setRegisterError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const CustomGoogleButton = () => {
		const login = useGoogleLogin({
			onSuccess: async (tokenResponse) => {
				const idToken = tokenResponse.access_token;
				if (!idToken) return;

				const request = await api.post('/auth/register/google', { id_token: idToken });

				if (request.data.success) {
					localStorage.setItem("userId", request.data.data.userId);
					router.push("/account?registered=true");
				}
			},
			onError: () => {
				console.log('Login Failed');
			}
		});

		return (
			<Button
				variant={"secondary"}
				type="button"
				onClick={() => login()}
				className="w-full border border-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
			>
				<FaGoogle className="h-5 w-5 dark:text-white text-black" />
				<span className="ml-2">Google</span>
			</Button>
		);
	};

	return (
		<GoogleOAuthProvider clientId="235849009633-efomk49fqdtlt8am0aufci14qoq38brg.apps.googleusercontent.com">
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-22 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8 dark:bg-slate-800 p-8 rounded-xl shadow-xl">
					<div className="text-center">
						<Link href="/" className="inline-block">
							<div className="flex items-center justify-center">
								<FaLeaf className="h-12 w-12 text-green-600" />
								<h1 className="ml-2 text-3xl font-bold text-green-600">GreenVue</h1>
							</div>
						</Link>
						<h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							Already have an account?{" "}
							<Link
								href="/login"
								prefetch={false}
								className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
							>
								Sign in
							</Link>
						</p>
					</div>

					{registerError && (
						<div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
							<span className="block sm:inline">{registerError}</span>
						</div>
					)}

					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						<div className="rounded-md shadow-sm -space-y-px">
							<div className="mb-4">
								<label htmlFor="name" className="sr-only">
									Full Name
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaUser className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="name"
										name="name"
										type="text"
										autoComplete="name"
										required
										className={`appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border ${errors.name ? "border-red-300" : "border-gray-300"
											} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400`}
										placeholder="Full Name"
										value={formData.name}
										onChange={handleChange}
									/>
								</div>
								{errors.name && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
								)}
							</div>

							<div className="mb-4">
								<label htmlFor="email" className="sr-only">
									Email address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaEnvelope className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										required
										className={`appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border ${errors.email ? "border-red-300" : "border-gray-300"
											} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400`}
										placeholder="Email address"
										value={formData.email}
										onChange={handleChange}
									/>
								</div>
								{errors.email && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
								)}
							</div>

							<div className="mb-4">
								<label htmlFor="password" className="sr-only">
									Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaLock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="new-password"
										required
										className={`appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border ${errors.password ? "border-red-300" : "border-gray-300"
											} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400`}
										placeholder="Password"
										value={formData.password}
										onChange={handleChange}
									/>
								</div>
								{errors.password && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
								)}

								{/* Password strength indicator */}
								{formData.password && (
									<div className="mt-2">
										<div className="flex justify-between mb-1">
											<span className="text-xs text-gray-500 dark:text-gray-400">Password strength:</span>
											<span className="text-xs font-medium">
												{passwordStrength === 0 && "Very Weak"}
												{passwordStrength === 1 && "Weak"}
												{passwordStrength === 2 && "Fair"}
												{passwordStrength === 3 && "Good"}
												{passwordStrength === 4 && "Strong"}
												{passwordStrength === 5 && "Very Strong"}
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
											<div
												className={`h-1.5 rounded-full ${passwordStrength <= 1 ? "bg-red-500" :
													passwordStrength <= 2 ? "bg-orange-500" :
														passwordStrength <= 3 ? "bg-yellow-500" :
															"bg-green-500"
													}`}
												style={{ width: `${(passwordStrength / 5) * 100}%` }}
											></div>
										</div>
									</div>
								)}
							</div>

							<div className="mb-4">
								<label htmlFor="passwordConfirm" className="sr-only">
									Confirm Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaLock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="passwordConfirm"
										name="passwordConfirm"
										type="password"
										autoComplete="new-password"
										required
										className={`appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border ${errors.passwordConfirm ? "border-red-300" : "border-gray-300"
											} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400`}
										placeholder="Confirm Password"
										value={formData.passwordConfirm}
										onChange={handleChange}
									/>
								</div>
								{errors.passwordConfirm && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.passwordConfirm}</p>
								)}
							</div>
						</div>

						<div className="flex items-start">
							<div className="flex items-center h-5">
								<Checkbox
									id="acceptTerms"
									name="acceptTerms"
									className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
									checked={formData.acceptTerms}
									onClick={() => setFormData((prev) => ({ ...prev, acceptTerms: !prev.acceptTerms }))}
									required
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="acceptTerms" className="text-gray-700 dark:text-gray-300">
									I agree to the{" "}
									<Link
										href="/terms"
										className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
									>
										Privacy Policy
									</Link>
								</label>
								{errors.acceptTerms && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>
								)}
							</div>
						</div>

						<div>
							<Button
								type="submit"
								disabled={isLoading}
								className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
								) : "Create Account"}
							</Button>
						</div>

						<div className="mt-6">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
										Or register with
									</span>
								</div>
							</div>

							<div className="mt-6">
								<CustomGoogleButton />
							</div>
						</div>
					</form>
				</div>
			</div>
		</GoogleOAuthProvider>
	);
}

export default RegisterPage;