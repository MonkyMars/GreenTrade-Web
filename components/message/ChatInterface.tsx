import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBubble } from './MessageBubble';
import { ChatMessage, Conversation } from '@/lib/types/chat';
import {
	FiSend,
	FiPaperclip,
	FiSmile,
	FiTag,
	FiShoppingCart,
} from 'react-icons/fi';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface ChatInterfaceProps {
	conversation: Conversation | null;
	messages: ChatMessage[];
	onSendMessage: (text: string) => void;
	userId: string | undefined;
	isLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
	conversation,
	messages,
	onSendMessage,
	userId,
	isLoading = false,
}) => {
	const [newMessage, setNewMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { user } = useAuth();

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (newMessage.trim() && conversation) {
			onSendMessage(newMessage.trim());
			setNewMessage('');
		}
	};

	// Group messages by sender for a more Discord-like appearance
	const groupedMessages = React.useMemo(() => {
		const groups: {
			senderName: string;
			senderId: string;
			messages: ChatMessage[];
			isOwn: boolean;
		}[] = [];

		messages.forEach((message, i) => {
			const isOwn = message.senderId === userId;
			const senderName = isOwn
				? 'You'
				: conversation?.buyerId === message.senderId
					? conversation?.buyerName || 'User'
					: conversation?.sellerName || 'User';

			// Check if this message should be grouped with the previous one
			if (
				i > 0 &&
				messages[i - 1].senderId === message.senderId &&
				// Messages within 10 minutes are grouped together
				Math.abs(
					new Date(message.timestamp).getTime() -
					new Date(messages[i - 1].timestamp).getTime()
				) <
				10 * 60 * 1000
			) {
				// Add to the existing group
				const allFilled = Object.values(message).every(
					(val) => val !== undefined && val !== null
				);
				if (!allFilled) return; // Skip empty messages
				groups[groups.length - 1].messages.push(message);
			} else {
				const allFilled = Object.values(message).every(
					(val) => val !== undefined && val !== null
				);
				if (!allFilled) return; // Skip empty messages
				// Create a new group
				groups.push({
					senderName,
					senderId: message.senderId,
					messages: [message],
					isOwn,
				});
			}
		});

		return groups;
	}, [messages, userId, conversation]);

	useEffect(() => {
		// Scroll to the bottom of the messages when new messages are added
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	useEffect(() => {
		// Focus input when conversation changes
		inputRef.current?.focus();
	}, [conversation]);

	if (!userId) return null;

	if (!conversation) {
		return (
			<div className='flex flex-col items-center justify-center h-full p-6 text-center bg-white dark:bg-gray-900'>
				<div className='w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6'>
					<FiSend className='h-8 w-8 text-green-600 dark:text-green-400' />
				</div>
				<h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>
					Select a conversation
				</h2>
				<p className='text-gray-600 dark:text-gray-400 mt-3 max-w-md'>
					Choose a conversation from the list to start messaging about
					sustainable items
				</p>
			</div>
		);
	}

	const otherPersonName =
		userId === conversation.buyerId
			? conversation.sellerName
			: conversation.buyerName;

	const userStatus = userId === conversation.buyerId ? 'Seller' : 'Buyer';

	return (
		<div className='flex flex-col h-full'>
			{/* Chat header */}
			<div className='px-6 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900 shadow-sm z-10'>
				<div className='flex items-center'>
					<div className='w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0 mr-3'>
						{otherPersonName.charAt(0).toUpperCase()}
					</div>
					<div>
						<div className='flex items-center'>
							<h3 className='font-semibold text-lg text-gray-900 dark:text-gray-100'>
								{otherPersonName}
							</h3>
							{/* Get opposites because it's for the other person*/}
							<Badge variant={'success'} className='ml-2'>
								{userStatus === 'Seller' ? (
									<FiTag className='mr-1' />
								) : (
									<FiShoppingCart className='mr-1' />
								)}
								{userStatus}
							</Badge>
						</div>
						<Link
							href={`/listings/${conversation.listingId}`}
							className='flex text-sm hover:underline text-gray-700 dark:text-gray-300'
						>
							{conversation.listingName}
						</Link>
					</div>
				</div>
			</div>

			{/* Messages */}
			<div
				ref={messagesEndRef}
				className='flex-grow overflow-y-auto bg-white dark:bg-black/[0.08] pb-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent'
			>
				{isLoading ? (
					<div className='flex justify-center items-center h-full'>
						<div className='animate-pulse flex flex-col items-center'>
							<div className='w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3'>
								<FiSend className='h-5 w-5 text-green-600 dark:text-green-400' />
							</div>
							<p className='text-gray-500 dark:text-gray-400'>
								Loading messages...
							</p>
						</div>
					</div>
				) : messages.length === 0 ? (
					<div className='flex flex-col items-center justify-center h-full text-center p-6'>
						<div className='w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4'>
							<FiSend className='h-6 w-6 text-green-600 dark:text-green-400' />
						</div>
						<p className='text-gray-700 dark:text-gray-300 font-medium'>
							No messages yet
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs'>
							Start the conversation about sustainable trading
						</p>
					</div>
				) : (
					<div className='space-y-3 pt-4'>
						{groupedMessages.filter(Boolean).map((group, groupIndex) => (
							<div
								key={`${group.senderId}-${groupIndex}`}
								className='message-group'
							>
								{group.messages.filter(Boolean).map((message, messageIndex) => (
									<MessageBubble
										key={message.id}
										message={message}
										isOwn={group.isOwn}
										showSender={messageIndex === 0}
										senderName={group.senderName}
										userName={user?.name || 'Anonymous'}
									/>
								))}
							</div>
						))}
						<div ref={messagesEndRef} />{' '}
						{/* Empty div for scrolling to the end */}
					</div>
				)}
			</div>

			{/* Message input */}
			<div className='px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900'>
				<form onSubmit={handleSendMessage} className='relative'>
					<div className='flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl pl-4 pr-2 py-2'>
						<button
							type='button'
							className='text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 p-1 cursor-pointer'
							aria-label='Add file'
							disabled={isLoading || newMessage.trim() !== ''}
						>
							<FiPaperclip className='h-5 w-5' />
						</button>

						<Input
							ref={inputRef}
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							placeholder='Type a message...'
							className='flex-grow shadow-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3'
							disabled={isLoading}
						/>

						<div className='flex items-center'>
							<button
								type='button'
								className='text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 p-1 mr-1'
								aria-label='Add emoji'
								disabled={isLoading}
							>
								<FiSmile className='h-5 w-5' />
							</button>

							<Button
								type='submit'
								disabled={!newMessage.trim() || isLoading}
								className='bg-accent hover:bg-accent-hover text-white rounded-xl h-9 w-9 p-0 flex items-center justify-center ml-1 cursor-pointer'
								aria-label='Send message'
							>
								<FiSend className='h-4 w-4' />
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};
