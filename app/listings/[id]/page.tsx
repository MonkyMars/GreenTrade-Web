"use client";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import {
	FaLeaf,
	FaMapMarkerAlt,
	FaRegClock,
	FaCheckCircle,
	FaStar,
	FaHeart,
	FaRegHeart,
	FaFolder,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FetchedListing } from "@/lib/types/main";
import { SimilairCard } from "./similairCard";
import { findCategory } from "@/lib/functions/categories";
import { useEffect, useState } from "react";
import api from "@/lib/backend/api/axiosConfig";
import { getListings } from "@/lib/backend/listings/getListings";
import { useRouter } from "next/navigation";
import { AppError, retryOperation } from "@/lib/errorUtils";
import { toast } from "sonner";
import { toggleFavorite } from "@/lib/backend/favorites/favorites";
import { useAuth } from "@/lib/contexts/AuthContext";
import { isFavorite } from "@/lib/backend/favorites/getFavorites";
import { findCondition } from "@/lib/functions/conditions";

export default function ListingPage() {
	const router = useRouter();
	const [listing, setListing] = useState<FetchedListing | null>(null);
	const [similarListings, setSimilarListings] = useState<FetchedListing[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const params = useParams();
	const { user } = useAuth();

	useEffect(() => {
		const fetchSimilarListings = async (
			category: string
		): Promise<FetchedListing[]> => {
			try {
				if (process.env.NODE_ENV !== "production") {
					console.log("Fetching similar listings");
				}

				if (!category) {
					return [];
				}

				// Use our retry operation utility with proper error typing
				const response = await retryOperation(
					() => api.get(`/listings/category/${category}`),
					{
						context: "Fetching similar listings",
						maxRetries: 2,
						showToastOnRetry: false, // Don't show toast for these retries
					}
				);

				if (!response.data.success) {
					if (process.env.NODE_ENV !== "production") {
						console.log(response);
					}
					return [];
				}

				return response.data.data;
			} catch (error) {
				// Convert to AppError if not already
				const appError =
					error instanceof AppError
						? error
						: AppError.from(error, "Fetching similar listings");

				// Log in development, use proper error tracking in production
				if (process.env.NODE_ENV !== "production") {
					console.error("Error fetching similar listings:", appError);
				} else {
					// In production, this would use a service like Sentry
					// Example: Sentry.captureException(appError);
				}

				// We don't show toasts for similar listings errors to avoid UI clutter
				// This is a non-critical feature, so we fail gracefully
				return [];
			}
		};

		const fetchData = async () => {
			setIsLoading(true);
			// Show loading toast in production
			const loadingToast =
				process.env.NODE_ENV === "production"
					? toast.loading("Loading listing details...")
					: undefined;

			try {
				// getListings already implements our error handling
				const listingData = (await getListings(
					params.id as string
				)) as FetchedListing;
				setListing(listingData);

				// Fetch similar listings after we have the listing data
				if (listingData && listingData.category) {
					const similarItems = await fetchSimilarListings(listingData.category);
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const all = similarItems as any[];

					const validListings: FetchedListing[] = all.map((listing) => {
						return {
							id: listing.id,
							title: listing.title,
							description: listing.description,
							category: listing.category,
							condition: listing.condition,
							location: listing.location,
							price: listing.price,
							negotiable: listing.negotiable,
							ecoScore: listing.ecoScore,
							ecoAttributes: listing.ecoAttributes,
							imageUrl: listing.imageUrl,
							createdAt: listing.created_at,
							sellerId: listing.seller_id,
							sellerCreatedAt: listing.seller_created_at,
							sellerUsername: listing.seller_username,
							sellerBio: listing.seller_bio,
							sellerRating: listing.seller_rating,
							sellerVerified: listing.seller_verified,
							bids: listing.bids,
						};
					});

					setSimilarListings(validListings);
				}

				// Dismiss loading toast if it exists
				if (loadingToast) {
					toast.dismiss(loadingToast);
				}
			} catch (error) {
				// Dismiss loading toast if it exists
				if (loadingToast) {
					toast.dismiss(loadingToast);
				}

				// Convert to AppError if not already
				const appError =
					error instanceof AppError
						? error
						: AppError.from(error, "Fetching listing details");

				// Log in development, use proper error tracking in production
				if (process.env.NODE_ENV !== "production") {
					console.error("Error fetching listing:", appError);
				} else {
					// In production, this would use a service like Sentry
					// Example: Sentry.captureException(appError);
				}

				// We don't need to show a toast here as getListings already handles error messages
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [params.id]);

	useEffect(() => {
		const fetchFavoriteStatus = async () => {
			if (!listing || !user) return;
			try {
				const isFavorited = await isFavorite(
					listing.id,
					user.id
				)

				if (isFavorited) {
					setListing((prevListing) => {
						if (!prevListing) return null;
						return {
							...prevListing,
							isUserFavorite: isFavorited,
						};
					});
				}
			} catch (error) {
				// Handle error silently, as this is not critical
				console.error("Error fetching favorite status:", error);
			}
		};

		fetchFavoriteStatus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [listing?.id, user])

	const onFavorite = async () => {
		if (!listing || !user) return;
		try {
			const favorite = await toggleFavorite(
				listing.id,
				user.id,
				listing.isUserFavorite as boolean
			)
			setListing((prevListing) => {
				if (!prevListing) return null;
				return {
					...prevListing,
					isUserFavorite: favorite,
				};
			});

		} catch (error) {
			const appError =
				error instanceof AppError
					? error
					: AppError.from(error, "Toggling favorite status");

			// Log in development, use proper error tracking in production
			if (process.env.NODE_ENV !== "production") {
				console.error("Error toggling favorite status:", appError);
			} else {
				// In production, this would use a service like Sentry
				// Example: Sentry.captureException(appError);
			}

			toast.error("Failed to update favorite status");
		}
	};

	if (isLoading) {
		return (
			<div className="mx-auto px-4 py-8 max-w-7xl">
				<div className="flex items-center justify-center h-96">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
						<p className="mt-4 text-gray-600 dark:text-gray-400">
							Loading listing...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!listing) {
		return notFound();
	}

	const listingCategory = listing.category?.toLowerCase() || "Unknown";
	let category = findCategory(listingCategory);

	if (!category) {
		category = { icon: FaFolder, name: "All Categories", id: "all" };
	}

	const condition = findCondition(listing.condition);

	// Format the creation date to show how long ago it was posted
	const timeAgo = listing.createdAt
		? formatDistanceToNow(listing.createdAt, { addSuffix: true })
		: "Recently";
	return (
		<main className="mx-auto px-4 py-22 max-w-7xl">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Image Gallery - Takes up 2 columns on desktop */}
				<div className="lg:col-span-2 space-y-6">
					<div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
						<Tabs defaultValue="0" className="w-full">
							{/* Main image content */}
							<TabsContent value="0" className="m-0">
								<div className="relative h-[400px] md:h-[500px]">
									{listing.imageUrl.length > 0 ? (
										<Image
											src={listing.imageUrl[0]}
											alt={listing.title}
											fill
											priority
											sizes="(max-width: 768px) 100vw, 66vw"
											className="object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
											<p className="text-gray-500 dark:text-gray-400">
												No image available
											</p>
										</div>
									)}
								</div>
							</TabsContent>

							{listing.imageUrl.slice(1).map((img: string, index: number) => (
								<TabsContent
									key={index + 1}
									value={(index + 1).toString()}
									className="m-0"
								>
									<div className="relative h-[400px] md:h-[500px]">
										<Image
											src={img}
											alt={`${listing.title} - image ${index + 2}`}
											fill
											priority
											sizes="(max-width: 768px) 100vw, 66vw"
											className="object-cover"
										/>
									</div>
								</TabsContent>
							))}

							{/* Image thumbnails */}
							<div className="p-4 border-t border-gray-100 dark:border-gray-800">
								<TabsList className="flex justify-start overflow-x-auto space-x-2 py-1 px-0 h-auto bg-gray-50 dark:bg-gray-800 rounded-lg">
									{listing.imageUrl.map((img: string, index: number) => (
										<TabsTrigger
											key={index}
											value={index.toString()}
											className="p-0 rounded-md overflow-hidden data-[state=active]:border-2 data-[state=active]:border-green-500 m-0"
										>
											<div className="relative w-16 h-16">
												<Image
													src={img}
													alt={`Thumbnail ${index + 1}`}
													fill
													sizes="64px"
													className="object-cover"
												/>
											</div>
										</TabsTrigger>
									))}
								</TabsList>
							</div>
						</Tabs>
					</div>

					{/* Description section */}
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
						<div className="flex items-center space-x-2 mb-4">
							<FaLeaf className="text-green-600 dark:text-green-500" />
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
								About This Item
							</h2>
						</div>
						<p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
							{listing.description}
						</p>
					</div>

					{/* Eco Attributes Card */}
					<div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-md p-6 border border-green-200 dark:border-green-800/50">
						<div className="flex items-center space-x-2 mb-4">
							<FaLeaf className="text-green-600 dark:text-green-500" />
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
								Eco-friendly Features
							</h2>
						</div>

						<div className="flex flex-col space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-gray-700 dark:text-gray-300">Eco Score</span>
								<div className="flex items-center">
									<div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-green-300 to-green-600 dark:from-green-800 dark:to-green-500"
											style={{ width: `${(listing.ecoScore / 5) * 100}%` }}
										/>
									</div>
									<span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
										{listing.ecoScore}/5
									</span>
								</div>
							</div>

							<div className="mt-3">
								<span className="text-gray-700 dark:text-gray-300 mb-2 block">
									What makes this item eco-friendly:
								</span>
								<div className="flex flex-wrap gap-2 mt-1">
									{listing.ecoAttributes.map((attr: string, index: number) => (
										<Badge
											key={index}
											className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-900/80"
										>
											<FaLeaf className="mr-1 h-3 w-3" />
											{attr}
										</Badge>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Seller info for mobile - Shows only on mobile */}
					<div className="lg:hidden bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
						<div className="flex items-center space-x-4">
							<div className="relative h-12 w-12 rounded-full bg-primary-500 dark:bg-green-600/60 overflow-hidden">
								{/* Placeholder for seller image */}
								<div className="absolute inset-0 flex items-center justify-center text-green-500 dark:text-green-400 text-xl font-bold">
									{listing.sellerUsername.charAt(0)}
								</div>
							</div>
							<div>
								<h3 className="font-medium text-gray-900 dark:text-gray-100">
									{listing.sellerUsername}
								</h3>
								<div className="flex items-center">
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => {
											const hasHalfStar =
												i + 0.5 === Math.floor(listing.sellerRating) + 0.5 &&
												!Number.isInteger(listing.sellerRating);
											return i < Math.floor(listing.sellerRating) ? (
												<FaStar key={i} className="w-4 h-4 text-yellow-400" />
											) : hasHalfStar ? (
												<div key={i} className="relative">
													<FaStar className="w-4 h-4 text-gray-300 dark:text-gray-600" />
													<div className="absolute top-0 left-0 overflow-hidden w-[50%]">
														<FaStar className="w-4 h-4 text-yellow-400" />
													</div>
												</div>
											) : (
												<FaStar
													key={i}
													className="w-4 h-4 text-gray-300 dark:text-gray-600"
												/>
											);
										})}
									</div>
									<span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
										{listing.sellerRating.toFixed(1)}
									</span>
									{listing.sellerVerified && (
										<Badge
											variant="secondary"
											className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
										>
											<FaCheckCircle className="mr-1 h-3 w-3" />
											Verified
										</Badge>
									)}
								</div>

								<div className="mt-4 space-y-2">
									<Button variant="default" className="w-full">
										Message Seller
									</Button>
									<Button variant="outline" className="w-full">
										View Profile
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Listing Details - Takes up 1 column on desktop */}
				<div className="lg:col-span-1">
					<div className="sticky top-20 space-y-6">
						<div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
							{/* Title and category */}
							<div className="mb-5">
								<div className="flex items-center justify-between">
									<Badge variant="secondary" className="mb-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
										<category.icon className="mr-1 h-4 w-4" />{" "}
										{listing.category}
									</Badge>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full"
										onClick={onFavorite}
									>
										{listing.isUserFavorite ? (
											<FaHeart className="h-5 w-5 text-red-500" />
										) : (
											<FaRegHeart className="h-5 w-5 text-gray-500 dark:text-gray-400" />
										)}
									</Button>
								</div>
								<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
									{listing.title}
								</h1>
							</div>

							{/* Price and negotiable */}
							<div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
								<div className="flex items-end">
									<span className="text-3xl font-bold text-green-700 dark:text-green-400">
										€{listing.price}
									</span>
									{listing.negotiable && (
										<span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
											(Negotiable)
										</span>
									)}
								</div>
							</div>

							{/* Quick details */}
							<div className="space-y-4 mb-6">
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
										<condition.icon size={18} className="text-green-600 dark:text-green-400" />
									</div>
									<div>
										<span className="text-sm text-gray-500 dark:text-gray-400">Condition</span>
										<p className="font-medium text-gray-900 dark:text-gray-100">{condition.name}</p>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
										<FaRegClock size={18} className="text-green-600 dark:text-green-400" />
									</div>
									<div>
										<span className="text-sm text-gray-500 dark:text-gray-400">Posted</span>
										<p className="font-medium text-gray-900 dark:text-gray-100">{timeAgo}</p>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
										<FaMapMarkerAlt size={18} className="text-green-600 dark:text-green-400" />
									</div>
									<div>
										<span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
										<p className="font-medium text-gray-900 dark:text-gray-100">{listing.location}</p>
									</div>
								</div>
							</div>

							{/* Action buttons */}
							<div className="space-y-3">
								<Button className="w-full bg-green-600 hover:bg-green-700">
									Contact Seller
								</Button>
								<Button variant="primaryOutline" className="w-full">
									Make an Offer
								</Button>
								<div className="flex gap-2">
									<Button variant="ghost" className="flex-1 rounded-lg">
										Share
									</Button>
									<Button variant="ghost" className="flex-1 rounded-lg">
										Report
									</Button>
								</div>
							</div>
						</div>

						{/* Seller info for desktop - Hidden on mobile */}
						<div className="hidden lg:block bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
							<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
								<FaCheckCircle className="mr-2 h-4 w-4 text-green-500" />
								Seller Information
							</h3>
							<div className="flex items-center space-x-4">
								<div className="relative h-12 w-12 rounded-full bg-primary-500 dark:bg-green-600/60 overflow-hidden">
									{/* Placeholder for seller image */}
									<div className="absolute inset-0 flex items-center justify-center text-green-500 dark:text-green-400 text-xl font-bold">
										{listing.sellerUsername.charAt(0)}
									</div>
								</div>
								<div>
									<h3 className="font-medium text-gray-900 dark:text-gray-100">
										{listing.sellerUsername}
									</h3>
									<div className="flex items-center">
										<div className="flex items-center">
											{[...Array(5)].map((_, i) => (
												<FaStar
													key={i}
													className={`w-4 h-4 ${i < Math.floor(listing.sellerRating)
														? "text-yellow-400"
														: i < listing.sellerRating
															? "text-yellow-400"
															: "text-gray-300 dark:text-gray-600"
														}`}
												/>
											))}
										</div>
										<span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
											{listing.sellerRating.toFixed(1)}
										</span>
										{listing.sellerVerified && (
											<Badge
												variant="secondary"
												className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
											>
												<FaCheckCircle className="mr-1 h-3 w-3" />
												Verified
											</Badge>
										)}
									</div>

									<div className="mt-4 space-y-2">
										<Button
											variant="outline"
											className="w-full"
											onClick={() =>
												router.replace(`/sellers/${listing.sellerId}`)
											}
										>
											View Profile
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Related listings section - Optional */}
			{similarListings.length > 0 ? (
				<div className="mt-12 w-full p-8 rounded-xl bg-green-50 dark:bg-gray-800/50 border border-green-100 dark:border-green-900/30">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
						<FaLeaf className="mr-2 text-green-600 dark:text-green-500" />
						Similar Listings
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{similarListings.length ? (
							similarListings.map((listing: FetchedListing) => (
								<SimilairCard key={listing.id} listing={listing} />
							))
						) : (
							<div>
								<p className="text-gray-800 dark:text-gray-300">
									No similar listings found
								</p>
							</div>
						)}
					</div>
				</div>
			) : null}
		</main>
	);
}
