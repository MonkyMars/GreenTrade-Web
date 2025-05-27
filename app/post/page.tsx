'use client';

// This is a client-side page that allows authorized users to post a new listing to GreenVue.
// It includes a form for entering item details, uploading images, and selecting eco-friendly attributes.

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { uploadImage } from '@/lib/backend/listings/uploadImage';
import { uploadListing } from '@/lib/backend/listings/uploadListing';
import { FetchedListing, UploadListingSchema, type UploadListing } from '@/lib/types/main';
import { calculateEcoScore } from '@/lib/functions/calculateEcoScore';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '@/lib/contexts/AuthContext';
import { type Categories } from '@/lib/functions/categories';
import { AppError, retryOperation } from '@/lib/errorUtils';
import { toast } from 'sonner';
import { NextPage } from 'next';
import { type Condition } from '@/lib/functions/conditions';
import { FiGrid, FiList } from 'react-icons/fi';

// Import components
import FormErrorDisplay from '@/components/post/FormErrorDisplay';
import FormSuccessMessage from '@/components/post/FormSuccessMessage';
import ItemDetailsForm from '@/components/post/ItemDetailsForm';
import PriceForm from '@/components/post/PriceForm';
import ImageUploadForm from '@/components/post/ImageUploadForm';
import EcoAttributesForm from '@/components/post/EcoAttributesForm';
import TermsAndSubmitForm from '@/components/post/TermsAndSubmitForm';
import { Button } from '@/components/ui/button';
import ListingCard from '@/components/ui/ListingCard';

// Create a more specific type for category that excludes "All Categories"
type CategoryName = Exclude<Categories['name'], 'All Categories'>;

// Helper functions
const MAX_TOTAL_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

// Helper function to validate total image size
const validateImageSize = (files: File[]): { valid: boolean; message?: string; totalSize: number } => {
	const totalSize = files.reduce((total, file) => total + file.size, 0);

	if (totalSize > MAX_TOTAL_IMAGE_SIZE) {
		const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
		return {
			valid: false,
			message: `Images exceed the 20MB size limit. Current total: ${sizeMB}MB`,
			totalSize,
		};
	}

	return { valid: true, totalSize };
};

// formatFileSize function is already defined in ImageUploadForm.tsx

