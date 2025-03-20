import { FetchedListing } from "@/lib/types/main";

export const filterListings = (listings: FetchedListing[], category: string) => {
  if (category === "all") return listings;
  return listings.filter((listing) => listing.category === category);
};