// Service pour connecter les notifications aux mises à jour juridiques
import { legalService } from './legalService';
import { Notification } from '../contexts/NotificationContext';

class LegalNotificationService {
  // Notifier les utilisateurs d'une nouvelle recherche juridique
  notifySearchCompletion(userId: string, query: string, resultsCount: number) {
    const notification: Omit<Notification, 'id' | 'timestamp' | 'read'> = {
      title: 'Recherche juridique complétée',
      message: `Votre recherche "${query}" a retourné ${resultsCount} résultat(s)`,
      type: resultsCount > 0 ? 'success' : 'warning',
      userId: userId,
      actionUrl: '/legal-search',
      metadata: {
        searchQuery: query,
        resultsCount: resultsCount,
        type: 'legal_search'
      }
    };

    return notification;
  }

  // Notifier les utilisateurs d'une nouvelle mise à jour juridique
  notifyLegalUpdate(affectedTexts: number[], updateType: 'new' | 'modified' | 'abrogated') {
    const updateMessages = {
      new: 'nouveaux textes juridiques ajoutés',
      modified: 'textes juridiques modifiés',
      abrogated: 'textes juridiques abrogés'
    };

    return {
      title: 'Mise à jour juridique',
      message: `${affectedTexts.length} ${updateMessages[updateType]} dans la base de données`,
      type: 'info' as const,
      metadata: {
        affectedTexts,
        updateType,
        type: 'legal_update'
      }
    };
  }

  // Notifier les utilisateurs de la disponibilité d'experts
  notifyExpertAvailability(expertCount: number, domain: string) {
    return {
      title: 'Experts disponibles',
      message: `${expertCount} expert(s) en ${domain} disponible(s) pour consultation`,
      type: 'info' as const,
      actionUrl: '/experts',
      metadata: {
        expertCount,
        domain,
        type: 'expert_availability'
      }
    };
  }

  // Simuler des notifications de test pour la recherche juridique
  async generateTestNotifications() {
    const notifications = [
      this.notifySearchCompletion('user_1', 'contrat de travail', 3),
      this.notifySearchCompletion('user_2', 'divorce', 5),
      this.notifyLegalUpdate([16, 20, 22], 'modified'),
      this.notifyExpertAvailability(8, 'Droit du travail')
    ];

    return notifications;
  }

  // Créer des notifications personnalisées basées sur l'activité utilisateur
  async createPersonalizedNotifications(userId: string, userInterests: string[]) {
    const notifications = [];

    // Notification pour les mises à jour dans les domaines d'intérêt
    if (userInterests.includes('droit du travail')) {
      notifications.push(
        this.notifyLegalUpdate([20], 'modified'),
        this.notifyExpertAvailability(12, 'Droit du travail')
      );
    }

    if (userInterests.includes('droit de la famille')) {
      notifications.push(this.notifyLegalUpdate([19], 'modified'));
    }

    if (userInterests.includes('droit pénal')) {
      notifications.push(this.notifyLegalUpdate([16], 'new'));
    }

    return notifications;
  }
}

export const legalNotificationService = new LegalNotificationService();