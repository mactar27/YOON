import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { legalNotificationService } from '../lib/legalNotificationService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Book, Bell, Search, Users, FileText, TestTube } from 'lucide-react';

const LegalTestPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Tests des notifications juridiques
  const testSearchNotification = async () => {
    setLoading(true);
    try {
      // Simuler une recherche
      const query = 'contrat de travail';
      const resultsCount = Math.floor(Math.random() * 10) + 1;
      
      // Créer notification de recherche
      const searchNotif = legalNotificationService.notifySearchCompletion(
        user?.id || 'guest',
        query,
        resultsCount
      );
      
      addNotification(searchNotif);
      addNotification({
        title: 'Test Search',
        message: `Recherche simulée "${query}" - ${resultsCount} résultats`,
        type: 'info'
      });
    } catch (error) {
      addNotification({
        title: 'Erreur',
        message: 'Erreur lors du test de notification',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testLegalUpdateNotification = () => {
    const updateNotif = legalNotificationService.notifyLegalUpdate(
      [16, 20, 22],
      'modified'
    );
    addNotification(updateNotif);
    
    addNotification({
      title: 'Test Update',
      message: 'Notification de mise à jour juridique simulée',
      type: 'warning'
    });
  };

  const testExpertNotification = () => {
    const expertNotif = legalNotificationService.notifyExpertAvailability(
      8,
      'Droit du travail'
    );
    addNotification(expertNotif);
    
    addNotification({
      title: 'Test Expert',
      message: 'Notification de disponibilité expert simulée',
      type: 'success'
    });
  };

  const testAllNotifications = async () => {
    setLoading(true);
    
    // Test de toutes les notifications en séquence
    await testSearchNotification();
    
    setTimeout(() => testLegalUpdateNotification(), 500);
    
    setTimeout(() => testExpertNotification(), 1000);
    
    addNotification({
      title: 'Test Complet',
      message: 'Tous les tests de notifications ont été exécutés',
      type: 'info'
    });
    
    setLoading(false);
  };

  const clearAllNotifications = () => {
    addNotification({
      title: 'Nettoyage',
      message: 'Toutes les notifications ont été supprimées (simulation)',
      type: 'info'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center">
              <TestTube className="mr-3" size={28} />
              Test des Notifications Juridiques
            </h1>
            <div className="text-sm text-gray-500">
              Système YOON - Notifications Réelles
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* État de l'utilisateur */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="mr-2" size={20} />
            État du Système
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 text-2xl font-bold">✅</div>
              <div className="text-sm text-green-700 mt-1">Notifications Réelles</div>
              <div className="text-xs text-green-600">Système fonctionnel</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 text-2xl font-bold">📚</div>
              <div className="text-sm text-blue-700 mt-1">Base Juridique</div>
              <div className="text-xs text-blue-600">{user ? 'Connecté' : 'Invité'}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-purple-600 text-2xl font-bold">🔔</div>
              <div className="text-sm text-purple-700 mt-1">Système de Notification</div>
              <div className="text-xs text-purple-600">Actif</div>
            </div>
          </div>
        </div>

        {/* Tests des notifications */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <Bell className="mr-2" size={20} />
            Tests des Notifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test de recherche */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Search className="mr-2" size={16} />
                Test Recherche Juridique
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Teste les notifications de recherche dans la base juridique
              </p>
              <button
                onClick={testSearchNotification}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Tester Notification de Recherche
              </button>
            </div>

            {/* Test de mise à jour */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="mr-2" size={16} />
                Test Mise à Jour Juridique
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Teste les notifications de mise à jour des textes juridiques
              </p>
              <button
                onClick={testLegalUpdateNotification}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Tester Notification de Mise à Jour
              </button>
            </div>

            {/* Test d'expert */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="mr-2" size={16} />
                Test Disponibilité Expert
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Teste les notifications de disponibilité d'experts juridiques
              </p>
              <button
                onClick={testExpertNotification}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Tester Notification Expert
              </button>
            </div>

            {/* Test complet */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <TestTube className="mr-2" size={16} />
                Test Complet
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Lance tous les tests de notifications en séquence
              </p>
              <button
                onClick={testAllNotifications}
                disabled={loading}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Tests en cours...' : 'Lancer Tous les Tests'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation vers autres pages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Book className="mr-2" size={20} />
            Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/legal-search')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Recherche Juridique
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              Accueil
            </button>
            <button
              onClick={() => navigate('/experts')}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Experts
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Profil
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions de Test</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Testez chaque type de notification individuellement</li>
            <li>• Vérifiez que les notifications apparaissent dans le Header</li>
            <li>• Naviguez vers différentes pages pour voir la persistance</li>
            <li>• Le compteur de notifications doit être mis à jour</li>
            <li>• Les notifications doivent être sauvegardées localement</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LegalTestPage;