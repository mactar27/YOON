import { Home, Search, MessageSquare, Scale, Heart, Shield, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/home' },
    { icon: Search, label: 'Recherche', path: '/search' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Scale, label: 'Experts', path: '/experts' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  // Ajouter l'onglet admin si l'utilisateur est admin
  if (profile?.role === 'admin') {
    navItems.push({ icon: Shield, label: 'Admin', path: '/admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom landscape-compact">
      <div className="flex items-center justify-around px-1 py-1 sm:px-2 sm:py-2 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-2 sm:px-3 rounded-lg transition-all min-w-0 flex-1 touch-target ${
                isActive
                  ? 'text-[#6B4C4C]'
                  : 'text-gray-500 hover:text-gray-700 active:bg-gray-100'
              }`}
            >
              <item.icon
                className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`}
              />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'} truncate`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
