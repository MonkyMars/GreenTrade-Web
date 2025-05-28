import { AppError } from '@/lib/errorUtils';
import { Conversation } from '@/lib/types/chat';
import api from '../api/axiosConfig';

export interface CreateConversationRequest {
	buyer_id: string;
	seller_id: string;
	listing_id: string;
}

export interface CreateConversationResponse {
	conversation: Conversation;
	isExisting: boolean;
}

/**
 * Creates a new conversation or returns existing one between buyer and seller for a specific listing
 */
export async function createConversation(
	payload: CreateConversationRequest
): Promise<CreateConversationResponse> {
	try {
		const data = await api.post('/api/chat/conversation', payload);

		if (!data.status) {
			let errorMessage = 'Failed to create conversation';

			switch (data.status) {
				case 400:
					errorMessage = 'Invalid request data. Please check the listing and user information.';
					break;
				case 401:
					errorMessage = 'You must be logged in to contact the seller.';
					break;
				case 403:
					errorMessage = 'You are not authorized to perform this action.';
					break;
				case 404:
					errorMessage = 'Listing or user not found.';
					break;
				case 409:
					// This might indicate conversation already exists
					break;
				case 500:
					errorMessage = 'Server error. Please try again later.';
					break;
				default:
					errorMessage = `Unexpected error occurred (${data.status})`;
			}

			if (data.status !== 409) {
				throw new AppError(errorMessage, {
					status: data.status,
					code: 'CONVERSATION_CREATION_FAILED',
				});
			}
		}

		// Handle case where conversation already exists
		const isExisting = data.status === 409 || data.data.isExisting === true;

		return {
			conversation: data.data || data,
			isExisting,
		};
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}

		// Network or other errors
		throw new AppError('Network error. Please check your connection and try again.', {
			status: 0,
			code: 'NETWORK_ERROR',
		});
	}
}
