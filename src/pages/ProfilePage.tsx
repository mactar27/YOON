import { useNavigate } from 'react-router-dom';
import { User, Settings, FileText, MessageSquare, HelpCircle, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/welcome');
  };

  const menuItems = [
    { icon: User, label: 'Informations personnelles', path: '/profile/edit' },
    { icon: FileText, label: 'Mes documents', path: '/home' },
    { icon: MessageSquare, label: 'Mes consultations', path: '/messages' },
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
      icon: Shield,
      label: 'Mon profil expert',
      path: '/expert-profile'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-[#6B4C4C] to-[#5A3E3E] px-6 pt-12 pb-24 text-white">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-4xl font-bold mb-4">
            {profile?.full_name.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1 className="text-2xl font-bold mb-1">
            {profile?.full_name || 'Utilisateur'}
          </h1>
          <p className="text-sm opacity-80 mb-1">
            {user?.email}
          </p>
          <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium capitalize">
            {profile?.role === 'admin' ? 'Administrateur' : profile?.role === 'expert' ? 'Expert' : 'Citoyen'}
          </span>
          {profile?.role === 'expert' && (
            <div className="mt-2 text-center">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Profil en attente de validation
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 -mt-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
            >
              <item.icon className="w-5 h-5 text-[#6B4C4C]" />
              <span className="flex-1 text-left text-gray-800 font-medium">
                {item.label}
              </span>
              <span className="text-gray-400">›</span>
            </button>
          ))}
        </div>

        {profile?.role === 'expert' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Statut Expert</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${profile ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">
                Compte vérifié et actif
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 bg-white text-red-600 py-4 rounded-xl font-medium hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>

        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>YOON Platform v1.0</p>
          <p className="mt-1">DroitCitoyen © 2025</p>
        </div>
      </div>
    </div>
  );
}
