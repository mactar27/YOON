// Service pour gérer les images de profil avec stockage local
export interface ImageRecord {
  id: string;
  userId: string;
  filename: string;
  base64: string;
  uploadDate: string;
}

class ImageService {
  private readonly STORAGE_KEY = 'yoon_profile_images';

  // Générer un ID unique pour chaque image
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Sauvegarder une image de profil
  async saveProfileImage(userId: string, file: File): Promise<string> {
    try {
      // Convertir le fichier en base64
      const base64 = await this.fileToBase64(file);
      
      // Valider la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image ne doit pas dépasser 5MB');
      }

      // Valider le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      // Optimiser l'image (redimensionner si nécessaire)
      const optimizedBase64 = await this.optimizeImage(base64, 500, 500);

      // Créer l'objet image
      const imageData: ImageRecord = {
        id: this.generateId(),
        userId,
        filename: file.name,
        base64: optimizedBase64,
        uploadDate: new Date().toISOString()
      };

      // Sauvegarder dans le stockage local
      const existingImages = this.getAllImages();
      existingImages[userId] = imageData;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingImages));

      return optimizedBase64;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'image:', error);
      throw error;
    }
  }

  // Récupérer l'image de profil d'un utilisateur
  getProfileImage(userId: string): string | null {
    try {
      const images = this.getAllImages();
      return images[userId]?.base64 || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'image:', error);
      return null;
    }
  }

  // Supprimer l'image de profil
  deleteProfileImage(userId: string): boolean {
    try {
      const images = this.getAllImages();
      if (images[userId]) {
        delete images[userId];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      return false;
    }
  }

  // Convertir un fichier en base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Optimiser une image (redimensionner et compresser)
  private async optimizeImage(base64: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Calculer les nouvelles dimensions
        let { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height);

        if (ratio < 1) {
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image optimisée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en base64 avec compression
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(optimizedBase64);
      };
      img.src = base64;
    });
  }

  // Récupérer toutes les images stockées
  private getAllImages(): Record<string, ImageRecord> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Erreur lors de la lecture du stockage:', error);
      return {};
    }
  }

  // Nettoyer les anciennes images (optionnel)
  cleanupOldImages(daysToKeep: number = 365): number {
    try {
      const images = this.getAllImages();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      let cleanedCount = 0;
      for (const [userId, imageData] of Object.entries(images)) {
        const uploadDate = new Date(imageData.uploadDate);
        if (uploadDate < cutoffDate) {
          delete images[userId];
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images));
      }

      return cleanedCount;
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      return 0;
    }
  }
}

// Singleton instance
export const imageService = new ImageService();