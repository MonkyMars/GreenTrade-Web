import { z } from 'zod';

export const ReviewSchema = z.object({
	rating: z.number().min(1).max(5),
	userId: z.string(),
	sellerId: z.string(),
	title: z.string(),
	content: z.string(),
	helpfulCount: z.number().nonnegative(),
	verifiedPurchase: z.boolean(),
});

export const FetchedReviewSchema = ReviewSchema.extend({
	id: z.string(),
	createdAt: z.date().or(z.string().pipe(z.coerce.date())),
	userName: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;
export type FetchedReview = z.infer<typeof FetchedReviewSchema>;
