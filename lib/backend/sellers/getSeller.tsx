import { Seller, SellerSchema } from '@/lib/types/seller';
import api from '@/lib/backend/api/axiosConfig';
import { AppError, retryOperation } from '@/lib/errorUtils';

/**
 * Fetch a single seller's profile information with improved error handling and retry logic
 */
export const getSeller = async (sellerId: string): Promise<Seller> => {
	try {
		// Use our retry operation utility with proper error typing
		const response = await retryOperation(
			() => api.get(`/seller/${sellerId}`),
			{
				context: 'Fetching seller profile',
				maxRetries: 3,
				showToastOnRetry: false, // Let the calling component handle toasts
			}
		);

		if (!response.data || !response.data.success) {
			throw new AppError(
				response.data?.message || 'Failed to fetch seller',
				{
					code: 'FETCH_FAILED',
					status: response.status,
				}
			);
		}

		// Transform the response data to match our Seller type
		const sellerData = response.data.data;
		const seller: Seller = {
			id: sellerData.id,
			name: sellerData.name,
			bio: sellerData.bio,
			rating: sellerData.rating,
			verified: sellerData.verified,
			createdAt: sellerData.created_at,
		};

		// Validate with Zod schema
		return SellerSchema.parse(seller);
	} catch (error) {
		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Fetching seller profile');

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error fetching seller:', appError);
		} else {
			// In production, this would use a service like Sentry
			// Example: Sentry.captureException(appError);
		}

		// Re-throw to let the calling component handle it
		throw appError;
	}
};
