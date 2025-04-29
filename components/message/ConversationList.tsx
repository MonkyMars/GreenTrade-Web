import React from 'react';
import { cn } from '@/lib/functions/cn';
import { Conversation } from '@/lib/types/chat';
import { formatDistanceToNow } from 'date-fns';

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
    <div className="w-full h-full overflow-y-auto">
      <h2 className="text-lg font-semibold px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        Messages
      </h2>
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            When you message sellers, your conversations will appear here
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
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
                  'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                  isActive && 'bg-gray-100 dark:bg-gray-800'
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="px-4 py-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {otherPersonName}
                    </h3>
                    {timestamp && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(timestamp, { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {conversation.listingName}
                  </p>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                      {conversation.lastMessage.text}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};