const PostListingPage: NextPage = () => {
	const { user } = useAuth();
	const [formData, setFormData] = useState<UploadListing>({
		title: '',
		description: '',
		category: '' as CategoryName,
		condition: '' as Condition['name'],
		price: 0,
		ecoAttributes: [],
		negotiable: false,
		ecoScore: 0,
		imageUrls: [],
		sellerId: user?.id || '',
	});
	const [images, setImages] = useState<
		{ uri: string; type?: string; name?: string; size?: number }[]
	>([]);
	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [ecoScore, setEcoScore] = useState<number>(0);
	const [tab, setTab] = useState<'edit' | 'preview'>('edit');
	const [previewListing, setPreviewListing] = useState<FetchedListing | null>(
		null
	);
	const [previewViewmode, setPreviewView] = useState<'grid' | 'list'>('grid');

	// Check if user has set their location for posting
	useEffect(() => {
		if (user && user.id) {
			if (!user.location?.city || !user.location?.country) {
				setErrorMessage(
					'Location required: Please update your profile with a location before posting.'
				);
				toast.error('Missing location information', {
					duration: 5000,
					icon: '📍',
				});
			} else if (errorMessage.includes('location')) {
				// Clear location-related error when user has location
				setErrorMessage('');
			}
		}
	}, [user, errorMessage]);

	// Handle form input changes
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Clear errors for this field when edited
		setFormErrors(formErrors.filter((error) => error.path[0] !== name));
	};

	// Form validation
	const validateForm = () => {
		const result = UploadListingSchema.safeParse(formData);
		if (!result.success) {
			setFormErrors(result.error.issues);
			return false;
		}
		return true;
	};
	const resetForm = () => {
		setFormData({
			title: '',
			description: '',
			category: '' as CategoryName,
			condition: '' as Condition['name'],
			price: 0,
			ecoAttributes: [],
			negotiable: false,
			ecoScore: 0,
			imageUrls: [],
			sellerId: user?.id || '',
		});
		// Clear any object URLs to prevent memory leaks
		images.forEach((image) => {
			if (image.uri) URL.revokeObjectURL(image.uri);
		});
		setImages([]);
		setImageFiles([]);
		setEcoScore(0);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Clear messages
		setFormErrors([]);
		setSuccessMessage('');
		setErrorMessage('');

		const isValid = validateForm();
		if (!isValid) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}
		// Check total image size
		const sizeValidation = validateImageSize(imageFiles);
		if (!sizeValidation.valid) {
			setErrorMessage(sizeValidation.message || 'Images are too large');
			toast.error('Images are too large');
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}

		// Check if we have any images
		if (imageFiles.length === 0) {
			setErrorMessage('Please add at least one image of your item');
			toast.error('Images required');
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}

		// Show loading toast
		const loadingToast = toast.loading('Creating your listing...');

		try {
			// Check if user is available
			if (!user || !user.id) {
				throw new AppError('You must be logged in to post a listing', {
					code: 'AUTH_REQUIRED',
					status: 401,
					context: 'Post Listing',
				});
			}

			// Upload images with proper error handling
			let imageUrls: string[] = [];
			try {
				const result = await uploadImage(images, formData.title);
				imageUrls = result.urls;
			} catch (error) {
				console.error('Image upload error:', error);
				throw new AppError('Failed to upload images', {
					code: 'IMAGE_UPLOAD_FAILED',
					context: 'Post Listing',
				});
			}

			if (imageUrls.length === 0) {
				throw new AppError('No image URLs returned from server', {
					code: 'IMAGE_UPLOAD_FAILED',
					context: 'Post Listing',
				});
			}

			console.log('Image URLs:', imageUrls);

			const listing: UploadListing = {
				title: formData.title,
				description: formData.description,
				category: formData.category,
				condition: formData.condition as Condition['name'],
				price: formData.price,
				negotiable: formData.negotiable,
				ecoAttributes: formData.ecoAttributes,
				ecoScore: calculateEcoScore(formData.ecoAttributes),
				imageUrls: imageUrls,
				sellerId: user.id,
			};

			// Use retryOperation for listing upload with proper error handling
			const uploadResponse = await retryOperation(
				() => uploadListing(listing),
				{
					context: 'Upload Listing',
					maxRetries: 1,
					showToastOnRetry: true,
				}
			);

			if (!uploadResponse) {
				throw new AppError('Failed to post listing', {
					code: 'LISTING_UPLOAD_FAILED',
					context: 'Post Listing',
				});
			}

			// Dismiss loading toast and show success
			toast.dismiss(loadingToast);
			toast.success('Listing posted successfully!');
			setSuccessMessage('Listing posted successfully!');

			// Reset form data on success
			resetForm();
		} catch (error) {
			// Dismiss loading toast
			toast.dismiss(loadingToast);

			// Convert to AppError if not already
			const appError =
				error instanceof AppError
					? error
					: AppError.from(error, 'Post Listing');

			// Log in development, use proper error tracking in production
			if (process.env.NODE_ENV !== 'production') {
				console.error('Post listing error:', appError);
			} else {
				// In production, this would use a service like Sentry
				// Example: Sentry.captureException(appError);
			}

			// Set appropriate user-friendly error message based on error code/type
			if (appError.code === 'AUTH_REQUIRED' || appError.status === 401) {
				setErrorMessage(
					'Authentication required. Please ensure you are logged in.'
				);
				toast.error('Authentication required');
			} else if (appError.code === 'IMAGE_UPLOAD_FAILED') {
				setErrorMessage(
					'Failed to upload images. Please try again with different images or check your connection.'
				);
				toast.error('Image upload failed');
			} else if (appError.code === 'LISTING_UPLOAD_FAILED') {
				setErrorMessage('Failed to post your listing. Please try again.');
				toast.error('Listing upload failed');
			} else if (
				appError.validationErrors &&
				Object.keys(appError.validationErrors).length > 0
			) {
				const validationMessages = Object.values(appError.validationErrors)
					.flat()
					.join(', ');
				setErrorMessage(`Validation error: ${validationMessages}`);
				toast.error('Please check your listing information');
			} else if (appError.message) {
				setErrorMessage(`Failed to post listing: ${appError.message}`);
				toast.error(appError.message);
			} else {
				setErrorMessage(
					'An unexpected error occurred. Please try again later.'
				);
				toast.error('Something went wrong');
			}
		} finally {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};
	const handleTabChange = (newTab: 'edit' | 'preview') => {
		if (newTab === tab) {
			return;
		}

		if (newTab === 'preview') {
			// Verify we have valid images
			const validImages = images.filter((img) => !!img.uri);

			const previewListing: FetchedListing = {
				...formData,
				price: formData.price,
				ecoScore: calculateEcoScore(formData.ecoAttributes),
				imageUrls: validImages.map((image) => image.uri),
				sellerId: user?.id || '',
				id: '',
				createdAt: new Date(),
				location: user?.location
					? {
						city: user.location.city || '',
						country: user.location.country || '',
						latitude: user.location.latitude || 0,
						longitude: user.location.longitude || 0,
					}
					: undefined,
				sellerUsername: user?.name || '',
				sellerBio: user?.bio || '',
				sellerCreatedAt: user?.createdAt || new Date(),
				sellerRating: 0,
				sellerVerified: false,
				bids: [],
			};
			setPreviewListing(previewListing);
		}

		setTab(newTab);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<ProtectedRoute>
			<main className='pt-16 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen'>
				<div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='my-8'>
						<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
							Post a New Listing
						</h1>
						<p className='mt-2 text-gray-600 dark:text-gray-400'>
							Share your sustainable item with the community
						</p>
					</div>

					<FormSuccessMessage successMessage={successMessage} />
					<FormErrorDisplay
						formErrors={formErrors}
						errorMessage={errorMessage}
					/>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<Button
							variant={'ghost'}
							type='button'
							className='rounded-sm'
							onClick={() => handleTabChange('edit')}
						>
							Edit
						</Button>
						<Button
							variant={'ghost'}
							type='button'
							className='rounded-sm'
							onClick={() => handleTabChange('preview')}
						>
							Preview
						</Button>

						{/* Tab content */}
						{tab === 'edit' && (
							<>
								{/* Item Details */}
								<ItemDetailsForm
									formData={formData}
									handleChange={handleChange}
									setFormData={setFormData}
									formErrors={formErrors}
								/>

								{/* Price */}
								<PriceForm
									formData={formData}
									setFormData={setFormData}
									formErrors={formErrors}
								/>

								{/* Images */}
								<ImageUploadForm
									images={images}
									setImages={setImages}
									imageFiles={imageFiles}
									setImageFiles={setImageFiles}
									uploading={uploading}
									setUploading={setUploading}
									formErrors={formErrors}
									setFormData={setFormData}
									formData={formData}
								/>

								{/* Eco-friendly Attributes */}
								<EcoAttributesForm
									formData={formData}
									setFormData={setFormData}
									ecoScore={ecoScore}
									setEcoScore={setEcoScore}
									formErrors={formErrors}
								/>

								{/* Terms and Submit */}
								<TermsAndSubmitForm onSubmit={handleSubmit} />
							</>
						)}

						{/* Information Tab */}
						{tab === 'preview' && previewListing && (
							<div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
								<h2 className='text-lg font-medium text-gray-900 dark:text-white'>Preview</h2>
								<div className='flex justify-between mb-4 border-b border-gray-200 dark:border-gray-700 '>
									<Button
										variant={'ghost'}
										type='button'
										className='rounded-sm'
										onClick={() => handleTabChange('edit')}
									>
										Edit
									</Button>
									<div className='hidden sm:flex items-center gap-1 rounded-md p-0.5'>
										<button
											onClick={() => setPreviewView('grid')}
											className={`p-1.5 rounded ${previewViewmode === 'grid'
												? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-300 shadow-sm'
												: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
												}`}
											aria-label='Grid view'
											type='button'
										>
											<FiGrid className='h-5 w-5' />
										</button>
										<button
											onClick={() => setPreviewView('list')}
											className={`p-1.5 rounded ${previewViewmode === 'list'
												? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-300 shadow-sm'
												: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
												}`}
											aria-label='List view'
											type='button'
										>
											<FiList className='h-5 w-5' />
										</button>
									</div>
								</div>
								<ListingCard
									listing={previewListing}
									viewMode={previewViewmode}
									className='mb-4 max-w-[300px] mx-auto'
								/>
							</div>
						)}
					</form>
				</div>
			</main>
		</ProtectedRoute>
	);
};

export default PostListingPage;
