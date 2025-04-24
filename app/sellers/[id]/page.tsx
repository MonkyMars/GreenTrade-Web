"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  FaStar, 
  FaCheckCircle, 
  FaRegClock, 
  FaEnvelope
} from "react-icons/fa";
import { Button } from "@/app/components/UI/button";
import { Badge } from "@/app/components/UI/badge";
import { Seller } from "@/lib/types/seller";
import { FetchedListing } from "@/lib/types/main";
import { getSellerListings } from "@/lib/backend/getListings";
import ListingCard from "@/app/components/UI/ListingCard";
import api from "@/lib/backend/api/axiosConfig";

export default function SellerPage() {
  const router = useRouter();
  const params = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<FetchedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSellerData = async() => {
      setIsLoading(true);
      try {
        // Fetch seller information
        const response = await api.get(`/api/sellers/${params.id}`);
        if (!response.data || !response.data.success) {
          throw new Error('Failed to fetch seller');
        }

        console.log(response.data.data);

        const sellerObject: Seller = {
          id: response.data.data.id,
          name: response.data.data.name,
          bio: response.data.data.bio,
          rating: response.data.data.rating,
          verified: response.data.data.verified,
          createdAt: response.data.data.created_at,
        }

        setSeller(sellerObject);

        // Fetch seller's listings
        const sellerListings = await getSellerListings(params.id as string);
        setListings(sellerListings as FetchedListing[]);
      } catch (error) {
        console.error("Error fetching seller data:", error);
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
    // This would integrate with your messaging system
    try {
      // Example: await api.post('/messages', { sellerId: seller?.id, message });
      alert("Message sent successfully!");
      setMessage("");
      setMessageOpen(false);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

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
            The seller you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button
            onClick={() => router.push("/browse")}
            className="mt-4"
          >
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
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-400 mr-2">
                <FaStar className="h-5 w-5" />
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  {seller.rating}
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
      <div>
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
              <div key={listing.id} className="transform transition duration-300 hover:scale-102 hover:shadow-lg">
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
    </div>
  );
}
