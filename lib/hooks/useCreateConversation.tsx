import { useState } from 'react';
import { createConversation, CreateConversationRequest, CreateConversationResponse } from '@/lib/backend/chat/createConversation';
import { AppError } from '@/lib/errorUtils';

interface UseCreateConversationReturn {
	createConversationAction: (payload: CreateConversationRequest) => Promise<CreateConversationResponse>;
	isLoading: boolean;
	error: string | null;
	clearError: () => void;
}

/**
 * Hook for managing conversation creation with loading and error states
 */
export function useCreateConversation(): UseCreateConversationReturn {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createConversationAction = async (
		payload: CreateConversationRequest
	): Promise<CreateConversationResponse> => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await createConversation(payload);
			return result;
		} catch (err) {
			const errorMessage = err instanceof AppError
				? err.message
				: 'An unexpected error occurred while creating the conversation.';

			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const clearError = () => {
		setError(null);
	};

	return {
		createConversationAction,
		isLoading,
		error,
		clearError,
	};
}
