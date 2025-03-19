import { notFound } from "next/navigation";
import Image from "next/image";
import {
  FaLeaf,
  FaMapMarkerAlt,
  FaRegClock,
  FaCheckCircle,
  FaStar,
  FaRegHeart,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/app/components/UI/button";
import { Badge } from "@/app/components/UI/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/UI/tabs";
import { FetchedListing } from "@/lib/types/main";
import { SimilairCard, SimilairCardSkeleton } from "./similairCard";
import { findCategory } from "@/lib/functions/categories";

export default async function ListingPage({
  params,
}: {
  params: { id: string };
}) {
  const awaitedParams = await params;

  const fetchListing = async (): Promise<FetchedListing> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/${awaitedParams.id}`,
        {
          next: { revalidate: 60 }, // Revalidate every minute
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listing");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching listing:", error);
      throw new Error("Failed to fetch listing");
    }
  };

  // Fetch the listing first
  const listing = await fetchListing();

  const fetchSimilarListings = async (): Promise<FetchedListing[]> => {
    try {
      console.log("Fetching similar listings");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/category/${listing.category}`,
        {
          next: { revalidate: 60 }, // Revalidate every minute
        }
      );

      if (!response.ok) {
        console.log(response)
        return [];
        
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching similar listings:", error);
      return [];
    }
  };
  
  // Now fetch similar listings after we have the listing data
  const similarListings = await fetchSimilarListings();
  let category = findCategory(listing.category.toLocaleLowerCase());
  if (!category) {
    category = { icon: FaLeaf, name: "Eco", id: "green" };
  }

  if (!listing) {
      return notFound();
  }

  // Format the creation date to show how long ago it was posted
  const postedDate = new Date(listing.created_at);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  return (
    <main className="mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-26">
        {/* Image Gallery - Takes up 3 columns on desktop */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <Tabs defaultValue="0" className="w-full">
                {/* Main image content - REMOVED mt-12 */}
                <TabsContent value="0" className="m-0">
                  <div className="relative h-[400px] lg:h-[500px]">
                    {listing.imageUrl.length > 0 ? (
                      <Image
                        src={listing.imageUrl[0]}
                        alt={listing.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                        <p className="text-gray-500 dark:text-gray-400">
                          No image available
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {listing.imageUrl.slice(1).map((img: string, index: number) => (
                  <TabsContent
                    key={index + 1}
                    value={(index + 1).toString()}
                    className="m-0"
                  >
                    <div className="relative h-[400px] lg:h-[500px]">
                      <Image
                        src={img}
                        alt={`${listing.title} - image ${index + 2}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </TabsContent>
                ))}

                {/* Image thumbnails */}
                <div className="mt-4">
                  <TabsList className="flex justify-start overflow-x-auto space-x-2 py-1 px-0 h-auto tabslist">
                    {listing.imageUrl.map((img: string, index: number) => (
                      <TabsTrigger
                        key={index}
                        value={index.toString()}
                        className="p-0 rounded-md overflow-hidden data-[state=active]:border-2 data-[state=active]:border-green-500 m-0"
                      >
                        <div className="relative w-16 h-16">
                          <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Description section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Seller info for mobile - Shows only on mobile */}
          <div className="lg:hidden bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {/* Placeholder for seller image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-bold">
                  {listing.seller.name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {listing.seller.name}
                </h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const hasHalfStar =
                        i + 0.5 === Math.floor(listing.seller.rating) + 0.5 &&
                        !Number.isInteger(listing.seller.rating);
                      return i < Math.floor(listing.seller.rating) ? (
                        <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                      ) : hasHalfStar ? (
                        <div key={i} className="relative">
                          <FaStar className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                          <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                            <FaStar className="w-4 h-4 text-yellow-400" />
                          </div>
                        </div>
                      ) : (
                        <FaStar
                          key={i}
                          className="w-4 h-4 text-gray-300 dark:text-gray-600"
                        />
                      );
                    })}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {listing.seller.rating}
                  </span>
                  {listing.seller.verified && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <FaCheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <Button className="w-full">Message Seller</Button>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listing Details - Takes up 2 columns on desktop */}
        <div className="lg:col-span-2">
          <div className="sticky top-20">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
              {/* Title and category */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="mb-2">
                    <category.icon size="24" className="mr-1" /> {listing.category}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FaRegHeart className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {listing.title}
                </h1>
              </div>

              {/* Price and negotiable */}
              <div className="mb-6">
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-green-900 dark:text-green-500">
                    €{listing.price}
                  </span>
                  {listing.negotiable && (
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      (Negotiable)
                    </span>
                  )}
                </div>
              </div>

              {/* Quick details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Condition
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {listing.condition}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Posted
                  </span>
                  <div className="flex items-center">
                    <FaRegClock className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {timeAgo}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Location
                  </span>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {listing.location}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Eco Score
                  </span>
                  <div className="flex items-center">
                    <FaLeaf className="w-4 h-4 mr-1 text-green-500" />
                    <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${(listing.ecoScore / 5) * 100}%` }}
                      />
                    </div>
                    <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                      {listing.ecoScore}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Eco attributes */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Eco-friendly Attributes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.ecoAttributes.map((attr: string, index: number) => (
                    <Badge
                      key={index}
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-900/80"
                    >
                      <FaLeaf className="mr-1 h-3 w-3" />
                      {attr}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 p-4 rounded-lg">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Contact Seller
                </Button>
                <Button variant="outline" className="w-full">
                  Make an Offer
                </Button>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1">
                    Share
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Seller info for desktop - Hidden on mobile */}
            <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Seller Information
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {/* Placeholder for seller image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-bold">
                    {listing.seller.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {listing.seller.name}
                  </h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(listing.seller.rating)
                              ? "text-yellow-400"
                              : i < listing.seller.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {listing.seller.rating}
                    </span>
                    {listing.seller.verified && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        <FaCheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related listings section - Optional */}
      <div className="mt-16 bg-gray-900 w-full p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Similar Listings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarListings.length
            ? similarListings.map((listing: FetchedListing) => (
                <SimilairCard key={listing.id} listing={listing} />
              ))
            : [...Array(4)].map((_, i) => <SimilairCardSkeleton key={i} />)}
        </div>
      </div>
    </main>
  );
}
