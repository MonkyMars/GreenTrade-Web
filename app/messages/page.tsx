"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { ConversationList } from "@/components/message/ConversationList";
import { ChatInterface } from "@/components/message/ChatInterface";
import { ChatMessage, Conversation } from "@/lib/types/chat";
import { FiLoader } from "react-icons/fi";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWebSocketChat } from "@/lib/services/useWebSocketChat";
import {
  fetchConversations,
  fetchMessages,
  handleNewMessage,
  updateConversationLastMessage
} from "@/lib/functions/chat/main";
import { sendMessage } from "@/lib/functions/chat/sendMessage";

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch conversations on component mount
  useEffect(() => {
    if (user?.id) {
      fetchConversations(
        user.id,
        setIsLoading,
        setRefreshing,
        setConversations,
        setError
      );
    }
  }, [user?.id]);

  // WebSocket message handler
  const onNewMessage = (newMessage: ChatMessage) => {
    handleNewMessage(newMessage, setMessages);
    updateConversationLastMessage(newMessage, setConversations);
  };

  // Use WebSocket hook
  const { sendMessage: sendWebSocketMessage } = useWebSocketChat({
    conversationId: activeConversationId,
    userId: user?.id || null,
    onMessage: onNewMessage,
    onError: (errorMsg: string) => setError(errorMsg || null)
  });

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversationId && user?.id) {
      setMessages([]);
      fetchMessages(activeConversationId, setIsMessagesLoading, setMessages, setError);
    }
  }, [activeConversationId, user?.id]);

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    if (conversationId !== activeConversationId) {
      setActiveConversationId(conversationId);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    if (!user?.id || !activeConversationId) return;
    
    setIsSending(true);
    try {
      // Send message using HTTP endpoint
      const newMessage = await sendMessage(activeConversationId, user.id, text);
      
      // Update UI with the new message
      if (newMessage) {
        handleNewMessage(newMessage, setMessages);
        updateConversationLastMessage(newMessage, setConversations);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Get the active conversation object
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  if (!user) {
    return null; // Protected route will handle this
  }

  if (isLoading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Error message banner if present */}
        {error && (
          <div className="bg-error text-white p-3 mb-2 mx-4 mt-4 rounded-md shadow-sm">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
          {/* Conversation list sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border dark:border-gray-700 bg-card-bg dark:bg-gray-800">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              userId={user.id}
            />
          </div>
          
          {/* Chat interface */}
          <div className="w-full md:w-2/3 lg:w-3/4 bg-white dark:bg-gray-900">
            <ChatInterface
              conversation={activeConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              userId={user.id}
              isLoading={isMessagesLoading || isSending}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MessagesPage;