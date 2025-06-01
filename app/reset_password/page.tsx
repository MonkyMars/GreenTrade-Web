'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
	FaShieldAlt,
	FaLock,
	FaCheckCircle,
	FaKey,
	FaEye,
	FaEyeSlash,
	FaLeaf,
	FaClock,
	FaInfoCircle,
	FaArrowLeft
} from 'react-icons/fa';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { NextPage } from 'next';
import api from '@/lib/backend/api/axiosConfig';
import { useAuth } from '@/lib/contexts/AuthContext';

// Password validation schema
const resetPasswordSchema = z.object({
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.max(128, 'Password must be at most 128 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number')
		.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
		.refine((val) => !/\s/.test(val), {
			message: 'Password cannot contain spaces',
		}),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: NextPage = () => {
	const router = useRouter();
	const { logout } = useAuth();
	const [formData, setFormData] = useState<ResetPasswordFormData>({
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

	// Validate token on component mount
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const hash = window.location.hash // e.g. "#access_token=..."
			const params = new URLSearchParams(hash.slice(1)) // remove the '#' and parse
			const token = params.get('access_token')
			if (!token) {
				setIsTokenValid(false);
				return;
			}
		}
		setIsTokenValid(true);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user types
		if (errors[name as keyof ResetPasswordFormData]) {
			setErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}
	};

	const validateForm = () => {
		try {
			resetPasswordSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};
				error.errors.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0] as keyof ResetPasswordFormData] = err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error('Please fix the errors in the form');
			return;
		}

		setIsLoading(true);

		try {
			// Change password API call
			const response = await api.post('/api/auth/change_password', {
				password: formData.password,
			});

			if (response.status !== 200 || !response.data.success) {
				throw new Error('Failed to change password');
			}

			// Redirect to login page after successful change
			toast.success('Password changed successfully! Redirecting to login...');
			await logout()
			router.push('/login');
		} catch {
			toast.error('Failed to change password. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const getPasswordStrength = (password: string) => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/[0-9]/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;

		return {
			score: strength,
			label: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength] || 'Very Weak',
			color: ['red', 'orange', 'yellow', 'lime', 'green'][strength] || 'red'
		};
	};

	const passwordStrength = getPasswordStrength(formData.password);

	// Show error page if no token or invalid token
	if (isTokenValid === false) {
		return (
			<main className='mx-auto px-4 py-22 max-w-7xl'>
				<div className='min-h-[60vh] flex items-center justify-center'>
					<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-800 text-center max-w-md'>
						<div className='w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4'>
							<FaShieldAlt className='text-red-600 dark:text-red-400 text-2xl' />
						</div>
						<h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
							Invalid Reset Link
						</h1>
						<p className='text-gray-600 dark:text-gray-400 mb-6'>
							This password reset link is invalid or has expired. Please request a new one.
						</p>
						<div className='space-y-3'>
							<Button
								onClick={() => router.push('/login')}
								className='w-full bg-green-600 hover:bg-green-700'
							>
								Back to Login
							</Button>
							<Button
								variant='outline'
								onClick={() => router.push('/forgot-password')}
								className='w-full'
							>
								Request New Reset Link
							</Button>
						</div>
					</div>
				</div>
			</main>
		);
	}

	// Show loading state while validating token
	if (isTokenValid === null) {
		return (
			<main className='mx-auto px-4 py-22 max-w-7xl'>
				<div className='min-h-[60vh] flex items-center justify-center'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto'></div>
						<p className='mt-4 text-gray-600 dark:text-gray-400'>
							Validating reset link...
						</p>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className='mx-auto px-4 py-22 max-w-7xl'>
			{/* Back to login link */}
			<div className='mb-6'>
				<Link
					href='/login'
					className='inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors'
				>
					<FaArrowLeft className='mr-2 h-4 w-4' />
					Back to Login
				</Link>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Main content area - Takes up 2 columns on desktop */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Header Card */}
					<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
						<div className='flex items-center space-x-3 mb-4'>
							<div className='w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center'>
								<FaShieldAlt className='text-green-600 dark:text-green-400 text-xl' />
							</div>
							<div>
								<h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
									Reset Your Password
								</h1>
								<p className='text-gray-600 dark:text-gray-400'>
									Create a new secure password for your GreenVue account
								</p>
							</div>
						</div>
					</div>

					{/* Password Reset Form */}
					<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
						<div className='flex items-center space-x-2 mb-6'>
							<FaKey className='text-green-600 dark:text-green-500' />
							<h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
								New Password
							</h2>
						</div>

						<form onSubmit={handleSubmit} className='space-y-6'>
							{/* New Password Field */}
							<div>
								<label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
									New Password
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<FaLock className='h-5 w-5 text-gray-400' />
									</div>
									<input
										type={showPassword ? 'text' : 'password'}
										id='password'
										name='password'
										value={formData.password}
										onChange={handleChange}
										className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${errors.password
											? 'border-red-300 dark:border-red-600'
											: 'border-gray-300 dark:border-gray-600'
											}`}
										placeholder='Enter your new password'
									/>
									<button
										type='button'
										className='absolute inset-y-0 right-0 pr-3 flex items-center'
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<FaEyeSlash className='h-5 w-5 text-gray-400 hover:text-gray-600' />
										) : (
											<FaEye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
										)}
									</button>
								</div>
								{errors.password && (
									<p className='mt-2 text-sm text-red-600 dark:text-red-400'>
										{errors.password}
									</p>
								)}

								{/* Password Strength Indicator */}
								{formData.password && (
									<div className='mt-3'>
										<div className='flex justify-between items-center mb-1'>
											<span className='text-sm text-gray-600 dark:text-gray-400'>
												Password Strength
											</span>
											<span className={`text-sm font-medium text-${passwordStrength.color}-600 dark:text-${passwordStrength.color}-400`}>
												{passwordStrength.label}
											</span>
										</div>
										<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
											<div
												className={`h-2 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
												style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
											/>
										</div>
									</div>
								)}
							</div>

							{/* Confirm Password Field */}
							<div>
								<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
									Confirm New Password
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<FaLock className='h-5 w-5 text-gray-400' />
									</div>
									<input
										type={showConfirmPassword ? 'text' : 'password'}
										id='confirmPassword'
										name='confirmPassword'
										value={formData.confirmPassword}
										onChange={handleChange}
										className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${errors.confirmPassword
											? 'border-red-300 dark:border-red-600'
											: 'border-gray-300 dark:border-gray-600'
											}`}
										placeholder='Confirm your new password'
									/>
									<button
										type='button'
										className='absolute inset-y-0 right-0 pr-3 flex items-center'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? (
											<FaEyeSlash className='h-5 w-5 text-gray-400 hover:text-gray-600' />
										) : (
											<FaEye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
										)}
									</button>
								</div>
								{errors.confirmPassword && (
									<p className='mt-2 text-sm text-red-600 dark:text-red-400'>
										{errors.confirmPassword}
									</p>
								)}
							</div>

							{/* Submit Button */}
							<Button
								type='submit'
								disabled={isLoading}
								className='w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium'
							>
								{isLoading ? (
									<div className='flex items-center justify-center'>
										<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
										Resetting Password...
									</div>
								) : (
									<div className='flex items-center justify-center'>
										<FaCheckCircle className='mr-2 h-5 w-5' />
										Reset Password
									</div>
								)}
							</Button>
						</form>
					</div>
				</div>

				{/* Security Information Sidebar - Takes up 1 column on desktop */}
				<div className='lg:col-span-1'>
					<div className='sticky top-20 space-y-6'>
						{/* Password Requirements */}
						<div className='bg-green-50 dark:bg-green-900/20 rounded-xl shadow-md p-6 border border-green-200 dark:border-green-800/50'>
							<div className='flex items-center space-x-2 mb-4'>
								<FaShieldAlt className='text-green-600 dark:text-green-500' />
								<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
									Password Requirements
								</h3>
							</div>
							<ul className='space-y-3'>
								{[
									{ text: 'At least 8 characters long', check: formData.password.length >= 8 },
									{ text: 'Contains uppercase letter', check: /[A-Z]/.test(formData.password) },
									{ text: 'Contains lowercase letter', check: /[a-z]/.test(formData.password) },
									{ text: 'Contains a number', check: /[0-9]/.test(formData.password) },
									{ text: 'Contains special character', check: /[^A-Za-z0-9]/.test(formData.password) },
								].map((requirement, index) => (
									<li key={index} className='flex items-center space-x-2'>
										<FaCheckCircle
											className={`h-4 w-4 ${requirement.check
												? 'text-green-600 dark:text-green-400'
												: 'text-gray-300 dark:text-gray-600'
												}`}
										/>
										<span className={`text-sm ${requirement.check
											? 'text-green-700 dark:text-green-300'
											: 'text-gray-600 dark:text-gray-400'
											}`}>
											{requirement.text}
										</span>
									</li>
								))}
							</ul>
						</div>

						{/* Security Tips */}
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
							<div className='flex items-center space-x-2 mb-4'>
								<FaInfoCircle className='text-green-600 dark:text-green-500' />
								<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
									Security Tips
								</h3>
							</div>
							<div className='space-y-4 text-sm text-gray-600 dark:text-gray-400'>								<div className='flex items-start space-x-2'>
								<FaLeaf className='text-green-500 mt-0.5 flex-shrink-0' />
								<p>Use a unique password that you haven&apos;t used elsewhere</p>
							</div>
								<div className='flex items-start space-x-2'>
									<FaClock className='text-green-500 mt-0.5 flex-shrink-0' />
									<p>Consider using a password manager to generate and store secure passwords</p>
								</div>
								<div className='flex items-start space-x-2'>
									<FaShieldAlt className='text-green-500 mt-0.5 flex-shrink-0' />
									<p>Never share your password with anyone or write it down in an unsecure location</p>
								</div>
							</div>
						</div>

						{/* Help & Support */}
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
							<div className='flex items-center space-x-2 mb-4'>
								<FaCheckCircle className='text-green-600 dark:text-green-500' />
								<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
									Need Help?
								</h3>
							</div>
							<div className='space-y-3'>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									Having trouble resetting your password? Our support team is here to help.
								</p>
								<div className='space-y-2'>
									<Button variant='outline' className='w-full text-sm' onClick={() => router.push('/support')}>
										Contact Support
									</Button>
									<Button variant='ghost' className='w-full text-sm' onClick={() => router.push('/help/password-reset')}>
										View Help Guide
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ResetPasswordPage;