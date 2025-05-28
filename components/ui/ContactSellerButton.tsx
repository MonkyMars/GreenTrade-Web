import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useContactSeller, navigateToConversation } from '@/lib/functions/chat/contactSeller';
import { toast } from 'sonner';

export interface ContactSellerButtonProps {
	buyerId: string;
	sellerId: string;
	listingId: string;
	sellerName?: string;
	variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'primaryOutline';
	size?: 'default' | 'sm' | 'lg' | 'icon';
	className?: string;
	children?: React.ReactNode;
	disabled?: boolean;
	onConversationCreated?: (conversationId: string) => void;
}

/**
 * Reusable "Contact Seller" button component
 * Handles conversation creation and navigation to messages page
 */
export function ContactSellerButton({
	buyerId,
	sellerId,
	listingId,
	sellerName,
	variant = 'primaryOutline',
	size = 'default',
	className,
	children,
	disabled = false,
	onConversationCreated,
}: ContactSellerButtonProps) {
	const router = useRouter();
	const { contactSeller, isLoading } = useContactSeller();
	const handleContactSeller = async () => {
		// Validate required props
		if (!buyerId || !sellerId || !listingId) {
			toast.error('Missing required information to contact seller');
			return;
		}

		// Don't allow contacting yourself
		if (buyerId === sellerId) {
			toast.error('You cannot contact yourself');
			return;
		}

		await contactSeller({
			buyerId,
			sellerId,
			listingId,
			onSuccess: (conversationId) => {
				// Show success message
				const sellerDisplayName = sellerName || 'seller';
				toast.success(`Conversation with ${sellerDisplayName} started!`);

				// Call custom callback if provided
				if (onConversationCreated) {
					onConversationCreated(conversationId);
				}

				// Navigate to conversation
				navigateToConversation(conversationId, router);
			},
			onError: (errorMessage) => {
				toast.error(errorMessage);
			},
		});
	};

	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			onClick={handleContactSeller}
			disabled={disabled || isLoading || !buyerId || !sellerId || !listingId}
		>
			{isLoading ? (
				<>
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
					Connecting...
				</>
			) : (
				children || 'Contact Seller'
			)}
		</Button>
	);
}

// Export a simple version for common use cases
export interface SimpleContactSellerButtonProps {
	buyerId: string;
	sellerId: string;
	listingId: string;
	sellerName?: string;
	className?: string;
}

export function SimpleContactSellerButton({
	buyerId,
	sellerId,
	listingId,
	sellerName,
	className,
}: SimpleContactSellerButtonProps) {
	return (
		<ContactSellerButton
			buyerId={buyerId}
			sellerId={sellerId}
			listingId={listingId}
			sellerName={sellerName}
			variant="primaryOutline"
			className={className}
		/>
	);
}
