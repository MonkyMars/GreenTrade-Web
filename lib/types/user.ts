import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(100),
	email: z.string().email(),
	location: z
		.object({
			city: z.string().min(0).max(100),
			country: z.string().min(0).max(100),
			latitude: z.number().min(-90).max(90).optional(),
			longitude: z.number().min(-180).max(180).optional(),
		})
		.optional(),
	createdAt: z.date().or(z.string().pipe(z.coerce.date())),
	emailVerified: z.boolean(),
	picture: z.string().url().optional(),
	bio: z.string().min(10).max(500).optional(),
	ecoScore: z.number().min(0).max(10).optional(),
	provider: z.enum(['email', 'google']).default('email'),
});

export type User = z.infer<typeof UserSchema>;
