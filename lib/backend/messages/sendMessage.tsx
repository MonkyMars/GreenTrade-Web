import api from '@/lib/backend/api/axiosConfig';
import { AppError, retryOperation } from '@/lib/errorUtils';

/**
 * Send a message to a seller with improved error handling and retry logic
 */
export const sendMessage = async (sellerId: string, message: string): Promise<void> => {
	try {
		// Use our retry operation utility with proper error typing
		await retryOperation(
			() =>
				api.post('/messages', {
					sellerId,
					message,
				}),
			{
				context: 'Sending message',
				maxRetries: 3,
				showToastOnRetry: false, // Let the calling component handle toasts
			}
		);
	} catch (error) {
		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Sending message');

		// Log in development, use proper error tracking in production
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error sending message:', appError);
		} else {
			// In production, this would use a service like Sentry
			// Example: Sentry.captureException(appError);
		}

		// Re-throw to let the calling component handle it
		throw appError;
	}
};
