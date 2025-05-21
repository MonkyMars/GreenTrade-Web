import { z } from 'zod';
import { Condition, conditions } from '../functions/conditions';
import { EcoAttributes } from '../functions/ecoAttributes';
import { Categories, categories } from '../functions/categories';

// Zod schemas
type CategoryName = Exclude<Categories['name'], 'All Categories'>;

export const UploadListingSchema = z.object({
	title: z
		.string()
		.min(5, { message: 'Title must be at least 5 characters' })
		.max(100, { message: 'Title must be at most 100 characters' }),
	description: z
		.string()
		.min(20, { message: 'Description must be at least 20 characters' })
		.max(1000, { message: 'Description must be at most 1000 characters' }),
	category: z.custom<CategoryName>(
		(val) => {
			return categories.some(
				(category) =>
					category.name === val &&
					category.name !== 'All Categories' &&
					val !== ''
			);
		},
		{
			message: 'Please select a valid category',
		}
	),
	condition: z.custom<Condition['name']>(
		(val) => {
			return conditions.some((condition) => condition.name === val);
		},
		{
			message: 'Please select a valid condition',
		}
	),
	price: z
		.number()
		.refine((val) => val !== null, { message: 'Price is required' })
		.refine((val) => !isNaN(Number(val)), { message: 'Price must be a number' })
		.refine((val) => Number(val) > 0, {
			message: 'Price must be greater than 0',
		}),
	negotiable: z.boolean().default(false),
	ecoAttributes: z.array(z.custom<EcoAttributes>()).default([]),
	ecoScore: z.number().min(0).max(1000000).default(0),
	imageUrls: z.array(z.string()).min(1, {
		message: 'At least one image is required',
	}),
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
	bids: z.array(FetchedBidSchema).optional(),
});

// Type inference from schemas
export type UploadListing = z.infer<typeof UploadListingSchema>;
export type Bid = z.infer<typeof BidSchema>;
export type FetchedBid = z.infer<typeof FetchedBidSchema>;
export type FetchedListing = z.infer<typeof FetchedListingSchema>;
