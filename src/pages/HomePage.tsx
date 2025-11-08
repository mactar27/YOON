import { Heart, Scale, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from '../components/NotificationBell';

// Seules les catégories qui ont réellement des données dans la base
const AVAILABLE_CATEGORIES = [
  { id: 'loi_penale', label: 'Code Pénal', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'procedure_civile', label: 'Procédure Civile', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'assurances', label: 'Assurances', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'aviation', label: 'Aviation', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'education', label: 'Éducation', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'environnement', label: 'Environnement', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'sante', label: 'Santé', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'securite_sociale', label: 'Sécurité Sociale', color: 'from-[#7B8A52] to-[#6B4C4C]' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white pb-20">
      {/* Header moderne avec éléments décoratifs */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-wide">
            <span className="text-[#A9B299]">YOO</span>
            <span className="text-[#6B4C4C]">N</span>
          </h1>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={() => navigate('/payment-methods')}
              className="p-3 hover:bg-[#6B4C4C]/10 rounded-full transition-all duration-200 backdrop-blur-sm"
              title="Méthodes de paiement"
            >
              <CreditCard className="w-5 h-5 text-[#6B4C4C]" />
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="p-3 hover:bg-[#A9B299]/10 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <Heart className="w-5 h-5 text-[#6B4C4C]" />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-3 hover:bg-[#6B4C4C]/10 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 text-[#6B4C4C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Section de bienvenue moderne */}
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[#6B4C4C] rounded-3xl"></div>
          
          <div className="relative p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              {profile ? `Bienvenue, ${profile.full_name}` : 'Bienvenue'}
            </h2>
            <p className="opacity-90 text-lg">
              Explorez vos droits et devoirs juridiques
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#6B4C4C] mb-6">
            Catégories juridiques
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-5 hover:bg-white hover:shadow-lg hover:border-[#A9B299]/40 transition-all duration-300 cursor-pointer group relative"
                onClick={() => navigate(`/category/${category.id}`)}
              >
                <div className="flex items-center gap-4 h-full">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#A9B299]/20 to-[#6B4C4C]/20 rounded-2xl border border-[#A9B299]/30">
                      <div className="text-2xl">⚖️</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#6B4C4C] leading-tight mb-2 line-clamp-2">
                      {category.label}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      Articles juridiques
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#A9B299] rounded-full"></div>
                        <span className="text-xs text-gray-500">0 vues</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

