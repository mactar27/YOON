import { LEGAL_ARTICLES } from '../data/legalArticles';

// Interface standardisée pour les articles
export interface LegalContent {
  id: string;
  title: string;
  category: string;
  content: string;
  summary?: string;
  language: string;
  tags?: string[];
  published_by?: string | null;
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

// Service juridique final optimisé
export class LegalServiceFinal {
  private static cache: LegalContent[] = [...LEGAL_ARTICLES];

  /**
   * Charger les articles avec filtres et recherche
   */
  static async loadContents(
    category?: string,
    searchQuery?: string
  ): Promise<LegalContent[]> {
    try {
      let filteredData = [...this.cache];

      // Filtrer par catégorie
      if (category && category !== 'all') {
        filteredData = filteredData.filter(article => article.category === category);
      }

      // Filtrer par recherche
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = searchQuery.trim().toLowerCase();
        filteredData = filteredData.filter(article =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.summary?.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm) ||
          article.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Trier par ID numérique croissant pour chaque catégorie
      return this.sortByCategoryAndNumber(filteredData);
    } catch (error) {
      console.error('Erreur lors du chargement des contenus:', error);
      return [];
    }
  }

  /**
   * Obtenir un article par ID
   */
  static async getArticleById(id: string): Promise<LegalContent | null> {
    try {
      // Validation: s'assurer que l'ID est un nombre valide
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        console.error('ID invalide:', id);
        return null;
      }

      const article = this.cache.find(article => article.id === id);
      
      if (!article) {
        console.error(`Article ${id} non trouvé dans la base de ${this.cache.length} articles`);
        return null;
      }

      console.log(`Article ${id} trouvé:`, article.title);
      return article;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      return null;
    }
  }

  /**
   * Trier par catégorie puis par numéro d'article croissant
   */
  private static sortByCategoryAndNumber(contents: LegalContent[]): LegalContent[] {
    const categoryOrder = {
      'constitution': 1,
      'loi_penale': 2,
      'procedure_penale': 3,
      'droit_civil': 4,
      'procedure_civile': 5,
      'code_famille': 6,
      'droit_travail': 7,
      'securite_sociale': 8,
      'impots': 9,
      'commerce': 10,
      'marches_publics': 11,
      'foncier': 12,
      'urbanisme': 13,
      'assurances': 14,
      'propriete_intellectuelle': 15,
      'sante': 16,
      'education': 17,
      'electoral': 18,
      'presse': 19,
      'environnement': 20,
      'foret': 21,
      'transport': 22,
      'aviation': 23
    };

    return contents.sort((a, b) => {
      // Trier par catégorie d'abord
      const orderA = categoryOrder[a.category as keyof typeof categoryOrder] || 999;
      const orderB = categoryOrder[b.category as keyof typeof categoryOrder] || 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // Puis par ID numérique croissant
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      
      if (!isNaN(idA) && !isNaN(idB)) {
        return idA - idB;
      }
      
      // Fallback: tri par titre
      return a.title.localeCompare(b.title, 'fr');
    });
  }

  /**
   * Obtenir tous les IDs d'articles pour la navigation
   */
  static getAllArticleIds(): string[] {
    return [...this.cache]
      .map(article => article.id)
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }

  /**
   * Obtenir le nombre total d'articles
   */
  static getTotalArticles(): number {
    return this.cache.length;
  }

  /**
   * Obtenir les catégories disponibles
   */
  static getCategories(): string[] {
    const categories = [...new Set(this.cache.map(article => article.category))];
    return categories.sort((a, b) => {
      const categoryOrder = {
        'constitution': 1,
        'loi_penale': 2,
        'procedure_penale': 3,
        'droit_civil': 4,
        'procedure_civile': 5,
        'code_famille': 6,
        'droit_travail': 7,
        'securite_sociale': 8,
        'impots': 9,
        'commerce': 10,
        'marches_publics': 11,
        'foncier': 12,
        'urbanisme': 13,
        'assurances': 14,
        'propriete_intellectuelle': 15,
        'sante': 16,
        'education': 17,
        'electoral': 18,
        'presse': 19,
        'environnement': 20,
        'foret': 21,
        'transport': 22,
        'aviation': 23
      };
      
      const orderA = categoryOrder[a as keyof typeof categoryOrder] || 999;
      const orderB = categoryOrder[b as keyof typeof categoryOrder] || 999;
      return orderA - orderB;
    });
  }
}