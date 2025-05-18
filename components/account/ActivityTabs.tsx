"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FetchedListing } from "@/lib/types/main";
import { FetchedReview } from "@/lib/types/review";
import ListingCard from "@/components/ui/ListingCard";
import ReviewCard from "@/components/ui/ReviewCard";
import { FiPackage, FiStar, FiHeart, FiShoppingBag } from "react-icons/fi";
import { cn } from "@/lib/functions/cn";

interface ActivityTabsProps {
	userListings: FetchedListing[];
	userReviews: FetchedReview[];
}

const ActivityTabs: React.FC<ActivityTabsProps> = ({ userListings, userReviews }) => {
	const [activeTab, setActiveTab] = useState("listings");

	// Common classes for tabs
	const baseTabClasses = "flex items-center gap-2 px-4 py-2 rounded-t rounded-b-none border-b-2 transition-all duration-200 text-md";
	const activeTabClasses = "text-green-600 dark:bg-green-900/20! bg-green-300/20! border-green-600 dark:text-green-400 dark:border-green-400 font-medium";
	const inactiveTabClasses = "text-gray-500 border-transparent hover:text-green-600 hover:border-green-300 dark:hover:text-green-400 dark:hover:border-green-800";

	// Common classes for icons
	const getIconClasses = (tab: string) => cn(
		"h-4 w-4",
		activeTab === tab ? "text-green-600 dark:text-green-400" : "text-gray-500"
	);

	return (
		<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded">
			<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
				Your Activity
			</h2>

			<Tabs
				defaultValue="listings"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="flex items-center overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-4 bg-transparent p-0 justify-start w-full sm:w-auto no-scrollbar">
					<TabsTrigger
						value="listings"
						onClick={() => setActiveTab("listings")}
						className={cn(
							baseTabClasses,
							activeTab === "listings"
								? activeTabClasses
								: inactiveTabClasses
						)}
					>
						<FiPackage className={getIconClasses("listings")} />
						Your Listings
					</TabsTrigger>

					<TabsTrigger
						value="reviews"
						onClick={() => setActiveTab("reviews")}
						className={cn(
							baseTabClasses,
							activeTab === "reviews" ? activeTabClasses : inactiveTabClasses
						)}
					>
						<FiStar className={getIconClasses("reviews")} />
						User Reviews
					</TabsTrigger>

					<TabsTrigger
						value="favorites"
						onClick={() => setActiveTab("favorites")}
						className={cn(
							baseTabClasses,
							activeTab === "favorites" ? activeTabClasses : inactiveTabClasses
						)}
					>
						<FiHeart className={getIconClasses("favorites")} />
						Favorites
					</TabsTrigger>

					<TabsTrigger
						value="purchases"
						onClick={() => setActiveTab("purchases")}
						className={cn(
							baseTabClasses,
							activeTab === "purchases" ? activeTabClasses : inactiveTabClasses
						)}
					>
						<FiShoppingBag className={getIconClasses("purchases")} />
						Purchases
					</TabsTrigger>
				</TabsList>

				<TabsContent value="listings" className="pt-2">
					{userListings && userListings.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{userListings.map((listing) => (
								<div key={listing.id}>
									<ListingCard listing={listing} viewMode="grid" className="h-full border border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800 transition-colors" />
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900/50">
							<p className="text-gray-500 dark:text-gray-400">You don&apos;t have any listings yet.</p>
							<Button variant="default" className="mt-4 bg-green-600 hover:bg-green-700 text-white border border-green-600 hover:border-green-700 dark:bg-green-700 dark:hover:bg-green-800 dark:border-green-700 dark:hover:border-green-800 transition-colors">
								<Link href="/post">Create a Listing</Link>
							</Button>
						</div>
					)}
				</TabsContent>

				<TabsContent value="reviews" className="pt-2">
					{userReviews && userReviews.length > 0 ? (
						<div className="space-y-4">
							{userReviews.map((review) => (
								<div key={review.id}>
									<ReviewCard review={review} className="border border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800 transition-colors" />
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900/50">
							<p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
						</div>
					)}
				</TabsContent>

				<TabsContent value="favorites" className="pt-2">
					<div className="text-center py-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900/50">
						<p className="text-gray-500 dark:text-gray-400">Your favorites will appear here.</p>
						<Button variant="outline" className="mt-4 border border-gray-300 dark:border-gray-700 hover:border-green-500 hover:text-green-600 dark:hover:border-green-700 dark:hover:text-green-500 transition-colors">
							<Link href="/browse">Browse Listings</Link>
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="purchases" className="pt-2">
					<div className="text-center py-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900/50">
						<p className="text-gray-500 dark:text-gray-400">Your purchase history will appear here.</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ActivityTabs;
