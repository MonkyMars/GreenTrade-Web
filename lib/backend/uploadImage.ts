import { UploadListing } from "../types/main";

export const uploadImage = async (files: File[], listing_title: UploadListing["title"]) => {
    const formData = new FormData();
    formData.append("listing_title", listing_title);
    
    files.forEach((file: File) => {
        formData.append("file", file); // backends expects files to be in "file" field
    });
    
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("Authentication required. Please log in.");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_PROTECTED}/upload/listing_image`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
                // Note: Do not set Content-Type header with FormData as browser will set it with boundary
            },
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload image");
        const data = await response.json();
        console.log(data);
        return await data; // Should return { urls: string[] }
    } catch (error) {
        console.error(error);
        throw error; // Re-throw to be handled by the caller
    }
};
