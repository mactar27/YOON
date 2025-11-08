import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageSquare, FileText, Phone, Mail, MapPin } from 'lucide-react';

export default function HelpPage() {
  const navigate = useNavigate();

  const helpSections = [
    {
      icon: MessageSquare,
      title: 'Questions fréquentes',
      description: 'Trouvez des réponses aux questions les plus courantes',
      action: () => {
        // Afficher un message temporaire car la page FAQ n'existe pas encore
        alert('🚧 Page FAQ en cours de développement.\n\nContactez-nous directement pour toute question !')
      }
    },
    {
      icon: FileText,
      title: 'Guide d\'utilisation',
      description: 'Apprenez à utiliser toutes les fonctionnalités de YOON',
      action: () => {
        // Afficher un message temporaire car la page Guide n'existe pas encore
        alert('📖 Guide d\'utilisation en cours de création.\n\nDécouvrez YOON en explorant les différentes sections !')
      }
    },
    {
      icon: Phone,
      title: 'Support téléphonique',
      description: 'Appelez-nous pour une assistance immédiate',
      action: () => window.open('tel:+221338000000')
    },
    {
      icon: Mail,
      title: 'Contact par email',
      description: 'Envoyez-nous un message détaillé',
      action: () => window.open('mailto:support@yoon.sn')
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+221 33 800 00 00',
      action: () => window.open('tel:+221338000000')
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@yoon.sn',
      action: () => window.open('mailto:support@yoon.sn')
    },
    {
      icon: MapPin,
      label: 'Adresse',
      value: 'Dakar, Sénégal',
      action: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white pb-20">
      {/* Header moderne avec éléments décoratifs */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-[#A9B299]/10 rounded-full transition-all duration-200 backdrop-blur-sm mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B4C4C]" />
          </button>
          <h1 className="text-2xl font-bold tracking-wide">
            <span className="text-[#A9B299]">YOO</span>
            <span className="text-[#6B4C4C]">N</span>
            <span className="text-gray-700 ml-2">• Aide & Support</span>
          </h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Section Introduction moderne */}
        <div className="relative bg-[#6B4C4C] rounded-2xl p-6 text-white overflow-hidden">
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6 text-[#6B4C4C]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Besoin d'aide ?</h2>
            <p className="opacity-90 text-lg">
              Nous sommes là pour vous aider. Choisissez l'option qui vous convient le mieux.
            </p>
          </div>
        </div>

        {/* Section d'aide moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h3 className="text-xl font-semibold text-[#6B4C4C] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6B4C4C] rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">?</span>
            </div>
            Comment pouvons-nous vous aider ?
          </h3>
          <div className="space-y-3">
            {helpSections.map((section, index) => (
              <button
                key={index}
                onClick={section.action}
                className="w-full flex items-center gap-4 p-4 bg-[#A9B299]/10 rounded-2xl hover:bg-[#A9B299]/20 transition-all duration-200 text-left group transform hover:scale-[1.01]"
              >
                <div className="w-10 h-10 bg-[#A9B299]/20 rounded-xl flex items-center justify-center group-hover:bg-[#A9B299]/30 transition-colors">
                  <section.icon className="w-5 h-5 text-[#6B4C4C]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#6B4C4C]">{section.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
                <ArrowLeft className="w-5 h-5 text-[#A9B299] rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Informations de contact modernes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h3 className="text-xl font-semibold text-[#6B4C4C] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6B4C4C] rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">@</span>
            </div>
            Contactez-nous
          </h3>
          <div className="space-y-3">
            {contactInfo.map((contact, index) => (
              <button
                key={index}
                onClick={contact.action || undefined}
                disabled={!contact.action}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                  contact.action
                    ? 'bg-[#A9B299]/10 hover:bg-[#A9B299]/20 group transform hover:scale-[1.01]'
                    : 'bg-gray-50 cursor-default'
                }`}
              >
                <div className="w-10 h-10 bg-[#A9B299]/20 rounded-xl flex items-center justify-center group-hover:bg-[#A9B299]/30 transition-colors">
                  <contact.icon className="w-5 h-5 text-[#6B4C4C]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-gray-500 font-medium">{contact.label}</p>
                  <p className="font-semibold text-[#6B4C4C]">{contact.value}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Heures d'ouverture modernes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h3 className="text-xl font-semibold text-[#6B4C4C] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6B4C4C] rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">⏰</span>
            </div>
            Heures d'ouverture
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-[#A9B299]/10 rounded-xl">
              <span className="font-medium text-[#6B4C4C]">Lundi - Vendredi</span>
              <span className="font-semibold text-[#6B4C4C]">8h00 - 18h00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#A9B299]/10 rounded-xl">
              <span className="font-medium text-[#6B4C4C]">Samedi</span>
              <span className="font-semibold text-[#6B4C4C]">9h00 - 16h00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
              <span className="font-medium text-red-600">Dimanche</span>
              <span className="font-semibold text-red-600">Fermé</span>
            </div>
          </div>
        </div>

        {/* Version moderne */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <div className="w-16 h-16 bg-[#6B4C4C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <p className="font-semibold text-[#6B4C4C] text-lg">YOON Platform v1.0</p>
          <p className="text-sm text-gray-600 mt-1">© 2025 DroitCitoyen</p>
        </div>
      </div>
    </div>
  );
}