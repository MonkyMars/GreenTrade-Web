import api from '../api/axiosConfig';
import { User } from '@/lib/types/user';
import { toast } from 'react-hot-toast';
import { AppError, retryOperation } from '@/lib/errorUtils';

/**
 * Get user data with improved error handling and retries
 */
export const getUser = async (): Promise<User> => {
	try {
		// Use our type-safe retry utility
		const response = await retryOperation(() => api.get('/api/auth/user'), {
			context: 'Fetching user data',
			maxRetries: 3,
		});

		if (!response.data || !response.data.data || !response.data.data.user) {
			throw new AppError('Invalid user data received', {
				code: 'INVALID_RESPONSE',
				status: response.status,
			});
		}

		const user = response.data.data.user;
		const mappedUser: User = {
			...user,
			emailVerified: response.data.data.user.email_verified,
			createdAt: response.data.data.user.created_at,
		};
		return mappedUser;
	} catch (error) {
		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Fetching user data');

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error fetching user data:', appError);
		}

		// Only show toast in production if not already shown by retry operation
		if (
			process.env.NODE_ENV === 'production' &&
			!appError.context?.includes('Fetching user data')
		) {
			// Create user-friendly message based on error
			let errorMessage = 'Failed to fetch user data. Please try again.';

			if (appError.status === 404) {
				errorMessage = 'User not found.';
			} else if (appError.status === 401) {
				errorMessage = 'Authentication required. Please log in again.';
			} else if (appError.message) {
				errorMessage = appError.message;
			}

			toast.error(errorMessage);
		}

		// Rethrow for component handling
		throw appError;
	}
};

/**
 * Update user data with improved error handling and retries
 */
export const updateUser = async (
	uuid: string,
	userData: {
		name: string;
		location: string;
		bio?: string;
	}
) => {
	// Show loading state
	let loadingToast: string | undefined;
	if (process.env.NODE_ENV === 'production') {
		loadingToast = toast.loading('Updating profile...');
	}

	try {
		// Use our type-safe retry utility
		const response = await retryOperation(
			() => api.put('/api/auth/user', userData),
			{
				context: 'Updating user profile',
				maxRetries: 3,
				showToastOnRetry: false, // We have our own loading toast
			}
		);

		if (!response.data.success) {
			throw new AppError(
				response.data.message || 'Failed to update user data',
				{
					code: 'UPDATE_FAILED',
					status: response.status,
				}
			);
		}

		if (!response.data.data) {
			throw new AppError('Invalid user data received', {
				code: 'INVALID_RESPONSE',
				status: response.status,
			});
		}

		const user = response.data.data as User;

		// Dismiss loading toast and show success message
		if (process.env.NODE_ENV === 'production') {
			if (loadingToast) toast.dismiss(loadingToast);
			toast.success('Profile updated successfully');
		}

		return user;
	} catch (error) {
		// Dismiss loading toast
		if (loadingToast && process.env.NODE_ENV === 'production') {
			toast.dismiss(loadingToast);
		}

		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Updating user profile');

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error updating user data:', appError);
		} else {
			// In production, use proper error tracking
			// Example: Sentry.captureException(appError)
		}

		// Only show toast in production if not already shown by retry operation
		if (
			process.env.NODE_ENV === 'production' &&
			!appError.context?.includes('Updating user profile')
		) {
			// Create user-friendly message based on error
			let errorMessage = 'Failed to update profile. Please try again.';

			if (appError.status === 404) {
				errorMessage = 'User not found.';
			} else if (appError.status === 401) {
				errorMessage = 'Authentication required. Please log in again.';
			} else if (appError.validationErrors) {
				errorMessage =
					'Some fields contain invalid data. Please check and try again.';
			} else if (appError.message) {
				errorMessage = appError.message;
			}

			toast.error(errorMessage);
		}

		// Rethrow for component handling
		throw appError;
	}
};

/**
 * Resend verification email
 */
export const resendEmail = async (email: string) => {
	// Show loading state
	let loadingToast: string | undefined;
	if (process.env.NODE_ENV === 'production') {
		loadingToast = toast.loading('Sending verification email...');
	}

	try {
		// Use our type-safe retry utility
		const response = await retryOperation(
			() => api.post('/api/auth/resend_email', { email }),
			{
				context: 'Resending verification email',
				maxRetries: 2,
				showToastOnRetry: false, // We have our own loading toast
			}
		);

		if (!response.data.success) {
			throw new AppError(
				response.data.message || 'Failed to resend verification email',
				{
					code: 'EMAIL_RESEND_FAILED',
					status: response.status,
				}
			);
		}

		// Dismiss loading toast and show success message
		if (process.env.NODE_ENV === 'production') {
			if (loadingToast) toast.dismiss(loadingToast);
			toast.success('Verification email sent successfully');
		}

		return response.data.data;
	} catch (error) {
		// Dismiss loading toast
		if (loadingToast && process.env.NODE_ENV === 'production') {
			toast.dismiss(loadingToast);
		}

		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Resending verification email');

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error resending verification email:', appError);
		}

		// Show toast in production if not already shown by retry operation
		if (
			process.env.NODE_ENV === 'production' &&
			!appError.context?.includes('Resending verification email')
		) {
			let errorMessage =
				'Failed to send verification email. Please try again later.';

			if (appError.status === 404) {
				errorMessage = 'Email address not found.';
			} else if (appError.status === 429) {
				errorMessage = 'Too many attempts. Please wait before trying again.';
			} else if (appError.message) {
				errorMessage = appError.message;
			}

			toast.error(errorMessage);
		}

		// Rethrow for component handling
		throw appError;
	}
};
