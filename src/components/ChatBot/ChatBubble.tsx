import { Message } from './ChatBot';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  return (
    <div
      className={`${
        message.isBot
          ? 'bg-gray-100 rounded-br-xl'
          : 'bg-[#6B4C4C] text-white rounded-bl-xl ml-auto'
      } p-3 rounded-t-xl max-w-[80%] animate-fade-in`}
    >
      {message.text}
    </div>
  );
}