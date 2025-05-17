"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FetchedListing } from "@/lib/types/main";
import { FetchedReview } from "@/lib/types/review";
import ListingCard from "@/components/ui/ListingCard";
import ReviewCard from "@/components/ui/ReviewCard";
import { motion } from "framer-motion";
import { FiPackage, FiStar, FiHeart, FiShoppingBag } from "react-icons/fi";

interface ActivityTabsProps {
	userListings: FetchedListing[];
	userReviews: FetchedReview[];
}

const ActivityTabs: React.FC<ActivityTabsProps> = ({ userListings, userReviews }) => {
	const [activeTab, setActiveTab] = useState("listings");

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05
			}
		}
	};

	const item = {
		hidden: { opacity: 0 },
		show: { opacity: 1 }
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
			className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6"
		>
			<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
				Your Activity
			</h2>

			<Tabs
				defaultValue="listings"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="flex items-center overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-4 bg-transparent p-0 justify-start w-full sm:w-auto overflow-visible no-scrollbar">
					<TabsTrigger
						value="listings"
						onClick={() => setActiveTab("listings")}
						className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all duration-200 text-md ${activeTab === "listings"
								? "text-green-600 border-green-600 dark:text-green-400 dark:border-green-400 font-medium"
								: "text-gray-500 border-transparent hover:text-green-600 hover:border-green-300 dark:hover:text-green-400 dark:hover:border-green-800"
							}`}
					>
						<FiPackage className={`h-4 w-4 ${activeTab === "listings" ? "text-green-600 dark:text-green-400" : "text-gray-500"}`} />
						Your Listings
					</TabsTrigger>

					<TabsTrigger
						value="reviews"
						onClick={() => setActiveTab("reviews")}
						className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all duration-200 text-md ${activeTab === "reviews"
								? "text-green-600 border-green-600 dark:text-green-400 dark:border-green-400 font-medium"
								: "text-gray-500 border-transparent hover:text-green-600 hover:border-green-300 dark:hover:text-green-400 dark:hover:border-green-800"
							}`}
					>
						<FiStar className={`h-4 w-4 ${activeTab === "reviews" ? "text-green-600 dark:text-green-400" : "text-gray-500"}`} />
						User Reviews
					</TabsTrigger>

					<TabsTrigger
						value="favorites"
						onClick={() => setActiveTab("favorites")}
						className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all duration-200 text-md ${activeTab === "favorites"
								? "text-green-600 border-green-600 dark:text-green-400 dark:border-green-400 font-medium"
								: "text-gray-500 border-transparent hover:text-green-600 hover:border-green-300 dark:hover:text-green-400 dark:hover:border-green-800"
							}`}
					>
						<FiHeart className={`h-4 w-4 ${activeTab === "favorites" ? "text-green-600 dark:text-green-400" : "text-gray-500"}`} />
						Favorites
					</TabsTrigger>

					<TabsTrigger
						value="purchases"
						onClick={() => setActiveTab("purchases")}
						className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all duration-200 text-md ${activeTab === "purchases"
								? "text-green-600 border-green-600 dark:text-green-400 dark:border-green-400 font-medium"
								: "text-gray-500 border-transparent hover:text-green-600 hover:border-green-300 dark:hover:text-green-400 dark:hover:border-green-800"
							}`}
					>
						<FiShoppingBag className={`h-4 w-4 ${activeTab === "purchases" ? "text-green-600 dark:text-green-400" : "text-gray-500"}`} />
						Purchases
					</TabsTrigger>
				</TabsList>

				<TabsContent value="listings" className="pt-2">
					{userListings && userListings.length > 0 ? (
						<motion.div
							variants={container}
							initial="hidden"
							animate="show"
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
						>
							{userListings.map((listing) => (
								<motion.div key={listing.id} variants={item}>
									<Link href={`/listings/${listing.id}`}>
										<ListingCard listing={listing} viewMode="grid" className="h-full border border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800 transition-colors" />
									</Link>
								</motion.div>
							))}
						</motion.div>
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
						<motion.div
							variants={container}
							initial="hidden"
							animate="show"
							className="space-y-4"
						>
							{userReviews.map((review) => (
								<motion.div key={review.id} variants={item}>
									<ReviewCard review={review} className="border border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800 transition-colors" />
								</motion.div>
							))}
						</motion.div>
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
		</motion.div>
	);
};

export default ActivityTabs;
