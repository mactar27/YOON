import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#A9B299] to-[#6B4C4C] p-4 rounded-t-xl flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white">Y</span>
        <span className="text-white font-medium">Assistant YOON</span>
      </div>
      <button 
        onClick={onClose}
        className="hover:bg-white/10 p-1 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}