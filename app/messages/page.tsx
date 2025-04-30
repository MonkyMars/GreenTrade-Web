"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { ConversationList } from "@/components/message/ConversationList";
import { ChatInterface } from "@/components/message/ChatInterface";
import { ChatMessage, Conversation } from "@/lib/types/chat";
import { FiLoader, FiMessageSquare } from "react-icons/fi";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWebSocketChat } from "@/lib/services/useWebSocketChat";
import {
	fetchConversations,
	fetchMessages,
	handleNewMessage,
	updateConversationLastMessage
} from "@/lib/functions/chat/main";
import { sendMessage } from "@/lib/functions/chat/sendMessage";
import { cn } from "@/lib/functions/cn";

const MessagesPage = () => {
	const { user } = useAuth();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isMessagesLoading, setIsMessagesLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);

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
	useWebSocketChat({
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

			// On mobile, close the sidebar when a conversation is selected
			if (window.innerWidth < 768) {
				setIsMobileSidebarOpen(false);
			}
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
		if (!user?.id || !activeConversationId) return
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
		}
	};

	// Toggle mobile sidebar
	const toggleMobileSidebar = () => {
		setIsMobileSidebarOpen(prev => !prev);
	};

	// Get the active conversation object
	const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

	if (!user) {
		return null; // Protected route will handle this
	}

	if (isLoading && !refreshing) {
		return (
			<div className="flex items-center justify-center py-22 min-h-screen bg-white dark:bg-gray-900">
				<div className="flex flex-col items-center">
					<FiLoader className="w-10 h-10 mb-4 animate-spin text-green-600 dark:text-green-500" />
					<p className="text-gray-600 dark:text-gray-300">Loading your conversations...</p>
				</div>
			</div>
		);
	}

	return (
		<ProtectedRoute>
			<div className="min-h-screen flex flex-col pt-16 bg-white dark:bg-gray-900">
				{/* Error message banner if present */}
				{error && (
					<div className="bg-red-500 dark:bg-red-600 text-white p-3 mb-2 mx-4 mt-4 rounded-md shadow-sm">
						<p className="text-sm font-medium">{error}</p>
						<button
							onClick={() => setError(null)}
							className="text-xs underline hover:no-underline mt-1 text-white/90 hover:text-white"
						>
							Dismiss
						</button>
					</div>
				)}

				{/* Mobile conversation toggle button - only visible on mobile */}
				<button
					onClick={toggleMobileSidebar}
					className={cn(
						"md:hidden fixed z-20 bottom-4 left-4 bg-accent hover:bg-accent-hover text-white p-3 rounded-full shadow-lg",
						activeConversationId && !isMobileSidebarOpen ? "flex" : "hidden"
					)}
				>
					<FiMessageSquare className="h-6 w-6" />
				</button>

				<div className="flex flex-row h-[calc(100vh-4rem)] overflow-hidden">
					{/* Conversation list sidebar - conditionally shown on mobile */}
					<div className={cn(
						"fixed md:relative inset-0 bg-white dark:bg-gray-900 z-10 md:z-auto",
						"md:w-80 lg:w-96 flex-shrink-0 transition-transform duration-300 ease-in-out",
						isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
					)}>
						<ConversationList
							conversations={conversations}
							activeConversationId={activeConversationId}
							onSelectConversation={handleSelectConversation}
							userId={user.id}
						/>
					</div>

					{/* Chat interface */}
					<div className="flex-grow bg-white dark:bg-gray-900">
						<ChatInterface
							conversation={activeConversation}
							messages={messages}
							onSendMessage={handleSendMessage}
							userId={user.id}
							isLoading={isMessagesLoading}
						/>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default MessagesPage;