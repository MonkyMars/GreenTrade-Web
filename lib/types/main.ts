export interface Listing {
    id: number;
    title: string;
    description: string;
    image: string;
    price: string;
    ecoScore: number;
    location: string;
    category: string;
    date: string;
    condition: string;
    isFavorite: boolean;
    seller: {
      name: string;
      rating: number;
      verified: boolean;
    };
}

export type UploadListing = {
    title: string
    description: string
    category: string
    condition: string
    location: string
    price: number
    negotiable: boolean
    ecoScore: number
    ecoAttributes: string[]
    imageUrl: string[]
  
    sellerId: string
  }
  
  export interface FetchedListing extends UploadListing {
    id: string
    createdAt: string
    sellerUsername: string
    sellerBio: string
    sellerCreatedAt: string
    sellerRating: number
    sellerVerified: boolean
  }