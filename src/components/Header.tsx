import NotificationBell from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  showNotifications?: boolean;
}

export default function Header({ title, showNotifications = true }: HeaderProps) {
  const { profile } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      
      <div className="relative flex items-center justify-between px-6 py-4">
        <div className="flex-1">
          {title && (
            <h1 className="text-lg font-semibold text-[#6B4C4C] truncate">
              {title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {showNotifications && (
            <NotificationBell />
          )}
          
          {profile && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-[#4A3A3A] flex items-center justify-center text-white text-sm font-medium shadow-lg">
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}