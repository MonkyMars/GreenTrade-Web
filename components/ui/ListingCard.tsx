"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLeaf, FaMapMarkedAlt, FaStar, FaUser, FaEye } from "react-icons/fa";
import { TbFolder } from "react-icons/tb";
import { FetchedListing } from "@/lib/types/main";
import { findCategory } from "@/lib/functions/categories"; // Remove Category import
import { Button } from "./button";
import { formatDistanceToNow } from "date-fns";

interface ListingCardProps {
  listing: FetchedListing;
  viewMode: "grid" | "list";
  className?: string;
  page?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  viewMode,
  className,
  page,
}) => {
  let category = findCategory(listing.category);
  if (!category) {
    category = { id: "all", icon: TbFolder, name: "Unknown" };
  }

  if (viewMode === "grid") {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${className}`}
      >
        <div className="relative h-52 group">
          {listing.imageUrl && listing.imageUrl.length > 0 ? (
            <Image
              src={listing.imageUrl[0]}
              alt={listing.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
          <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 px-2 py-1 rounded text-sm font-medium flex items-center">
            <FaLeaf className="h-4 w-4 text-green-500 mr-1" />
            <span className="font-bold">{listing.ecoScore}</span>
          </div>
        </div>
        <div className="p-4">
          <Link href={`/listings/${listing.id}`} className="block">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 line-clamp-2">
              {listing.title}
            </h3>
          </Link>
          <div className="mt-1 flex items-baseline">
            <span className="text-green-600 dark:text-green-400 text-lg font-bold">
              €{listing.price}
            </span>
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              Exc. Shipping
            </span>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FaMapMarkedAlt className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{listing.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <category.icon className="mr-2 h-4 w-4 flex-shrink-0 text-green-400 dark:text-green-500" />
              <span className="truncate text-green-400 dark:text-green-500">
                {listing.category}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300/60 dark:border-gray-700 flex items-center justify-between"></div>
          <div className="flex items-center text-sm">
            {listing.sellerVerified && (
              <span className="mr-1 px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full flex items-center">
                ✓
              </span>
            )}
            <Link
              title="View seller profile"
              href={`/sellers/${listing.sellerId}`}
              className="text-green-600 dark:text-green-200 hover:text-green-600 dark:hover:text-green-400"
            >
              {listing.sellerUsername}
            </Link>
            <div className="ml-2 flex items-center">
              <FaStar className="h-3 w-3 text-yellow-400" />
              <span className="text-xs ml-1">{listing.sellerRating}</span>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(listing.createdAt), {
              addSuffix: true,
            })}
          </span>
          {page !== "seller" ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
              >
                <Link href={`/sellers/${listing.sellerId}`}>
                  <span className="flex items-center gap-1">
                    <FaUser />
                    View Seller
                  </span>
                </Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex items-center justify-center bg-green-600 hover:bg-green-700"
              >
                <Link href={`/listings/${listing.id}`}>
                  <span className="flex items-center text-white gap-1">
                    <FaEye />
                    Details
                  </span>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-3 w-full">
              <Button
                variant="default"
                size="sm"
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 w-full"
              >
                <Link href={`/listings/${listing.id}`}>
                  <span className="flex items-center text-white gap-1">
                    <FaEye />
                    Details
                  </span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // List view
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0">
            {listing.imageUrl && listing.imageUrl.length > 0 ? (
              <Image
                src={listing.imageUrl[0]}
                alt={listing.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 192px" // sm:w-48 is 12rem = 192px
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
            )}
            <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 px-2 py-1 rounded text-sm font-medium flex items-center">
              <FaLeaf className="h-4 w-4 text-green-500 mr-1" />
              <span>{listing.ecoScore}</span>
            </div>
          </div>
          <div className="p-4 flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/listings/${listing.id}`} className="block">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400">
                    {listing.title}
                  </h3>
                </Link>
                <p className="mt-1 text-green-600 dark:text-green-400 text-lg font-bold">
                  €{listing.price}
                </p>
              </div>
              {/* Favorite button removed for simplicity, can be added back if needed */}
            </div>
            <div className="space-y-3 mt-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FaMapMarkedAlt className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                <span className="truncate">{listing.location}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(listing.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className="flex items-center">
                <category.icon className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {category.name}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  {listing.sellerVerified && (
                    <span className="mr-1.5 px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full flex items-center">
                      ✓
                    </span>
                  )}
                  <Link
                    title="View seller profile"
                    href={`/sellers/${listing.sellerId}`}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                  >
                    {listing.sellerUsername}
                  </Link>
                  <div className="ml-2 flex items-center">
                    <FaStar className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 ml-1 font-medium">
                      {listing.sellerRating}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/listings/${listing.id}`}
                  className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors"
                >
                  View Details
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ListingCard;
