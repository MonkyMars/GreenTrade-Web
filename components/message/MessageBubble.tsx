import React from 'react';
import { cn } from '@/lib/functions/cn';
import { ChatMessage } from '@/lib/types/chat';
import { format } from 'date-fns';

interface MessageBubbleProps {
	message: ChatMessage;
	isOwn: boolean;
	showSender?: boolean;
	senderName?: string;
	ref?: React.RefObject<HTMLDivElement | null> | null;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
	message,
	isOwn,
	showSender = false,
	senderName = isOwn ? 'You' : 'User',
	ref,
}) => {
	const timestamp = typeof message.timestamp === 'string'
		? new Date(message.timestamp)
		: message.timestamp;

	const timeFormatted = format(timestamp, 'h:mm a');

	return (
		<div
			ref={ref}
			className={cn(
				'group flex items-start px-4 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
				isOwn ? 'justify-start' : 'justify-start'
			)}
		>
			{!isOwn && showSender && (
				<div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0 mr-3">
					{senderName.charAt(0).toUpperCase()}
				</div>
			)}

			{!isOwn && !showSender && (
				<div className="w-10 h-10 opacity-0 flex-shrink-0 mr-3">
					{/* Spacer to maintain alignment */}
				</div>
			)}

			<div className={cn(
				'flex flex-col max-w-[85%]',
				isOwn ? 'items-start' : 'items-start'
			)}>
				{showSender && (
					<div className="flex items-center mb-1">
						<span className={cn(
							"font-medium text-sm",
							isOwn ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"
						)}>
							{senderName}
						</span>
						<span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
							{timeFormatted}
						</span>
					</div>
				)}

				<div className={cn(
					'rounded-lg py-2 px-3',
					isOwn
						? 'bg-primary/10 dark:bg-primary/20 text-gray-800 dark:text-gray-100'
						: 'bg-background dark:bg-gray-700 text-gray-800 dark:text-gray-100'
				)}>
					<p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
				</div>

				{!showSender && (
					<span className="text-xs text-gray-400 dark:text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
						{timeFormatted}
					</span>
				)}
			</div>
		</div>
	);
};