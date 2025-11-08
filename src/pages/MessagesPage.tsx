import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageSquare, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Header from '../components/Header';

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
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
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
      // Utiliser des données mock pour l'expert
      const expertNames: { [key: string]: string } = {
        '1': 'Me. Fatou Diop',
        '2': 'Me. Amadou Ndiaye',
        '3': 'Me. Mariama Sow',
        '4': 'Me. Ousmane Faye',
        '5': 'Me. Khady Ba',
        '6': 'Me. Abdoulaye Diallo'
      };

      const mockExpert: Expert = {
        id: expertId,
        user_id: `user_${expertId}`,
        user: {
          full_name: expertNames[expertId] || 'Expert juridique'
        }
      };

      setExpert(mockExpert);
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

    // Créer une notification pour l'expert
    // (Ceci pourrait être intégré au service de notification)
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
      <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white flex items-center justify-center">
        {/* Header pour le loading */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Header />
        </div>
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B4C4C]"></div>
          <div className="absolute inset-0 bg-[#A9B299]/20 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white">
      {/* Header moderne */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4">
          <h1 className="text-2xl font-bold text-[#6B4C4C]">Messages</h1>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* En-tête de la conversation moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-6 border border-[#A9B299]/20 p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/messages')}
              className="p-3 hover:bg-[#A9B299]/10 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 text-[#6B4C4C]" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-[#4A3A3A] flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
              {expert?.user.full_name.charAt(0).toUpperCase() || 'E'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#6B4C4C]">
                  {expert?.user.full_name}
                </h1>
                <MessageSquare className="w-5 h-5 text-[#A9B299]" />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-600 font-medium">Expert juridique</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">En ligne</span>
                </div>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#6B4C4C]" />
                <span className="px-3 py-1.5 bg-[#6B4C4C] text-white text-sm rounded-full font-medium shadow-lg">
                  {unreadCount} notif{unreadCount > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Interface de messages moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#A9B299]/20 h-[calc(100vh-300px)] flex flex-col overflow-hidden">
          {/* Messages container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-[#A9B299]/5">
            {messages.map((message, index) => {
              const isCurrentUser = message.sender_id === 'user123';
              const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
              const showTimestamp = index === messages.length - 1 ||
                new Date(messages[index + 1].created_at).getTime() - new Date(message.created_at).getTime() > 300000; // 5 minutes

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCurrentUser && showAvatar && (
                    <div className="w-12 h-12 rounded-2xl bg-[#4A3A3A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
                      {expert?.user?.full_name.charAt(0).toUpperCase() || 'E'}
                    </div>
                  )}
                  {!isCurrentUser && !showAvatar && <div className="w-12"></div>}

                  <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`px-5 py-4 rounded-2xl shadow-sm ${
                        isCurrentUser
                          ? 'bg-[#6B4C4C] text-white rounded-br-lg'
                          : 'bg-white/80 text-[#6B4C4C] rounded-bl-lg border border-[#A9B299]/30'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>

                    {showTimestamp && (
                      <p className={`text-xs mt-2 px-2 ${
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
                    <div className="w-12 h-12 rounded-2xl bg-[#6B7A4A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  {isCurrentUser && !showAvatar && <div className="w-12"></div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie moderne */}
          <div className="p-6 border-t border-[#A9B299]/20 bg-white/50 backdrop-blur-sm">
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
                  placeholder="Tapez votre message à l'expert..."
                  rows={1}
                  className="w-full px-5 py-4 pr-12 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B4C4C] focus:border-[#6B4C4C] resize-none max-h-32 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                  style={{ minHeight: '52px' }}
                />
                <div className="absolute right-4 bottom-4 text-[#A9B299]">
                  <Send className="w-5 h-5" />
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-4 bg-[#6B4C4C] text-white rounded-2xl hover:bg-[#5A3E3E] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-gray-500">
                Appuyez sur Entrée pour envoyer • Shift+Entrée pour un retour à la ligne
              </p>
              {newMessage.trim() && (
                <span className="text-xs text-[#6B4C4C] font-medium">
                  {newMessage.length} caractères
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notifications récentes */}
        {notifications.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#6B4C4C]" />
              Notifications récentes
            </h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-gray-50 rounded-lg border-l-4 border-[#6B4C4C]"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.timestamp).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
