import api from '@/lib/backend/api/axiosConfig';
import { toast } from 'sonner';
import { AppError, retryOperation } from '@/lib/errorUtils';
import { FetchedListing, FetchedListingSchema } from '@/lib/types/main';
import camelcaseKeys from 'camelcase-keys';

/**
 * Fetch user's favorite listings with proper error handling
 */
export const getFavorites = async (): Promise<FetchedListing[]> => {
	// Show loading state in production
	let loadingToast;
	if (process.env.NODE_ENV === 'production') {
		loadingToast = toast.loading('Fetching your favorites...');
	}

	try {
		// Use type-safe retry utility
		const response = await retryOperation(
			() => api.get(`/api/favorites`),
			{
				context: 'Fetching favorites',
				maxRetries: 3,
				delayMs: 800,
				shouldRetry: (error) =>
					!!error.isNetworkError || !!(error.status && error.status >= 500),
			}
		);

		if (!response.data || !response.data.success) {
			throw new AppError(
				response.data?.message || 'Failed to fetch favorites',
				{
					code: 'FETCH_FAILED',
					status: response.status,
				}
			);
		}

		// Convert snake_case to camelCase and validate with Zod
		const rawData = response.data.data;
		const camelCaseData = camelcaseKeys(rawData, { deep: true });

		// Validate each listing with Zod schema
		const favorites = camelCaseData.map((listing: unknown) =>
			FetchedListingSchema.parse(listing)
		);

		// Dismiss loading toast if in production
		if (loadingToast && process.env.NODE_ENV === 'production') {
			toast.dismiss(loadingToast);
		}

		if (favorites.length === 0 && process.env.NODE_ENV === 'production') {
			toast.info("You don't have any favorites yet.");
		}

		return favorites;
	} catch (error) {
		// Dismiss loading toast if in production
		if (loadingToast && process.env.NODE_ENV === 'production') {
			toast.dismiss(loadingToast);
		}

		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Fetching favorites');

		// Create a user-friendly error message
		const errorMessage =
			appError.message ||
			'Failed to fetch your favorites. Please try again later.';

		// Show error to user in production if not already shown by retryOperation
		if (
			process.env.NODE_ENV === 'production' &&
			!appError.context?.includes('Fetching favorites')
		) {
			toast.error(errorMessage);
		}

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error fetching favorites:', appError);
		} else {
			// In production, use proper error tracking
			// Example: Sentry.captureException(appError)
		}

		// Rethrow with improved message
		throw appError;
	}
};

export const isFavorite = async (
	listingId: string,
): Promise<boolean> => {
	try {
		const response = await api.get(
			`/api/favorites/check/${listingId}`
		);
		if (!response.data || !response.data.success) {
			throw new AppError(
				response.data?.message || 'Failed to check favorite status',
				{
					code: 'CHECK_FAILED',
					status: response.status,
				}
			);
		}

		return response.data.data as boolean;
	} catch (error) {
		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Checking favorite status');

		// Create a user-friendly error message
		const errorMessage =
			appError.message || 'Failed to check favorite status. Please try again.';

		// Show error to user in production if not already shown by retryOperation
		if (
			process.env.NODE_ENV === 'production' &&
			!appError.context?.includes('Checking favorite status')
		) {
			toast.error(errorMessage);
		}

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error checking favorite status:', appError);
		} else {
			// In production, use proper error tracking
			// Example: Sentry.captureException(appError)
		}

		// Rethrow with improved message
		throw appError;
	}
};
