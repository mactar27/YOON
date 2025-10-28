import { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { MessageSquare } from 'lucide-react';

export interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const generateResponse = (message: string): string => {
  // Base de connaissances
  const knowledge = {
    // Informations générales
    default: [
      "Je suis l'assistant YOON, spécialisé en droit.",
      "• Questions juridiques générales",
      "• Procédures légales",
      "• Consultation d'experts",
      "• Navigation dans l'application",
    ].join('\n'),

    // Domaines juridiques
    juridique: {
      civil: "Le droit civil couvre :\n• Contrats\n• Propriété\n• Responsabilité civile\n• Obligations",
      penal: "Le droit pénal traite :\n• Infractions\n• Procédures pénales\n• Droits de la défense\n• Sanctions",
      famille: "Le droit de la famille inclut :\n• Mariage\n• Divorce\n• Garde d'enfants\n• Succession",
      travail: "Le droit du travail comprend :\n• Contrats de travail\n• Licenciement\n• Conditions de travail\n• Conflits"
    },

    // Questions fréquentes
    faq: {
      cout: "Nos services incluent :\n• Consultation gratuite de base\n• Tarifs transparents\n• Devis personnalisés\n• Options de paiement flexibles",
      delais: "Les délais varient selon :\n• Type de procédure\n• Juridiction compétente\n• Complexité du dossier\n• Urgence de la situation",
      documents: "Documents nécessaires :\n• Pièce d'identité\n• Justificatifs\n• Documents officiels\n• Preuves pertinentes"
    }
  };

  const msg = message.toLowerCase();

  // Analyse contextuelle
  if (msg.includes('bonjour') || msg.includes('salut')) {
    return knowledge.default;
  }

  // Domaines juridiques
  if (msg.includes('civil')) return knowledge.juridique.civil;
  if (msg.includes('pénal')) return knowledge.juridique.penal;
  if (msg.includes('famille')) return knowledge.juridique.famille;
  if (msg.includes('travail')) return knowledge.juridique.travail;

  // Questions fréquentes
  if (msg.includes('prix') || msg.includes('coût')) return knowledge.faq.cout;
  if (msg.includes('délai')) return knowledge.faq.delais;
  if (msg.includes('document')) return knowledge.faq.documents;

  // Réponse par défaut
  return "Je suis là pour vous aider. Pouvez-vous préciser votre question ? Par exemple :\n• Droit civil\n• Droit pénal\n• Droit de la famille\n• Droit du travail";
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant YOON. Comment puis-je vous aider aujourd'hui ?",
      isBot: true
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Simuler un délai de réponse naturel
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: generateResponse(message),
        isBot: true
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 p-4 bg-gradient-to-br from-[#A9B299] to-[#6B4C4C] rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-xl shadow-xl">
          <ChatHeader onClose={() => setIsOpen(false)} />
          
          <div className="h-96 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-300">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={handleSend} />
        </div>
      )}
    </>
  );
}