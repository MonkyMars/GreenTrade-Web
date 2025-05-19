export interface User {
	id: string;
	name: string;
	email: string;
	location: string;
	createdAt: Date;
	emailVerified: boolean;
	phone?: string;
	picture?: string;
	bio: string;
	ecoScore?: number;
}
