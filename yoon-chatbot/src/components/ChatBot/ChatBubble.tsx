import React from 'react';

interface ChatBubbleProps {
  message: string;
  sender: 'user' | 'bot';
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender }) => {
  const bubbleStyle = sender === 'user' 
    ? 'bg-blue-500 text-white' 
    : 'bg-gray-300 text-black';

  return (
    <div className={`p-3 rounded-lg my-2 ${bubbleStyle}`}>
      {message}
    </div>
  );
};

export default ChatBubble;