import { FetchedListing } from "../types/main";

export const getListings = async (id?: number): Promise<FetchedListing | FetchedListing[]> => {
  if (id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/${id}`);
    const data: FetchedListing = await response.json();
    return data;
  } else {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings`);
    const data: FetchedListing[] = await response.json();
    return data;
  }
};
