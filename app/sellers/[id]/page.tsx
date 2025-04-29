"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { FaStar, FaCheckCircle, FaRegClock, FaEnvelope } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Seller } from "@/lib/types/seller";
import { FetchedListing } from "@/lib/types/main";
import { getSellerListings } from "@/lib/backend/listings/getListings";
import ListingCard from "@/components/ui/ListingCard";
import api from "@/lib/backend/api/axiosConfig";
import { toast } from "react-hot-toast";
import { AppError, retryOperation } from "@/lib/errorUtils";
import { getReviews } from "@/lib/backend/reviews/getReviews";
import { FetchedReview } from "@/lib/types/review";
import ReviewCard from "@/components/ui/ReviewCard";
import { NextPage } from "next";

const SellerPage: NextPage = () => {
  const router = useRouter();
  const params = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<FetchedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sellerReviews, setSellerReviews] = useState<FetchedReview[]>([]);

  useEffect(() => {
    const fetchSellerData = async () => {
      setIsLoading(true);

      // Show loading toast for better UX
      const loadingToast = toast.loading("Loading seller profile...");

      try {
        // Fetch seller information with retry logic and proper error typing
        const response = await retryOperation(
          () => api.get(`/seller/${params.id}`),
          {
            context: "Fetching seller profile",
            maxRetries: 3,
            showToastOnRetry: false, // We have our own loading toast
          }
        );

        if (!response.data || !response.data.success) {
          throw new AppError(
            response.data?.message || "Failed to fetch seller",
            {
              code: "FETCH_FAILED",
              status: response.status,
            }
          );
        }

        if (process.env.NODE_ENV !== "production") {
          console.log(response.data.data);
        }

        const sellerObject: Seller = {
          id: response.data.data.id,
          name: response.data.data.name,
          bio: response.data.data.bio,
          rating: response.data.data.rating,
          verified: response.data.data.verified,
          createdAt: response.data.data.created_at,
        };

        setSeller(sellerObject);

        // Fetch seller's listings - getSellerListings already has retry and error handling
        const sellerListings = await getSellerListings(params.id as string);
        setListings(sellerListings as FetchedListing[]);

        // Dismiss the loading toast
        toast.dismiss(loadingToast);
      } catch (error) {
        // Dismiss the loading toast
        toast.dismiss(loadingToast);

        // Convert to AppError if not already
        const appError =
          error instanceof AppError
            ? error
            : AppError.from(error, "Fetching seller profile");

        // Handle error properly with user feedback
        let errorMessage = "Failed to load seller profile. Please try again.";

        if (appError.status === 404) {
          errorMessage = "Seller not found.";
        } else if (appError.message) {
          errorMessage = appError.message;
        }

        // Show error to user
        toast.error(errorMessage);

        // Log in development, use proper error tracking in production
        if (process.env.NODE_ENV !== "production") {
          console.error("Error fetching seller data:", appError);
        } else {
          // In production, this would use a service like Sentry
          // Example: Sentry.captureException(appError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchSellerData();
    }
  }, [params.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    // Prevent double-submission
    if (sendingMessage) return;

    setSendingMessage(true);
    const loadingToast = toast.loading("Sending message...");

    // This would integrate with your messaging system
    try {
      // Example API call with retry logic and proper error typing
      await retryOperation(
        () =>
          api.post("/messages", {
            sellerId: seller?.id,
            message,
          }),
        {
          context: "Sending message",
          maxRetries: 3,
          showToastOnRetry: false, // We have our own loading toast
        }
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success message
      toast.success("Message sent successfully!");

      // Reset form
      setMessage("");
      setMessageOpen(false);
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Convert to AppError if not already
      const appError =
        error instanceof AppError
          ? error
          : AppError.from(error, "Sending message");

      // Handle error properly with user feedback
      let errorMessage = "Failed to send message. Please try again.";

      if (appError.status === 401) {
        errorMessage = "Please log in to send messages.";
      } else if (appError.message) {
        errorMessage = appError.message;
      }

      // Show error to user
      toast.error(errorMessage);

      // Log in development, use proper error tracking in production
      if (process.env.NODE_ENV !== "production") {
        console.error("Error sending message:", appError);
      } else {
        // In production, this would use a service like Sentry
        // Example: Sentry.captureException(appError);
      }
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMessageOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchSellerReviews = async () => {
      if (seller) {
        try {
          const data = await getReviews(seller.id);
          if (!data) {
            throw new AppError("Failed to fetch reviews", {
              code: "FETCH_FAILED",
              status: 500,
            });
          }

          setSellerReviews(data);
        } catch (error) {
          const appError =
            error instanceof AppError
              ? error
              : AppError.from(error, "Fetching seller reviews");
          if (process.env.NODE_ENV !== "production") {
            console.error("Error fetching seller reviews:", appError);
          }
        }
      }
    };
    fetchSellerReviews();
  }, [seller]);

  if (isLoading) {
    return (
      <div className="mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading seller profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Seller not found
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The seller you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push("/browse")} className="mt-4">
            Browse Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-22 max-w-7xl">
      {/* Seller Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex gap-6 items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="relative h-24 w-24 rounded-full bg-green-200 dark:bg-green-700/70 overflow-hidden">
              {/* Placeholder for seller image */}
              <div className="absolute inset-0 flex items-center justify-center text-green-500 dark:text-green-400 text-3xl font-bold">
                {seller.name.charAt(0)}
              </div>
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mr-2">
                {seller.name}
              </h1>
              {seller.verified && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <FaCheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`h-4 w-4 ${
                      index < Math.floor(seller.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  {seller.rating.toFixed(1)} <span className="text-gray-500 dark:text-gray-400">(based on {sellerReviews.length}{" "} review{sellerReviews.length !== 1 ? "s" : ""})</span>
                </span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <FaRegClock className="h-4 w-4 mr-1" />
                <span>
                  Member since {format(new Date(seller.createdAt), "MMMM yyyy")}
                </span>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {seller.bio || "This seller hasn't added a bio yet."}
            </p>

            <Button
              onClick={() => setMessageOpen(!messageOpen)}
              className="flex items-center"
            >
              <FaEnvelope className="mr-2 h-4 w-4" />
              Message Seller
            </Button>
          </div>
        </div>

        {/* Message Form */}
        {messageOpen && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Send a Message
            </h3>
            <form onSubmit={handleSendMessage}>
              <textarea
                className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 resize-none"
                rows={4}
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-end mt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMessageOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit">Send Message</Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Seller's Listings Section */}
      <div className="space-y-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Listings from {seller.name}
        </h2>

        {listings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              This seller doesn&apos;t have any active listings at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <div
                key={listing.id}
                className="transform transition duration-300 hover:scale-102 hover:shadow-lg"
              >
                <ListingCard
                  listing={listing}
                  viewMode="grid"
                  className="h-full"
                  key={index}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Reviews about {seller.name}
        </h2>

        {sellerReviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              This seller has no reviews yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerReviews.map((review, index) => (
              <div
                key={review.id}
                className="transform transition duration-300 hover:scale-102 hover:shadow-lg"
              >
                <ReviewCard
                  review={review}
                  className="h-full"
                  key={index}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerPage;