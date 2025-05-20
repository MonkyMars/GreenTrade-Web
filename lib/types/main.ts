import { z } from 'zod';

// Zod schemas
export const UploadListingSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	category: z.string(),
	condition: z.string(),
	price: z.number().positive('Price must be positive'),
	negotiable: z.boolean(),
	ecoScore: z.number().min(0).max(10),
	ecoAttributes: z.array(z.string()),
	imageUrl: z.array(z.string().url()),
	sellerId: z.string(),
});

export const BidSchema = z.object({
	listingId: z.string(),
	userId: z.string(),
	price: z.number().positive('Bid price must be positive'),
});

export const FetchedBidSchema = BidSchema.extend({
	id: z.string(),
	createdAt: z.date().or(z.string().pipe(z.coerce.date())),
	userName: z.string(),
	userPicture: z.string(),
});

export const FetchedListingSchema = UploadListingSchema.extend({
	id: z.string(),
	createdAt: z.date().or(z.string().pipe(z.coerce.date())),
	location: z.string(),
	sellerUsername: z.string(),
	sellerBio: z.string(),
	sellerCreatedAt: z.date().or(z.string().pipe(z.coerce.date())),
	sellerRating: z.number().min(0).max(5),
	sellerVerified: z.boolean(),
	isUserFavorite: z.boolean().optional(),
	bids: z.array(FetchedBidSchema),
});

// Type inference from schemas
export type UploadListing = z.infer<typeof UploadListingSchema>;
export type Bid = z.infer<typeof BidSchema>;
export type FetchedBid = z.infer<typeof FetchedBidSchema>;
export type FetchedListing = z.infer<typeof FetchedListingSchema>;
