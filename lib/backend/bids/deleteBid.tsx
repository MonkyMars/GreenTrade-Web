import { AppError } from '@/lib/errorUtils';
import api from '../api/axiosConfig';

export async function deleteBid(bidId: string): Promise<{ message: string }> {
	try {
		const response = await api.delete(`/api/bid/${bidId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (response.status !== 200) {
			const errorData = response.data.message;
			throw new AppError(
				errorData.error || `Failed to delete bid: ${response.status}`,
				{ status: response.status, code: 'BID_DELETION_FAILED' }
			);
		}

		return response.data.data;
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
