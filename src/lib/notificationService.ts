import React from 'react';
import { useNotifications, Notification } from '../contexts/NotificationContext';

export interface NotificationTemplate {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  private static instance: NotificationService;
  private addNotification: (notification: any) => void;

  private constructor(addNotification: (notification: any) => void) {
    this.addNotification = addNotification;
  }

  static getInstance(addNotification?: (notification: any) => void): NotificationService {
    if (!NotificationService.instance && addNotification) {
      NotificationService.instance = new NotificationService(addNotification);
    }
    return NotificationService.instance;
  }

  // Notifications pour les consultations
  consultationCreated(consultationData: any) {
    this.addNotification({
      title: 'Nouvelle demande de consultation',
      message: `Votre demande de consultation en ${consultationData.subject} a été envoyée avec succès`,
      type: 'success',
      userId: consultationData.userId,
      actionUrl: `/consultations/${consultationData.id}`,
      metadata: { consultationId: consultationData.id, type: 'consultation_created' }
    });
  }

  consultationStatusChanged(consultationData: any) {
    const statusMessages: Record<string, string> = {
      'accepted': 'Votre consultation a été acceptée par un expert',
      'rejected': 'Votre consultation a été refusée',
      'in_progress': 'Votre consultation est en cours',
      'completed': 'Votre consultation est terminée',
      'cancelled': 'Votre consultation a été annulée'
    };

    this.addNotification({
      title: 'Mise à jour de consultation',
      message: statusMessages[consultationData.status] || 'Statut de consultation mis à jour',
      type: consultationData.status === 'accepted' || consultationData.status === 'completed' ? 'success' : 'info',
      userId: consultationData.userId,
      actionUrl: `/consultations/${consultationData.id}`,
      metadata: { consultationId: consultationData.id, newStatus: consultationData.status }
    });
  }

  // Notifications pour les messages
  newMessage(messageData: any) {
    this.addNotification({
      title: 'Nouveau message',
      message: `Nouveau message de ${messageData.senderName}`,
      type: 'info',
      userId: messageData.receiverId,
      actionUrl: `/messages/${messageData.conversationId}`,
      metadata: { conversationId: messageData.conversationId, senderId: messageData.senderId }
    });
  }

  // Notifications pour les documents
  documentUploaded(documentData: any) {
    this.addNotification({
      title: 'Document ajouté',
      message: `Le document "${documentData.name}" a été ajouté à vos favoris`,
      type: 'success',
      userId: documentData.userId,
      actionUrl: `/favorites`,
      metadata: { documentId: documentData.id, documentName: documentData.name }
    });
  }

  // Notifications pour les experts
  expertRegistered(expertData: any) {
    this.addNotification({
      title: 'Nouvel expert inscrit',
      message: `${expertData.name} s'est inscrit comme expert`,
      type: 'info',
      actionUrl: `/experts/${expertData.id}`,
      metadata: { expertId: expertData.id, type: 'expert_registration' }
    });
  }

  // Notifications pour l'administration
  adminAlert(alertData: any) {
    this.addNotification({
      title: alertData.title,
      message: alertData.message,
      type: alertData.type || 'warning',
      metadata: alertData.metadata
    });
  }

  // Notifications pour les paiements
  paymentReminder(paymentData: any) {
    this.addNotification({
      title: 'Rappel de paiement',
      message: `Vous avez une facture de ${paymentData.amount} FCFA en attente`,
      type: 'warning',
      userId: paymentData.userId,
      actionUrl: `/payments/${paymentData.id}`,
      metadata: { paymentId: paymentData.id, amount: paymentData.amount }
    });
  }

  paymentConfirmed(paymentData: any) {
    this.addNotification({
      title: 'Paiement confirmé',
      message: `Votre paiement de ${paymentData.amount} FCFA a été confirmé`,
      type: 'success',
      userId: paymentData.userId,
      actionUrl: `/payments/${paymentData.id}`,
      metadata: { paymentId: paymentData.id, amount: paymentData.amount }
    });
  }

  // Notifications système
  systemMaintenance(maintenanceData: any) {
    this.addNotification({
      title: 'Maintenance du système',
      message: `Maintenance prévue le ${maintenanceData.date} de ${maintenanceData.startTime} à ${maintenanceData.endTime}`,
      type: 'warning',
      metadata: { type: 'maintenance', ...maintenanceData }
    });
  }

  appUpdate(updateData: any) {
    this.addNotification({
      title: 'Mise à jour disponible',
      message: 'Une nouvelle version de l\'application est disponible',
      type: 'info',
      actionUrl: '/download',
      metadata: { type: 'app_update', version: updateData.version }
    });
  }
}

// Hook pour utiliser le service de notifications
export function useNotificationService() {
  const { addNotification } = useNotifications();
  
  React.useEffect(() => {
    NotificationService.getInstance(addNotification);
  }, [addNotification]);

  return NotificationService.getInstance();
}