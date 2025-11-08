import { Home, Search, MessageSquare, Scale, Shield, User, Bell, CreditCard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();

  const navItems = [
    { icon: Home, path: '/home' },
    { icon: Search, path: '/search' },
    { icon: MessageSquare, path: '/messages' },
    { icon: Scale, path: '/experts' },
    { icon: User, path: '/profile' },
  ];

  // Ajouter l'onglet admin si l'utilisateur est admin
  if (profile?.role === 'admin') {
    navItems.push({ icon: Shield, path: '/admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[#7B8A52]/30 z-50 safe-area-bottom landscape-compact">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex items-center justify-center p-2 rounded-2xl transition-all duration-200 min-w-0 touch-target ${
                isActive
                  ? 'text-[#6B4C4C] bg-[#6B4C4C]/20 shadow-lg transform scale-110'
                  : 'text-gray-500 hover:text-[#6B4C4C] hover:bg-[#7B8A52]/20 active:bg-[#7B8A52]/30'
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-1.5'}`}
              />
              {/* Badge pour les notifications */}
              {item.path === '/profile' && unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
