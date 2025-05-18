"use client";

// This is a client-side page that allows authorized users to post a new listing to GreenVue.
// It includes a form for entering item details, uploading images, and selecting eco-friendly attributes.

import { useEffect, useState } from "react";
import { z } from "zod";
import { uploadImage } from "@/lib/backend/listings/uploadImage";
import { uploadListing } from "@/lib/backend/listings/uploadListing";
import { FetchedListing, type UploadListing } from "@/lib/types/main";
import { calculateEcoScore } from "@/lib/functions/calculateEcoScore";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "@/lib/contexts/AuthContext";
import { type Categories, categories } from "@/lib/functions/categories";
import { AppError, retryOperation } from "@/lib/errorUtils";
import { toast } from "react-hot-toast";
import { NextPage } from "next";
import { type Condition, conditions } from "@/lib/functions/conditions";
import { FiGrid, FiList } from "react-icons/fi";

// Import components
import FormErrorDisplay from "@/components/post/FormErrorDisplay";
import FormSuccessMessage from "@/components/post/FormSuccessMessage";
import ItemDetailsForm from "@/components/post/ItemDetailsForm";
import PriceLocationForm from "@/components/post/PriceLocationForm";
import ImageUploadForm from "@/components/post/ImageUploadForm";
import EcoAttributesForm from "@/components/post/EcoAttributesForm";
import TermsAndSubmitForm from "@/components/post/TermsAndSubmitForm";
import { type EcoAttributes } from "@/lib/functions/ecoAttributes";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/ui/ListingCard";

// Create a more specific type for category that excludes "All Categories"
type CategoryName = Exclude<Categories["name"], "All Categories">;

const listingSchema = z.object({
	title: z
		.string()
		.min(5, { message: "Title must be at least 5 characters" })
		.max(100, { message: "Title must be at most 100 characters" }),
	description: z
		.string()
		.min(20, { message: "Description must be at least 20 characters" })
		.max(1000, { message: "Description must be at most 1000 characters" }),
	category: z
		.custom<CategoryName>((val) => {
			return categories.some(category => category.name === val && category.name !== "All Categories" && val !== "");
		}, {
			message: "Please select a valid category"
		}),
	condition: z
		.custom<Condition["name"]>((val) => {
			return conditions.some(condition => condition.name === val);
		}, {
			message: "Please select a valid condition"
		}),
	price: z
		.string()
		.refine((val) => val !== "", { message: "Price is required" })
		.refine((val) => !isNaN(Number(val)), { message: "Price must be a number" })
		.refine((val) => Number(val) > 0, {
			message: "Price must be greater than 0",
		}),
	negotiable: z.boolean().default(false),
	ecoAttributes: z.array(z.custom<EcoAttributes>()).default([])
});

export type ListingFormType = z.infer<typeof listingSchema>;

