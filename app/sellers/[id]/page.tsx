'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FaStar, FaCheckCircle, FaRegClock, FaEnvelope } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSellerListings } from '@/lib/backend/listings/getListings';
import ListingCard from '@/components/ui/ListingCard';
import { toast } from 'sonner';
import { AppError } from '@/lib/errorUtils';
import { getReviews } from '@/lib/backend/reviews/getReviews';
import ReviewCard from '@/components/ui/ReviewCard';
import { NextPage } from 'next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSeller } from '@/lib/backend/sellers/getSeller';
import { sendMessage } from '@/lib/backend/messages/sendMessage';

const SellerPage: NextPage = () => {
	const router = useRouter();
	const params = useParams();
	const [messageOpen, setMessageOpen] = useState(false);
	const [message, setMessage] = useState('');

	// Query for seller data
	const {
		data: seller,
		isLoading: isSellerLoading,
		error: sellerError
	} = useQuery({
		queryKey: ['seller', params.id],
		queryFn: () => getSeller(params.id as string),
		enabled: !!params.id,
		retry: (failureCount, error) => {
			// Don't retry if it's a 404 or similar client error
			if (error instanceof AppError && error.status && error.status < 500) {
				return false;
			}
			return failureCount < 2;
		},
	});

	// Query for seller's listings
	const {
		data: listings = []
	} = useQuery({
		queryKey: ['sellerListings', params.id],
		queryFn: () => getSellerListings(params.id as string),
		enabled: !!params.id,
		retry: 1,
	});

	// Query for seller reviews
	const {
		data: sellerReviews = []
	} = useQuery({
		queryKey: ['sellerReviews', seller?.id],
		queryFn: () => getReviews(seller!.id),
		enabled: !!seller?.id,
		retry: 1,
	});

	// Mutation for sending messages
	const sendMessageMutation = useMutation({
		mutationFn: async ({ sellerId, message }: { sellerId: string; message: string }) => {
			return sendMessage(sellerId, message);
		},
		onSuccess: () => {
			toast.success('Message sent successfully!');
			setMessage('');
			setMessageOpen(false);
		},
		onError: (error) => {
			const appError =
				error instanceof AppError
					? error
					: AppError.from(error, 'Sending message');

			// Handle error properly with user feedback
			let errorMessage = 'Failed to send message. Please try again.';

			if (appError.status === 401) {
				errorMessage = 'Please log in to send messages.';
			} else if (appError.message) {
				errorMessage = appError.message;
			}

			toast.error(errorMessage);

			// Log in development, use proper error tracking in production
			if (process.env.NODE_ENV !== 'production') {
				console.error('Error sending message:', appError);
			}
		},
	});

	// Handle escape key to close message form
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setMessageOpen(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!message.trim()) {
			toast.error('Please enter a message');
			return;
		}

		if (!seller) {
			toast.error('Seller information not available');
			return;
		}

		sendMessageMutation.mutate({
			sellerId: seller.id,
			message,
		});
	};

	// Handle loading states
	const isLoading = isSellerLoading;

	// Handle errors
	if (sellerError) {
		// If it's a client error (like 404), show not found
		if (sellerError instanceof AppError && sellerError.status && sellerError.status < 500) {
			return (
				<div className='mx-auto px-4 py-8 max-w-7xl'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
							Seller not found
						</h1>
						<p className='mt-2 text-gray-600 dark:text-gray-400'>
							The seller you&apos;re looking for doesn&apos;t exist or has been
							removed.
						</p>
						<Button onClick={() => router.push('/browse')} className='mt-4'>
							Browse Listings
						</Button>
					</div>
				</div>
			);
		}

		// For other errors, show a generic error message
		return (
			<div className='mx-auto px-4 py-8 max-w-7xl'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
						Error loading seller
					</h1>
					<p className='mt-2 text-gray-600 dark:text-gray-400'>
						Something went wrong while loading the seller profile.
					</p>
					<Button onClick={() => router.push('/browse')} className='mt-4'>
						Browse Listings
					</Button>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className='mx-auto px-4 py-8 max-w-7xl'>
				<div className='flex items-center justify-center h-96'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto'></div>
						<p className='mt-4 text-gray-600 dark:text-gray-400'>
							Loading seller profile...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!seller) {
		return (
			<div className='mx-auto px-4 py-8 max-w-7xl'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
						Seller not found
					</h1>
					<p className='mt-2 text-gray-600 dark:text-gray-400'>
						The seller you&apos;re looking for doesn&apos;t exist or has been
						removed.
					</p>
					<Button onClick={() => router.push('/browse')} className='mt-4'>
						Browse Listings
					</Button>
				</div>
			</div>
		);
	}

	return (
		<main className='mx-auto px-4 py-22 max-w-7xl'>
			{/* Seller Profile Section - Main grid layout similar to listing page */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
				{/* Profile Image and Bio - Takes up 2 columns on desktop */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Profile Header Card */}
					<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
						<div className='flex flex-col md:flex-row gap-6 items-start'>
							<div className='flex-shrink-0'>
								<div className='relative h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/50 overflow-hidden'>
									{/* Placeholder for seller image */}
									<div className='absolute inset-0 flex items-center justify-center text-green-600 dark:text-green-400 text-3xl font-bold'>
										{seller.name.charAt(0)}
									</div>
								</div>
							</div>

							<div className='flex-grow'>
								<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
									<div className='flex items-center gap-3'>
										<h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
											{seller.name}
										</h1>
										{seller.verified && (
											<Badge className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
												<FaCheckCircle className='mr-1 h-3 w-3' />
												Verified
											</Badge>
										)}
									</div>
								</div>

								{/* Rating and member info */}
								<div className='space-y-3 mb-6'>
									<div className='flex items-center'>
										<div className='flex items-center'>
											{[...Array(5)].map((_, index) => (
												<FaStar
													key={index}
													className={`h-4 w-4 ${index < Math.floor(seller.rating)
														? 'text-yellow-400'
														: 'text-gray-300 dark:text-gray-600'
														}`}
												/>
											))}
										</div>
										<span className='ml-2 text-gray-700 dark:text-gray-300 font-medium'>
											{seller.rating.toFixed(1)}
										</span>
										<span className='ml-2 text-gray-500 dark:text-gray-400'>
											({sellerReviews.length} review{sellerReviews.length !== 1 ? 's' : ''})
										</span>
									</div>

									<div className='flex items-center space-x-2'>
										<div className='w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center'>
											<FaRegClock
												size={18}
												className='text-green-600 dark:text-green-400'
											/>
										</div>
										<div>
											<span className='text-sm text-gray-500 dark:text-gray-400'>
												Member since
											</span>
											<p className='font-medium text-gray-900 dark:text-gray-100'>
												{format(new Date(seller.createdAt), 'MMMM yyyy')}
											</p>
										</div>
									</div>
								</div>

								{/* Action buttons for mobile */}
								<div className='lg:hidden'>
									<Button
										onClick={() => setMessageOpen(!messageOpen)}
										className='w-full bg-green-600 hover:bg-green-700'
									>
										<FaEnvelope className='mr-2 h-4 w-4' />
										Message Seller
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Bio Section */}
					<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
						<div className='flex items-center space-x-2 mb-4'>
							<FaCheckCircle className='text-green-600 dark:text-green-500' />
							<h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
								About {seller.name}
							</h2>
						</div>
						<p className='text-gray-700 dark:text-gray-300 whitespace-pre-line'>
							{seller.bio || "This seller hasn't added a bio yet."}
						</p>
					</div>

					{/* Message Form */}
					{messageOpen && (
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
							<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-4'>
								Send a Message
							</h3>
							<form onSubmit={handleSendMessage}>
								<textarea
									className='w-full px-4 py-3 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 resize-none'
									rows={4}
									placeholder='Write your message here...'
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									required
								></textarea>
								<div className='flex justify-end gap-3 mt-4'>
									<Button
										type='button'
										variant='ghost'
										onClick={() => setMessageOpen(false)}
										disabled={sendMessageMutation.isPending}
									>
										Cancel
									</Button>
									<Button
										type='submit'
										disabled={sendMessageMutation.isPending}
										className='bg-green-600 hover:bg-green-700'
									>
										{sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
									</Button>
								</div>
							</form>
						</div>
					)}
				</div>

				{/* Seller Stats & Actions - Takes up 1 column on desktop */}
				<div className='lg:col-span-1'>
					<div className='sticky top-20 space-y-6'>
						{/* Stats Card */}
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
							<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center'>
								<FaCheckCircle className='mr-2 h-4 w-4 text-green-500' />
								Seller Stats
							</h3>

							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-gray-700 dark:text-gray-300'>
										Total Listings
									</span>
									<span className='font-medium text-gray-900 dark:text-gray-100'>
										{listings.length}
									</span>
								</div>

								<div className='flex items-center justify-between'>
									<span className='text-gray-700 dark:text-gray-300'>
										Reviews
									</span>
									<span className='font-medium text-gray-900 dark:text-gray-100'>
										{sellerReviews.length}
									</span>
								</div>

								<div className='flex items-center justify-between'>
									<span className='text-gray-700 dark:text-gray-300'>
										Rating
									</span>
									<div className='flex items-center'>
										<div className='flex items-center'>
											{[...Array(5)].map((_, i) => (
												<FaStar
													key={i}
													className={`w-4 h-4 ${i < Math.floor(seller.rating)
														? 'text-yellow-400'
														: 'text-gray-300 dark:text-gray-600'
														}`}
												/>
											))}
										</div>
										<span className='ml-2 font-medium text-gray-900 dark:text-gray-100'>
											{seller.rating.toFixed(1)}
										</span>
									</div>
								</div>
							</div>

							{/* Action buttons for desktop */}
							<div className='hidden lg:block mt-6 pt-6 border-t border-gray-100 dark:border-gray-800'>
								<div className='space-y-3'>
									<Button
										onClick={() => setMessageOpen(!messageOpen)}
										className='w-full bg-green-600 hover:bg-green-700'
									>
										<FaEnvelope className='mr-2 h-4 w-4' />
										Message Seller
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Seller's Listings Section */}
			<div className='mb-12'>
				<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
					<div className='flex items-center space-x-2 mb-6'>
						<FaCheckCircle className='text-green-600 dark:text-green-500' />
						<h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
							Listings from {seller.name}
						</h2>
						<Badge variant='secondary' className='bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'>
							{listings.length} {listings.length === 1 ? 'listing' : 'listings'}
						</Badge>
					</div>

					{listings.length === 0 ? (
						<div className='text-center py-12'>
							<p className='text-gray-600 dark:text-gray-400'>
								This seller doesn&apos;t have any active listings at the moment.
							</p>
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{listings.map((listing) => (
								<ListingCard
									key={listing.id}
									listing={listing}
									viewMode='grid'
									className='shadow-sm hover:shadow-md transition-shadow duration-300'
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Reviews Section */}
			<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800'>
				<div className='flex items-center space-x-2 mb-6'>
					<FaStar className='text-yellow-500' />
					<h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
						Reviews for {seller.name}
					</h2>
					<Badge variant='secondary' className='bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'>
						{sellerReviews.length} {sellerReviews.length === 1 ? 'review' : 'reviews'}
					</Badge>
				</div>

				{sellerReviews.length === 0 ? (
					<div className='text-center py-12'>
						<p className='text-gray-600 dark:text-gray-400'>
							This seller has no reviews yet.
						</p>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
						{sellerReviews.map((review) => (
							<ReviewCard
								key={review.id}
								review={review}
								className='shadow-sm hover:shadow-md transition-shadow duration-300'
							/>
						))}
					</div>
				)}
			</div>
		</main>
	);
};

export default SellerPage;
