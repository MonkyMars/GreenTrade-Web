import { FaCamera } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { z } from 'zod';
import Image from 'next/image';
import React from 'react';
import { UploadListing } from '@/lib/types/main';
import { toast } from 'sonner';

// Define allowed image formats
const ALLOWED_IMAGE_FORMATS: Record<string, boolean> = {
	'image/jpeg': true,
	'image/jpg': true,
	'image/png': true,
	'image/webp': true
};

// Maximum total image size (20MB in bytes)
const MAX_TOTAL_IMAGE_SIZE = 20 * 1024 * 1024;

// Format file size for display
const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) return bytes + ' bytes';
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
	return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

// Helper function to validate image format
const isValidImageFormat = (type: string): boolean => {
	return ALLOWED_IMAGE_FORMATS[type] === true;
};

interface ImageUploadFormProps {
	images: { uri: string; type?: string; name?: string; size?: number }[];
	setImages: React.Dispatch<
		React.SetStateAction<{ uri: string; type?: string; name?: string; size?: number }[]>
	>;
	imageFiles: File[];
	setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
	uploading: boolean;
	setUploading: React.Dispatch<React.SetStateAction<boolean>>;
	formErrors: z.ZodIssue[];
	setFormData: React.Dispatch<React.SetStateAction<UploadListing>>;
	formData: UploadListing;
}

const ImageUploadForm = ({
	images,
	setImages,
	imageFiles,
	setImageFiles,
	uploading,
	setUploading,
	formErrors,
	setFormData,
	formData,
}: ImageUploadFormProps) => {
	// Maximum total image size (20MB in bytes) - defined at module level

	// Calculate current total image size
	const getCurrentTotalSize = (): number => {
		return imageFiles.reduce((total, file) => total + file.size, 0);
	};
	// Note: formatFileSize is defined at module level
	// Handle image upload
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setUploading(true);

		// Store both the file objects and create preview URLs
		const newImageFiles = [...imageFiles];
		const newImages = [...images];

		// Check for invalid file types
		const invalidFiles: File[] = [];
		// Track files skipped due to size limit
		const skippedDueToSize: File[] = [];

		// Calculate current total size before adding new files
		let totalSize = getCurrentTotalSize();

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const fileType = file.type;

			// Validate file type
			if (!isValidImageFormat(fileType)) {
				invalidFiles.push(file);
				continue;
			}

			// Check if adding this file would exceed the size limit
			if (totalSize + file.size > MAX_TOTAL_IMAGE_SIZE) {
				skippedDueToSize.push(file);
				continue;
			}

			if (newImages.length < 5) {
				// Limit to 5 images
				totalSize += file.size;
				newImageFiles.push(file);
				newImages.push({
					uri: URL.createObjectURL(file),
					type: file.type,
					name: file.name,
					size: file.size
				});
			}
		}

		// Show error message if invalid files were found
		if (invalidFiles.length > 0) {
			toast.error(`${invalidFiles.length} file(s) skipped. Only JPEG, PNG, and WebP formats are supported.`);
		}

		// Show error message if files were skipped due to size limit
		if (skippedDueToSize.length > 0) {
			toast.error(`${skippedDueToSize.length} file(s) skipped. Total image size must be under 20MB.`);
		}

		setImageFiles(newImageFiles);

		// Update formData with new image files
		setFormData({
			...formData,
			imageUrls: newImageFiles.map((file) => file.name),
		});
		setImages(newImages);
		setUploading(false);
	};

	// Remove an image
	const removeImage = (index: number) => {
		const newImages = [...images];
		const newImageFiles = [...imageFiles];

		URL.revokeObjectURL(newImages[index].uri);
		newImages.splice(index, 1);
		newImageFiles.splice(index, 1);

		setImages(newImages);
		setImageFiles(newImageFiles);
	};

	// Calculate total size of all images
	const totalSize = getCurrentTotalSize();
	const totalSizeFormatted = formatFileSize(totalSize);
	const sizePercentage = Math.min(100, (totalSize / MAX_TOTAL_IMAGE_SIZE) * 100);

	return (
		<section className='bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg'>
			<div className='px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700'>
				<h2 className='text-lg font-medium text-gray-900 dark:text-white'>
					Images
				</h2>
				<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
					Add up to 5 images of your item
				</p>
			</div>
			<div className='px-4 py-5 sm:p-6'>
				<div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
					{/* Existing images */}
					{images.map((image, index) => (
						<div
							key={index}
							className='relative h-32 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden'
						>
							<Image
								src={image.uri}
								alt={`Listing image ${index + 1}`}
								fill
								style={{ objectFit: 'cover' }}
							/>
							<button
								type='button'
								onClick={() => removeImage(index)}
								className='absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700'
							>
								<FiX className='h-4 w-4 text-gray-500 dark:text-gray-400' />
							</button>
						</div>
					))}

					{/* Upload button */}
					{images.length < 5 && (
						<div className='relative h-32'>
							<label
								htmlFor='image-upload'
								className='h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-green-300 hover:border-solid hover:border-1 cursor-pointer'
							>
								<div className='flex flex-col items-center justify-center pt-5 pb-6'>
									<FaCamera className='mx-auto h-12 w-12 text-gray-400' />
									<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
										{uploading ? 'Uploading...' : 'Add Image'}
									</p>
								</div>
								<input
									id='image-upload'
									name='image-upload'
									type='file'
									accept='.jpeg, .jpg, .png, .webp, image/jpeg, image/jpg, image/png, image/webp'
									onChange={handleImageUpload}
									multiple={true}
									disabled={uploading}
									className='sr-only'
								/>
							</label>
						</div>
					)}
				</div>
				{formErrors.find((error) => error.path[0] === 'images') && (
					<p className='text-sm text-red-600 dark:text-red-400'>
						{formErrors.find((error) => error.path[0] === 'images')?.message}
					</p>
				)}				{/* Size indicator */}
				<div className="mt-3 mb-4">
					<div className="flex justify-between items-center mb-1">
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Total size: {totalSizeFormatted} / 20 MB
						</span>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{sizePercentage.toFixed(0)}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
						<div
							className={`h-2.5 rounded-full ${sizePercentage > 80 ? 'bg-yellow-400' : 'bg-green-500'}`}
							style={{ width: `${sizePercentage}%` }}
						></div>
					</div>
				</div>

				<p className='text-sm text-gray-500 dark:text-gray-400'>
					First image will be the featured image. Clear, well-lit photos from
					multiple angles help items sell faster.
				</p>
				<p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
					Supported formats: JPEG, PNG, WebP
				</p>
				<p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
					Total image size must be under 20MB
				</p>
			</div>
		</section>
	);
};

export default ImageUploadForm;
