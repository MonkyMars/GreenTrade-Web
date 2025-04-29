import api from '@/lib/backend/api/axiosConfig';
import { ChatMessage, Conversation } from '@/lib/types/chat';
import { v4 as uuidv4 } from 'uuid';

/**
 * Determines if the current user is the buyer in a conversation
 */
export function isBuyer(conversation: Conversation, userId: string): boolean {
  return conversation.buyerId === userId;
}

/**
 * Handles a new incoming message from the WebSocket
 */
export function handleNewMessage(
  newMessage: ChatMessage, 
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
): void {
  setMessages(prevMessages => {
    // Check if the message already exists in the array to prevent duplicates
    const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
    if (messageExists) {
      return prevMessages;
    }
    
    // Add the new message and sort by timestamp
    const updatedMessages = [...prevMessages, newMessage];
    return updatedMessages.sort((a, b) => {
      const dateA = a.timestamp instanceof Date 
        ? a.timestamp.getTime() 
        : new Date(a.timestamp).getTime();
      const dateB = b.timestamp instanceof Date 
        ? b.timestamp.getTime() 
        : new Date(b.timestamp).getTime();
      return dateA - dateB;
    });
  });
}

/**
 * Fetches all conversations for a user
 */
export async function fetchConversations(
  userId: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRefreshing?: React.Dispatch<React.SetStateAction<boolean>>,
  setConversations?: React.Dispatch<React.SetStateAction<Conversation[]>>,
  setError?: React.Dispatch<React.SetStateAction<string | null>>,
  isRefresh: boolean = false
): Promise<Conversation[] | undefined> {
  if (!isRefresh) {
    setLoading(true);
  }
  if (setRefreshing) {
    setRefreshing(true);
  }
  
  try {
    const response = await api.get(`/api/chat/conversation/${userId}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conversations = response.data.data.map((conversation: any) => ({
        id: conversation.id,
        listingId: conversation.listing_id,
        sellerId: conversation.seller_id,
        buyerId: conversation.buyer_id,
        sellerName: conversation.seller_name,
        buyerName: conversation.buyer_name,
        listingName: conversation.listing_title,
        lastMessage: conversation.last_message_content
          ? {
              text: conversation.last_message_content,
              timestamp: new Date(conversation.last_message_time),
            }
          : undefined,
      }))
    
      
    if (setConversations) {
      setConversations(conversations);
    }
    
    if (setError) {
      setError(null);
    }
    
    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    if (setError) {
      setError('Failed to load conversations. Please try again.');
    }
    return undefined;
  } finally {
    setLoading(false);
    if (setRefreshing) {
      setRefreshing(false);
    }
  }
}

/**
 * Fetches messages for a specific conversation
 */
export async function fetchMessages(
  conversationId: string,
  setLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setError?: React.Dispatch<React.SetStateAction<string | null>>
): Promise<ChatMessage[] | undefined> {
  setLoadingMessages(true);
  
  try {
    const response = await api.get(`/api/chat/messages/${conversationId}`);
    
    const messages = response.data;
    setMessages(messages);
    
    if (setError) {
      setError(null);
    }
    
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    if (setError) {
      setError('Failed to load messages. Please try again.');
    }
    return undefined;
  } finally {
    setLoadingMessages(false);
  }
}

/**
 * Sends a text message to the conversation
 */
export async function handleSendMessage(
  text: string,
  conversationId: string | null,
  userId: string,
  setSendingMessage: React.Dispatch<React.SetStateAction<boolean>>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  setError?: React.Dispatch<React.SetStateAction<string | null>>
): Promise<boolean> {
  if (!conversationId) {
    if (setError) setError('No active conversation selected.');
    return false;
  }
  
  if (!text.trim()) return false;
  
  setSendingMessage(true);
  
  // Create optimistic message
  const tempMessage: ChatMessage = {
    id: uuidv4(), // Temporary ID
    conversationId,
    senderId: userId,
    text: text.trim(),
    timestamp: new Date()
  };
  
  // Update UI optimistically
  setMessages(prev => [...prev, tempMessage]);
  
  try {
    // Send message to server
    const response = await api.post(`/api/chat/conversation/${conversationId}/messages`, {
      content: text.trim(),
      sender_id: userId
    });
    
    // Update last message in conversations list
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                text: text.trim(),
                timestamp: new Date()
              }
            }
          : conv
      )
    );
    
    // Replace optimistic message with real one from server if needed
    const serverMessage = response.data;
    if (serverMessage && serverMessage.id !== tempMessage.id) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? serverMessage : msg
        )
      );
    }
    
    if (setError) setError(null);
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    if (setError) setError('Failed to send message. Please try again.');
    
    // Remove optimistic message on failure
    setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    return false;
  } finally {
    setSendingMessage(false);
  }
}

/**
 * Updates the UI when a new message is received via WebSocket
 */
export function updateConversationLastMessage(
  message: ChatMessage,
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
): void {
  setConversations(prevConversations => 
    prevConversations.map(conv => 
      conv.id === message.conversationId
        ? {
            ...conv,
            lastMessage: {
              text: message.text,
              timestamp: message.timestamp
            }
          }
        : conv
    )
  );
}