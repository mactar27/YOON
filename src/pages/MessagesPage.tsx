import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_read: boolean;
}

interface Expert {
  id: string;
  user_id: string;
  user: {
    full_name: string;
  };
}

export default function MessagesPage() {
  const { expertId } = useParams<{ expertId: string }>();
  const navigate = useNavigate();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expertId) {
      loadExpert();
      loadMessages();
    }
  }, [expertId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadExpert = async () => {
    if (!expertId) return;

    try {
      const { data, error } = await supabase
        .from('legal_experts')
        .select(`
          id,
          user_id,
          user:user_profiles(full_name)
        `)
        .eq('id', expertId)
        .single();

      if (error) throw error;
      setExpert(data);
    } catch (error) {
      console.error('Error loading expert:', error);
    }
  };

  const loadMessages = async () => {
    if (!expertId) return;

    // Charger les messages depuis localStorage
    const allMessages = JSON.parse(localStorage.getItem('yoon_messages') || '{}');
    const conversationKey = `conversation_${expertId}`;

    if (allMessages[conversationKey] && allMessages[conversationKey].length > 0) {
      setMessages(allMessages[conversationKey]);
    } else {
      // Messages de bienvenue par défaut
      const welcomeMessages = [
        {
          id: 'welcome_' + expertId,
          content: `Bonjour ! Je suis ${expert?.user?.full_name || 'cet expert'}. Comment puis-je vous aider avec votre problème juridique ?`,
          sender_id: expertId || '',
          receiver_id: 'user123',
          created_at: new Date().toISOString(),
          is_read: true
        }
      ];
      setMessages(welcomeMessages);

      // Sauvegarder les messages de bienvenue
      allMessages[conversationKey] = welcomeMessages;
      localStorage.setItem('yoon_messages', JSON.stringify(allMessages));
    }

    setLoading(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: 'user123', // En production, ceci serait l'ID de l'utilisateur connecté
      receiver_id: expertId || '',
      created_at: new Date().toISOString(),
      is_read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Sauvegarder les messages dans localStorage pour persister entre les sessions
    const allMessages = JSON.parse(localStorage.getItem('yoon_messages') || '{}');
    const conversationKey = `conversation_${expertId}`;
    if (!allMessages[conversationKey]) {
      allMessages[conversationKey] = [];
    }
    allMessages[conversationKey].push(message);
    localStorage.setItem('yoon_messages', JSON.stringify(allMessages));

    // Mettre à jour la liste des conversations
    updateConversationsList(expertId || '', newMessage);
  };

  const updateConversationsList = (expertId: string, lastMessage: string) => {
    const conversations = JSON.parse(localStorage.getItem('yoon_conversations') || '[]');
    const existingIndex = conversations.findIndex((conv: any) => conv.expertId === expertId);

    const expertNames: { [key: string]: string } = {
      '1': 'Me. Fatou Diop',
      '2': 'Me. Amadou Ndiaye',
      '3': 'Me. Mariama Sow',
      '4': 'Me. Ousmane Faye',
      '5': 'Me. Khady Ba',
      '6': 'Me. Abdoulaye Diallo'
    };

    if (existingIndex >= 0) {
      conversations[existingIndex].lastMessage = lastMessage;
      conversations[existingIndex].timestamp = new Date().toISOString();
      conversations[existingIndex].unreadCount += 1;
    } else {
      conversations.push({
        id: Date.now().toString(),
        expertId,
        expertName: expertNames[expertId] || 'Expert',
        lastMessage,
        timestamp: new Date().toISOString(),
        unreadCount: 1,
        avatar: expertNames[expertId]?.charAt(3) || 'E'
      });
    }

    localStorage.setItem('yoon_conversations', JSON.stringify(conversations));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B4C4C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/experts')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B4C4C] to-[#8A6A6A] flex items-center justify-center text-white font-bold">
                {expert?.user.full_name.charAt(0).toUpperCase() || 'E'}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Messages
                </h1>
                <p className="text-sm text-gray-500">En ligne</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-200px)] flex flex-col">
          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message, index) => {
              const isCurrentUser = message.sender_id === 'user123';
              const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
              const showTimestamp = index === messages.length - 1 ||
                new Date(messages[index + 1].created_at).getTime() - new Date(message.created_at).getTime() > 300000; // 5 minutes

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCurrentUser && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B4C4C] to-[#8A6A6A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {expert?.user?.full_name.charAt(0).toUpperCase() || 'E'}
                    </div>
                  )}
                  {!isCurrentUser && !showAvatar && <div className="w-8"></div>}

                  <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        isCurrentUser
                          ? 'bg-[#6B4C4C] text-white rounded-br-md'
                          : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>

                    {showTimestamp && (
                      <p className={`text-xs mt-1 px-2 ${
                        isCurrentUser ? 'text-right text-gray-400' : 'text-left text-gray-500'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>

                  {isCurrentUser && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A9B299] to-[#8A9279] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      V
                    </div>
                  )}
                  {isCurrentUser && !showAvatar && <div className="w-8"></div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Tapez votre message..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-transparent resize-none max-h-32"
                  style={{ minHeight: '48px' }}
                />
                <div className="absolute right-3 bottom-3 text-gray-400">
                  <Send className="w-4 h-4" />
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-3 bg-[#6B4C4C] text-white rounded-2xl hover:bg-[#5A3E3E] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Appuyez sur Entrée pour envoyer • Shift+Entrée pour un retour à la ligne
              </p>
              {newMessage.trim() && (
                <span className="text-xs text-gray-400">
                  {newMessage.length} caractères
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
