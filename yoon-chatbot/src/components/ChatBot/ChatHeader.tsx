import React from 'react';
import YLogo from './YLogo';

const ChatHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-[#6B4C4C] text-white">
      <YLogo />
      <h1 className="text-xl font-bold">Yoon Chatbot</h1>
    </header>
  );
};

export default ChatHeader;