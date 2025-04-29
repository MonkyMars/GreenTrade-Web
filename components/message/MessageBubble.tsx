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
        'flex mb-4 max-w-[90%]',
        isOwn ? 'justify-end self-end' : 'justify-start self-start'
      )}
    >
      <div
        className={cn(
          'rounded-2xl p-4',
          isOwn 
            ? 'bg-primary text-white rounded-br-none' 
            : 'bg-background dark:bg-gray-800 text-foreground dark:text-gray-100 rounded-bl-none border border-border dark:border-gray-700'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <p 
          className={cn(
            'text-xs mt-2 text-right',
            isOwn ? 'text-white/70' : 'text-muted dark:text-gray-400'
          )}
        >
          {timeAgo}
        </p>
      </div>
    </div>
  );
};