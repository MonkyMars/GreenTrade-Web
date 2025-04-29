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
  handleSendMessage as sendChatMessage,
  handleNewMessage,
  updateConversationLastMessage
} from "@/lib/functions/chat/main";

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
  const { sendMessage } = useWebSocketChat({
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
    
    await sendChatMessage(
      text,
      activeConversationId,
      user.id,
      setIsSending,
      setMessages,
      setConversations,
      setError
    );
    
    // Also try to send via WebSocket for real-time updates
    const messageData = {
      type: 'message',
      content: text,
      conversation_id: activeConversationId,
      sender_id: user.id,
      created_at: new Date().toISOString()
    };
    
    sendMessage(JSON.stringify(messageData));
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
      <div className="container mx-auto py-22 px-4 max-w-7xl">
        {/* Error message banner if present */}
        {error && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded-md shadow-sm">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
          {/* Conversation list sidebar */}
          <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              userId={user.id}
            />
          </div>
          
          {/* Chat interface */}
          <div className="w-full md:w-2/3">
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