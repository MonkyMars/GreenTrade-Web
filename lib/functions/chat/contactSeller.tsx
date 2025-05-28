import { useCreateConversation } from '@/lib/hooks/useCreateConversation';
import { AppError } from '@/lib/errorUtils';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface ContactSellerParams {
	buyerId: string;
	sellerId: string;
	listingId: string;
	onSuccess?: (conversationId: string) => void;
	onError?: (error: string) => void;
}

/**
 * Utility function to handle the complete "Contact Seller" flow
 * Creates conversation and provides callback for navigation
 */
export function useContactSeller() {
	const { createConversationAction, isLoading, error, clearError } = useCreateConversation();

	const contactSeller = async ({
		buyerId,
		sellerId,
		listingId,
		onSuccess,
		onError,
	}: ContactSellerParams): Promise<void> => {
		try {
			// Clear any previous errors
			clearError();

			// Create or get existing conversation
			const result = await createConversationAction({
				buyer_id: buyerId,
				seller_id: sellerId,
				listing_id: listingId,
			});

			// Call success callback with conversation ID for navigation
			if (onSuccess) {
				onSuccess(result.conversation.id);
			}
		} catch (err) {
			const errorMessage = err instanceof AppError
				? err.message
				: 'Failed to contact seller. Please try again.';

			if (onError) {
				onError(errorMessage);
			}
		}
	};

	return {
		contactSeller,
		isLoading,
		error,
		clearError,
	};
}

/**
 * Helper function to navigate to conversation page
 * This can be used with the onSuccess callback
 */
export function navigateToConversation(conversationId: string, router?: AppRouterInstance): void {
	const conversationUrl = `/messages?conversation=${conversationId}`;

	if (router) {
		// If Next.js router is provided, use it
		router.push(conversationUrl);
	} else {
		// Fallback to window.location
		window.location.href = conversationUrl;
	}
}
