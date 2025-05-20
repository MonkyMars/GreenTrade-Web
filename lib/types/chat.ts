import { z } from 'zod';

export const ChatMessageSchema = z.object({
	id: z.string(),
	conversationId: z.string(),
	text: z.string(),
	senderId: z.string(),
	timestamp: z.date().or(z.string()),
});

export const ConversationSchema = z.object({
	id: z.string(),
	listingId: z.string(),
	sellerId: z.string(),
	buyerId: z.string(),
	sellerName: z.string(),
	buyerName: z.string(),
	listingName: z.string(),
	lastMessage: z
		.object({
			text: z.string(),
			timestamp: z.date().or(z.string()),
		})
		.optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
