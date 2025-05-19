export interface Review {
	rating: number;
	userId: string;
	sellerId: string;
	title: string;
	content: string;
	helpfulCount: number;
	verifiedPurchase: boolean;
}

export interface FetchedReview extends Review {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userName: string;
	userPicture: string; // TODO: add user picture to the review
}
