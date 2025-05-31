'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaGavel, FaTrash, FaCrown, FaSort } from 'react-icons/fa';
import { FetchedBid, FetchedListing } from '@/lib/types/main';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitBid } from '@/lib/backend/bids/submitBid';
import { deleteBid } from '@/lib/backend/bids/deleteBid';
import { useAuth } from '@/lib/contexts/AuthContext';
import { AppError } from '@/lib/errorUtils';
import { toast } from 'sonner';

interface BiddingUiProps {
	listing: FetchedListing;
	isNegotiable: boolean;
	bids?: FetchedBid[];
	isOwner?: boolean;
}

export default function BiddingUi({
	listing,
	isNegotiable,
	bids = [],
	isOwner = false,
}: BiddingUiProps) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [bidAmount, setBidAmount] = useState('');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	// Sort bids by price
	const sortedBids = [...bids].sort((a, b) => {
		return sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
	});

	const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.price)) : 0;
	const minimumBid = highestBid + 1;

	// Submit bid mutation
	const submitBidMutation = useMutation({
		mutationFn: async (price: number) => {
			if (!user) {
				throw new AppError('You must be logged in to place a bid', { status: 401, code: 'NOT_AUTHENTICATED' });
			}
			return submitBid({ listingId: listing.id, price });
		},
		onSuccess: () => {
			// Invalidate and refetch the listing to get updated bids
			queryClient.invalidateQueries({ queryKey: ['listing', listing.id] });
			setBidAmount('');
			toast.success('Bid submitted successfully!');
			// Update local bids state
			if (!user) return;
			bids.push({
				id: crypto.randomUUID(),
				listingId: listing.id,
				userId: user.id,
				userName: user.name || 'Anonymous',
				price: parseFloat(bidAmount),
				createdAt: new Date(),
				userPicture: user.picture || '',
			});
		}, onError: (error) => {
			const appError = error instanceof AppError ? error : new AppError('Failed to submit bid, please refresh the page and try again.', { status: 500, code: 'BID_SUBMISSION_FAILED' });
			toast.error(appError.message);
		},
	});

	// Delete bid mutation
	const deleteBidMutation = useMutation({
		mutationFn: deleteBid,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['listing', listing.id] });
			toast.success('Bid removed successfully!');
			// Update local bids state
			if (!user) return;
			const updatedBids = bids.filter(bid => bid.userId !== user.id);
			queryClient.setQueryData(['listing', listing.id], (oldData: FetchedListing | undefined) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					bids: updatedBids,
				};
			});
		}, onError: (error) => {
			const appError = error instanceof AppError ? error : new AppError('Failed to delete bid', { status: 500, code: 'BID_DELETION_FAILED' });
			toast.error(appError.message);
		},
	});

	const handleSubmitBid = () => {
		const price = parseFloat(bidAmount);

		if (isNaN(price) || price <= 0) {
			toast.error('Please enter a valid bid amount');
			return;
		}

		if (price < minimumBid) {
			toast.error(`Bid must be at least €${minimumBid}`);
			return;
		}

		submitBidMutation.mutate(price);
	};

	const handleDeleteBid = (bidId: string) => {
		deleteBidMutation.mutate(bidId);
	};

	const getUserBid = () => {
		if (!user) return null;
		return bids.find(bid => bid.userId === user.id);
	};

	const userBid = getUserBid();

	if (isOwner) {
		return (
			<Card className="rounded-xl shadow-md border-gray-200 dark:border-gray-800">
				<CardHeader className="pb-4">
					<CardTitle className="flex items-center space-x-2 text-lg">
						<FaGavel className="text-green-600 dark:text-green-500" />
						<span>Bidding Activity</span>
						{bids.length > 0 && (
							<Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
								{bids.length} bid{bids.length !== 1 ? 's' : ''}
							</Badge>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{bids.length === 0 ? (
						<p className="text-gray-500 dark:text-gray-400 text-center py-4">
							No bids yet. Be the first to place a bid!
						</p>
					) : (
						<>
							<div className="flex items-center justify-between">
								<div className="text-sm text-gray-600 dark:text-gray-400">
									Highest bid: <span className="font-semibold text-green-600 dark:text-green-400">€{highestBid}</span>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
									className="text-xs"
								>
									<FaSort className="mr-1 h-3 w-3" />
									{sortOrder === 'desc' ? 'Highest first' : 'Lowest first'}
								</Button>
							</div>
							<div className="space-y-3 max-h-60 overflow-y-auto">
								{sortedBids.map((bid, index) => (
									<div
										key={bid.id}
										className={`flex items-center justify-between p-3 rounded-lg border ${index === 0 && sortOrder === 'desc'
											? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
											: 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
											}`}
									>
										<div className="flex items-center space-x-3">
											{index === 0 && sortOrder === 'desc' && (
												<FaCrown className="h-4 w-4 text-yellow-500" />
											)}
											<div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
												<span className="text-sm font-medium text-green-600 dark:text-green-400">
													{bid.userName.charAt(0).toUpperCase()}
												</span>
											</div>
											<div>
												<div className="font-medium text-gray-900 dark:text-gray-100">
													€{bid.price}
												</div>
												<div className="text-xs text-gray-500 dark:text-gray-400">
													{bid.userName} • {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</>
					)}
				</CardContent>
			</Card>
		);
	}

	if (!user) {
		return (
			<Card className="rounded-xl shadow-md border-gray-200 dark:border-gray-800">
				<CardHeader className="pb-4">
					<CardTitle className="flex items-center space-x-2 text-lg">
						<FaGavel className="text-green-600 dark:text-green-500" />
						<span>Make a Bid</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-6">
						<p className="text-gray-500 dark:text-gray-400 mb-4">
							Please sign in to place a bid on this item.
						</p>
						<Button variant="default" disabled>
							Sign In to Bid
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="rounded-xl shadow-md border-gray-200 dark:border-gray-800">
			<CardHeader className="pb-4">
				<CardTitle className="flex items-center space-x-2 text-lg">
					<FaGavel className="text-green-600 dark:text-green-500" />
					<span>Make a Bid</span>
					{bids.length > 0 && (
						<Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
							{bids.length} bid{bids.length !== 1 ? 's' : ''}
						</Badge>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Current bid status */}
				{bids.length > 0 && (
					<div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600 dark:text-gray-400">
								Current highest bid:
							</span>
							<span className="font-semibold text-green-600 dark:text-green-400">
								€{highestBid}
							</span>
						</div>
					</div>
				)}

				{/* User's current bid */}
				{userBid && (
					<div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
						<div className="flex items-center justify-between">
							<div>
								<span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
									Your current bid: €{userBid.price}
								</span>
								<div className="text-xs text-gray-500 dark:text-gray-400">
									{formatDistanceToNow(new Date(userBid.createdAt), { addSuffix: true })}
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleDeleteBid(userBid.id)}
								disabled={deleteBidMutation.isPending}
								className="text-red-600 hover:text-red-700 dark:text-red-400"
							>
								<FaTrash className="h-3 w-3" />
							</Button>
						</div>
					</div>
				)}

				{/* Bid form */}
				<div className="space-y-3">
					<div>
						<Label htmlFor="bidAmount" className="text-sm font-medium">
							Your bid (minimum: €{minimumBid})
						</Label>
						<div className="flex space-x-2 mt-1">
							<input
								id="bidAmount"
								type="number"
								value={bidAmount}
								onChange={(e) => setBidAmount(e.target.value)}
								placeholder={`€${minimumBid}`}
								min={minimumBid}
								step="1"
								className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-transparent"
								disabled={submitBidMutation.isPending}
							/>
							<Button
								onClick={handleSubmitBid}
								disabled={submitBidMutation.isPending || !bidAmount}
								className="bg-green-600 hover:bg-green-700"
							>
								{submitBidMutation.isPending ? 'Submitting...' : 'Place Bid'}
							</Button>
						</div>
					</div>

					{isNegotiable && (
						<p className="text-xs text-gray-500 dark:text-gray-400">
							💡 This item is negotiable - the seller may accept lower offers.
						</p>
					)}
				</div>

				{/* Existing bids */}
				{bids.length > 0 && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label className="text-sm font-medium">Recent Bids</Label>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
								className="text-xs"
							>
								<FaSort className="mr-1 h-3 w-3" />
								{sortOrder === 'desc' ? 'Highest first' : 'Lowest first'}
							</Button>
						</div>
						<div className="space-y-2 max-h-48 overflow-y-auto">
							{sortedBids.slice(0, 5).map((bid, index) => (
								<div
									key={bid.id}
									className={`flex items-center justify-between p-2 rounded border ${index === 0 && sortOrder === 'desc'
										? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
										: 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
										}`}
								>
									<div className="flex items-center space-x-2">
										{index === 0 && sortOrder === 'desc' && (
											<FaCrown className="h-4 w-4 text-yellow-500" />
										)}
										<div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
											<span className="text-xs font-medium text-green-600 dark:text-green-400">
												{bid.userName.charAt(0).toUpperCase()}
											</span>
										</div>
										<div>
											<div className="text-sm font-medium text-gray-900 dark:text-gray-100">
												€{bid.price}
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400">
												{formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
											</div>
										</div>
									</div>
								</div>
							))}
							{bids.length > 5 && (
								<p className="text-xs text-gray-500 dark:text-gray-400 text-center">
									... and {bids.length - 5} more bid{bids.length - 5 !== 1 ? 's' : ''}
								</p>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
