import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Star, MessageCircle, Calendar, DollarSign, Users, CheckCircle, Clock, AlertCircle, TrendingUp, Award, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Header from '../components/Header';

interface ExpertProfile {
  id: string;
  specialties: string[];
  bio: string | null;
  is_verified: boolean;
  is_available: boolean;
  consultation_fee: number | null;
  experience_years: number | null;
  availability: string | null;
  license_number: string | null;
  bar_association: string | null;
  photo_url: string | null;
  status: string;
  contact_email: string | null;
  contact_phone: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export default function ExpertProfilePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    consultation_fee: '',
    availability: '',
    contact_email: '',
    contact_phone: ''
  });
  const [stats, setStats] = useState({
    totalConsultations: 0,
    activeCases: 0,
    rating: 4.5,
    reviews: 12,
    responseTime: '2h',
    completionRate: 98
  });

  useEffect(() => {
    if (profile?.role !== 'expert') {
      navigate('/home');
      return;
    }
    loadExpertProfile();
  }, [profile, navigate]);

  useEffect(() => {
    if (expertProfile) {
      setEditForm({
        bio: expertProfile.bio || '',
        consultation_fee: expertProfile.consultation_fee?.toString() || '',
        availability: expertProfile.availability || '',
        contact_email: expertProfile.contact_email || '',
        contact_phone: expertProfile.contact_phone || ''
      });
    }
  }, [expertProfile]);

  const loadExpertProfile = async () => {
    if (!user?.id) return;

    try {
      // Charger depuis localStorage
      const savedExperts = JSON.parse(localStorage.getItem('yoon_new_experts') || '[]');
      const currentExpert = savedExperts.find((expert: any) => expert.user_id === user.id);
      
      if (currentExpert) {
        setExpertProfile(currentExpert);
      } else {
        // Créer un profil expert par défaut pour les tests
        const defaultExpert = {
          id: `default-${user.id}`,
          user_id: user.id,
          specialties: ['Droit civil', 'Droit pénal'],
          bio: 'Expert juridique avec plusieurs années d\'expérience.',
          is_verified: true,
          is_available: true,
          consultation_fee: 50000,
          experience_years: 5,
          availability: 'Lundi - Vendredi (9h-17h)',
          license_number: 'LIC-' + user.id.substring(0, 8),
          bar_association: 'Barreau du Sénégal',
          photo_url: null,
          status: 'validated',
          contact_email: user.email,
          contact_phone: '+221 XX XXX XX XX',
          full_name: profile?.full_name || 'Expert',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setExpertProfile(defaultExpert);
      }
    } catch (error) {
      console.error('Error loading expert profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          text: 'En attente de validation',
          description: 'Votre profil est en cours de révision par notre équipe.'
        };
      case 'validated':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          text: 'Profil validé',
          description: 'Votre profil est visible par les citoyens.'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          text: 'Profil rejeté',
          description: 'Veuillez contacter le support pour plus d\'informations.'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          text: 'Statut inconnu',
          description: 'Contactez le support si ce message persiste.'
        };
    }
  };

  const handleSaveProfile = async () => {
    if (!expertProfile || !user?.id) return;

    try {
      const updates: any = {
        bio: editForm.bio,
        consultation_fee: parseInt(editForm.consultation_fee) || null,
        availability: editForm.availability,
        contact_email: editForm.contact_email,
        contact_phone: editForm.contact_phone,
        updated_at: new Date().toISOString()
      };

      // Sauvegarder dans localStorage
      const savedExperts = JSON.parse(localStorage.getItem('yoon_new_experts') || '[]');
      const expertIndex = savedExperts.findIndex((expert: any) => expert.user_id === user.id);
      
      if (expertIndex >= 0) {
        savedExperts[expertIndex] = { ...savedExperts[expertIndex], ...updates };
      } else {
        savedExperts.push({ ...expertProfile, ...updates });
      }
      
      localStorage.setItem('yoon_new_experts', JSON.stringify(savedExperts));

      setExpertProfile(prev => prev ? { ...prev, ...updates } : null);
      setIsEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erreur lors de la mise à jour du profil.');
    }
  };

  if (profile?.role !== 'expert') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header moderne pour le loading */}
        <Header />
        
        <div className="px-4">
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-20 bg-gray-200 rounded-xl"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = expertProfile ? getStatusInfo(expertProfile.status) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header moderne avec notifications */}
      <Header />
      
      {/* Contenu principal */}
      <div className="px-6 py-6 space-y-6">
        {/* Titre */}
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-[#6B4C4C]" />
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-[#A9B299]">Mon Profil</span>
            <span className="text-[#6B4C4C]"> Expert</span>
          </h1>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
              {unreadCount} notif{unreadCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Status Banner */}
        {statusInfo && (
          <div className={`rounded-xl p-4 ${statusInfo.bgColor} border border-gray-200`}>
            <div className="flex items-start gap-3">
              <statusInfo.icon className={`w-6 h-6 ${statusInfo.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h3 className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</h3>
                <p className="text-sm text-gray-600 mt-1">{statusInfo.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-[#4A3A3A] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
              {profile?.full_name?.charAt(0).toUpperCase() || 'E'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{profile?.full_name}</h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>

              {/* Rating et statistiques */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= stats.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {stats.rating}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({stats.reviews} avis)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">{stats.completionRate}% réussite</span>
                </div>
              </div>

              {/* Badge de vérification */}
              {expertProfile?.is_verified && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Profil vérifié
                </div>
              )}

              {/* Specialties */}
              {expertProfile?.specialties && expertProfile.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {expertProfile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#A9B299] bg-opacity-20 text-[#6B4C4C] text-xs rounded-full font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics améliorées */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
            <Users className="w-8 h-8 text-[#6B4C4C] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.totalConsultations}</p>
            <p className="text-sm text-gray-600">Consultations</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
            <MessageCircle className="w-8 h-8 text-[#6B4C4C] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.activeCases}</p>
            <p className="text-sm text-gray-600">Cas actifs</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
            <Clock className="w-8 h-8 text-[#6B4C4C] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.responseTime}</p>
            <p className="text-sm text-gray-600">Temps de réponse</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
            <TrendingUp className="w-8 h-8 text-[#6B4C4C] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.completionRate}%</p>
            <p className="text-sm text-gray-600">Taux de réussite</p>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#6B4C4C]" />
            Informations professionnelles
          </h3>
          <div className="space-y-4">
            {expertProfile?.experience_years && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Expérience</p>
                  <p className="font-medium">{expertProfile.experience_years} années</p>
                </div>
              </div>
            )}

            {expertProfile?.consultation_fee && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tarif consultation</p>
                  <p className="font-medium">{expertProfile.consultation_fee.toLocaleString()} FCFA</p>
                </div>
              </div>
            )}

            {expertProfile?.availability && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Disponibilités</p>
                  <p className="font-medium">{expertProfile.availability}</p>
                </div>
              </div>
            )}

            {expertProfile?.license_number && (
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Numéro de licence</p>
                  <p className="font-medium">{expertProfile.license_number}</p>
                </div>
              </div>
            )}

            {expertProfile?.bar_association && (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Ordre professionnel</p>
                  <p className="font-medium">{expertProfile.bar_association}</p>
                </div>
              </div>
            )}

            {/* Certifications et récompenses */}
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Certifications</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Barreau du Sénégal</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">DPO Certifié</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Médiateur</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Biographie</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[#6B4C4C] hover:text-[#5A3E3E] text-sm font-medium bg-gray-100 px-3 py-1 rounded-lg transition-colors"
              >
                Modifier
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                placeholder="Décrivez votre parcours, vos compétences..."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tarif consultation (FCFA)
                  </label>
                  <input
                    type="number"
                    value={editForm.consultation_fee}
                    onChange={(e) => setEditForm(prev => ({ ...prev, consultation_fee: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilités
                  </label>
                  <select
                    value={editForm.availability}
                    onChange={(e) => setEditForm(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Lundi - Vendredi (9h-17h)">Lundi - Vendredi (9h-17h)</option>
                    <option value="Lundi - Vendredi (14h-18h)">Lundi - Vendredi (14h-18h)</option>
                    <option value="Samedi (9h-12h)">Samedi (9h-12h)</option>
                    <option value="Sur rendez-vous uniquement">Sur rendez-vous uniquement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    value={editForm.contact_email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                    placeholder="expert@yoon.sn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone professionnel
                  </label>
                  <input
                    type="tel"
                    value={editForm.contact_phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-[#6B4C4C] text-white py-2 rounded-lg font-medium hover:bg-[#5A3E3E] transition-colors"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 leading-relaxed">{expertProfile?.bio || 'Aucune biographie définie.'}</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#6B4C4C]" />
            Informations de contact
          </h3>
          <div className="space-y-3">
            {expertProfile?.contact_email && (
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email professionnel</p>
                  <p className="font-medium">{expertProfile.contact_email}</p>
                </div>
              </div>
            )}

            {expertProfile?.contact_phone && (
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-medium">{expertProfile.contact_phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions améliorées */}
        {!isEditing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#6B4C4C] text-white py-3 rounded-lg font-medium hover:bg-[#5A3E3E] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Scale className="w-4 h-4" />
                Modifier profil
              </button>

              <button
                onClick={() => navigate('/messages')}
                className="border border-[#6B4C4C] text-[#6B4C4C] py-3 rounded-lg font-medium hover:bg-[#6B4C4C] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Messages
              </button>
            </div>

            <button
              onClick={() => navigate('/consultations')}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 bg-white shadow-sm"
            >
              <Users className="w-4 h-4" />
              Mes consultations
            </button>

            <button
              onClick={() => navigate('/expert-analytics')}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 bg-white shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              Statistiques & Analytics
            </button>
          </div>
        )}

        {/* Notifications récentes */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#6B4C4C]" />
              Notifications récentes
            </h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-gray-50 rounded-lg border-l-4 border-[#6B4C4C]"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.timestamp).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>Membre depuis le {expertProfile ? new Date(expertProfile.created_at).toLocaleDateString('fr-FR') : 'N/A'}</p>
          <p className="mt-1">YOON Platform v1.0</p>
        </div>
      </div>
    </div>
  );
}