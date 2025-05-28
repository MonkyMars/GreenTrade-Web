import api from '@/lib/backend/api/axiosConfig';
import { toast } from 'sonner';
import { AppError, retryOperation } from '@/lib/errorUtils';
import { FetchedListing, FetchedListingSchema } from '@/lib/types/main';
import camelcaseKeys from 'camelcase-keys';

/**
 * Fetch similar listings by category with proper error handling and validation
 */
export const getSimilarListings = async (
	category: string,
	currentId: string
): Promise<FetchedListing[]> => {
	try {
		if (!category) {
			return [];
		}

		// Use our retry operation utility with proper error typing
		const response = await retryOperation(
			() => api.get(`/listings/category/${category}`),
			{
				context: 'Fetching similar listings',
				maxRetries: 2,
				showToastOnRetry: false, // Don't show toast for these retries
			}
		);

		if (!response.data.success) {
			return [];
		}

		// Convert the data to the expected format and validate
		const rawListings = response.data.data;

		if (!rawListings || !Array.isArray(rawListings)) {
			if (process.env.NODE_ENV !== 'production') {
				console.error('Invalid data format for similar listings:', rawListings);
			}
			return [];
		}

		const validListings: FetchedListing[] = [];
		let invalidCount = 0;

		// Process each listing with proper validation
		for (const rawListing of rawListings) {
			try {
				// Convert snake_case to camelCase for field names that need it
				const listing = camelcaseKeys(rawListing, { deep: true });

				if (listing.id === currentId) {
					// Skip the current listing
					continue;
				}

				// Validate with Zod schema
				const validListing = FetchedListingSchema.parse(listing);
				validListings.push(validListing);
			} catch (error) {
				invalidCount++;
				if (process.env.NODE_ENV !== 'production') {
					console.error('Invalid similar listing detected:', error);
				}
			}
		}

		// Show notification if invalid listings were found
		if (invalidCount > 0 && process.env.NODE_ENV === 'production') {
			toast.warning(
				`${invalidCount} invalid similar listing${invalidCount > 1 ? 's' : ''
				} skipped.`
			);
		}

		return validListings;
	} catch (error) {
		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Fetching similar listings');

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error fetching similar listings:', appError);
		} else {
			// In production, this would use a service like Sentry
			// Example: Sentry.captureException(appError);
		}

		// This is a non-critical feature, so we fail gracefully
		return [];
	}
};
