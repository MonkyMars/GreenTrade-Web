import { z } from 'zod';

export const SellerSchema = z.object({
	id: z.string(),
	name: z.string(),
	rating: z.number().min(0).max(5),
	verified: z.boolean(),
	bio: z.string(),
	createdAt: z.date().or(z.string().pipe(z.coerce.date())),
});

export type Seller = z.infer<typeof SellerSchema>;
