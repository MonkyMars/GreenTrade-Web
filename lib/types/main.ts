import { Condition } from '../functions/conditions';

export type UploadListing = {
	title: string;
	description: string;
	category: string;
	condition: Condition['name'];
	price: number;
	negotiable: boolean;
	ecoScore: number;
	ecoAttributes: string[];
	imageUrl: string[];

	sellerId: string;
};

export interface FetchedListing extends UploadListing {
	id: string;
	createdAt: Date;
	location: string;
	sellerUsername: string;
	sellerBio: string;
	sellerCreatedAt: Date;
	sellerRating: number;
	sellerVerified: boolean;
	isUserFavorite?: boolean;

	bids: FetchedBid[];
}

export interface Bid {
	ListingId: string;
	UserId: string;
	price: number;
}

export interface FetchedBid {
	id: string;
	listingId: string;
	userId: string;
	price: number;
	createdAt: Date;

	// User data
	userName: string;
	userPicture: string;
}
