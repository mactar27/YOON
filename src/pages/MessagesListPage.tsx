import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Search } from 'lucide-react';

interface Conversation {
  id: string;
  expertId: string;
  expertName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
}

export default function MessagesListPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    // Charger les conversations depuis localStorage
    const savedConversations = JSON.parse(localStorage.getItem('yoon_conversations') || '[]');

    // Si pas de conversations sauvegardées, utiliser des exemples
    if (savedConversations.length === 0) {
      setConversations([
        {
          id: '1',
          expertId: '1',
          expertName: 'Me. Fatou Diop',
          lastMessage: 'Bonjour ! Comment puis-je vous aider ?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 0,
          avatar: 'F'
        }
      ]);
    } else {
      setConversations(savedConversations);
    }
    setLoading(false);
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white pb-24">
      {/* Header moderne avec éléments décoratifs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        
        <div className="relative px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="p-3 hover:bg-[#A9B299]/10 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 text-[#6B4C4C]" />
            </button>
            <h1 className="text-2xl font-bold text-[#6B4C4C]">Messages</h1>
          </div>

          {/* Barre de recherche moderne */}
          <div className="relative mt-5">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A9B299]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
              className="w-full pl-14 pr-4 py-4 bg-white/50 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] text-gray-800 placeholder-gray-500 backdrop-blur-sm shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="px-6 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl h-20 border border-[#A9B299]/20"></div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <MessageCircle className="w-24 h-24 text-[#A9B299] mx-auto" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#6B4C4C]/20 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-[#6B4C4C] mb-3">
              {searchQuery ? 'Aucune conversation trouvée' : 'Aucun message'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              {searchQuery
                ? 'Essayez de modifier vos critères de recherche'
                : 'Vos conversations avec les experts apparaîtront ici'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/experts')}
                className="mt-8 bg-[#6B4C4C] text-white px-8 py-4 rounded-2xl hover:bg-[#5A3E3E] transition-all duration-200 font-semibold shadow-lg transform hover:scale-105"
              >
                Contacter un expert
              </button>
            )}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-[#A9B299] rounded-full"></div>
              <div className="w-2 h-2 bg-[#A9B299] rounded-full"></div>
              <div className="w-2 h-2 bg-[#A9B299] rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/messages/${conversation.expertId}`)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer border border-[#A9B299]/20 hover:border-[#6B4C4C]/40 transform hover:scale-[1.01]"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar moderne */}
                  <div className="w-14 h-14 rounded-2xl bg-[#4A3A3A] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                    {conversation.avatar}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#6B4C4C] truncate text-lg">
                        {conversation.expertName}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm text-gray-500">
                          {formatTime(conversation.timestamp)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-[#6B4C4C] text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-lg">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className={`text-sm truncate ${
                      conversation.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-600'
                    }`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}