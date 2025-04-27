"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getFavorites } from "@/lib/backend/favorites/getFavorites";
import { toggleFavorite } from "@/lib/backend/favorites/favorites";
import { FetchedListing } from "@/lib/types/main";
import ListingCard from "@/components/ui/ListingCard";
import { Button } from "@/components/ui/button";
import { FaArrowRight, FaHeart, FaList, FaThLarge } from "react-icons/fa";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FetchedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return; // Ensure user is available before fetching
      try {
        setLoading(true);
        const data = await getFavorites(user.id);
        setFavorites(data);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const handleRemoveFavorite = async (listingId: string) => {
    if (!user) return; // Ensure user is available before toggling favorite
    try {
      await toggleFavorite(listingId, user.id, true); // Remove from favorites
      // Remove from local state after successful toggle
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.id !== listingId)
      );
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-22">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            My Favorites
          </h1>
          <p className="mt-2 text-gray-200">
            Listings you&apos;ve saved for later
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              <FaList className="mr-2" />
              List
            </Button><Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              <FaThLarge className="mr-2" />
              Grid
            </Button>
          </div>
          <Button
            variant="ghost"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            size="sm"
            onClick={() => router.push("/browse")}
          >
            Browse more listings
            <FaArrowRight className="ml-2 group-hover:translate-x-0.5 transition-transform duration-100" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <FaHeart className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Items you save will appear here. Start browsing to find items you
              like!
            </p>
            <Button
              onClick={() => router.push("/browse")}
              className="bg-green-600 hover:bg-green-700"
            >
              Browse Listings
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
          >
            {favorites.map((listing) => (
              <div key={listing.id} className="relative group">
                <ListingCard listing={listing} viewMode={viewMode} />
                <button
                  onClick={() => handleRemoveFavorite(listing.id)}
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full cursor-pointer shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 dark:hover:bg-red-900"
                  aria-label="Remove from favorites"
                >
                  <FaHeart className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
