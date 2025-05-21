import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	location: z.string(),
	createdAt: z.date().or(z.string().pipe(z.coerce.date())),
	emailVerified: z.boolean(),
	picture: z.string().optional(),
	bio: z.string(),
	ecoScore: z.number().min(0).max(10).optional(),
});

export type User = z.infer<typeof UserSchema>;
