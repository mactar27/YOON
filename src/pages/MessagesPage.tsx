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
    // Simulation de chargement des messages
    // En production, ceci viendrait de la base de données
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          content: 'Bonjour, je suis intéressé par une consultation concernant un problème de droit du travail.',
          sender_id: 'user123',
          receiver_id: expertId || '',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: true
        },
        {
          id: '2',
          content: 'Bonjour ! Je serais ravi de vous aider. Pouvez-vous me donner plus de détails sur votre situation ?',
          sender_id: expertId || '',
          receiver_id: 'user123',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          is_read: true
        },
        {
          id: '3',
          content: 'Il s\'agit d\'un licenciement abusif. J\'ai été congédié sans motif valable.',
          sender_id: 'user123',
          receiver_id: expertId || '',
          created_at: new Date(Date.now() - 900000).toISOString(),
          is_read: false
        }
      ]);
      setLoading(false);
    }, 1000);
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

    // Simulation de réponse automatique
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Merci pour ces informations. Je vais examiner votre dossier et vous recontacterai sous 24h avec mes recommandations.',
        sender_id: expertId || '',
        receiver_id: 'user123',
        created_at: new Date().toISOString(),
        is_read: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
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
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === 'user123' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === 'user123'
                      ? 'bg-[#6B4C4C] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === 'user123' ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-[#6B4C4C] text-white rounded-lg hover:bg-[#5A3E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Appuyez sur Entrée pour envoyer • Shift+Entrée pour un retour à la ligne
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
