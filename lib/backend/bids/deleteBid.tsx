import { AppError } from '@/lib/errorUtils';

export async function deleteBid(bidId: string): Promise<{ message: string }> {
	try {
		const response = await fetch(`/api/bid/${bidId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new AppError(
				errorData.error || `Failed to delete bid: ${response.status}`,
				{ status: response.status, code: 'BID_DELETION_FAILED' }
			);
		}

		const result = await response.json();
		return result;
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		console.error('Error deleting bid:', error);
		throw new AppError(
			'An unexpected error occurred while deleting the bid',
			{ status: 500, code: 'BID_DELETION_ERROR' }
		);
	}
}
