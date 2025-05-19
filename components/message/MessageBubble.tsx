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
	userName: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
	message,
	isOwn,
	showSender = false,
	senderName = isOwn ? 'You' : 'User',
	ref,
	userName,
}) => {
	const timestamp =
		typeof message.timestamp === 'string'
			? new Date(message.timestamp)
			: message.timestamp;

	const timeFormatted = format(timestamp, 'h:mm a');

	const sender = isOwn ? userName : senderName;

	return (
		<div
			ref={ref}
			className={
				'group flex items-start px-4 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors justfy-start'
			}
		>
			{showSender && (
				<div
					className={cn(
						'w-10 h-10 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0 mr-3',
						isOwn
							? 'bg-green-300 dark:bg-accent/50'
							: 'bg-green-100 dark:bg-green-900/30'
					)}
				>
					{sender.charAt(0).toUpperCase()}
				</div>
			)}

			{!showSender && (
				<div
					className={cn(
						'w-10 h-10 opacity-0 rounded-full flex items-center justify-center flex-shrink-0 mr-3',
						isOwn
							? 'bg-green-300 dark:bg-accent/50'
							: 'bg-green-100 dark:bg-green-900/30'
					)}
				>
					{/* Spacer to maintain alignment */}
				</div>
			)}

			<div className={'flex flex-col max-w-[85%] items-start'}>
				{showSender && (
					<div className='flex items-center mb-1'>
						<span
							className={cn(
								'font-medium text-sm',
								isOwn
									? 'text-green-600 dark:text-green-400'
									: 'text-gray-700 dark:text-gray-300'
							)}
						>
							{senderName}
						</span>
						<span className='text-xs text-gray-400 dark:text-gray-500 ml-2'>
							{timeFormatted}
						</span>
					</div>
				)}

				<div
					className={cn(
						'rounded-lg py-2 px-3',
						isOwn
							? 'bg-green-400/50 dark:bg-accent/[0.8] text-gray-800 dark:text-gray-100'
							: 'bg-accent/10 dark:bg-accent/20 text-gray-800 dark:text-gray-100'
					)}
				>
					<p className='whitespace-pre-wrap break-words text-sm'>
						{message.text}
					</p>
				</div>

				{/* {!showSender && (
					<span className="text-xs text-gray-400 dark:text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
						{timeFormatted}
					</span>
				)} */}
			</div>
		</div>
	);
};
