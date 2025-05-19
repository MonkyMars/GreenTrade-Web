'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaLeaf, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { AppError } from '@/lib/errorUtils';
import { NextPage } from 'next';
import { BASE_URL } from '@/lib/backend/api/axiosConfig';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: NextPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { login } = useAuth();
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof LoginFormData, string>>
	>({});
	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));

		// Clear error when user types
		if (errors[name as keyof LoginFormData]) {
			setErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}
	};

	const validateForm = () => {
		try {
			loginSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
				error.errors.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0] as keyof LoginFormData] = err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoginError('');

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			// Call your authentication API
			await login(formData.email, formData.password);
			const path = searchParams.get('redirect') || '/';
			router.push(path);
		} catch (error) {
			// Convert to AppError if not already
			const appError =
				error instanceof AppError ? error : AppError.from(error, 'Login');

			// Log in development
			if (process.env.NODE_ENV !== 'production') {
				console.error('Login error:', appError);
			} else {
				// In production, this would use a service like Sentry
				// Example: Sentry.captureException(appError);
			}

			// Create a user-friendly error message
			let errorMessage: string;

			if (appError.code === 'INVALID_CREDENTIALS' || appError.status === 401) {
				errorMessage = 'Invalid email or password. Please try again.';
			} else if (appError.code === 'ACCOUNT_LOCKED') {
				errorMessage = 'Your account has been locked. Please contact support.';
			} else if (appError.code === 'RATE_LIMITED') {
				errorMessage = 'Too many login attempts. Please try again later.';
			} else if (appError.message) {
				errorMessage = appError.message;
			} else {
				errorMessage = 'An unexpected error occurred. Please try again.';
			}

			setLoginError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialLogin = async (provider: string) => {
		setLoginError('');
		try {
			setIsLoading(true);
			router.push(`${BASE_URL}/auth/login/${provider}`);
			// The actual social login logic would be handled in the backend
		} catch (error) {
			// Handle social login error
			const appError =
				error instanceof AppError ? error : AppError.from(error, 'SocialLogin');

			if (process.env.NODE_ENV !== 'production') {
				console.error('Social login error:', appError);
			} else {
				// In production, this would use a service like Sentry
				// Example: Sentry.captureException(appError);
			}

			setLoginError('An error occurred during social login. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-22 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8 p-8 rounded-lg dark:bg-slate-800 shadow-xl'>
				<div className='text-center'>
					<Link href='/' className='inline-block'>
						<div className='flex items-center justify-center'>
							<FaLeaf className='h-12 w-12 text-green-600' />
							<h1 className='ml-2 text-3xl font-bold text-green-600'>
								GreenVue
							</h1>
						</div>
					</Link>
					<h2 className='mt-6 text-2xl font-bold text-gray-900 dark:text-white'>
						Sign in to your account
					</h2>
					<p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
						Or{' '}
						<Link
							href='/register'
							prefetch
							className='font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300'
						>
							create a new account
						</Link>
					</p>
				</div>

				{loginError && (
					<div
						className='bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative'
						role='alert'
					>
						<span className='block sm:inline'>
							{loginError === 'Invalid credentials'
								? 'Invalid email or password. Please try again.'
								: loginError}
						</span>
					</div>
				)}

				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div className='rounded-md shadow-sm -space-y-px'>
						<div className='mb-4'>
							<label htmlFor='email' className='sr-only'>
								Email address
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FaEnvelope className='h-5 w-5 text-gray-400' />
								</div>
								<input
									id='email'
									name='email'
									type='email'
									autoComplete='email'
									required
									className={`appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border ${
										errors.email ? 'border-red-300' : 'border-gray-300'
									} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400`}
									placeholder='Email address'
									value={formData.email}
									onChange={handleChange}
								/>
							</div>
							{errors.email && (
								<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
									{errors.email}
								</p>
							)}
						</div>

						<div className='mb-4'>
							<label htmlFor='password' className='sr-only'>
								Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FaLock className='h-5 w-5 text-gray-400' />
								</div>
								<input
									id='password'
									name='password'
									type='password'
									autoComplete='current-password'
									required
									className={`appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border ${
										errors.password ? 'border-red-300' : 'border-gray-300'
									} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400`}
									placeholder='Password'
									value={formData.password}
									onChange={handleChange}
								/>
							</div>
							{errors.password && (
								<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
									{errors.password}
								</p>
							)}
						</div>
					</div>

					<div className='flex items-center justify-between'>
						<div className='text-sm'>
							<Link
								href='/forgot-password'
								className='font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300'
							>
								Forgot your password?
							</Link>
						</div>
					</div>

					<div>
						<Button
							type='submit'
							variant={'default'}
							disabled={isLoading}
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{isLoading ? (
								<svg
									className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
									></path>
								</svg>
							) : (
								'Sign in'
							)}
						</Button>
					</div>

					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300 dark:border-gray-700'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
									Or continue with
								</span>
							</div>
						</div>

						<div className='mt-6'>
							<Button
								variant={'secondary'}
								type='button'
								onClick={() => handleSocialLogin('google')}
								className='w-full border border-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
							>
								<FaGoogle className='h-5 w-5 dark:text-white text-black' />
								<span className='ml-2'>Google</span>
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

const LoginPage = () => {
	return (
		<Suspense>
			<Login />
		</Suspense>
	);
};

export default LoginPage;
