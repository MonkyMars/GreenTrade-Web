import { FetchedListing } from "../types/main";

export const getListings = async (id?: number): Promise<FetchedListing | FetchedListing[]> => {
  if (id) {
    const response = await fetch(`http://localhost:8080/listings/${id}`);
    const data: FetchedListing = await response.json();
    return data;
  } else {
    const response = await fetch("http://localhost:8080/listings");
    const data: FetchedListing[] = await response.json();
    return data;
  }
};
