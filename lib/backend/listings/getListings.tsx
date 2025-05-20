import { FetchedListing, FetchedListingSchema } from '@/lib/types/main';
import api from '@/lib/backend/api/axiosConfig';
import { toast } from 'sonner';
import { AppError, retryOperation } from '@/lib/errorUtils';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

/**
 * Fetch a single listing or all listings with improved error handling and retry logic
 */
export const getListings = async (
	id?: string,
	limit?: number
): Promise<FetchedListing | FetchedListing[]> => {
	try {
		if (id) {
			// Show loading state in production
			let loadingToast;
			if (process.env.NODE_ENV === 'production') {
				loadingToast = toast.loading('Fetching listing details...');
			}

			try {
				// Use our type-safe retry utility
				const response = await retryOperation(
					() => api.get(`/listings/${id}`),
					{
						context: 'Fetching listing details',
						maxRetries: 3,
						delayMs: 1000,
						shouldRetry: (error) =>
							!!error.isNetworkError || !!(error.status && error.status >= 500),
					}
				);

				if (!response.data || !response.data.success) {
					throw new AppError(
						response.data?.message || 'Failed to fetch listing',
						{
							code: 'FETCH_FAILED',
							status: response.status,
						}
					);
				}

				// Convert snake_case to camelCase and validate with Zod
				const camelCaseData = camelcaseKeys(response.data.data, { deep: true });
				const validListing = FetchedListingSchema.parse(camelCaseData);

				// Dismiss loading toast if we're in production
				if (loadingToast && process.env.NODE_ENV === 'production') {
					toast.dismiss(loadingToast);
				}

				return validListing;
			} catch (error) {
				// Dismiss loading toast if we're in production
				if (loadingToast && process.env.NODE_ENV === 'production') {
					toast.dismiss(loadingToast);
				}
				throw error; // Re-throw to be handled by the outer catch
			}
		} else {
			// Prepare query parameters using snake_case
			const params = snakecaseKeys({ limit: limit || 50 });

			// Use our type-safe retry utility
			const response = await retryOperation(
				() => api.get('/listings', { params }),
				{
					context: 'Fetching listings',
					maxRetries: 3,
				}
			);

			if (!response.data.success) {
				throw new AppError(
					response.data?.message || 'Failed to fetch listings',
					{
						code: 'FETCH_FAILED',
						status: response.status,
					}
				);
			}

			// Convert snake_case to camelCase
			const rawData = response.data.data;
			const camelCaseData = camelcaseKeys(rawData, { deep: true });

			// Validate each listing with Zod schema and filter out invalid ones
			const validListings: FetchedListing[] = [];

			camelCaseData.forEach((listing: unknown) => {
				try {
					const validListing = FetchedListingSchema.parse(listing);
					validListings.push(validListing);
				} catch (error) {
					if (process.env.NODE_ENV !== 'production') {
						console.error('Invalid listing detected:', error);
					}
				}
			});

			if (validListings.length === 0) {
				if (process.env.NODE_ENV === 'production') {
					toast.info('No valid listings found.');
				}
			}

			return validListings;
		}
	} catch (error) {
		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(
					error,
					id ? 'Fetching listing details' : 'Fetching listings'
				);

		// Create a user-friendly error message based on the error details
		let errorMessage: string;

		if (appError.status === 404) {
			errorMessage = id
				? 'Listing not found. It may have been removed.'
				: 'No listings found.';
		} else {
			errorMessage =
				appError.message || 'Failed to fetch listings. Please try again later.';
		}

		// Show error to user in production if not already shown by retryOperation
		if (
			process.env.NODE_ENV === 'production' &&
			!appError.context?.includes('Fetching')
		) {
			toast.error(errorMessage);
		}

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error fetching listings:', appError);
		} else {
			// In production, use proper error tracking
			// Example: Sentry.captureException(appError)
		}

		// Rethrow with improved message
		throw appError;
	}
};

/**
 * Fetch listings from a specific seller with improved error handling
 */
export const getSellerListings = async (
	sellerId: string
): Promise<FetchedListing[]> => {
	// Show loading state in production
	let loadingToast;
	if (process.env.NODE_ENV === 'production') {
		loadingToast = toast.loading('Fetching seller listings...');
	}

	try {
		// Prepare query parameters using snake_case
		const params = snakecaseKeys({ sellerId });

		// Use our type-safe retry utility
		const response = await retryOperation(
			() => api.get(`/listings/seller/${sellerId}`, { params }),
			{
				context: 'Fetching seller listings',
				maxRetries: 3,
				showToastOnRetry: false, // We have our own loading state
			}
		);

		if (!response.data || !response.data.success) {
			throw new AppError(
				response.data?.message || 'Failed to fetch seller listings',
				{
					code: 'FETCH_FAILED',
					status: response.status,
				}
			);
		}

		// Convert snake_case to camelCase
		const rawData = response.data.data;
		const camelCaseData = camelcaseKeys(rawData, { deep: true });

		// Validate each listing with Zod schema and filter out invalid ones
		const validListings: FetchedListing[] = [];
		let invalidCount = 0;

		camelCaseData.forEach((listing: unknown) => {
			try {
				const validListing = FetchedListingSchema.parse(listing);
				validListings.push(validListing);
			} catch (error) {
				invalidCount++;
				if (process.env.NODE_ENV !== 'production') {
					console.error('Invalid seller listing detected:', error);
				}
			}
		});

		// Dismiss loading toast if we're in production
		if (loadingToast && process.env.NODE_ENV === 'production') {
			toast.dismiss(loadingToast);
		}

		// Show notification if invalid listings were found
		if (invalidCount > 0 && process.env.NODE_ENV === 'production') {
			toast.warning(
				`${invalidCount} invalid listing${invalidCount > 1 ? 's' : ''
				} skipped.`
			);
		}

		if (validListings.length === 0 && process.env.NODE_ENV === 'production') {
			toast.info('No valid listings found for this seller.');
		}

		return validListings;
	} catch (error) {
		// Dismiss loading toast if we're in production
		if (loadingToast && process.env.NODE_ENV === 'production') {
			toast.dismiss(loadingToast);
		}

		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Fetching seller listings');

		// Create a user-friendly error message based on the error details
		let errorMessage: string;

		if (appError.status === 404) {
			errorMessage = 'Seller not found or has no listings.';
		} else {
			errorMessage =
				appError.message ||
				'Failed to fetch seller listings. Please try again later.';
		}

		// Show error to user in production if not already shown by retryOperation
		if (
			process.env.NODE_ENV === 'production' &&
			!appError.context?.includes('Fetching seller listings')
		) {
			toast.error(errorMessage);
		}

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error fetching seller listings:', appError);
		} else {
			// In production, use proper error tracking
			// Example: Sentry.captureException(appError)
		}

		// Rethrow with improved message
		throw appError;
	}
};
