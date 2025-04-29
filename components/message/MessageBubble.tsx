import React from 'react';
import { cn } from '@/lib/functions/cn';
import { ChatMessage } from '@/lib/types/chat';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const timestamp = typeof message.timestamp === 'string' 
    ? new Date(message.timestamp) 
    : message.timestamp;
  
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <div
      className={cn(
        'flex mb-4',
        isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[70%] rounded-lg p-3 shadow-sm',
          isOwn 
            ? 'bg-green-600 text-white rounded-br-none' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <p 
          className={cn(
            'text-xs mt-1',
            isOwn ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {timeAgo}
        </p>
      </div>
    </div>
  );
};