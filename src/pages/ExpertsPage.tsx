import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Search, Star, MessageCircle, Filter, MapPin, Clock, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    avatar_url: string | null;
  };
}

export default function ExpertsPage() {
  const navigate = useNavigate();
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
      const { data, error } = await supabase
        .from('legal_experts')
        .select(`
          *,
          user:user_profiles(full_name, avatar_url)
        `)
        .eq('is_verified', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Utiliser directement getMockExperts() qui inclut déjà les nouveaux experts
      const allExperts = getMockExperts();

      // Si on a des données de la DB, les ajouter au début
      if (data && data.length > 0) {
        setExperts([...data, ...allExperts]);
      } else {
        setExperts(allExperts);
      }
    } catch (error) {
      console.error('Error loading experts:', error);
      // En cas d'erreur, utiliser uniquement les données mock
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
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white sticky top-0 z-10 border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Scale className="w-8 h-8 text-[#6B4C4C]" />
              Experts Juridiques
            </h1>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un expert ou une spécialité"
              className="w-full pl-12 pr-4 py-3 bg-[#A9B299] bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A9B299] text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* Barre d'outils avec filtres et tri */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
            >
              <option value="rating">Trier par: Note</option>
              <option value="name">Trier par: Nom</option>
              <option value="fee">Trier par: Tarif</option>
              <option value="experience">Trier par: Expérience</option>
            </select>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'Tous' },
                    { value: 'available', label: 'Disponibles' },
                    { value: 'busy', label: 'Occupés' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setAvailabilityFilter(option.value as typeof availabilityFilter)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        availabilityFilter === option.value
                          ? 'bg-[#6B4C4C] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filtres par spécialité */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {specialties.slice(0, 8).map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedSpecialty === specialty
                    ? 'bg-[#6B4C4C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {specialty === 'all' ? 'Tous' : specialty}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Statistiques améliorées */}
        {!loading && filteredExperts.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-[#A9B299] to-[#8A9279] rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Experts trouvés</p>
                  <p className="text-2xl font-bold">{filteredExperts.length}</p>
                </div>
                <Scale className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#6B4C4C] to-[#8A6A6A] rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Disponibles</p>
                  <p className="text-2xl font-bold">{filteredExperts.filter(e => e.is_available).length}</p>
                </div>
                <Clock className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl h-40 animate-pulse"></div>
              ))}
            </div>
          ) : filteredExperts.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Aucun expert trouvé</p>
              <p className="text-sm text-gray-400">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            filteredExperts.map((expert) => (
              <div
                key={expert.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6B4C4C] to-[#8A6A6A] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {expert.user.full_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          {expert.user.full_name}
                          {expert.is_verified && (
                            <span className="text-blue-500">✓</span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4" />
                            </div>
                            <span className="text-sm text-gray-600">4.5</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
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
                          <p className="font-bold text-[#6B4C4C]">
                            {expert.consultation_fee.toLocaleString()} FCFA
                          </p>
                          <p className="text-xs text-gray-500">par consultation</p>
                        </div>
                      )}
                    </div>

                    {expert.bio && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {expert.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {expert.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#A9B299] bg-opacity-20 text-[#6B4C4C] text-xs rounded-full font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                      {expert.specialties.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{expert.specialties.length - 3} autres
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          expert.is_available
                            ? 'bg-[#6B4C4C] text-white hover:bg-[#5A3E3E] hover:shadow-md'
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
                        <span className="font-semibold">
                          {expert.is_available ? 'Message' : 'Indisponible'}
                        </span>
                      </button>
                      <button
                        className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 hover:shadow-md transition-all"
                        onClick={() => {
                          navigate(`/consultation/${expert.id}`);
                        }}
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                      <button
                        className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 hover:shadow-md transition-all"
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

