import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Calendar, Clock, Star, MessageCircle, Phone, Mail } from 'lucide-react';

interface Expert {
  id: string;
  user_id: string;
  specialties: string[];
  bio: string | null;
  is_verified: boolean;
  is_available: boolean;
  consultation_fee: number | null;
  experience_years: number | null;
  contact_email: string | null;
  contact_phone: string | null;
  user: {
    full_name: string;
  };
}

export default function ConsultationPage() {
  const { expertId } = useParams<{ expertId: string }>();
  const navigate = useNavigate();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('Demande de consultation juridique');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'online' | 'phone' | 'office'>('online');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'very_urgent'>('normal');

  useEffect(() => {
    if (expertId) {
      loadExpert();
    }
  }, [expertId]);

  const loadExpert = async () => {
    if (!expertId) {
      navigate('/experts');
      return;
    }

    // Simulation de chargement d'expert avec données mockées
    setTimeout(() => {
      const mockExperts = [
        {
          id: '1',
          user_id: '1',
          specialties: ['Droit civil', 'Droit de la famille', 'Successions'],
          bio: 'Avocat spécialisé en droit civil avec plus de 15 ans d\'expérience. Expert en droit de la famille et successions.',
          is_verified: true,
          is_available: true,
          consultation_fee: 50000,
          experience_years: 15,
          contact_email: 'fatou.diop@yoon.sn',
          contact_phone: '+221 77 123 45 67',
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
          is_available: true,
          consultation_fee: 75000,
          experience_years: 12,
          contact_email: 'amadou.ndiaye@yoon.sn',
          contact_phone: '+221 76 234 56 78',
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
          experience_years: 10,
          contact_email: 'mariama.sow@yoon.sn',
          contact_phone: '+221 78 345 67 89',
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
          experience_years: 8,
          contact_email: 'ousmane.faye@yoon.sn',
          contact_phone: '+221 75 456 78 90',
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
          experience_years: 14,
          contact_email: 'khady.ba@yoon.sn',
          contact_phone: '+221 70 567 89 01',
          user: {
            full_name: 'Me. Khady Ba',
            avatar_url: null
          }
        }
      ];

      const foundExpert = mockExperts.find(e => e.id === expertId);
      if (foundExpert) {
        setExpert(foundExpert);
      } else {
        navigate('/experts');
      }
      setLoading(false);
    }, 500);
  };

  const handleSendRequest = () => {
    if (!message.trim()) {
      alert('Veuillez décrire votre demande.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Veuillez sélectionner une date et heure pour la consultation.');
      return;
    }

    // Simulation d'envoi de demande
    const requestData = {
      expert: expert?.user.full_name,
      subject,
      message,
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      urgency,
      fee: expert?.consultation_fee
    };

    const typeLabel = consultationType === 'online' ? 'En ligne (Vidéo)' :
                     consultationType === 'phone' ? 'Téléphone' :
                     'Au cabinet (Physique)';

    const urgencyLabel = urgency === 'normal' ? 'Normale' :
                        urgency === 'urgent' ? 'Urgente' :
                        'Très urgente';

    alert(`✅ Demande de consultation ${consultationType === 'office' ? 'physique' : ''} envoyée avec succès !

🏢 Destinataire : ${requestData.expert}
📋 Sujet : ${requestData.subject}
📅 Date : ${requestData.date} à ${requestData.time}
🎯 Type : ${typeLabel}
⚡ Urgence : ${urgencyLabel}
💰 Tarif : ${requestData.fee?.toLocaleString()} FCFA

${consultationType === 'office' ?
  '🏛️ Rendez-vous physique - N\'oubliez pas d\'apporter vos documents originaux et pièces justificatives.' :
  '📧 Vous recevrez un email de confirmation avec les instructions de connexion.'}

Confirmation sous 24h avec les détails de paiement.`);

    navigate('/experts');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B4C4C]"></div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Expert non trouvé</h2>
          <button
            onClick={() => navigate('/experts')}
            className="bg-[#6B4C4C] text-white px-6 py-2 rounded-lg hover:bg-[#5A3E3E] transition-colors"
          >
            Retour aux experts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
            <h1 className="text-xl font-bold text-gray-800">Demande de consultation</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Profil de l'expert */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#4A3A3A] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {expert.user.full_name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {expert.user.full_name}
                    {expert.is_verified && (
                      <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full font-medium">
                        ✓ Vérifié
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4" />
                    <span className="text-gray-600 text-sm ml-2">(4.8/5)</span>
                  </div>
                </div>

                {expert.consultation_fee && (
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#6B4C4C]">
                      {expert.consultation_fee.toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-gray-500">par consultation</p>
                  </div>
                )}
              </div>

              {expert.bio && (
                <p className="text-gray-600 mb-4 leading-relaxed">{expert.bio}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {expert.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#A9B299] bg-opacity-20 text-[#6B4C4C] text-sm rounded-full font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {expert.experience_years && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{expert.experience_years} ans d'expérience</span>
                  </div>
                )}
                {expert.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{expert.contact_email}</span>
                  </div>
                )}
                {expert.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{expert.contact_phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de demande */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Demander une consultation</h3>

          <div className="space-y-6">
            {/* Sujet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet de la consultation *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-transparent"
                placeholder="Ex: Problème de succession familiale"
                required
              />
            </div>

            {/* Description détaillée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée de votre demande *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-transparent resize-vertical"
                placeholder="Décrivez en détail votre situation juridique, les faits, vos questions spécifiques..."
                required
              />
            </div>

            {/* Type de consultation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mode de consultation préféré *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'office', label: 'Au cabinet (Physique)', icon: Calendar, description: 'Rencontre en personne' },
                  { value: 'online', label: 'En ligne (Vidéo)', icon: MessageCircle, description: 'Consultation à distance' },
                  { value: 'phone', label: 'Téléphone', icon: Phone, description: 'Appel vocal' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setConsultationType(type.value as 'online' | 'phone' | 'office')}
                    className={`p-4 border-2 rounded-lg transition-all text-left ${
                      consultationType === type.value
                        ? 'border-[#6B4C4C] bg-[#6B4C4C] bg-opacity-5'
                        : 'border-gray-200 hover:border-[#6B4C4C] hover:border-opacity-50'
                    }`}
                  >
                    <type.icon className={`w-6 h-6 mb-2 ${
                      consultationType === type.value ? 'text-[#6B4C4C]' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium block ${
                      consultationType === type.value ? 'text-[#6B4C4C]' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </span>
                    <span className={`text-xs mt-1 block ${
                      consultationType === type.value ? 'text-[#6B4C4C] opacity-80' : 'text-gray-500'
                    }`}>
                      {type.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date et heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date souhaitée *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure souhaitée *
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une heure</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>
            </div>

            {/* Niveau d'urgence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Niveau d'urgence
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'normal', label: 'Normal', color: 'bg-green-100 text-green-800' },
                  { value: 'urgent', label: 'Urgent', color: 'bg-orange-100 text-orange-800' },
                  { value: 'very_urgent', label: 'Très urgent', color: 'bg-red-100 text-red-800' }
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setUrgency(level.value as 'normal' | 'urgent' | 'very_urgent')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      urgency === level.value
                        ? level.color
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Résumé et tarif */}
            {expert.consultation_fee && (
              <div className="bg-gradient-to-r from-[#A9B299] to-[#8A9279] rounded-lg p-4 text-white">
                <h4 className="font-bold mb-2">Résumé de votre demande</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Expert:</span> {expert.user.full_name}</p>
                  <p><span className="font-medium">Tarif:</span> {expert.consultation_fee.toLocaleString()} FCFA</p>
                  <p><span className="font-medium">Durée:</span> 60 minutes</p>
                  <p><span className="font-medium">Mode:</span> {consultationType === 'online' ? 'En ligne (Vidéo)' : consultationType === 'phone' ? 'Téléphone' : 'Au cabinet (Physique)'}</p>
                  <p><span className="font-medium">Date:</span> {selectedDate} à {selectedTime}</p>
                  {consultationType === 'office' && (
                    <p className="text-orange-600 font-medium">⚠️ Rendez-vous physique - Apportez vos documents</p>
                  )}
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/experts')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleSendRequest}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6B4C4C] to-[#8A6A6A] text-white rounded-lg hover:from-[#5A3E3E] hover:to-[#7A5A5A] transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Envoyer la demande
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}