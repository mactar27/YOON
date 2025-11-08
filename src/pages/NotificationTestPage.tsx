import { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useNotificationService } from '../lib/notificationService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

export default function NotificationTestPage() {
  const { profile } = useAuth();
  const { notifications, clearAllNotifications } = useNotifications();
  const notificationService = useNotificationService();

  const [testData, setTestData] = useState({
    consultationSubject: 'Droit civil',
    expertName: 'Maître Diop',
    amount: 50000,
    senderName: 'Maître Fall'
  });

  const triggerNotification = (type: string) => {
    const userId = profile?.id || 'demo-user';
    
    switch (type) {
      case 'consultation_created':
        notificationService.consultationCreated({
          id: 'consultation_123',
          subject: testData.consultationSubject,
          userId
        });
        break;
        
      case 'consultation_accepted':
        notificationService.consultationStatusChanged({
          id: 'consultation_123',
          status: 'accepted',
          userId,
          subject: testData.consultationSubject
        });
        break;
        
      case 'new_message':
        notificationService.newMessage({
          conversationId: 'conv_123',
          senderName: testData.senderName,
          receiverId: userId,
          senderId: 'expert_123'
        });
        break;
        
      case 'payment_reminder':
        notificationService.paymentReminder({
          id: 'payment_123',
          amount: testData.amount,
          userId
        });
        break;
        
      case 'payment_confirmed':
        notificationService.paymentConfirmed({
          id: 'payment_123',
          amount: testData.amount,
          userId
        });
        break;
        
      case 'expert_registered':
        notificationService.expertRegistered({
          id: 'expert_456',
          name: 'Maître Ndiaye'
        });
        break;
        
      case 'system_alert':
        notificationService.adminAlert({
          title: 'Maintenance programmée',
          message: 'Le système sera indisponible dimanche de 2h à 4h du matin',
          type: 'warning',
          metadata: { scheduled: true }
        });
        break;
        
      case 'document_uploaded':
        notificationService.documentUploaded({
          id: 'doc_789',
          name: 'Nouveau Code Civil',
          userId
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Test des Notifications" />
      
      <div className="p-4 space-y-6">
        {/* Section configuration */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuration de test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet de consultation
              </label>
              <input
                type="text"
                value={testData.consultationSubject}
                onChange={(e) => setTestData(prev => ({ ...prev, consultationSubject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B4C4C]"
                placeholder="Droit civil"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'expert
              </label>
              <input
                type="text"
                value={testData.expertName}
                onChange={(e) => setTestData(prev => ({ ...prev, expertName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B4C4C]"
                placeholder="Maître Diop"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant (FCFA)
              </label>
              <input
                type="number"
                value={testData.amount}
                onChange={(e) => setTestData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B4C4C]"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'expéditeur
              </label>
              <input
                type="text"
                value={testData.senderName}
                onChange={(e) => setTestData(prev => ({ ...prev, senderName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B4C4C]"
                placeholder="Maître Fall"
              />
            </div>
          </div>
        </div>

        {/* Section notifications */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Déclencher des notifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              onClick={() => triggerNotification('consultation_created')}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Nouvelle consultation
            </button>
            <button
              onClick={() => triggerNotification('consultation_accepted')}
              className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Consultation acceptée
            </button>
            <button
              onClick={() => triggerNotification('new_message')}
              className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              Nouveau message
            </button>
            <button
              onClick={() => triggerNotification('payment_reminder')}
              className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              Rappel de paiement
            </button>
            <button
              onClick={() => triggerNotification('payment_confirmed')}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Paiement confirmé
            </button>
            <button
              onClick={() => triggerNotification('expert_registered')}
              className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
            >
              Nouvel expert
            </button>
            <button
              onClick={() => triggerNotification('system_alert')}
              className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Alerte système
            </button>
            <button
              onClick={() => triggerNotification('document_uploaded')}
              className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
            >
              Document ajouté
            </button>
            <button
              onClick={clearAllNotifications}
              className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Tout effacer
            </button>
          </div>
        </div>

        {/* Section aperçu des notifications */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Aperçu des notifications ({notifications.length})
          </h3>
          
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    !notification.read ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.timestamp.toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notification.type === 'success' ? 'bg-green-100 text-green-800' :
                        notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        notification.type === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notification.type}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instructions</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Cliquez sur les boutons pour déclencher différents types de notifications</li>
            <li>• Les notifications sont sauvegardées localement et persistent au rechargement</li>
            <li>• Si les notifications navigateur sont autorisées, elles apparaîtront aussi en push</li>
            <li>• Utilisez la cloche de notifications dans l'en-tête pour voir la liste complète</li>
          </ul>
        </div>
      </div>
    </div>
  );
}