"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
	FaUser,
	FaStore,
	FaShieldAlt,
	FaTrash,
	FaKey,
	FaSignOutAlt,
	FaCheck,
	FaExclamationTriangle,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/lib/types/user";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/contexts/AuthContext";
import Link from "next/link";
import { getSellerListings } from "@/lib/backend/listings/getListings";
import { FetchedListing } from "@/lib/types/main";
import ListingCard from "@/components/ui/ListingCard";
import { calculateAverageEcoScore } from "@/lib/functions/calculateEcoScore";
import { getReviews } from "@/lib/backend/reviews/getReviews";
import { FetchedReview } from "@/lib/types/review";
import ReviewCard from "@/components/ui/ReviewCard";
import api from "@/lib/backend/api/axiosConfig";
import { NextPage } from "next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCountriesInEurope } from "@/lib/functions/countries";

interface ActiveTab {
	activeTab: "profile" | "seller" | "security" | "delete";
}

const AccountPage: NextPage = () => {
	const router = useRouter();
	const {
		user: authUser,
		logout,
		loading: authLoading,
		isAuthenticated,
	} = useAuth();
	const [location, setLocation] = useState<{ city: string; country: string }>({
		city: "",
		country: "",
	});
	const [user, setUser] = useState<User>({
		id: "",
		name: "",
		email: "",
		location: `${location.city}, ${location.country}`,
		profileUrl: "",
		createdAt: "",
		emailVerified: false,
	});
	const [activeTab, setActiveTab] = useState<ActiveTab["activeTab"]>("profile");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState("");
	const [userListings, setUserListings] = useState<FetchedListing[]>([]);
	const [userReviews, setUserReviews] = useState<FetchedReview[]>([]);

	// Add this new useEffect at the beginning of the component after the state declarations
	// This will ensure the city and country values are properly initialized on mount
	useEffect(() => {
		// This useEffect only runs once on component mount to ensure the user data is fully populated
		if (authUser?.location) {
			const [cityPart = "", countryPart = ""] = authUser.location.split(", ");

			// Only update if we have actual values
			if (cityPart || countryPart) {
				setLocation({
					city: cityPart,
					country: countryPart
				});
			}
		}
		console.log(authUser?.location)
	}, [authUser?.location]);  // Empty dependency array means this runs once on mount

	useEffect(() => {
		if (!authLoading) {
			if (authUser) {
				// Parse location from authUser if available
				const cityFromAuth = authUser.location?.split(", ")[0] || "";
				const countryFromAuth = authUser.location?.split(", ")[1] || "";

				// Update location state
				setLocation({
					city: cityFromAuth,
					country: countryFromAuth
				});

				// Update the user state with data from AuthContext
				setUser({
					...user,
					id: authUser.id || "",
					name: authUser.name || "",
					email: authUser.email || "",
					location: authUser.location || `${cityFromAuth}, ${countryFromAuth}`,
					profileUrl: authUser.profileUrl || "",
					createdAt: authUser.createdAt || "",
				});
			} else if (isAuthenticated) {
				// We're authenticated but don't have user data yet
				console.log(
					"Authenticated but no user data available yet - waiting for data"
				);
				// Could potentially trigger a refresh of user data here if needed
			} else {
				console.log("Not authenticated and no user data available");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authUser, authLoading, isAuthenticated]);

	useEffect(() => {
		// Update the user object whenever location state changes
		if (location.city && location.country) {
			setUser(prevUser => ({
				...prevUser,
				location: `${location.city}, ${location.country}`
			}));
		}
	}, [location.city, location.country]);

	const handleLogout = async () => {
		logout(); // need to improve logout handling with a
	};

	const handleDeleteAccount = async () => {
		try {
			const response = await api.delete(
				`/user/delete`,
			);

			if (!response.data.success) {
				throw new Error("Failed to delete account");
			}

			// Logout using the auth context
			logout();

			// Redirect to home page with message
			router.push("/?deleted=true");
		} catch (error) {
			console.error("Error deleting account:", error);
		}
	};

	useEffect(() => {
		const fetchUserlisings = async () => {
			try {
				const data = await getSellerListings(user.id);
				if (data.length > 0) {
					setUserListings(data);
				}
			} catch (error) {
				console.error("Error fetching user listings:", error);
			}
		};

		const fetchUserReviews = async () => {
			try {
				const data = await getReviews(user.id);
				if (data.length > 0) {
					setUserReviews(data);
				}
			} catch (error) {
				console.error("Error fetching user reviews:", error);
			}
		};

		if (user.id) {
			fetchUserlisings();
			fetchUserReviews();
		}
	}, [user]);

	const handleUdateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());

		// Combine city and country to create a properly formatted location string
		data.location = `${location.city}, ${location.country}`;

		try {
			const response = await api.patch(`/user/update`, data);

			if (!response.data.success) {
				throw new Error("Failed to update user data");
			}

			// Update local user state with the new data
			setUser({
				...user,
				...data,
				location: data.location
			});

			setUpdateSuccess("User data updated successfully!");
		} catch (error) {
			console.error("Error updating user data:", error);
		}
	};

	const countries = fetchCountriesInEurope();

	return (
		<ProtectedRoute>
			<div className="container mx-auto px-4 py-22 max-w-6xl">
				<div className="flex flex-col md:flex-row gap-8">
					{/* Sidebar */}
					<div className="md:w-64 flex-shrink-0">
						<div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
							<div className="flex flex-col items-center">
								<div className="relative h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-4">
									{user?.profileImage ? (
										<Image
											src={user.profileImage}
											alt={user.name}
											fill
											className="object-cover"
										/>
									) : (
										<div className="absolute inset-0 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-4xl font-bold">
											{user?.name?.charAt(0).toUpperCase()}
										</div>
									)}
								</div>
								<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
									{user?.name}
								</h2>
								<p className="text-gray-600 dark:text-gray-400 mb-3">
									{user?.email}
								</p>

								{userListings.length > 0 && (
									<Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800">
										<FaStore className="mr-1 h-3 w-3" />
										Seller
									</Badge>
								)}

								<div className="w-full mt-2">
									<Button
										variant="outline"
										className={`w-full mb-2 relative justify-between ${activeTab === "profile" ? "bg-green-400 border-none text-gray-800 dark:bg-green-800 dark:text-white hover:bg-green-500 hover:dark:bg-green-900" : ""}`}
										onClick={() => setActiveTab("profile")}
									>
										<FaUser className="mr-2 left-2 relative h-4 w-4" />
										Profile
										<p></p>
									</Button>
									<Button
										variant="outline"
										className={`w-full mb-2 relative justify-between ${activeTab === "security" ? "bg-green-400 border-none text-gray-800 dark:bg-green-800 dark:text-white hover:bg-green-500 hover:dark:bg-green-900" : ""}`}
										onClick={() => setActiveTab("security")}
									>
										<FaShieldAlt className="mr-2 left-2 relative h-4 w-4" />
										Security
										<p></p>
									</Button>
									<Button
										variant="outline"
										className={`w-full mb-2 relative justify-between ${activeTab === "delete" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-none hover:bg-red-200 dark:hover:bg-red-800/70" : ""}`}
										onClick={() => setActiveTab("delete")}
									>
										<FaTrash className="mr-2 left-2 relative h-4 w-4 text-red-500" />
										Delete Account
										<p></p>
									</Button>
									<Button
										variant="ghost"
										className="w-full shadow-xl mb-2 relative justify-between bg-white/90 text-gray-900 dark:bg-gray-900/80 dark:text-white"
										onClick={handleLogout}
									>
										<FaSignOutAlt className="mr-2 left-2 relative h-4 w-4 text-red-500" />
										Log Out
										<p></p>
									</Button>
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
							<h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
								Account Summary
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-400">
										Member since
									</span>
									<span className="font-medium text-gray-900 dark:text-white">
										{new Date(
											user?.createdAt || Date.now()
										).toLocaleDateString()}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-400">
										Listings
									</span>
									<span className="font-medium text-gray-900 dark:text-white">
										{userListings.length || 0}
									</span>
								</div>
								{userListings.length > 0 && (
									<div className="flex justify-between text-sm">
										<span className="text-gray-600 dark:text-gray-400">
											Eco Score
										</span>
										<span className="font-medium text-green-600">
											{calculateAverageEcoScore(userListings) || 0}/5
										</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1">
						{updateSuccess && (
							<div
								className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded-md mb-6"
								role="alert"
							>
								<div className="flex items-center">
									<FaCheck className="h-4 w-4 mr-2" />
									<span>{updateSuccess}</span>
								</div>
							</div>
						)}

						{activeTab === "profile" && (
							<div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
								<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
									<FaUser className="mr-2 h-5 w-5 text-green-600" />
									Profile Information
								</h2>

								<form className="space-y-6" onSubmit={handleUdateUser}>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label
												htmlFor="name"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
											>
												Full Name
											</label>
											<input
												type="text"
												id="name"
												name="name"
												defaultValue={user?.name}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
											/>
										</div>

										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
											>
												Email Address
											</label>
											<input
												type="email"
												id="email"
												name="email"
												defaultValue={user?.email}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
												disabled
											/>
											<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
												Email cannot be changed
											</p>
										</div>

										<div className="block">
											<div className="flex items-center justify-between">
												<label
													htmlFor="city"
													className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
												>
													City
												</label>
												<label
													htmlFor="country"
													className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
												>
													Country
												</label>
											</div>
											<div className="flex items-center justify-center gap-2">
												<input
													type="text"
													id="city"
													name="city"
													value={location.city || ""}
													onChange={(e) => setLocation({ ...location, city: e.target.value })}
													placeholder="Enter your city"
													className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
												/>
												<Select
													value={location.country || ""}
													onValueChange={(value) => setLocation({ ...location, country: value })}
												>
													<SelectTrigger id="country" className="w-full px-3 py-5 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white">
														<SelectValue placeholder="Select country" />
													</SelectTrigger>
													<SelectContent className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-none mt-3">
														{countries.map((country, index) => (
															<SelectItem
																value={country.name}
																key={index}
															>
																{country.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											{/* Preview of the combined location */}
											<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
												Your location will be saved as: {location.city && location.country ? `${location.city}, ${location.country}` : "Not set yet"}
											</p>
										</div>

										<div>
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
											>
												Phone Number
											</label>
											<input
												type="tel"
												id="phone"
												name="phone"
												defaultValue={user?.phone || ""}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="bio"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
										>
											Bio
										</label>
										<textarea
											id="bio"
											name="bio"
											rows={4}
											defaultValue={user?.bio || ""}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
										></textarea>
									</div>

									{/* <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Image
                  </label>
                  <div className="flex items-center mt-2">
                    <div className="relative h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                      {user?.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-2xl font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <FaEdit className="mr-2 h-4 w-4" />
                      Change Image
                    </Button>
                  </div>
                </div> */}

									<div className="flex justify-end">
										<Button type="submit">Save Changes</Button>
									</div>
								</form>
							</div>
						)}

						{activeTab === "security" && (
							<div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
								<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
									<FaShieldAlt className="mr-2 h-5 w-5 text-green-600" />
									Security Settings
								</h2>

								<div className="space-y-6">
									<div>
										<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
											Change Password
										</h3>
										<div className="space-y-4">
											<div>
												<label
													htmlFor="currentPassword"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
												>
													Current Password
												</label>
												<input
													type="password"
													id="currentPassword"
													name="currentPassword"
													className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
												/>
											</div>

											<div>
												<label
													htmlFor="newPassword"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
												>
													New Password
												</label>
												<input
													type="password"
													id="newPassword"
													name="newPassword"
													className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
												/>
											</div>

											<div>
												<label
													htmlFor="confirmPassword"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
												>
													Confirm New Password
												</label>
												<input
													type="password"
													id="confirmPassword"
													name="confirmPassword"
													className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
												/>
											</div>
										</div>

										<div className="flex justify-end mt-4">
											<Button>
												<FaKey className="mr-2 h-4 w-4" />
												Change Password
											</Button>
										</div>
									</div>

									<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
										<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
											Login Sessions
										</h3>
										<p className="text-gray-600 dark:text-gray-400 mb-4">
											Manage your active login sessions. If you notice any
											suspicious activity, log out of all devices immediately.
										</p>

										<Button variant="outline" className="w-full sm:w-auto">
											Log out of all devices
										</Button>
									</div>
								</div>
							</div>
						)}

						{activeTab === "delete" && (
							<div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
								<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
									<FaTrash className="mr-2 h-5 w-5 text-red-500" />
									Delete Account
								</h2>

								<div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-200 dark:border-red-900 mb-6">
									<div className="flex items-start">
										<FaExclamationTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
										<div>
											<h3 className="text-md font-medium text-red-800 dark:text-red-300 mb-2">
												Warning: This action cannot be undone
											</h3>
											<p className="text-gray-700 dark:text-gray-400">
												Deleting your account will permanently remove all your
												data, including listings, messages, and purchase
												history. Your account cannot be recovered after
												deletion.
											</p>
										</div>
									</div>
								</div>

								{!showDeleteConfirm ? (
									<Button
										variant="destructive"
										className="bg-red-600 hover:bg-red-700 text-white"
										onClick={() => setShowDeleteConfirm(true)}
									>
										<FaTrash className="mr-2 h-4 w-4" />
										Delete My Account
									</Button>
								) : (
									<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
										<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
											Confirm Account Deletion
										</h3>
										<p className="text-gray-600 dark:text-gray-400 mb-4">
											Please type <strong>delete my account</strong> below to
											confirm:
										</p>

										<div className="mb-4">
											<input
												type="text"
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white"
												placeholder="delete my account"
											/>
										</div>

										<div className="flex space-x-4">
											<Button
												variant="destructive"
												className="bg-red-600 hover:bg-red-700 text-white"
												onClick={handleDeleteAccount}
											>
												Permanently Delete Account
											</Button>
											<Button
												variant="outline"
												onClick={() => setShowDeleteConfirm(false)}
											>
												Cancel
											</Button>
										</div>
									</div>
								)}
							</div>
						)}

						{/* Activity and Recent Listings */}
						{activeTab === "profile" && (
							<div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
								<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
									Your Activity
								</h2>

								<Tabs defaultValue="listings">
									<TabsList>
										<TabsTrigger value="listings">Your Listings</TabsTrigger>
										<TabsTrigger value="reviews">User Reviews</TabsTrigger>
										<TabsTrigger value="favorites">Favorites</TabsTrigger>
										<TabsTrigger value="purchases">Purchases</TabsTrigger>
									</TabsList>

									<TabsContent value="listings" className="pt-4">
										{userListings.length > 0 ? (
											<div className="space-y-4">
												{/* Listing cards would go here */}
												{userListings.map((listing, index) => (
													<ListingCard
														listing={listing}
														key={index}
														viewMode="list"
													/>
												))}
											</div>
										) : (
											<div className="text-center py-6">
												<p className="text-gray-600 dark:text-gray-400 mb-4">
													You haven&apos;t created any listings yet.
												</p>
												<Button>
													<Link href={"/post"} prefetch>
														Create Your First Listing
													</Link>
												</Button>
											</div>
										)}
									</TabsContent>

									<TabsContent value="favorites" className="pt-4">
										<div className="text-center py-6">
											<p className="text-gray-600 dark:text-gray-400">
												You haven&apos;t saved any favorites yet.
											</p>
										</div>
									</TabsContent>

									<TabsContent value="purchases" className="pt-4">
										<div className="text-center py-6">
											<p className="text-gray-600 dark:text-gray-400">
												No purchase history available.
											</p>
										</div>
									</TabsContent>

									<TabsContent value="reviews">
										<div className="py-3 pb-6">
											{userReviews.length > 0 ? (
												<div className="space-y-4">
													<p className="text-gray-800 dark:text-gray-400">
														What other users say about you:
													</p>
													<div>
														{userReviews.map((review, index) => (
															<ReviewCard
																review={review}
																key={index}
																className="mb-4"
															/>
														))}
													</div>
												</div>
											) : (
												<div>
													<p className="text-gray-800 dark:text-gray-800"></p>
												</div>
											)}
										</div>
									</TabsContent>
								</Tabs>
							</div>
						)}
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}

export default AccountPage;