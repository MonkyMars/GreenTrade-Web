import { FetchedReview, FetchedReviewSchema } from '@/lib/types/review';
import api from '../api/axiosConfig';
import { AppError, retryOperation } from '@/lib/errorUtils';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

interface ApiResponse {
	success: boolean;
	data: unknown[];
	message?: string;
}

export const getReviews = async (userId: string): Promise<FetchedReview[]> => {
	if (!userId) {
		throw new AppError('userId must be provided', {
			code: 'MISSING_PARAMETERS',
			status: 400,
		});
	}

	try {
		// Prepare snake_case params
		const params = snakecaseKeys({ userId });

		const response = await retryOperation(
			() => api.get<ApiResponse>(`/reviews/${userId}`, { params }),
			{
				context: 'Fetching reviews by user',
				maxRetries: 3,
			}
		);

		if (!response.data || !response.data.success) {
			throw new AppError('Failed to fetch reviews', {
				code: 'FETCH_FAILED',
				status: response.status,
			});
		}

		if (!Array.isArray(response.data.data)) {
			throw new AppError('Invalid data format received', {
				code: 'INVALID_RESPONSE',
				status: response.status,
			});
		}

		// Convert snake_case to camelCase and validate with Zod
		const camelCaseData = camelcaseKeys(response.data.data as Record<string, unknown>[], { deep: true });

		// Validate with Zod schema
		const reviews = camelCaseData.map((review) =>
			FetchedReviewSchema.parse(review)
		);

		return reviews;
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error fetching reviews:', error);
		}
		throw new AppError('An error occurred while fetching reviews', {
			code: 'FETCH_ERROR',
			status: 500,
		});
	}
};
