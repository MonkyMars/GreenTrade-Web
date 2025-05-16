export interface User {
	id: string;
	name: string;
	email: string;
	location: string;
	createdAt: string;
	emailVerified: boolean;
	phone?: string;
	picture?: string;
	bio: string;
	ecoScore?: number;
}
