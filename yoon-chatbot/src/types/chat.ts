export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatHistory {
  messages: ChatMessage[];
}

export interface UserInput {
  message: string;
}