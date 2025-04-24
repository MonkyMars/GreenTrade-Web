"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import {
  FaLeaf,
  FaCamera,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaStar,
  FaClipboardCheck,
} from "react-icons/fa";
import {
  MdBuild,
  MdCategory,
  MdCheckCircleOutline,
  MdThumbUp,
} from "react-icons/md";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { FiX } from "react-icons/fi";
import { uploadImage } from "@/lib/backend/uploadImage";
import { uploadListing } from "@/lib/backend/uploadListing";
import { type UploadListing } from "@/lib/types/main";
import { calculateEcoScore } from "@/lib/functions/calculateEcoScore";
import ProtectedRoute from "../components/UI/ProtectedRoute";
import { useAuth } from "@/lib/contexts/AuthContext";
import { categories } from "@/lib/functions/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Define Zod schema for form validation
const listingSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100, { message: "Title must be at most 100 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(1000, { message: "Description must be at most 1000 characters" }),
  category: z.string().refine(value => value !== "" && value !== "Select a category" && value !== "All Categories", {
    message: "Please select a category"
  }),
  condition: z.string().min(1, { message: "Please select the condition" }),
  price: z.string()
    .refine(val => val !== "", { message: "Price is required" })
    .refine(val => !isNaN(Number(val)), { message: "Price must be a number" })
    .refine(val => Number(val) > 0, { message: "Price must be greater than 0" }),
  negotiable: z.boolean().default(false),
  ecoAttributes: z.array(z.string()),
  location: z.string().optional(),
});

type ListingFormType = z.infer<typeof listingSchema>;

const PostListingPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ListingFormType>({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    ecoAttributes: [] as string[],
    negotiable: false,
    location: user?.location,
  });
  const [images, setImages] = useState<
  { uri: string; type?: string; name?: string }[]
