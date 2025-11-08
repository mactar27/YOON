import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users, Database, Cookie } from 'lucide-react';

export default function PrivacyPage() {
  const navigate = useNavigate();

  const privacySections = [
    {
      icon: Eye,
      title: 'Collecte des données',
      content: 'Nous collectons uniquement les informations nécessaires pour fournir nos services juridiques. Cela inclut votre nom, email, numéro de téléphone et les informations que vous partagez lors de vos consultations.'
    },
    {
      icon: Lock,
      title: 'Sécurité des données',
      content: 'Vos données sont chiffrées et stockées de manière sécurisée. Nous utilisons les dernières technologies de sécurité pour protéger vos informations personnelles contre tout accès non autorisé.'
    },
    {
      icon: Users,
      title: 'Partage des données',
      content: 'Nous ne partageons vos données qu\'avec votre consentement explicite ou lorsque la loi l\'exige. Vos consultations avec les experts restent strictement confidentielles.'
    },
    {
      icon: Database,
      title: 'Conservation des données',
      content: 'Vos données sont conservées uniquement pendant la durée nécessaire pour fournir nos services. Vous pouvez demander la suppression de vos données à tout moment.'
    },
    {
      icon: Cookie,
      title: 'Cookies et suivi',
      content: 'Nous utilisons des cookies pour améliorer votre expérience utilisateur. Vous pouvez contrôler l\'utilisation des cookies dans les paramètres de votre navigateur.'
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
            <span className="text-[#A9B299]">Politique</span>
            <span className="text-[#6B4C4C]"> de confidentialité</span>
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Introduction */}
        <div className="bg-[#6B4C4C] rounded-xl p-6 text-white">
          <Shield className="w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold mb-2">Protection de vos données</h2>
          <p className="opacity-90">
            Votre confidentialité est notre priorité. Découvrez comment nous protégeons vos informations.
          </p>
        </div>

        {/* Sections de confidentialité */}
        <div className="space-y-4">
          {privacySections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl p-4">
              <div className="flex items-start gap-4">
                <section.icon className="w-6 h-6 text-[#6B4C4C] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">{section.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Droits des utilisateurs */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vos droits</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#6B4C4C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600 text-sm">Accéder à vos données personnelles</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#6B4C4C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600 text-sm">Rectifier vos données inexactes</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#6B4C4C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600 text-sm">Supprimer vos données (droit à l'oubli)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#6B4C4C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600 text-sm">Limiter le traitement de vos données</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#6B4C4C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600 text-sm">Vous opposer au traitement de vos données</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
          <p className="text-gray-600 text-sm mb-3">
            Pour exercer vos droits ou poser des questions sur notre politique de confidentialité :
          </p>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email :</span> privacy@yoon.sn
            </p>
            <p className="text-sm">
              <span className="font-medium">Téléphone :</span> +221 33 800 00 00
            </p>
            <p className="text-sm">
              <span className="font-medium">Adresse :</span> Dakar, Sénégal
            </p>
          </div>
        </div>

        {/* Dernière mise à jour */}
        <div className="text-center text-gray-500 text-sm">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          <p className="mt-2">YOON Platform v1.0</p>
          <p className="mt-1">© 2025 DroitCitoyen</p>
        </div>
      </div>
    </div>
  );
}