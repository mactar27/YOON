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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          </div>

          {/* Barre de recherche */}
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
              className="w-full pl-12 pr-4 py-3 bg-[#A9B299] bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A9B299] text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="px-6 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-20 animate-pulse"></div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'Aucune conversation trouvée' : 'Aucun message'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery
                ? 'Essayez de modifier vos critères de recherche'
                : 'Vos conversations avec les experts apparaîtront ici'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/experts')}
                className="mt-6 bg-[#6B4C4C] text-white px-6 py-3 rounded-lg hover:bg-[#5A3E3E] transition-colors font-semibold"
              >
                Contacter un expert
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/messages/${conversation.expertId}`)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-[#6B4C4C] hover:border-opacity-20"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B4C4C] to-[#8A6A6A] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {conversation.avatar}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {conversation.expertName}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.timestamp)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-[#6B4C4C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
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