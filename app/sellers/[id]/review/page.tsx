"use client";

import { getSeller } from "@/lib/backend/sellers/getSeller";
import { submitReview, SubmitReviewRequest } from "@/lib/backend/reviews/submitReview";
import { AppError } from "@/lib/errorUtils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/contexts/AuthContext";
import { toast } from "sonner";
import {
	FaStar,
	FaUser,
	FaCheckCircle,
	FaShieldAlt,
	FaEdit,
	FaArrowLeft,
	FaInfoCircle,
} from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";

interface ReviewFormData {
	rating: number;
	title: string;
	content: string;
	verifiedPurchase: boolean;
}

const ReviewPage: NextPage = () => {
	const params = useParams();
	const router = useRouter();
	const { user } = useAuth();
	const [formData, setFormData] = useState<ReviewFormData>({
		rating: 4,
		title: "",
		content: "",
		verifiedPurchase: false,
	});

	const [hoveredRating, setHoveredRating] = useState(0);
	const [errors, setErrors] = useState<Record<string, string>>({});

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

	const submitReviewMutation = useMutation({
		mutationFn: (reviewData: SubmitReviewRequest) => submitReview(reviewData),
		onSuccess: (data) => {
			toast.success(data.message);
			router.push(`/sellers/${params.id}`);
		},
		onError: (error: AppError) => {
			toast.error(error.message || "Failed to submit review");
		},
	}); const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (formData.rating < 1 || formData.rating > 5) {
			newErrors.rating = "Rating must be between 1 and 5";
		} else if (formData.rating * 10 % 1 !== 0) {
			newErrors.rating = "Rating must have at most one decimal place";
		}

		if (!formData.title.trim()) {
			newErrors.title = "Review title is required";
		} else if (formData.title.trim().length < 5) {
			newErrors.title = "Title must be at least 5 characters long";
		} else if (formData.title.trim().length > 100) {
			newErrors.title = "Title must be less than 100 characters";
		}

		if (!formData.content.trim()) {
			newErrors.content = "Review content is required";
		} else if (formData.content.trim().length < 20) {
			newErrors.content = "Review must be at least 20 characters long";
		} else if (formData.content.trim().length > 1000) {
			newErrors.content = "Review must be less than 1000 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!user) {
			toast.error("You must be logged in to submit a review");
			return;
		}

		if (!validateForm()) {
			return;
		}

		const reviewData: SubmitReviewRequest = {
			rating: formData.rating,
			title: formData.title.trim(),
			content: formData.content.trim(),
			sellerId: params.id as string,
			verifiedPurchase: formData.verifiedPurchase,
		};

		submitReviewMutation.mutate(reviewData);
	};

	const handleRatingClick = (rating: number) => {
		setFormData(prev => ({ ...prev, rating }));
		if (errors.rating) {
			setErrors(prev => ({ ...prev, rating: "" }));
		}
	};

	const handleRatingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value) || 1;
		const clampedValue = Math.max(1, Math.min(5, value));
		const roundedValue = Math.round(clampedValue * 10) / 10; // Round to 1 decimal place

		setFormData(prev => ({ ...prev, rating: roundedValue }));
		if (errors.rating) {
			setErrors(prev => ({ ...prev, rating: "" }));
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
		}));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: "" }));
		}
	};

	if (isSellerLoading) {
		return (
			<main className="mx-auto px-4 py-22 max-w-7xl">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
					<div className="space-y-4">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
					</div>
				</div>
			</main>
		);
	}

	if (sellerError || !seller) {
		return (
			<main className="mx-auto px-4 py-22 max-w-7xl">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Seller Not Found</h1>
					<p className="text-gray-600 dark:text-gray-400">
						The seller you&apos;re trying to review could not be found.
					</p>
					<Button
						onClick={() => router.back()}
						variant="outline"
						className="mt-4"
					>
						Go Back
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className="mx-auto px-4 py-22 max-w-7xl">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main content area - Takes up 2 columns on desktop */}
				<div className="lg:col-span-2 space-y-6">
					{/* Header */}
					<div className="mb-6">
						<Button
							variant="outline"
							onClick={() => router.back()}
							className="mb-4"
						>
							<FaArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Button>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Write a Review
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Share your experience with <span className="font-semibold">{seller.name}</span>
						</p>
					</div>

					{/* Review Form Card */}
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
						<form onSubmit={handleSubmit} className="space-y-6">
							{user && user.id === seller.id && (
								<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4">
									<div className="flex items-center space-x-2 mb-2">
										<FaInfoCircle className="text-yellow-600 dark:text-yellow-400 h-5 w-5" />
										<h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400">
											Important Notice
										</h2>
									</div>
									<p className="text-yellow-800 dark:text-yellow-400">
										You cannot review your own seller profile. Please choose a different seller.
									</p>
								</div>
							)}
							{/* Rating Section */}
							<div>
								<Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
									Rating <span className="text-red-500">*</span>
								</Label>

								{/* Star Display */}
								<div className="flex items-center space-x-1 mb-4">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											onClick={() => handleRatingClick(star)}
											onMouseEnter={() => setHoveredRating(star)}
											onMouseLeave={() => setHoveredRating(0)}
											className="p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
											aria-label={`Rate ${star} stars`}
										>
											<FaStar
												className={`w-8 h-8 transition-colors duration-200 ${star <= (hoveredRating || Math.ceil(formData.rating))
													? "text-yellow-400"
													: "text-gray-300 dark:text-gray-600"
													}`}
											/>
										</button>
									))}
									<span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
										{formData.rating > 0 ? `${formData.rating} out of 5 stars` : "Select a rating"}
									</span>
								</div>

								{/* Decimal Rating Input */}
								<div className="flex items-center space-x-3">
									<Label htmlFor="ratingInput" className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Precise Rating:
									</Label>									<Input
										type="number"
										id="ratingInput"
										min="1"
										max="5"
										step="0.1"
										value={formData.rating}
										onChange={handleRatingInputChange}
										className={`w-24 ${errors.rating
											? 'border-red-300 focus:ring-red-500 focus:border-red-500'
											: 'focus:ring-green-500 focus:border-green-500'
											}`}
									/>
									<span className="text-sm text-gray-500 dark:text-gray-400">
										(1.0 - 5.0)
									</span>
								</div>

								{errors.rating && (
									<p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.rating}</p>
								)}
							</div>

							{/* Title Section */}
							<div>
								<Label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Review Title <span className="text-red-500">*</span>
								</Label>
								<Input
									type="text"
									id="title"
									name="title"
									value={formData.title}
									onChange={handleInputChange}
									placeholder="Summarize your experience in a few words"
									maxLength={100}
									className={`block w-full px-4 py-6 rounded-md border shadow-sm text-base transition-all duration-200 ease-in-out resize-vertical focus:outline-none
										${errors.title
											? 'border-red-300 focus:ring-red-500 focus:border-red-500'
											: 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500'
										} dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
								/>
								<div className="flex justify-between items-center mt-1">
									{errors.title && (
										<p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>
									)}
									<span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
										{formData.title.length}/100
									</span>
								</div>
							</div>

							{/* Content Section */}
							<div>
								<Label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Your Review <span className="text-red-500">*</span>
								</Label>
								<textarea
									id="content"
									name="content"
									value={formData.content}
									onChange={handleInputChange}
									rows={6}
									maxLength={1000}
									placeholder="Tell others about your experience with this seller. What went well? What could be improved? Be honest and helpful."
									className={`block w-full px-4 py-3 rounded-md border shadow-sm text-base transition-all duration-200 ease-in-out resize-vertical focus:outline-none
										${errors.content
											? 'border-red-300 focus:ring-red-500 focus:border-red-500'
											: 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500'
										} dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
								/>
								<div className="flex justify-between items-center mt-1">
									{errors.content && (
										<p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>
									)}
									<span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
										{formData.content.length}/1000
									</span>
								</div>
							</div>

							{/* Verified Purchase Checkbox */}
							<div className="flex items-start space-x-3">
								<Checkbox
									id="verifiedPurchase"
									name="verifiedPurchase"
									checked={formData.verifiedPurchase}
									onCheckedChange={(checked) => {
										setFormData(prev => ({
											...prev,
											verifiedPurchase: checked === true
										}));
									}}
									className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
								/>
								<div>
									<Label htmlFor="verifiedPurchase" className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Verified Purchase
									</Label>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										Check this if you have actually purchased from this seller
									</p>
								</div>
							</div>

							{/* Submit Section */}
							<div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}
									className="sm:w-auto px-8"
									disabled={submitReviewMutation.isPending}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									className="sm:w-auto px-8 bg-green-600 hover:bg-green-700"
									disabled={submitReviewMutation.isPending || user?.id == seller.id}
								>
									{submitReviewMutation.isPending ? (
										<>
											<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Submitting...
										</>
									) : (
										"Submit Review"
									)}
								</Button>
							</div>
						</form>
					</div>
				</div>

				{/* Sidebar - Takes up 1 column on desktop */}
				<div className="lg:col-span-1">
					<div className="sticky top-20 space-y-6">
						{/* Seller Info Card */}
						<div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
									<FaUser className="text-green-600 dark:text-green-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										{seller.name}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Seller Profile
									</p>
								</div>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600 dark:text-gray-400">Member since</span>
									<span className="text-sm font-medium text-gray-900 dark:text-white">
										{seller.createdAt ? new Date(seller.createdAt).getFullYear() : 'N/A'}
									</span>
								</div>
								{seller.verified && (
									<div className="flex items-center space-x-2">
										<FaCheckCircle className="text-green-500 h-4 w-4" />
										<span className="text-sm text-green-600 dark:text-green-400 font-medium">
											Verified Seller
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Review Guidelines Card */}
						<div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-md p-6 border border-green-200 dark:border-green-800/50">
							<div className="flex items-center space-x-2 mb-4">
								<FaInfoCircle className="text-green-600 dark:text-green-500" />
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Review Guidelines
								</h3>
							</div>
							<ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
								<li className="flex items-start space-x-2">
									<FaCheckCircle className="text-green-500 h-4 w-4 mt-0.5 flex-shrink-0" />
									<span>Be honest and fair in your assessment</span>
								</li>
								<li className="flex items-start space-x-2">
									<FaCheckCircle className="text-green-500 h-4 w-4 mt-0.5 flex-shrink-0" />
									<span>Focus on your experience with the seller</span>
								</li>
								<li className="flex items-start space-x-2">
									<FaCheckCircle className="text-green-500 h-4 w-4 mt-0.5 flex-shrink-0" />
									<span>Avoid personal attacks or inappropriate language</span>
								</li>
								<li className="flex items-start space-x-2">
									<FaCheckCircle className="text-green-500 h-4 w-4 mt-0.5 flex-shrink-0" />
									<span>Include specific details that might help others</span>
								</li>
							</ul>
						</div>						{/* Writing Tips Card */}
						<div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
							<div className="flex items-center space-x-2 mb-4">
								<FaEdit className="text-green-600 dark:text-green-500" />
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Writing Tips
								</h3>
							</div>							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>• Use decimal ratings (e.g., 4.5) for precise scoring (1.0-5.0)</li>
								<li>• Mention product quality and condition</li>
								<li>• Comment on communication and responsiveness</li>
								<li>• Note delivery speed and packaging</li>
								<li>• Share any standout experiences</li>
							</ul>
						</div>

						{/* Trust & Safety Card */}
						<div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
							<div className="flex items-center space-x-2 mb-4">
								<FaShieldAlt className="text-green-600 dark:text-green-500" />
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Trust & Safety
								</h3>
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Your review helps build trust in our community. We moderate all reviews to ensure they meet our guidelines and provide value to other users.
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ReviewPage;
