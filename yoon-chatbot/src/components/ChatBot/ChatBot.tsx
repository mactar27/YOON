import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { Message } from '../../types/chat';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
    // Here you would typically also call a function to get a response from the chatbot
  };

  return (
    <div className="chatbot-container">
      <ChatHeader />
      <div className="chat-bubbles">
        {messages.map((message) => (
          <ChatBubble key={message.id} content={message.content} sender={message.sender} />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBot;