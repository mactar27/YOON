import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Search, Star, MessageCircle, Filter, MapPin, Clock, Award, Users } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

interface Expert {
  id: string;
  user_id: string;
  specialties: string[];
  bio: string | null;
  is_verified: boolean;
  is_available: boolean;
  consultation_fee: number | null;
  user: {
    full_name: string;
  };
}

export default function ExpertsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // const { notifications, unreadCount } = useNotifications();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee' | 'name'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'busy'>('all');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    loadExperts();
  }, []);

  // Recharger les experts quand on revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      loadExperts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadExperts = async () => {
    try {
      // Charger les experts nouvellement inscrits depuis localStorage
      const newExpertsFromStorage = JSON.parse(localStorage.getItem('yoon_new_experts') || '[]');
      const mockExperts = getMockExperts();

      // Combiner les experts du localStorage avec les experts mock
      const allExperts = [...newExpertsFromStorage, ...mockExperts];

      console.log('Loaded experts:', allExperts.length, 'experts from localStorage + mock data');
      setExperts(allExperts);
    } catch (error) {
      console.error('Error loading experts, using mock data:', error);
      setExperts(getMockExperts());
    } finally {
      setLoading(false);
    }
  };

  const getMockExperts = (): Expert[] => {
    // Charger les experts nouvellement inscrits depuis localStorage
    const newExpertsFromStorage = JSON.parse(localStorage.getItem('yoon_new_experts') || '[]');

    const baseExperts = [
      {
        id: '1',
        user_id: '1',
        specialties: ['Droit civil', 'Droit de la famille', 'Successions'],
        bio: 'Avocat spécialisé en droit civil avec plus de 15 ans d\'expérience. Expert en droit de la famille et successions.',
        is_verified: true,
        is_available: true,
        consultation_fee: 50000,
        user: {
          full_name: 'Me. Fatou Diop',
          avatar_url: null
        }
      },
      {
        id: '2',
        user_id: '2',
        specialties: ['Droit pénal', 'Droit des affaires', 'Droit commercial'],
        bio: 'Juriste d\'affaires expérimentée, spécialisée en droit pénal et commercial. Ancienne magistrate.',
        is_verified: true,
        is_available: false,
        consultation_fee: 75000,
        user: {
          full_name: 'Me. Amadou Ndiaye',
          avatar_url: null
        }
      },
      {
        id: '3',
        user_id: '3',
        specialties: ['Droit du travail', 'Droit social', 'Droit syndical'],
        bio: 'Spécialiste en droit du travail et relations sociales. Accompagnement des entreprises et salariés.',
        is_verified: true,
        is_available: true,
        consultation_fee: 45000,
        user: {
          full_name: 'Me. Mariama Sow',
          avatar_url: null
        }
      },
      {
        id: '4',
        user_id: '4',
        specialties: ['Droit immobilier', 'Droit foncier', 'Urbanisme'],
        bio: 'Expert en droit immobilier et foncier. Conseil en transactions immobilières et contentieux foncier.',
        is_verified: true,
        is_available: true,
        consultation_fee: 60000,
        user: {
          full_name: 'Me. Ousmane Faye',
          avatar_url: null
        }
      },
      {
        id: '5',
        user_id: '5',
        specialties: ['Droit fiscal', 'Droit des sociétés', 'Comptabilité'],
        bio: 'Conseil fiscal et juridique pour entreprises. Expertise en optimisation fiscale et structuration sociétaire.',
        is_verified: true,
        is_available: true,
        consultation_fee: 80000,
        user: {
          full_name: 'Me. Khady Ba',
          avatar_url: null
        }
      },
      {
        id: '6',
        user_id: '6',
        specialties: ['Droit international', 'Droit des contrats', 'Arbitrage'],
        bio: 'Spécialiste en droit international et arbitrage commercial. Expérience dans les contrats internationaux.',
        is_verified: true,
        is_available: true,
        consultation_fee: 90000,
        user: {
          full_name: 'Me. Abdoulaye Diallo',
          avatar_url: null
        }
      }
    ];

    // Retourner les nouveaux experts + les experts de base
    return [...newExpertsFromStorage, ...baseExperts];
  };

  const specialties = ['all', ...Array.from(new Set(experts.flatMap(e => e.specialties)))];

  const filteredExperts = experts
    .filter(expert => {
      const matchesSearch = expert.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSpecialty = selectedSpecialty === 'all' ||
        expert.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

      const matchesAvailability = availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && expert.is_available) ||
        (availabilityFilter === 'busy' && !expert.is_available);

      return matchesSearch && matchesSpecialty && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.user.full_name.localeCompare(b.user.full_name);
        case 'fee':
          return (a.consultation_fee || 0) - (b.consultation_fee || 0);
        case 'experience':
          // Pour l'instant, tri par nom si pas d'expérience
          return a.user.full_name.localeCompare(b.user.full_name);
        case 'rating':
        default:
          // Tri par disponibilité puis par nom
          if (a.is_available !== b.is_available) {
            return a.is_available ? -1 : 1;
          }
          return a.user.full_name.localeCompare(b.user.full_name);
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#7B8A52]/5 to-white pb-24">
      {/* Header moderne avec éléments décoratifs */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-[#6B4C4C]" />
            <h1 className="text-2xl font-bold text-[#6B4C4C]">Experts Juridiques</h1>
            <span className="text-sm text-gray-600 bg-[#7B8A52]/20 px-3 py-1 rounded-full">
              {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="px-6 py-6">
        {/* Barre de recherche moderne */}
        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7B8A52]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un expert ou une spécialité..."
            className="w-full pl-14 pr-4 py-4 bg-white/50 border border-[#7B8A52]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7B8A52] focus:border-[#7B8A52] text-gray-800 placeholder-gray-500 backdrop-blur-sm shadow-sm"
          />
        </div>

        {/* Barre d'outils moderne avec filtres et tri */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-[#7B8A52]/30 rounded-2xl hover:bg-[#7B8A52]/10 transition-all duration-200 font-semibold backdrop-blur-sm shadow-sm"
          >
            <Filter className="w-4 h-4 text-[#6B4C4C]" />
            <span className="text-[#6B4C4C]">Filtres</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3 bg-white/50 border border-[#7B8A52]/30 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6B4C4C] backdrop-blur-sm shadow-sm"
          >
            <option value="rating">Trier par: Note</option>
            <option value="name">Trier par: Nom</option>
            <option value="fee">Trier par: Tarif</option>
            <option value="experience">Trier par: Expérience</option>
          </select>
        </div>

        {/* Filtres avancés modernes */}
        {showFilters && (
          <div className="mb-6 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#7B8A52]/20">
            <div>
              <label className="block text-sm font-semibold text-[#6B4C4C] mb-3">Disponibilité</label>
              <div className="flex gap-3">
                {[
                  { value: 'all', label: 'Tous' },
                  { value: 'available', label: 'Disponibles' },
                  { value: 'busy', label: 'Occupés' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setAvailabilityFilter(option.value as typeof availabilityFilter)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      availabilityFilter === option.value
                        ? 'bg-[#6B4C4C] text-white shadow-lg transform scale-105'
                        : 'bg-[#7B8A52]/20 text-[#6B4C4C] hover:bg-[#7B8A52]/30'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtres par spécialité modernes */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-8 -mx-6 px-6">
          {specialties.slice(0, 8).map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedSpecialty === specialty
                  ? 'bg-[#6B4C4C] text-white shadow-lg transform scale-105'
                  : 'bg-white/50 text-[#6B4C4C] border border-[#7B8A52]/30 hover:bg-[#7B8A52]/20'
              }`}
            >
              {specialty === 'all' ? 'Tous' : specialty}
            </button>
          ))}
        </div>

        {/* Statistiques modernes */}
        {!loading && filteredExperts.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-6">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[#6B4C4C] rounded-2xl"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Experts trouvés</p>
                    <p className="text-3xl font-bold">{filteredExperts.length}</p>
                  </div>
                  <Users className="w-8 h-8 opacity-80" />
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[#6B7A4A] rounded-2xl"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Disponibles</p>
                    <p className="text-3xl font-bold">{filteredExperts.filter(e => e.is_available).length}</p>
                  </div>
                  <Clock className="w-8 h-8 opacity-80" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl h-48 border border-[#7B8A52]/20"></div>
              ))}
            </div>
          ) : filteredExperts.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative mb-6">
                <Scale className="w-20 h-20 text-[#7B8A52] mx-auto" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#6B4C4C]/20 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-[#6B4C4C] mb-3">Aucun expert trouvé</h3>
              <p className="text-gray-600 text-lg">
                Essayez de modifier vos critères de recherche
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[#7B8A52] rounded-full"></div>
                <div className="w-2 h-2 bg-[#7B8A52] rounded-full"></div>
                <div className="w-2 h-2 bg-[#7B8A52] rounded-full"></div>
              </div>
            </div>
          ) : (
            filteredExperts.map((expert) => (
              <div
                key={expert.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#7B8A52]/20 hover:border-[#6B4C4C]/40 transform hover:scale-[1.01]"
              >
                <div className="flex items-start gap-5">
                  <div className="w-18 h-18 rounded-2xl bg-[#6B4C4C] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
                    {expert.user.full_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-xl text-[#6B4C4C] flex items-center gap-2 mb-2">
                          {expert.user.full_name}
                          {expert.is_verified && (
                            <span className="text-green-500 text-lg">✓</span>
                          )}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4" />
                          </div>
                          <span className="text-sm text-gray-600 font-medium">4.5</span>
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                            expert.is_available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              expert.is_available ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            {expert.is_available ? 'Disponible' : 'Occupé'}
                          </span>
                        </div>
                      </div>
                      {expert.consultation_fee && (
                        <div className="text-right">
                          <p className="font-bold text-[#6B4C4C] text-lg">
                            {expert.consultation_fee.toLocaleString()} FCFA
                          </p>
                          <p className="text-xs text-gray-500">par consultation</p>
                        </div>
                      )}
                    </div>

                    {expert.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {expert.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {expert.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-[#7B8A52]/20 text-[#6B4C4C] text-xs rounded-full font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                      {expert.specialties.length > 3 && (
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{expert.specialties.length - 3} autres
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
                          expert.is_available
                            ? 'bg-[#6B4C4C] text-white hover:bg-[#5A3E3E] hover:shadow-lg transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          if (expert.is_available) {
                            navigate(`/messages/${expert.id}`);
                          }
                        }}
                        disabled={!expert.is_available}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>
                          {expert.is_available ? 'Message' : 'Indisponible'}
                        </span>
                      </button>
                      <button
                        className="px-4 py-3 border-2 border-[#7B8A52]/30 text-[#6B4C4C] rounded-2xl font-medium hover:bg-[#7B8A52]/10 hover:shadow-md transition-all duration-200"
                        onClick={() => {
                          navigate(`/consultation/${expert.id}`);
                        }}
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                      <button
                        className="px-4 py-3 border-2 border-[#7B8A52]/30 text-[#6B4C4C] rounded-2xl font-medium hover:bg-[#7B8A52]/10 hover:shadow-md transition-all duration-200"
                        onClick={() => {
                          navigate(`/expert-profile/${expert.id}`);
                        }}
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
