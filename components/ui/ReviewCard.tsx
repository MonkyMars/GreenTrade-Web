import { FetchedReview } from '@/lib/types/review';
import { formatDistanceToNow } from 'date-fns';
import { FaStar, FaCheckCircle, FaThumbsUp, FaUser } from 'react-icons/fa';
import Link from 'next/link';

interface ReviewCardProps {
	review: FetchedReview;
	className?: string;
}

const ReviewCard = ({ review, className = '' }: ReviewCardProps) => {
	// Generate stars based on rating
	const renderStars = () => {
		const stars = [];
		const rating = review.rating;

		for (let i = 1; i <= 5; i++) {
			let starClass = '';

			if (i <= Math.floor(rating)) {
				// Full star
				starClass = 'text-yellow-400';
			} else if (i === Math.ceil(rating) && rating % 1 !== 0) {
				// Partial star - for simplicity we'll show it as full since we can't easily show half stars with FontAwesome
				starClass = 'text-yellow-400';
			} else {
				// Empty star
				starClass = 'text-gray-300 dark:text-gray-600';
			}

			stars.push(
				<FaStar
					key={i}
					className={`h-4 w-4 ${starClass}`}
				/>
			);
		}
		return stars;
	};

	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow ${className}`}
		>
			<div className='flex items-start justify-between'>
				<div className='flex items-center'>
					<div className='flex-shrink-0'>
						<div className='h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center'>
							<FaUser className='h-5 w-5 text-green-600 dark:text-green-400' />
						</div>
					</div>
					<div className='ml-3'>
						<p className='text-sm font-medium text-gray-900 dark:text-white'>
							{review.userName}
						</p>
						<div className='flex items-center text-xs text-gray-500 dark:text-gray-400'>
							{formatDistanceToNow(new Date(review.createdAt), {
								addSuffix: true,
							})}
							{review.verifiedPurchase && (
								<>
									<span className='mx-1.5'>•</span>
									<span className='flex items-center text-green-600 dark:text-green-400'>
										<FaCheckCircle className='h-3 w-3 mr-1' />
										Verified Purchase
									</span>
								</>
							)}
						</div>
					</div>			</div>
				<div className='flex items-center'>
					<div className='flex'>{renderStars()}</div>
					<span className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
						{review.rating.toFixed(1)}
					</span>
				</div>
			</div>

			<div className='mt-4'>
				<h3 className='text-lg font-medium text-gray-900 dark:text-white'>
					{review.title}
				</h3>
				<p className='mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line'>
					{review.content}
				</p>
			</div>

			<div className='mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between'>
				<div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
					<FaThumbsUp className='h-4 w-4 text-gray-400 dark:text-gray-500 mr-1' />
					<span>{review.helpfulCount} people found this helpful</span>
				</div>
				<Link
					href={`/sellers/${review.sellerId}`}
					className='text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
				>
					View Seller
				</Link>
			</div>
		</div>
	);
};

export default ReviewCard;
