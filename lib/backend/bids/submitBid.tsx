import { AppError } from '@/lib/errorUtils';
import { BidSchema } from '@/lib/types/main';
import { z } from 'zod';

export interface SubmitBidData {
	listingId: string;
	price: number;
}

export async function submitBid(data: SubmitBidData): Promise<{ message: string }> {
	try {
		// Validate input data
		const validatedData = BidSchema.pick({ listingId: true, price: true }).parse(data);

		const response = await fetch(`/api/bid/${validatedData.listingId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				price: validatedData.price,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new AppError(
				errorData.error || `Failed to submit bid: ${response.status}`,
				{ status: response.status, code: 'BID_SUBMISSION_FAILED' }
			);
		}

		const result = await response.json();
		return result;
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
