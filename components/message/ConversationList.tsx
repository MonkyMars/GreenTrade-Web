import React from 'react';
import { cn } from '@/lib/functions/cn';
import { Conversation } from '@/lib/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { FaLeaf } from 'react-icons/fa';
import { FiMessageCircle } from 'react-icons/fi';

interface ConversationListProps {
	conversations: Conversation[];
	activeConversationId: string | null;
	onSelectConversation: (conversationId: string) => void;
	userId: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
	conversations,
	activeConversationId,
	onSelectConversation,
	userId,
}) => {
	return (
		<div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
			<div className="p-5.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm">
				<h2 className="text-lg font-semibold flex items-center text-gray-800 dark:text-gray-100">
					<div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-md mr-3">
						<FiMessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
					</div>
					<span>Conversations</span>
					<span className="ml-auto text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full">
						{conversations.length}
					</span>
				</h2>
			</div>

			<div className="overflow-y-auto flex-grow">
				{conversations.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 p-6 text-center">
						<div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
							<FaLeaf className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<p className="text-gray-700 dark:text-gray-300 font-medium">No conversations yet</p>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs">
							When you message sellers about sustainable items, your conversations will appear here
						</p>
					</div>
				) : (
					<ul className="pt-2">
						{conversations.map((conversation) => {
							const isActive = activeConversationId === conversation.id;
							const otherPersonName = userId === conversation.buyerId
								? conversation.sellerName
								: conversation.buyerName;

							const timestamp = conversation.lastMessage?.timestamp
								? typeof conversation.lastMessage.timestamp === 'string'
									? new Date(conversation.lastMessage.timestamp)
									: conversation.lastMessage.timestamp
								: null;

							return (
								<li
									key={conversation.id}
									className={cn(
										'mx-2 mb-0.5 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors',
										isActive ? 'bg-gray-200 dark:bg-gray-800' : 'bg-transparent'
									)}
									onClick={() => onSelectConversation(conversation.id)}
								>
									<div className="p-3 flex items-start">
										<div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
											{otherPersonName.charAt(0).toUpperCase()}
										</div>

										<div className="ml-3 flex-grow min-w-0">
											<div className="flex justify-between items-baseline">
												<h3 className={cn(
													"font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]",
													isActive && "text-primary dark:text-accent"
												)}>
													{otherPersonName}
												</h3>
												{timestamp && (
													<span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
														{formatDistanceToNow(timestamp, { addSuffix: false })}
													</span>
												)}
											</div>

											<div className="flex flex-col">
												<p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
													{conversation.listingName}
												</p>
												{conversation.lastMessage && (
													<p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] mt-1">
														{conversation.lastMessage.text}
													</p>
												)}
											</div>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
};