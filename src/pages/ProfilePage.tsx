import { useNavigate } from 'react-router-dom';
import { User, Settings, FileText, MessageSquare, HelpCircle, LogOut, Shield, Award, TrendingUp, Users, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Header from '../components/Header';
import { imageService } from '../lib/imageService';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Charger l'image de profil au chargement
  useEffect(() => {
    // Utiliser ImageService pour charger l'image
    if (user?.email) {
      const imageUrl = imageService.getProfileImage(user.email);
      console.log('Chargement ImageService:', imageUrl);
      setProfileImage(imageUrl);
      setImageError(false);
    }
  }, [user]);

  // Rafraîchir automatiquement quand le profil change
  useEffect(() => {
    // Recharger via ImageService
    if (user?.email) {
      const imageUrl = imageService.getProfileImage(user.email);
      console.log('Rafraîchissement ImageService:', imageUrl);
      setProfileImage(imageUrl);
      setImageError(false);
    }
  }, [profile?.updated_at, user?.email]);

  const handleImageError = () => {
    console.log('Erreur de chargement image');
    setImageError(true);
    setProfileImage(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/welcome');
  };

  const menuItems = [
    { icon: User, label: 'Informations personnelles', path: '/profile/edit' },
    { icon: FileText, label: 'Mes documents', path: '/home' },
    { icon: MessageSquare, label: 'Mes messages', path: '/messages' },
    { icon: Bell, label: 'Mes notifications', path: '/notifications' },
    { icon: CreditCard, label: 'Méthodes de paiement', path: '/payment-methods' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
    { icon: HelpCircle, label: 'Aide & Support', path: '/profile/help' },
  ];

  if (profile?.role === 'admin') {
    menuItems.unshift({
      icon: Shield,
      label: 'Panneau d\'administration',
      path: '/admin'
    });
  }

  if (profile?.role === 'expert') {
    menuItems.splice(2, 0, {
      icon: Award,
      label: 'Mon profil expert',
      path: '/expert-profile'
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#7B8A52]/5 to-white pb-24">
      {/* Header moderne avec éléments décoratifs */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#6B4C4C]">Mon Profil</h1>
          <User className="w-6 h-6 text-[#6B4C4C]" />
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="px-6 py-6">
        {/* Header profil moderne */}
        <div className="relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-[#6B4C4C] rounded-3xl"></div>
          
          <div className="relative p-8 text-white">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-3xl bg-white flex items-center justify-center text-4xl font-bold mb-6 overflow-hidden shadow-2xl">
                {profileImage && !imageError ? (
                  <img
                    src={profileImage}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-3xl"
                    onError={handleImageError}
                    onLoad={() => console.log('Image chargée avec succès')}
                    style={{ backgroundColor: 'white' }}
                  />
                ) : (
                  <span className="text-[#6B4C4C] font-bold">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {profile?.full_name || 'Utilisateur'}
              </h1>
              <p className="text-lg opacity-90 mb-4 text-gray-100">
                {user?.email}
              </p>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <span className="px-3 py-2 bg-red-500 text-white text-sm rounded-2xl font-medium">
                    {unreadCount} notif{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {profile?.role === 'expert' && (
                <div className="mt-4">
                  <span className="px-3 py-1.5 bg-blue-100/20 text-blue-100 text-sm rounded-2xl backdrop-blur-sm">
                    Profil en attente de validation
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu principal moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-6 border border-[#7B8A52]/20">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#7B8A52]/10 transition-all duration-200 border-b last:border-b-0"
            >
              <item.icon className="w-5 h-5 text-[#6B4C4C]" />
              <span className="flex-1 text-left text-gray-800 font-medium">
                {item.label}
              </span>
              <span className="text-gray-400">›</span>
            </button>
          ))}
        </div>

        {/* Section Expert moderne */}
        {profile?.role === 'expert' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-[#7B8A52]/20">
            <h3 className="font-bold text-[#6B4C4C] mb-4 flex items-center gap-2 text-lg">
              <Award className="w-5 h-5" />
              Statut Expert
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-200/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700 font-medium">Compte vérifié et actif</span>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">Validé</span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#7B8A52]/20">
                <div className="text-center p-3 bg-[#7B8A52]/10 rounded-2xl">
                  <div className="text-2xl font-bold text-[#6B4C4C]">0</div>
                  <div className="text-xs text-gray-600 font-medium">Consultations</div>
                </div>
                <div className="text-center p-3 bg-[#7B8A52]/10 rounded-2xl">
                  <div className="text-2xl font-bold text-[#6B4C4C]">4.5</div>
                  <div className="text-xs text-gray-600 font-medium">Note</div>
                </div>
                <div className="text-center p-3 bg-[#7B8A52]/10 rounded-2xl">
                  <div className="text-2xl font-bold text-[#6B4C4C]">98%</div>
                  <div className="text-xs text-gray-600 font-medium">Réussite</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Citoyen moderne */}
        {profile?.role === 'citizen' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-[#7B8A52]/20">
            <h3 className="font-bold text-[#6B4C4C] mb-4 flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              Activité Citoyen
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#7B8A52]/10 rounded-2xl">
                <div className="text-2xl font-bold text-[#6B4C4C]">0</div>
                <div className="text-xs text-gray-600 font-medium">Consultations</div>
              </div>
              <div className="text-center p-4 bg-[#7B8A52]/10 rounded-2xl">
                <div className="text-2xl font-bold text-[#6B4C4C]">0</div>
                <div className="text-xs text-gray-600 font-medium">Documents</div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications récentes modernes */}
        {notifications.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-[#7B8A52]/20">
            <h3 className="font-bold text-[#6B4C4C] mb-4 flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5" />
              Notifications récentes
            </h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 bg-gray-50/50 rounded-2xl border-l-4 border-[#6B4C4C]/40 backdrop-blur-sm"
                >
                  <p className="text-sm font-semibold text-gray-800">
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

        {/* Bouton de déconnexion moderne */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-50/50 transition-all duration-200 shadow-lg border border-red-200/50 mb-6"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>

        {/* Footer moderne */}
        <div className="text-center mt-6 text-gray-500 text-sm mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#7B8A52]/20">
          <p className="font-medium text-[#6B4C4C]">YOON Platform v1.0</p>
          <p className="mt-1 text-gray-600">DroitCitoyen © 2025</p>
        </div>
      </div>
    </div>
  );
}
