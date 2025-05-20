import { UploadListing, UploadListingSchema } from '@/lib/types/main';
import api from '@/lib/backend/api/axiosConfig';
import { toast } from 'sonner';
import { AppError, retryOperation } from '@/lib/errorUtils';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

export const uploadListing = async (listing: UploadListing) => {
	try {
		// Validate listing data with Zod schema
		const validListing = UploadListingSchema.parse(listing);

		// Format the data to match the backend's expected structure
		const formattedListing = {
			...validListing,
			imageUrl: {
				urls: validListing.imageUrl,
			},
		};

		// Convert to snake_case for API request
		const snakeCaseListing = snakecaseKeys(formattedListing, { deep: true });

		// Use our new strongly-typed retry function
		const response = await retryOperation(
			() =>
				api.post('/api/listings', snakeCaseListing, {
					headers: {
						'Content-Type': 'application/json',
					},
				}),
			{
				context: 'Uploading listing',
				maxRetries: 3,
				showToastOnRetry: true,
			}
		);

		// Check if the response has the expected format
		if (!response.data || !response.data.success) {
			const errorMessage = response.data?.message || 'Failed to upload listing';
			toast.error(errorMessage);
			throw new AppError(errorMessage, {
				code: 'UPLOAD_FAILED',
				status: response.status,
			});
		}

		// Convert response data from snake_case to camelCase
		const responseData = camelcaseKeys(response.data.data, { deep: true });

		// Show success message
		toast.success('Your listing has been successfully uploaded!');
		return responseData;
	} catch (error) {
		// Our retryOperation will handle most errors and convert them to AppError,
		// but we can also handle them here to provide more specific error information

		// Convert to AppError if not already
		const appError =
			error instanceof AppError
				? error
				: AppError.from(error, 'Upload listing');

		// Display error message to user if not already shown by retryOperation
		if (!appError.context?.includes('Uploading listing')) {
			toast.error(appError.message);
		}

		// Log in development
		if (process.env.NODE_ENV !== 'production') {
			console.error('Upload listing error:', appError);
		}

		// Rethrow for component handling
		throw appError;
	}
};
