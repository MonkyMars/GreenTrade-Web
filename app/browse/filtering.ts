import { Categories, categories } from '@/lib/functions/categories';
import { FetchedListing } from '@/lib/types/main';

export interface FilterOptions {
	category?: Categories['name'];
	search?: string;
	country?: string;
	minPrice?: number;
	maxPrice?: number;
	minEcoScore?: number;
	condition?: string;
	sellerId?: string;
	sortBy?: string;
}

/**
 * Find category details by ID or Name (case-insensitive)
 */
const findCategoryDetails = (identifier: string): Categories | undefined => {
	if (!identifier) return undefined;
	const lowerIdentifier = identifier.trim().toLowerCase();
	return categories.find(
		(cat) =>
			cat.id.toLowerCase() === lowerIdentifier ||
			cat.name.trim().toLowerCase() === lowerIdentifier
	);
};

/**
 * Filter listings based on comprehensive filter options
 */
export const filterListings = (
	listings: FetchedListing[],
	filters: FilterOptions
): FetchedListing[] => {
	if (!listings || listings.length === 0) return [];

	let filteredListings = [...listings];

	// Filter by category ONLY if a specific category (not "All Categories") is selected
	if (filters.category && filters.category !== 'All Categories') {
		// Find category details using the identifier from filters (should be the Name)
		const categoryDetails = findCategoryDetails(filters.category);
		const expectedCategoryName = categoryDetails?.name; // Get the canonical name

		if (expectedCategoryName) {
			const lowerExpectedName = expectedCategoryName.trim().toLowerCase();
			filteredListings = filteredListings.filter((listing) => {
				const listingCategoryName = listing.category?.trim().toLowerCase();
				const match = listingCategoryName === lowerExpectedName;
				return match;
			});
		}
	}

	// Search in title and description
	if (filters.search && filters.search.trim() !== '') {
		const searchTerm = filters.search.toLowerCase().trim();
		filteredListings = filteredListings.filter(
			(listing) =>
				listing.title.toLowerCase().includes(searchTerm) ||
				listing.description.toLowerCase().includes(searchTerm)
		);
	}

	// Filter by country (extracted from location)
	if (filters.country && filters.country !== 'all') {
		filteredListings = filteredListings.filter((listing) => {
			const country = listing.location?.country;
			return (
				country && country.toLowerCase() === filters.country?.toLowerCase()
			);
		});
	}

	// Filter by price range
	if (filters.minPrice !== undefined) {
		filteredListings = filteredListings.filter(
			(listing) => listing.price >= filters.minPrice!
		);
	}

	if (filters.maxPrice !== undefined) {
		filteredListings = filteredListings.filter(
			(listing) => listing.price <= filters.maxPrice!
		);
	}

	// Filter by minimum eco score
	if (filters.minEcoScore !== undefined) {
		filteredListings = filteredListings.filter(
			(listing) => listing.ecoScore >= filters.minEcoScore!
		);
	}

	// Filter by condition
	if (filters.condition && filters.condition !== 'all') {
		filteredListings = filteredListings.filter(
			(listing) => listing.condition === filters.condition
		);
	}

	// Filter by seller
	if (filters.sellerId) {
		filteredListings = filteredListings.filter(
			(listing) => listing.sellerId === filters.sellerId
		);
	}

	// Sort listings
	if (filters.sortBy) {
		switch (filters.sortBy) {
			case 'newest':
				filteredListings.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				break;
			case 'price-low':
				filteredListings.sort((a, b) => a.price - b.price);
				break;
			case 'price-high':
				filteredListings.sort((a, b) => b.price - a.price);
				break;
			case 'eco-score':
				filteredListings.sort((a, b) => b.ecoScore - a.ecoScore);
				break;
			default:
				break;
		}
	}

	return filteredListings;
};
