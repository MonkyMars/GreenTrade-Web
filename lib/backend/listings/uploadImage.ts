import { UploadListing } from '@/lib/types/main';
import api from '@/lib/backend/api/axiosConfig';
import { toast } from 'sonner';
import { AppError, retryOperation } from '@/lib/errorUtils';

// Define allowed image formats
const ALLOWED_IMAGE_FORMATS: Record<string, boolean> = {
	'image/jpeg': true,
	'image/jpg': true,
	'image/png': true,
	'image/webp': true,
};

// Maximum total image size (20MB in bytes)
const MAX_TOTAL_IMAGE_SIZE = 20 * 1024 * 1024;

// Helper function to format file size for display (used in error messages)
const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) return bytes + ' bytes';
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
	return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

// Helper function to validate image format
const isValidImageFormat = (type: string): boolean => {
	return ALLOWED_IMAGE_FORMATS[type] === true;
};

// Helper function to get file extension from name or mime type
const getFileExtension = (filename: string): string => {
	return filename.split('.').pop()?.toLowerCase() || '';
};

// Define the return type for uploadImage
interface UploadImageResult {
	urls: string[];
}

export const uploadImage = async (
	images: { uri: string; type?: string; name?: string; size?: number }[],
	listingTitle: UploadListing['title']
): Promise<UploadImageResult> => {
	if (!images || images.length === 0) {
		const errorMessage = 'No images provided';
		toast.error(errorMessage);
		throw new AppError(errorMessage, {
			code: 'NO_IMAGES',
			status: 400,
		});
	}

	// Check total image size - this will be more accurate after actual File objects are created below
	let estimatedTotalSize = 0;
	images.forEach((image) => {
		if (image.size) {
			estimatedTotalSize += image.size;
		}
	});
	if (estimatedTotalSize > MAX_TOTAL_IMAGE_SIZE) {
		const formattedSize = formatFileSize(estimatedTotalSize);
		const errorMessage = `Total image size exceeds limit of 20MB. Current total: ${formattedSize}`;
		toast.error(errorMessage);
		throw new AppError(errorMessage, {
			code: 'IMAGE_SIZE_EXCEEDED',
			status: 400,
		});
	}

	try {
		// Authentication is handled by HTTP-only cookies
		// No need to manually check for tokens as the cookies will be sent automatically
		// Create a single FormData object for all images
		const formData = new FormData();
		formData.append('listing_title', listingTitle);

		// Will track actual file sizes as they're processed
		let actualTotalSize = 0;

		// Validate all images first
		const invalidImages = images.filter((image) => {
			// Check file extension if name is provided
			if (image.name) {
				const ext = getFileExtension(image.name);
				if (ext && !['jpeg', 'jpg', 'png', 'webp'].includes(ext)) {
					return true;
				}
			}

			// Check mime type if provided
			if (image.type && !isValidImageFormat(image.type)) {
				return true;
			}

			return false;
		});

		// If invalid images found, reject the upload
		if (invalidImages.length > 0) {
			const errorMessage = `Unsupported image format(s). Only JPEG, PNG, and WebP are allowed.`;
			toast.error(errorMessage);
			throw new AppError(errorMessage, {
				code: 'INVALID_IMAGE_FORMAT',
				status: 400,
			});
		}

		// The backend expects files with the key "file" (not "file0", "file1", etc.)
		await Promise.all(
			images.map(async (image, index) => {
				try {
					// Check if we have a URL/URI or a File object
					if (image instanceof File) {
						// Validate file type
						if (!isValidImageFormat(image.type)) {
							throw new Error(`Unsupported image format: ${image.type}`);
						}
						// Track size
						actualTotalSize += image.size;

						// Check if adding this file would exceed the size limit
						if (actualTotalSize > MAX_TOTAL_IMAGE_SIZE) {
							const formattedSize = formatFileSize(actualTotalSize);
							throw new Error(
								`Adding this image would exceed the 20MB size limit. Total: ${formattedSize}`
							);
						}

						// If it's already a File object, just append it
						formData.append('file', image);
					} else if (image.uri) {
						// For NextJS, convert the URI to a File object
						const response = await fetch(image.uri);
						const blob = await response.blob();

						const fileType = image.type || blob.type;
						// Validate file type
						if (!isValidImageFormat(fileType)) {
							throw new Error(`Unsupported image format: ${fileType}`);
						}

						// Track size
						actualTotalSize += blob.size;
						// Check if adding this file would exceed the size limit
						if (actualTotalSize > MAX_TOTAL_IMAGE_SIZE) {
							const formattedSize = formatFileSize(actualTotalSize);
							throw new Error(
								`Adding this image would exceed the 20MB size limit. Total: ${formattedSize}`
							);
						}

						// Create a File object from the blob
						const file = new File(
							[blob],
							image.name || `image-${Date.now()}-${index}.jpg`,
							{ type: fileType }
						);

						// Append the file to the FormData
						formData.append('file', file);

						if (process.env.NODE_ENV !== 'production') {
							console.log(
								`Converted image URI to File: ${file.name}, size: ${file.size}, type: ${file.type}`
							);
						}
					} else {
						console.warn('Invalid image object:', image);
					}
				} catch (err) {
					console.error(`Error processing image ${index}:`, err);
					// Show user-friendly error message
					if (
						err instanceof Error &&
						err.message.includes('Unsupported image format')
					) {
						toast.error(err.message);
					}
					// Continue with other images even if one fails
				}
			})
		);

		if (process.env.NODE_ENV !== 'production') {
			console.log('Uploading images to /api/upload/listing_image');
		}

		// Show loading state to user
		const loadingToast = toast.loading('Uploading images...');

		// Use our new strongly-typed retry function
		const response: {
			data: {
				success: boolean;
				data?: {
					image_count: number;
					images: {
						id: string;
						url: string;
						file_name: string;
						status: string;
					}[];
				};
				message?: string;
			};
			status: number;
		} = await retryOperation(
			() =>
				api.post('/api/upload/listing_image', formData, {
					headers: {
						// No need to include Authorization header with HTTP-only cookies
						'Content-Type': 'multipart/form-data',
					},
				}),
			{
				context: 'Uploading images',
				maxRetries: 3,
				showToastOnRetry: false, // We'll handle this with our own loading state
			}
		);

		// Dismiss loading toast on success
		toast.dismiss(loadingToast);

		if (process.env.NODE_ENV !== 'production') {
			console.log('Image upload response:', response.data);
		}

		// Check if the response has the expected format
		if (!response.data || !response.data.success) {
			const errorMessage =
				response.data?.message || 'Invalid response format from server';
			toast.error(`Image upload failed: ${errorMessage}`);
			throw new AppError(errorMessage, {
				code: 'INVALID_RESPONSE',
				status: response.status,
			});
		}
		// Extract URLs from the response
		let urls: string[] = [];

		// If the response data is empty but success is true, use the original image URIs
		if (
			!response.data.data ||
			!response.data.data.images ||
			response.data.data.images.length === 0
		) {
			if (process.env.NODE_ENV !== 'production') {
				console.log('No URLs returned from server, using original image URIs');
			}
			urls = images.map((img) => img.uri);
		}
		// If we have images array in the response (standard format)
		else if (
			response.data.data.images &&
			Array.isArray(response.data.data.images)
		) {
			urls = response.data.data.images.map((img) => img.url);
		}
		// If we have a single URL string
		else if (typeof response.data.data === 'string') {
			urls = [response.data.data];
		} else {
			const errorMessage = 'Invalid response format from server';
			toast.error(`Image upload issue: ${errorMessage}`);
			throw new AppError(errorMessage, {
				code: 'INVALID_RESPONSE_FORMAT',
				status: response.status,
			});
		}

		if (process.env.NODE_ENV !== 'production') {
			console.log('Successfully uploaded images, received URLs:', urls);
		}

		// Show success message
		toast.success(`Successfully uploaded ${urls.length} image(s)`);

		// Return the URLs in the format expected by the listing creation
		return { urls };
	} catch (error) {
		// Convert to AppError if not already
		const appError =
			error instanceof AppError ? error : AppError.from(error, 'Image upload');

		// Display error message to user if not already shown
		if (!appError.context?.includes('Uploading images')) {
			toast.error(`Image upload failed: ${appError.message}`);
		}

		// Log in development
		if (process.env.NODE_ENV !== 'production') {
			console.error('Image upload error:', appError);
		} else {
			// In production, use proper error tracking
			// Example: Sentry.captureException(appError)
		}

		// Rethrow for component handling
		throw appError;
	}
};
