import { AppError } from '@/lib/errorUtils';
import api from '../api/axiosConfig';
import snakecaseKeys from 'snakecase-keys';

export interface SubmitReviewRequest {
	rating: number;
	title: string;
	content: string;
	sellerId: string;
	verifiedPurchase?: boolean;
}

export interface SubmitReviewResponse {
	success: boolean;
	reviewId: string;
	message: string;
}

export const submitReview = async (
	reviewData: SubmitReviewRequest
): Promise<SubmitReviewResponse> => {
	try {
		// Validate the review data
		const validatedData = {
			rating: reviewData.rating,
			title: reviewData.title,
			content: reviewData.content,
			sellerId: reviewData.sellerId,
			verifiedPurchase: reviewData.verifiedPurchase ?? false,
		};

		const response = await api.post(
			'/api/reviews',
			snakecaseKeys(validatedData, { deep: true })
		);

		if (response.status === 200) {
			return {
				success: true,
				reviewId: response.data.reviewId,
				message: 'Review submitted successfully!',
			};
		}

		if (response.status === 409) {
			throw new AppError(
				'You have already submitted a review for this seller',
				{
					status: 409,
					code: 'DUPLICATE_REVIEW',
				}
			);
		}

		throw new AppError('Failed to submit review', { status: response.status });
	} catch (error) {
		console.error('Error submitting review:', error);

		if (error instanceof AppError) {
			throw error;
		}

		// Handle validation errors
		if (error instanceof Error && error.name === 'ZodError') {
			throw new AppError('Invalid review data provided', { status: 400 });
		}

		// Handle network errors
		if (error instanceof Error && error.message.includes('Network Error')) {
			throw new AppError('Network error. Please check your connection.', {
				status: 500,
				isNetworkError: true,
			});
		}

		throw new AppError(
			'An unexpected error occurred while submitting your review',
			{ status: 500 }
		);
	}
};
