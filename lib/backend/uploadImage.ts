import { UploadListing } from "../types/main";

export const uploadImage = async (files: File[], listing_title: UploadListing["title"]) => {
    const formData = new FormData();
    formData.append("listing_title", listing_title);
    
    files.forEach((file: File) => {
        formData.append("file", file); // backends expects files to be in "file" field
    });
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC}/upload/listing_image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload image");

        return await response.json(); // Should return { urls: string[] }
    } catch (error) {
        console.error(error);
        return null;
    }
};
