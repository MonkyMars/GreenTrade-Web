import { FetchedBid, FetchedBidSchema } from "@/lib/types/main";
import api from "../api/axiosConfig";
import { AppError, retryOperation } from "@/lib/errorUtils";
import camelcaseKeys from 'camelcase-keys';

export const getBids = async (listingId: string): Promise<FetchedBid[]> => {
	try {
		const response = await retryOperation(
			() => api.get(`/listings/${listingId}/bids`),
			{
				context: 'Fetching bids',
				maxRetries: 2,
				showToastOnRetry: false, // Don't show toast for these retries
			}
		)

		if (!response.data.success) {
			return [];
		}

		const rawBids = response.data.data;
		if (!rawBids || !Array.isArray(rawBids)) {
			if (process.env.NODE_ENV !== 'production') {
				console.error('Invalid data format for bids:', rawBids);
			}
			return [];
		}

		const validBids: FetchedBid[] = [];
		let invalidCount = 0;

		// Process each bid with proper validation
		for (const bid of rawBids) {
			try {
				// Convert snake_case to camelCase for field names that need it
				const formattedBid = camelcaseKeys(bid, { deep: true });

				// Validate with Zod schema
				const validBid = FetchedBidSchema.parse(formattedBid);
				validBids.push(validBid);
			} catch (error) {
				invalidCount++;
				if (process.env.NODE_ENV !== 'production') {
					console.error('Invalid similar listing detected:', error);
				}
			}
		}

		if (invalidCount > 0) {
			if (process.env.NODE_ENV !== 'production') {
				console.warn(`Found ${invalidCount} invalid bids`);
			}
		}

		return validBids;
	} catch (error) {
		console.error('Error fetching bids:', error);
		throw new AppError('An unexpected error occurred while fetching bids');
	}
};