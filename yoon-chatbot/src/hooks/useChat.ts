import { useState, useEffect } from 'react';
import { sendMessage, fetchChatHistory } from '../services/chatService';
import { ChatMessage } from '../types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadChatHistory = async () => {
      setLoading(true);
      const history = await fetchChatHistory();
      setMessages(history);
      setLoading(false);
    };

    loadChatHistory();
  }, []);

  const handleSendMessage = async (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    await sendMessage(content);
  };

  return {
    messages,
    loading,
    handleSendMessage,
  };
};