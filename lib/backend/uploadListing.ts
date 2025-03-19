import { UploadListing } from "../types/main";

export const uploadListing = async (listing: UploadListing) => {   
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(listing),
        });

        if (!response.ok) throw new Error("Failed to upload listing");

        return await response.json();
    } catch (error) {
        console.error(error);
    }
};