import Image from "next/image";
import { FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { FetchedListing } from "@/lib/types/main";

interface SimilairCardProps {
  listing: FetchedListing;
}

export const SimilairCard = ({ listing }: SimilairCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="relative h-48 w-full mb-4">
        <Image
          src={listing.imageUrl[0]}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover rounded-lg"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {listing.title}
      </h3>
      <div className="flex items-center mb-2">
        <span className="text-green-600 font-bold">€{listing.price}</span>
        {listing.negotiable && (
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            (Negotiable)
          </span>
        )}
      </div>
      <div className="flex items-center mb-2">
        <FaMapMarkerAlt className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {listing.location}
        </span>
      </div>
      <div className="flex items-center">
        <FaRegClock className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDistanceToNow(listing.createdAt, {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
};

export const SimilairCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-48 w-full mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-6 w-3/4 mb-2 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-4 w-1/2 mb-2 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-4 w-1/3 mb-2 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    );
};
