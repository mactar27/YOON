import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageSquare, FileText, Phone, Mail, MapPin } from 'lucide-react';

export default function HelpPage() {
  const navigate = useNavigate();

  const helpSections = [
    {
      icon: MessageSquare,
      title: 'Questions fréquentes',
      description: 'Trouvez des réponses aux questions les plus courantes',
      action: () => navigate('/faq')
    },
    {
      icon: FileText,
      title: 'Guide d\'utilisation',
      description: 'Apprenez à utiliser toutes les fonctionnalités de YOON',
      action: () => navigate('/guide')
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold tracking-wide">
            <span className="text-[#A9B299]">Aide</span>
            <span className="text-[#6B4C4C]"> & Support</span>
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-[#A9B299] to-[#8A9279] rounded-xl p-6 text-white">
          <HelpCircle className="w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold mb-2">Besoin d'aide ?</h2>
          <p className="opacity-90">
            Nous sommes là pour vous aider. Choisissez l'option qui vous convient le mieux.
          </p>
        </div>

        {/* Sections d'aide */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Comment pouvons-nous vous aider ?</h3>
          <div className="space-y-3">
            {helpSections.map((section, index) => (
              <button
                key={index}
                onClick={section.action}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <section.icon className="w-6 h-6 text-[#6B4C4C] flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{section.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Informations de contact */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contactez-nous</h3>
          <div className="space-y-3">
            {contactInfo.map((contact, index) => (
              <button
                key={index}
                onClick={contact.action || undefined}
                disabled={!contact.action}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  contact.action ? 'hover:bg-gray-50' : 'cursor-default'
                }`}
              >
                <contact.icon className="w-5 h-5 text-[#6B4C4C] flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm text-gray-500">{contact.label}</p>
                  <p className="font-medium text-gray-800">{contact.value}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Heures d'ouverture */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Heures d'ouverture</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Lundi - Vendredi</span>
              <span>8h00 - 18h00</span>
            </div>
            <div className="flex justify-between">
              <span>Samedi</span>
              <span>9h00 - 16h00</span>
            </div>
            <div className="flex justify-between">
              <span>Dimanche</span>
              <span>Fermé</span>
            </div>
          </div>
        </div>

        {/* Version */}
        <div className="text-center text-gray-500 text-sm">
          <p>YOON Platform v1.0</p>
          <p className="mt-1">© 2025 DroitCitoyen</p>
        </div>
      </div>
    </div>
  );
}