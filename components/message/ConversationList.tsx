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
    <div className="w-full h-full flex flex-col bg-card-bg dark:bg-gray-800">
      <h2 className="text-xl font-semibold p-6 border-b border-border dark:border-gray-700 text-primary dark:text-accent">
        Messages
      </h2>
      
      <div className="overflow-y-auto flex-grow">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
            <p className="text-muted dark:text-gray-400">No conversations yet</p>
            <p className="text-sm text-muted-foreground dark:text-gray-500 mt-3">
              When you message sellers, your conversations will appear here
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border dark:divide-gray-700">
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
                    'cursor-pointer transition-colors',
                    isActive 
                      ? 'bg-background dark:bg-gray-700 border-l-4 border-primary dark:border-accent' 
                      : 'hover:bg-background/50 dark:hover:bg-gray-700/50 border-l-4 border-transparent',
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="p-4 pl-5">
                    <div className="flex justify-between items-baseline">
                      <h3 className={cn(
                        "font-medium",
                        isActive 
                          ? "text-primary dark:text-accent" 
                          : "text-foreground dark:text-gray-100"
                      )}>
                        {otherPersonName}
                      </h3>
                      {timestamp && (
                        <span className="text-xs text-muted dark:text-gray-400">
                          {formatDistanceToNow(timestamp, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted dark:text-gray-400 mt-1 line-clamp-1">
                      {conversation.listingName}
                    </p>
                    {conversation.lastMessage && (
                      <p className="text-sm text-muted-foreground dark:text-gray-300 mt-2 line-clamp-1">
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
    </div>
  );
};