import { useState, useEffect } from 'react';
import { Bell, Check, X, Filter } from 'lucide-react';
import Header from '../components/Header';
import { useNotifications, Notification } from '../contexts/NotificationContext';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    let filtered = [...notifications];

    // Filtrer par statut de lecture
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    setFilteredNotifications(filtered);
  }, [notifications, filter]);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteNotification = (id: string) => {
    removeNotification(id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-50/50';
      case 'warning': return 'border-yellow-500 bg-yellow-50/50';
      case 'error': return 'border-red-500 bg-red-50/50';
      default: return 'border-[#7B8A52] bg-[#7B8A52]/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#7B8A52]/5 to-white pb-24">
      {/* Header moderne avec notifications */}
      <Header title="Notifications" />
      
      {/* Contenu principal */}
      <div className="px-6 py-6">
        {/* En-tête avec actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4A3A3A] rounded-2xl flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#6B4C4C]">Notifications</h1>
              <p className="text-sm text-gray-600">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''} sur {notifications.length} notification{notifications.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-[#6B4C4C] text-white rounded-2xl hover:bg-[#5A3E3E] transition-all duration-200 font-semibold shadow-lg"
            >
              Tout marquer lu
            </button>
          )}
        </div>

        {/* Filtres modernes */}
        <div className="mb-6 space-y-4">
          {/* Filtres par statut */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-[#7B8A52]/20">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-[#6B4C4C]" />
              <span className="text-sm font-semibold text-[#6B4C4C]">Filtrer par statut</span>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Toutes' },
                { value: 'unread', label: 'Non lues' },
                { value: 'read', label: 'Lues' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as typeof filter)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    filter === option.value
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

        {/* Liste des notifications */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <Bell className="w-24 h-24 text-[#7B8A52] mx-auto" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#6B4C4C]/20 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-[#6B4C4C] mb-3">
              Aucune notification
            </h3>
            <p className="text-gray-600 text-lg">
              {filter === 'unread' ? 'Vous avez lu toutes vos notifications.' : 'Vous n\'avez pas de notifications pour le moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 border-l-4 ${getTypeColor(notification.type)} hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] ${
                  !notification.read ? 'ring-2 ring-[#7B8A52]/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icône de type */}
                  <div className="text-2xl mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#6B4C4C] leading-tight mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.timestamp).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-[#6B4C4C] hover:bg-[#7B8A52]/20 rounded-xl transition-colors"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          title="Supprimer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}