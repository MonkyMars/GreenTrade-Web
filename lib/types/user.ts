export interface User {
	id: string;
	name: string;
	email: string;
	location: string;
	profileUrl: string;
	createdAt: string;
	emailVerified: boolean;
	phone?: string;
	profileImage?: string;
	bio?: string;
	ecoScore?: number;
}
