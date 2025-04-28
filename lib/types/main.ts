export type UploadListing = {
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  negotiable: boolean;
  ecoScore: number;
  ecoAttributes: string[];
  imageUrl: string[];

  sellerId: string;
};

export interface FetchedListing extends UploadListing {
  id: string;
  createdAt: string;
  sellerUsername: string;
  sellerBio: string;
  sellerCreatedAt: string;
  sellerRating: number;
  sellerVerified: boolean;
  isUserFavorite?: boolean;
}
