import axios from "axios";
import { UploadListing } from "../types/main";

export const uploadListing = async (listing: UploadListing) => {   
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("Authentication required. Please log in.");
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL_PROTECTED}/listings`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(listing),
        });

        if (!response.data.success) throw new Error("Failed to upload listing");

        return await response.data.data; // Should return { listing_id: string, ...otherData }
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to be handled by the caller
    }
};