const PostListingPage: NextPage = () => {
	const { user } = useAuth();
	const [formData, setFormData] = useState<ListingFormType>({
		title: "",
		description: "",
		category: "" as CategoryName,
		condition: "" as Condition["name"],
		price: "",
		ecoAttributes: [],
		negotiable: false,
	});
	const [images, setImages] = useState<
		{ uri: string; type?: string; name?: string }[]
	>([]);
	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [ecoScore, setEcoScore] = useState<number>(0);
	const [tab, setTab] = useState<"edit" | "preview">("edit");
	const [previewListing, setPreviewListing] = useState<FetchedListing | null>(null);
	const [previewViewmode, setPreviewView] = useState<"grid" | "list">("grid");

	// Check if user has set their location for posting
	useEffect(() => {
		if (user && user.id) {
			if (!user.location) {
				setErrorMessage("Location required: Please update your profile with a location before posting.");
				toast.error("Missing location information", {
					duration: 5000,
					icon: '📍',
				});
			} else if (errorMessage.includes("location")) {
				// Clear location-related error when user has location
				setErrorMessage("");
			}
		}
	}, [user, errorMessage]);

	// Handle form input changes
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Clear errors for this field when edited
		setFormErrors(formErrors.filter((error) => error.path[0] !== name));
	};

	// Form validation
	const validateForm = () => {
		const result = listingSchema.safeParse(formData);
		if (!result.success) {
			setFormErrors(result.error.issues);
			return false;
		}
		return true;
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			category: "" as CategoryName,
			condition: "" as Condition["name"],
			price: "",
			ecoAttributes: [],
			negotiable: false,
		});
		setImages([]);
		setImageFiles([]);
		setEcoScore(0);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Clear messages
		setFormErrors([]);
		setSuccessMessage("");
		setErrorMessage("");

		const isValid = validateForm();
		if (!isValid) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}

		// Show loading toast
		const loadingToast = toast.loading("Creating your listing...");

		try {
			// Check if user is available
			if (!user || !user.id) {
				throw new AppError("You must be logged in to post a listing", {
					code: "AUTH_REQUIRED",
					status: 401,
					context: "Post Listing",
				});
			}

			// Use retryOperation for image upload with proper error handling
			const imageUrls = await retryOperation(
				() => uploadImage(images, formData.title),
				{
					context: "Image Upload",
					maxRetries: 2,
					showToastOnRetry: true,
				}
			);

			if (!imageUrls) {
				throw new AppError("Failed to upload images", {
					code: "IMAGE_UPLOAD_FAILED",
					context: "Post Listing",
				});
			}

			const listing: UploadListing = {
				title: formData.title,
				description: formData.description,
				category: formData.category,
				condition: formData.condition as Condition["name"],
				price: parseFloat(formData.price),
				negotiable: formData.negotiable,
				ecoAttributes: formData.ecoAttributes,
				ecoScore: calculateEcoScore(formData.ecoAttributes),
				imageUrl: imageUrls.urls,
				sellerId: user.id,
			};

			// Use retryOperation for listing upload with proper error handling
			const uploadResponse = await retryOperation(
				() => uploadListing(listing),
				{
					context: "Upload Listing",
					maxRetries: 1,
					showToastOnRetry: true,
				}
			);

			if (!uploadResponse) {
				throw new AppError("Failed to post listing", {
					code: "LISTING_UPLOAD_FAILED",
					context: "Post Listing",
				});
			}

			// Dismiss loading toast and show success
			toast.dismiss(loadingToast);
			toast.success("Listing posted successfully!");
			setSuccessMessage("Listing posted successfully!");

			// Reset form data on success
			resetForm();
		} catch (error) {
			// Dismiss loading toast
			toast.dismiss(loadingToast);

			// Convert to AppError if not already
			const appError =
				error instanceof AppError
					? error
					: AppError.from(error, "Post Listing");

			// Log in development, use proper error tracking in production
			if (process.env.NODE_ENV !== "production") {
				console.error("Post listing error:", appError);
			} else {
				// In production, this would use a service like Sentry
				// Example: Sentry.captureException(appError);
			}

			// Set appropriate user-friendly error message based on error code/type
			if (appError.code === "AUTH_REQUIRED" || appError.status === 401) {
				setErrorMessage(
					"Authentication required. Please ensure you are logged in."
				);
				toast.error("Authentication required");
			} else if (appError.code === "IMAGE_UPLOAD_FAILED") {
				setErrorMessage(
					"Failed to upload images. Please try again with different images or check your connection."
				);
				toast.error("Image upload failed");
			} else if (appError.code === "LISTING_UPLOAD_FAILED") {
				setErrorMessage("Failed to post your listing. Please try again.");
				toast.error("Listing upload failed");
			} else if (
				appError.validationErrors &&
				Object.keys(appError.validationErrors).length > 0
			) {
				const validationMessages = Object.values(appError.validationErrors)
					.flat()
					.join(", ");
				setErrorMessage(`Validation error: ${validationMessages}`);
				toast.error("Please check your listing information");
			} else if (appError.message) {
				setErrorMessage(`Failed to post listing: ${appError.message}`);
				toast.error(appError.message);
			} else {
				setErrorMessage(
					"An unexpected error occurred. Please try again later."
				);
				toast.error("Something went wrong");
			}
		} finally {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleTabChange = (newTab: "edit" | "preview") => {
		if (newTab === tab) {
			return;
		}

		if (newTab === "preview") {
			const previewListing: FetchedListing = {
				...formData,
				price: parseFloat(formData.price) || 0,
				ecoScore: calculateEcoScore(formData.ecoAttributes),
				imageUrl: images.map((image) => image.uri),
				sellerId: user?.id || "",
				id: "",
				createdAt: new Date().toISOString(),
				location: user?.location || "",
				sellerUsername: user?.name || "",
				sellerBio: user?.bio || "",
				sellerCreatedAt: user?.createdAt || new Date().toLocaleDateString(),
				sellerRating: 0,
				sellerVerified: false
			};
			setPreviewListing(previewListing);
		};

		setTab(newTab);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<ProtectedRoute>
			<main className="pt-16 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="my-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							Post a New Listing
						</h1>
						<p className="mt-2 text-gray-600 dark:text-gray-400">
							Share your sustainable item with the community
						</p>
					</div>

					<FormSuccessMessage successMessage={successMessage} />
					<FormErrorDisplay formErrors={formErrors} errorMessage={errorMessage} />

					<form onSubmit={handleSubmit}>
						<Button variant={'ghost'} type="button" className="rounded-sm" onClick={() => handleTabChange("edit")}>Edit</Button>
						<Button variant={'ghost'} type="button" className="rounded-sm" onClick={() => handleTabChange("preview")}>Preview</Button>

						{/* Tab content */}
						{tab === "edit" && (
							<>
								{/* Item Details */}
								<ItemDetailsForm
									formData={formData}
									handleChange={handleChange}
									setFormData={setFormData}
									formErrors={formErrors}
								/>

								{/* Price & Location */}
								<PriceLocationForm
									formData={formData}
									handleChange={handleChange}
									setFormData={setFormData}
									formErrors={formErrors}
									user={user}
								/>

								{/* Images */}
								<ImageUploadForm
									images={images}
									setImages={setImages}
									imageFiles={imageFiles}
									setImageFiles={setImageFiles}
									uploading={uploading}
									setUploading={setUploading}
									formErrors={formErrors}
								/>

								{/* Eco-friendly Attributes */}
								<EcoAttributesForm
									formData={formData}
									setFormData={setFormData}
									ecoScore={ecoScore}
									setEcoScore={setEcoScore}
									formErrors={formErrors}
								/>

								{/* Terms and Submit */}
								<TermsAndSubmitForm onSubmit={handleSubmit} />
							</>
						)}

						{/* Information Tab */}
						{tab === "preview" && previewListing && (
							<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
								<h2 className="text-xl font-bold mb-4">Preview</h2>
								<div className="flex justify-between mb-4 border-b border-gray-200 dark:border-gray-700 ">
									<Button variant={'ghost'} type="button" className="rounded-sm" onClick={() => handleTabChange("edit")}>Edit</Button>
									<div className="hidden sm:flex items-center gap-1 rounded-md p-0.5">
										<button
											onClick={() => setPreviewView("grid")}
											className={`p-1.5 rounded ${previewViewmode === "grid"
												? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-300 shadow-sm"
												: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
												}`}
											aria-label="Grid view"
											type="button"
										>
											<FiGrid className="h-5 w-5" />
										</button>
										<button
											onClick={() => setPreviewView("list")}
											className={`p-1.5 rounded ${previewViewmode === "list"
												? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-300 shadow-sm"
												: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
												}`}
											aria-label="List view"
											type="button"
										>
											<FiList className="h-5 w-5" />
										</button>
									</div>
								</div>
								<ListingCard
									listing={previewListing}
									viewMode={previewViewmode}
									className="mb-4 max-w-[300px] mx-auto"
								/>
							</div>
						)}
					</form>
				</div>
			</main>
		</ProtectedRoute>
	);
};

export default PostListingPage;
