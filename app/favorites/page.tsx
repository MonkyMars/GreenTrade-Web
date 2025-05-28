'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getFavorites } from '@/lib/backend/favorites/getFavorites';
import { toggleFavorite } from '@/lib/backend/favorites/favorites';
import { FetchedListing } from '@/lib/types/main';
import ListingCard from '@/components/ui/ListingCard';
import { Button } from '@/components/ui/button';
import { FaArrowRight, FaHeart, FaList, FaThLarge } from 'react-icons/fa';
import { useAuth } from '@/lib/contexts/AuthContext';
import { NextPage } from 'next';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AppError } from '@/lib/errorUtils';

const FavoritesPage: NextPage = () => {
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
	const router = useRouter();
	const { user } = useAuth();
	const queryClient = useQueryClient();

	// Query for favorites
	const {
		data: favorites = [],
		isLoading: loading
	} = useQuery({
		queryKey: ['favorites', user?.id],
		queryFn: getFavorites,
		enabled: !!user,
		retry: 2,
		meta: {
			errorMessage: 'Failed to load favorites'
		}
	});

	// Mutation for removing favorites
	const removeFavoriteMutation = useMutation({
		mutationFn: async (listingId: string) => {
			return toggleFavorite(listingId, true); // Remove from favorites
		},
		onSuccess: (_, listingId) => {
			// Update the favorites cache by removing the item
			queryClient.setQueryData(['favorites', user?.id], (oldData: FetchedListing[] | undefined) => {
				return oldData ? oldData.filter(listing => listing.id !== listingId) : [];
			});

			// Also invalidate individual favorite status queries
			queryClient.invalidateQueries({
				queryKey: ['favorite', listingId, user?.id]
			});

			toast.success('Removed from favorites');
		},
		onError: (error) => {
			const appError = error instanceof AppError
				? error
				: AppError.from(error, 'Removing from favorites');

			if (process.env.NODE_ENV !== 'production') {
				console.error('Error removing from favorites:', appError);
			}

			toast.error('Failed to remove from favorites');
		}
	});

	const handleRemoveFavorite = (listingId: string) => {
		if (!user) return;
		removeFavoriteMutation.mutate(listingId);
	};

	return (
		<ProtectedRoute>
			<div className='container mx-auto px-4 py-22 bg-gray-50 dark:bg-gray-900 min-h-screen pt-20'>
				<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800 mb-8'>
					<div className='flex items-center space-x-2 mb-2'>
						<FaHeart className='text-green-600 dark:text-green-500' />
						<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
							My Favorites
						</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400'>
						Listings you&apos;ve saved for later
					</p>
				</div>
				<div className='flex justify-between items-center mb-6'>
					<div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-md p-0.5 shadow-sm'>
						<button
							onClick={() => setViewMode('list')}
							className={`p-1.5 cursor-pointer rounded ${viewMode === 'list'
								? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
								: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
								}`}
							aria-label='List view'
						>
							<FaList className='h-4 w-4' />
						</button>
						<button
							onClick={() => setViewMode('grid')}
							className={`p-1.5 cursor-pointer rounded ${viewMode === 'grid'
								? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
								: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
								}`}
							aria-label='Grid view'
						>
							<FaThLarge className='h-4 w-4' />
						</button>
					</div>{' '}
					<Button
						size={'sm'}
						className='py-4'
						onClick={() => router.push('/browse')}
					>
						Browse more listings
						<FaArrowRight className='ml-2 group-hover:translate-x-0.5 transition-transform duration-300' />
					</Button>
				</div>

				{loading ? (
					<div className='flex items-center justify-center h-96'>
						<div className='text-center'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto'></div>
							<p className='mt-4 text-gray-600 dark:text-gray-400'>
								Loading favorites...
							</p>
						</div>
					</div>
				) : favorites.length === 0 ? (
					<div className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center border border-gray-200 dark:border-gray-800'>
						<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4'>
							<FaHeart className='h-8 w-8 text-gray-400 dark:text-gray-500' />
						</div>
						<h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
							No favorites yet
						</h3>
						<p className='text-gray-500 dark:text-gray-400 mb-6'>
							Items you save will appear here. Start browsing to find items you
							like!
						</p>{' '}
						<Button
							onClick={() => router.push('/browse')}
							className='bg-green-600 hover:bg-green-700 text-white shadow-sm transition-colors'
						>
							Browse Listings
						</Button>
					</div>
				) : (
					<div
						className={
							viewMode === 'grid'
								? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
								: 'space-y-6'
						}
					>
						{favorites.map((listing: FetchedListing) => {
							const isFavorite = true; // Always true since these are favorites
							return (
								<div key={listing.id} className='relative group'>
									<ListingCard
										listing={listing}
										viewMode={viewMode}
										className='shadow-sm hover:shadow-md transition-shadow duration-300'
									/>{' '}
									<button
										onClick={() => handleRemoveFavorite(listing.id)}
										disabled={removeFavoriteMutation.isPending}
										className={cn('absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full cursor-pointer shadow-md transition-all duration-200 z-10 border border-gray-200 dark:border-gray-800 hover:scale-110', isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500')}
										aria-label='Remove from favorites'
									>
										<FaHeart className={cn('h-5 w-5', isFavorite ? 'text-red-500' : 'text-gray-400')} />
									</button>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</ProtectedRoute>
	);
};

export default FavoritesPage;
