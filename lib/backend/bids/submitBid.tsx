import { AppError } from '@/lib/errorUtils';
import { BidSchema } from '@/lib/types/main';
import { z } from 'zod';
import api from '../api/axiosConfig';

export interface SubmitBidData {
	listingId: string;
	price: number;
}

export async function submitBid(data: SubmitBidData): Promise<{ message: string }> {
	try {
		// Validate input data
		const validatedData = BidSchema.pick({ listingId: true, price: true }).parse(data);

		const response = await api.post(`/api/bid/${validatedData.listingId}`, {
			price: validatedData.price,
		});

		if (response.status !== 200) {
			const errorData = response.data.message;
			throw new AppError(
				errorData.error || `Failed to submit bid: ${response.status}`,
				{ status: response.status, code: 'BID_SUBMISSION_FAILED' }
			);
		}

		return response.data.data;
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		if (error instanceof z.ZodError) {
			throw new AppError(
				'Invalid bid data provided',
				{ status: 400, code: 'INVALID_BID_DATA' }
			);
		}
		console.error('Error submitting bid:', error);
		throw new AppError(
			'An unexpected error occurred while submitting the bid',
			{ status: 500, code: 'BID_SUBMISSION_ERROR' }
		);
	}
}