>([])
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ecoScore, setEcoScore] = useState<number>(0);

  // Condition options
  const conditions: {
    name: string;
    icon: React.ElementType;
  }[] = [
    { name: "New", icon: FaBoxOpen },
    { name: "Like New", icon: MdCheckCircleOutline },
    { name: "Very Good", icon: FaStar },
    { name: "Good", icon: MdThumbUp },
    { name: "Acceptable", icon: RiCheckboxBlankCircleLine },
    { name: "For Parts/Not Working", icon: MdBuild },
  ];

  // Eco-friendly attributes
  const ecoAttributes = [
    "Second-hand",
    "Refurbished",
    "Upcycled",
    "Locally Made",
    "Organic Material",
    "Biodegradable",
    "Energy Efficient",
    "Plastic-free",
    "Vegan",
    "Handmade",
    "Repaired",
  ];

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors for this field when edited
    setFormErrors(formErrors.filter(error => error.path[0] !== name));
  };

  // Handle eco-attribute toggles
  const toggleEcoAttribute = (attribute: string) => {
    const updatedAttributes = formData.ecoAttributes.includes(attribute)
      ? formData.ecoAttributes.filter((a) => a !== attribute)
      : [...formData.ecoAttributes, attribute];
    
    setFormData({
      ...formData,
      ecoAttributes: updatedAttributes,
    });
    
    setEcoScore(calculateEcoScore(updatedAttributes));
  };

  // Mock image upload function
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    // Store both the file objects and create preview URLs
    const newImageFiles = [...imageFiles];
    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      if (newImages.length < 5) {
        // Limit to 5 images
        newImageFiles.push(files[i]);
        newImages.push({ uri: URL.createObjectURL(files[i]) });
      }
    }

    setImageFiles(newImageFiles);
    setImages(newImages);
    setUploading(false);
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newImageFiles = [...imageFiles];

    URL.revokeObjectURL(newImages[index].uri);
    newImages.splice(index, 1);
    newImageFiles.splice(index, 1);

    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  // Form validation
  const validateForm = () => {
    const result = listingSchema.safeParse(formData);
    if (!result.success) {
      setFormErrors(result.error.issues);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear messages
    setFormErrors([]);
    setSuccessMessage("");
    setErrorMessage("");

    const isValid = validateForm();
    if (!isValid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      // Check if user is available
      if (!user || !user.id) {
        throw new Error("You must be logged in to post a listing");
      }

      const imageUrls = await uploadImage(images, formData.title);

      if (!imageUrls) {
        throw new Error("Failed to upload images");
      }

      const listing: UploadListing = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        location: user.location,
        price: parseFloat(formData.price),
        negotiable: formData.negotiable,
        ecoAttributes: formData.ecoAttributes,
        ecoScore: calculateEcoScore(formData.ecoAttributes),
        imageUrl: imageUrls.urls,
        sellerId: user.id,
      };

      const uploadResponse = await uploadListing(listing);
      if (!uploadResponse) {
        throw new Error("Failed to post listing");
      }

      setSuccessMessage("Listing posted successfully!");
    } catch (error) {
      console.error("Post listing error:", error);
      if (error instanceof Error) {
        // Handle specific error scenarios
        if (
          error.message.includes("Authentication required") ||
          error.message.includes("must be logged in")
        ) {
          setErrorMessage(
            "Authentication required. Please ensure you are logged in."
          );
        } else if (
          error.message.includes("401") ||
          error.message.includes("Unauthorized")
        ) {
          setErrorMessage("Your session has expired. Please log in again.");
        } else {
          setErrorMessage(`Failed to post listing: ${error.message}`);
        }
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    } finally {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <ProtectedRoute>
      <main className="pt-16 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="my-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Post a New Listing
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Share your sustainable item with the community
            </p>
          </div>

          {successMessage && (
            <div className="mb-8 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded relative">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-8 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {formErrors.length > 0 && (
            <div className="mb-8 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
              <p className="font-medium">
                Please correct the following errors:
              </p>
              <ul className="mt-2 list-disc pl-5">
                {formErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Item Details */}
            <section className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Item Details
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tell us about what you&apos;re listing
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Handmade Wooden Coffee Table"
                    className={`block w-full px-4 py-3 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out
                            ${
                              formErrors.find(error => error.path[0] === "title")
                                ? "border-2 border-red-300 focus:ring-1 focus:ring-green-400"
                                : "border border-gray-300 dark:border-gray-600 hover:border-green-300"
                            }
                            focus:ring-0 focus:border-transparent focus:outline-none
                            dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                  />
                  {formErrors.find(error => error.path[0] === "title") && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.find(error => error.path[0] === "title")?.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    maxLength={1000}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your item, including details about its condition, history, and sustainability aspects"
                    className={`block w-full px-4 py-3 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out focus:ring-0 focus:border-transparent focus:outline-none
                    ${
                      formErrors.find(error => error.path[0] === "description")
                        ? "border-2 border-red-300 focus:ring-1 focus:ring-green-400"
                        : "border border-gray-300 dark:border-gray-600 hover:border-green-300"
                    }
                    dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                  />
                  {formErrors.find(error => error.path[0] === "description") && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.find(error => error.path[0] === "description")?.message}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Category */}
                <div className="z-50">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 pb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                      <SelectTrigger
                        className={`block w-full px-4 py-6 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out
                    ${
                      formErrors.find(error => error.path[0] === "category")
                        ? "border-2 border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-300"
                    }
                    dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                      >
                        <SelectValue
                          placeholder={
                            <>
                              <MdCategory className="text-gray-400" />
                              <span>Category</span>
                            </>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="mt-1 w-full bg-slate-100 dark:bg-gray-700 rounded-md shadow-lg border-green-500">
                        {categories.slice(1).map((category) => (
                          <SelectItem
                            value={category.name}
                            key={category.id}
                            onSelect={() =>
                              setFormData({
                                ...formData,
                                category: category.name,
                              })
                            }
                          >
                            <div className="flex items-center">
                              <category.icon className="h-5 w-5 mr-2" />
                              <span className="text-[1em]">
                                {category.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formErrors.find(error => error.path[0] === "category") && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.find(error => error.path[0] === "category")?.message}
                    </p>
                  )}
                </div>

                {/* Condition */}
                <div>
                  <label
                    htmlFor="condition"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 pb-1"
                  >
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}>
                    <SelectTrigger
                      className={`block w-full px-4 py-6 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out
                    ${
                      formErrors.find(error => error.path[0] === "condition")
                        ? "border-2 border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-300"
                    }
                    dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                    >
                      <SelectValue
                        placeholder={
                          <>
                            <FaClipboardCheck className="text-gray-400" />
                            <span>Condition</span>
                          </>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="mt-1 w-full bg-slate-100 dark:bg-gray-700 rounded-md shadow-lg border-green-500">
                      {conditions.map((condition) => (
                        <SelectItem
                          value={condition.name}
                          key={condition.name}
                        >
                          <div className="flex items-center">
                            <condition.icon className="h-5 w-5 mr-2" />
                            <span className="text-[1em]">{condition.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.find(error => error.path[0] === "condition") && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.find(error => error.path[0] === "condition")?.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Price & Location */}
            <section className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Price & Location
                </h2>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-6">
                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Price (€) <span className="text-red-500">*</span>
                  </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                      €
                      </span>
                    </div>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers and up to 2 decimal places
                      if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
                        setFormData({
                        ...formData,
                        price: value
                        });
                      }
                      }}
                      className={`pl-6 block w-full px-4 py-3 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out focus:ring-0 focus:border-transparent focus:outline-none
                                ${
                      formErrors.find(error => error.path[0] === "price")
                        ? "border-2 border-red-300 focus:ring-1 focus:ring-green-400"
                        : "border border-gray-300 dark:border-gray-600 hover:border-green-300"
                      }
                                dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                      placeholder="0.00"
                    />
                    </div>
                  {formErrors.find(error => error.path[0] === "price") && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.find(error => error.path[0] === "price")?.message}
                    </p>
                  )}
                </div>

                {/* Negotiable checkbox */}
                <div className="flex items-center mt-2 bg-gray-50 dark:bg-gray-700 rounded-md p-3 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Checkbox
                    id="negotiable"
                    name="negotiable"
                    checked={formData.negotiable}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        negotiable: checked === true,
                      });
                    }}
                    className="h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 border-gray-300 rounded transition-all duration-200 flex items-center justify-center"
                  />
                  <label
                    htmlFor="negotiable"
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                  >
                    Price is negotiable
                  </label>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={user?.location}
                      disabled
                      onChange={handleChange}
                      placeholder="e.g., Berlin, Germany"
                      className={`pl-8 block w-full px-4 py-3 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out focus:ring-0 focus:border-transparent focus:outline-none
											${
                        formErrors.find(error => error.path[0] === "location")
                          ? "border-2 border-red-300 focus:ring-1 focus:ring-green-400"
                          : "border border-gray-300 dark:border-gray-600 hover:border-green-300"
                      }
											dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                    />
                  </div>
                  {formErrors.find(error => error.path[0] === "location") && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.find(error => error.path[0] === "location")?.message}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your exact address will not be shared publicly
                  </p>
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Images
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add up to 5 images of your item
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {/* Existing images */}
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-32 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden"
                    >
                      <Image
                        src={image.uri}
                        alt={`Listing image ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FiX className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  {images.length < 5 && (
                    <div className="relative h-32">
                      <label
                        htmlFor="image-upload"
                        className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FaCamera className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {uploading ? "Uploading..." : "Add Image"}
                          </p>
                        </div>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/jpeg, image/jpg, image/png, image/webp"
                          onChange={handleImageUpload}
                          multiple={true}
                          disabled={uploading}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  )}
                </div>
                {formErrors.find(error => error.path[0] === "images") && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {formErrors.find(error => error.path[0] === "images")?.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  First image will be the featured image. Clear, well-lit photos
                  from multiple angles help items sell faster.
                </p>
              </div>
            </section>

            {/* Eco-friendly Attributes */}
            <section className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <FaLeaf className="h-5 w-5 text-green-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Eco-friendly Attributes
                  </h2>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select all attributes that apply to your item
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-2 gap-4">
                  {ecoAttributes.map((attribute) => (
                    <div key={attribute} className="flex items-center">
                      <Checkbox
                        id={`eco-${attribute}`}
                        checked={formData.ecoAttributes.includes(attribute)}
                        onClick={() => toggleEcoAttribute(attribute)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`eco-${attribute}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {attribute}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {ecoScore}/5
                    </div>
                    <FaLeaf className="absolute -top-1 -right-1 h-5 w-5 text-green-500 bg-white dark:bg-green-900 rounded-full p-0.5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-green-800 dark:text-green-300">Eco-friendly Score</h3>
                    <p className="text-sm text-green-700 dark:text-green-400">
                    Items with higher eco-friendly scores are more likely to be
                    promoted in search results and featured on the homepage!
                    </p>
                    <p className="text-xs mt-1 text-green-600 dark:text-green-500">
                    Add more eco attributes to increase your score.
                    </p>
                  </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Terms and Submit */}
            <section className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start mb-6">
                  <div className="flex items-center h-5">
                    <Checkbox
                      id="terms"
                      name="terms"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-medium text-gray-700 dark:text-gray-300"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-green-600 hover:text-green-500"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      By posting this listing, I confirm that I have the right
                      to sell this item and the information provided is
                      accurate.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/browse"
                    className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Post Listing
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default PostListingPage;
