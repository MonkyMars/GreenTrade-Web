import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBubble } from './MessageBubble';
import { ChatMessage, Conversation } from '@/lib/types/chat';
import { FiSend } from 'react-icons/fi';
import { cn } from '@/lib/functions/cn';

interface ChatInterfaceProps {
  conversation: Conversation | null;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  userId: string;
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && conversation) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus input when conversation changes
    inputRef.current?.focus();
  }, [conversation]);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-background dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-primary dark:text-accent">
          Select a conversation
        </h2>
        <p className="text-muted dark:text-gray-400 mt-3 max-w-md">
          Choose a conversation from the list to start messaging
        </p>
      </div>
    );
  }

  const otherPersonName = userId === conversation.buyerId 
    ? conversation.sellerName 
    : conversation.buyerName;

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-6 py-4 border-b border-border dark:border-gray-700 shrink-0 bg-card-bg dark:bg-gray-800">
        <div className="flex items-center">
          <div>
            <h3 className="font-semibold text-xl text-primary dark:text-accent">
              {otherPersonName}
            </h3>
            <p className="text-sm text-muted dark:text-gray-400">
              {conversation.listingName}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-white dark:bg-gray-900">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-muted dark:text-gray-400">
              Loading messages...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted dark:text-gray-400">No messages yet</p>
            <p className="text-sm text-muted-foreground dark:text-gray-500 mt-2">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === userId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form 
        onSubmit={handleSendMessage}
        className={cn(
          "p-4 border-t border-border dark:border-gray-700 shrink-0",
          "bg-card-bg dark:bg-gray-800"
        )}
      >
        <div className="flex items-center gap-3">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow shadow-sm focus-visible:ring-primary/50"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isLoading}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            <FiSend className="h-4 w-4 mr-2" />
            <span>Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
};