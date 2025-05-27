'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaLeaf, FaMapMarkedAlt, FaStar } from 'react-icons/fa';
import { TbFolder } from 'react-icons/tb';
import { FetchedListing } from '@/lib/types/main';
import { findCategory } from '@/lib/functions/categories';
import { formatDistanceToNow } from 'date-fns';

interface ListingCardProps {
	listing: FetchedListing;
	viewMode: 'grid' | 'list';
	className?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
	listing,
	viewMode,
	className,
}) => {
	let category = findCategory(listing.category);
	if (!category) {
		category = { id: 'all', icon: TbFolder, name: 'All Categories' };
	}

	const formattedDate = formatDistanceToNow(new Date(listing.createdAt), {
		addSuffix: true,
	}).charAt(0).toUpperCase() +
		formatDistanceToNow(new Date(listing.createdAt), {
			addSuffix: true,
		}).slice(1);

	if (viewMode === 'grid') {
		return (
			<div
				className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 h-full border border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800 ${className}`}
			>
				<div className='relative h-48 overflow-hidden'>
					{listing.imageUrls && listing.imageUrls.length > 0 ? (
						<Image
							src={listing.imageUrls[0]}
							alt={listing.title}
							fill
							priority
							unoptimized
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							className='object-cover w-full h-full transition-transform duration-500 hover:scale-105'
						/>
					) : (
						<div className='w-full h-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center'>
							<TbFolder className='h-12 w-12 text-gray-300 dark:text-gray-600' />
						</div>
					)}
					<div className='absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm'>
						<FaLeaf className='h-3 w-3 text-green-500 mr-1.5' />
						<span className='font-semibold text-green-600 dark:text-green-400'>
							{listing.ecoScore.toFixed(1)}
						</span>
					</div>
				</div>

				<div className='p-4'>
					<div className='flex items-center space-x-1.5 mb-2'>
						<category.icon className='h-3.5 w-3.5 text-green-500' />
						<span className='text-sm text-green-600 dark:text-green-400 font-medium'>
							{category.name}
						</span>
					</div>

					<Link href={`/listings/${listing.id}`} className='block'>
						<h3 className='text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
							{listing.title}
						</h3>
					</Link>

					<div className='mt-3 flex items-center justify-between'>
						<span className='text-green-600 dark:text-green-400 text-lg font-semibold'>
							€{listing.price}
						</span>
						<div className='flex items-center text-xs text-gray-500 dark:text-gray-400'>
							<FaMapMarkedAlt className='mr-1.5 h-3 w-3 flex-shrink-0' />
							<span className='truncate max-w-[120px] text-sm'>
								{listing.location?.city || 'Unknown City'}
							</span>
						</div>
					</div>

					<div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-800'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								{listing.sellerVerified && (
									<span className='mr-1.5 h-4 w-4 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-xs rounded-full flex items-center justify-center'>
										✓
									</span>
								)}
								<Link
									href={`/sellers/${listing.sellerId}`}
									className='text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm'
								>
									{listing.sellerUsername}
								</Link>
								{Number(listing.sellerRating) !== 0 && (
									<div className='ml-2 flex items-center'>
										<FaStar className='h-3 w-3 text-yellow-400' />
										<span className='text-xs ml-1 text-gray-600 dark:text-gray-400'>
											{Number(listing.sellerRating).toFixed(1)}
										</span>
									</div>
								)}
							</div>
							<span className='text-sm text-gray-400 dark:text-gray-500'>
								{formattedDate}
							</span>
						</div>

						<Link
							href={`/listings/${listing.id}`}
							className='mt-3 block w-full text-center py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors'
						>
							View Details
						</Link>
					</div>
				</div>
			</div>
		);
	} else {
		// List view
		return (
			<div className='bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 h-full border border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800'>
				<div className='flex flex-col sm:flex-row'>
					<div className='relative h-40 sm:h-auto sm:w-40 flex-shrink-0 overflow-hidden'>
						{listing.imageUrls && listing.imageUrls.length > 0 ? (
							<Image
								src={listing.imageUrls[0]}
								alt={listing.title}
								fill
								priority
								sizes='(max-width: 640px) 100vw, 160px'
								className='object-cover w-full h-full transition-transform duration-500 hover:scale-105'
								unoptimized
							/>
						) : (
							<div className='w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
								<TbFolder className='h-10 w-10 text-gray-300 dark:text-gray-600' />
							</div>
						)}
						<div className='absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full text-xs flex items-center shadow-sm'>
							<FaLeaf className='h-3 w-3 text-green-500 mr-1.5' />
							<span className='font-semibold text-green-600 dark:text-green-400'>
								{listing.ecoScore.toFixed(1)}
							</span>
						</div>
					</div>

					<div className='p-4 flex-grow'>
						<div className='flex items-center space-x-1.5 mb-2'>
							<category.icon className='h-3.5 w-3.5 text-green-500' />
							<span className='text-xs text-green-600 dark:text-green-400 font-medium'>
								{category.name}
							</span>
						</div>

						<div className='flex justify-between items-start'>
							<div>
								<Link href={`/listings/${listing.id}`} className='block'>
									<h3 className='text-base font-medium text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
										{listing.title}
									</h3>
								</Link>
								<p className='mt-1 text-green-600 dark:text-green-400 text-lg font-semibold'>
									€{listing.price}
								</p>
							</div>
						</div>

						<div className='mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400'>
							<FaMapMarkedAlt className='mr-1.5 h-3 w-3 flex-shrink-0' />
							<span className='truncate'>{listing.location?.city || 'Unknown City'}</span>
							<span className='mx-2 text-gray-300 dark:text-gray-600'>•</span>
							<span>{formattedDate}</span>
						</div>

						<div className='flex items-center justify-between mt-4'>
							<div className='flex items-center'>
								{listing.sellerVerified && (
									<span className='mr-1.5 h-4 w-4 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-xs rounded-full flex items-center justify-center'>
										✓
									</span>
								)}
								<Link
									href={`/sellers/${listing.sellerId}`}
									className='text-xs text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'
								>
									{listing.sellerUsername}
								</Link>
								{Number(listing.sellerRating) !== 0 && (
									<div className='ml-2 flex items-center'>
										<FaStar className='h-3 w-3 text-yellow-400' />
										<span className='text-xs ml-1 text-gray-600 dark:text-gray-400'>
											{Number(listing.sellerRating).toFixed(1)}
										</span>
									</div>
								)}
							</div>

							<Link
								href={`/listings/${listing.id}`}
								className='inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors'
							>
								View Details
								<svg
									className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5l7 7-7 7'
									/>
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default ListingCard;
