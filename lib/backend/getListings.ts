import { FetchedListing } from "../types/main";
import api from "./api/axiosConfig";

export const getListings = async (id?: number): Promise<FetchedListing | FetchedListing[]> => {
  if (id) {
    const response = await api.get(`/listings/${id}`);
    return response.data.data as FetchedListing;
  } else {
    const response = await api.get(`/listings`);
    return response.data.data as FetchedListing[];
  }
};
