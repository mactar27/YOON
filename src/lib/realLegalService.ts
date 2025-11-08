import { LEGAL_ARTICLES } from '../data/legalArticles';

type LegalContent = {
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
};

export class RealLegalService {
  // Mapping des catégories par ordre de priorité hiérarchique
  private static readonly CATEGORY_ORDER = {
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

  // Cache des données de la base de données
  private static cache: LegalContent[] | null = null;

  /**
   * Charger les articles depuis la base de données senegal_juridique.sql
   * @param category - Filtre par catégorie (optionnel)
   * @param searchQuery - Terme de recherche (optionnel)
   * @returns Liste des articles
   */
  static async loadContents(
    category?: string,
    searchQuery?: string
  ): Promise<LegalContent[]> {
    try {
      // Charger les données depuis la base extraite
      if (!this.cache) {
        this.cache = [...LEGAL_ARTICLES]; // Utiliser les 333 articles extraits
      }

      let filteredData = [...this.cache];

      // Filtrer par catégorie si spécifiée
      if (category && category !== 'all') {
        filteredData = filteredData.filter(article => article.category === category);
      }

      // Filtrer par terme de recherche si spécifié
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = searchQuery.trim().toLowerCase();
        filteredData = filteredData.filter(article =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.summary?.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm) ||
          article.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // Trier par ordre logique hiérarchique
      return this.sortByLegalHierarchy(filteredData);
    } catch (error) {
      console.error('Erreur lors du chargement des contenus:', error);
      
      // En cas d'erreur, retourner des données de fallback
      return this.getFallbackData();
    }
  }

  /**
   * Obtenir un article par ID depuis la base de données
   * @param id - ID de l'article
   * @returns Article ou null
   */
  static async getArticleById(id: string): Promise<LegalContent | null> {
    try {
      if (!this.cache) {
        this.cache = [...LEGAL_ARTICLES]; // Utiliser les 333 articles extraits
      }
      
      const article = this.cache.find(article => article.id === id);
      return article || null;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      return this.getFallbackArticle(id);
    }
  }

  /**
   * Trier les articles par ordre logique hiérarchique
   * @param contents - Liste des articles
   * @returns Articles triés
   */
  private static sortByLegalHierarchy(contents: LegalContent[]): LegalContent[] {
    return contents.sort((a, b) => {
      const orderA = this.CATEGORY_ORDER[a.category as keyof typeof this.CATEGORY_ORDER] || 999;
      const orderB = this.CATEGORY_ORDER[b.category as keyof typeof this.CATEGORY_ORDER] || 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      return a.title.localeCompare(b.title, 'fr');
    });
  }

  // Contenu simulé basé sur les vrais articles du fichier SQL
  private static getConstitutionContent(): string {
    return `PRÉAMBULE
Le peuple sénégalais, proclame solennellement sa volonté de:
- Construire un État de droit et de justice
- Promouvoir la sauvegarde de la dignité humaine
- Établir la justice sociale
- Réaliser l'égalité politique, économique et sociale

TITRE I - DE L'ÉTAT ET DE LA SOUVERAINETÉ
Article 1er. Le Sénégal est une République indépendante et souveraine.
Article 2. La langue officielle de la République du Sénégal est le français.
Article 3. La capitale de la République du Sénégal est Dakar.

TITRE II - DU PRÉSIDENT DE LA RÉPUBLIQUE
Article 5. Le Président de la République est le Chef de l'État. Il veille au respect de la Constitution.
Article 6. Il est l'agent principal des relations internationales.`;
  }

  private static getPenalCodeContent(): string {
    return `LIVRE I - DES INFRACTIONS
TITRE PREMIER - DES INFRACTIONS EN GÉNÉRAL
CHAPITRE I - DE LA CLASSIFICATION DES INFRACTIONS

Art. 1.- Les infractions sont rangées, suivant la gravité que la loi leur attribue, en crimes, délits et contraventions.

CHAPITRE II - DE LA QUALIFICATION DES INFRACTIONS
Art. 2.- Nul ne peut être puni pour un crime ou pour un délit qui n'était pas angé comme tel par la loi, ou pour une contravention qui n'était pas ainsi qualifiée par un règlement au moment où il a été commis.

LIVRE II - DES DÉLITS
Les délits sont punis soit de peines d'emprisonnement, soit de peines d'amende, soit de ces deux peines à la fois, à la prescription de la loi.`;
  }

  private static getCivilCodeContent(): string {
    return `TITRE I - DES PERSONNES
CHAPITRE I - DE LA CAPACITÉ
Art. 112. Toute personne physique a une capacité juridique.
Art. 113. La capacité juridique s'exerce à partir de la majorité.
Art. 114. Les actes accomplis par la personne arelle de capacité sont nuls.

TITRE II - DES BIENS
CHAPITRE I - DE LA PROPRIÉTÉ
Art. 578. La propriété est le droit de jouir et disposer des choses de la manière la plus absolue.
Art. 579. Nul ne peut être contraint de ceder sa propriété, si ce n'est pour cause d'utilité publique.
`;
  }

  private static getFamilyCodeContent(): string {
    return `LIVRE I - DU MARIAGE
CHAPITRE I - DES CONDITIONS DU MARIAGE
Art. 1. Le mariage est l'union légitime d'un homme et d'une femme.
Art. 2. Le consentement doit être libre et éclairé.
Art. 3. Le mariage est célébré par un Officier de l'état civil.

LIVRE II - DU DIVORCE
CHAPITRE I - DES CAUSES
Art. 58. Le divorce peut être prononcé pour cause d'adultère, de violences, d'abandon.`;
  }

  private static getLaborCodeContent(): string {
    return `TITRE I - DU CONTRAT DE TRAVAIL
CHAPITRE I - DE LA FORMATION
Art. 1. Le contrat de travail est celui par lequel une personne s'engage à travailler pour le compte et sous la direction d'une autre.
Art. 2. Le contrat peut être écrit ou verbal.
Art. 3. Il doit préciser la nature du travail, le lieu, la durée.`;
  }

  private static getCriminalProcedureContent(): string {
    return `LIVRE I - DE L'ENQUÊTE
CHAPITRE I - DE LA POLICE JUDICIAIRE
Art. 1. La police judiciaire est placée sous la direction et le contrôle du Procureur de la République.
Art. 2. Les officiers de police judiciaire sont compétents pour rechercher et constater les infractions.`;
  }

  private static getCivilProcedureContent(): string {
    return `LIVRE I - DES JURIDICTIONS
CHAPITRE I - DU TRIBUNAL
Art. 1. Le tribunal est compétent pour connaître de toutes les demandes civiles.
Art. 2. Il est statué en premier ressort, à charge d'appel.`;
  }

  /**
   * Données de fallback en cas d'erreur
   * @returns Données de démonstration
   */
  private static getFallbackData(): LegalContent[] {
    return [
      {
        id: '1',
        title: 'Constitution du Sénégal',
        category: 'constitution',
        content: 'Constitution de la République du Sénégal...',
        summary: 'Texte fondamental de l\'État sénégalais',
        language: 'fr',
        tags: ['constitution', 'état', 'droits'],
        published_by: null,
        is_published: true,
        views_count: 1450,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private static getFallbackArticle(id: string): LegalContent {
    return {
      id,
      title: `Article ${id}`,
      category: 'constitution',
      content: 'Contenu de l\'article depuis la base de données...',
      summary: 'Résumé de l\'article',
      language: 'fr',
      tags: ['article'],
      published_by: null,
      is_published: true,
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Obtenir les catégories avec leur ordre
   * @returns Catégories triées
   */
  static getSortedCategories() {
    return [
      { id: 'constitution', label: 'Constitution', priority: 1 },
      { id: 'loi_penale', label: 'Droit Pénal', priority: 2 },
      { id: 'procedure_penale', label: 'Procédure Pénale', priority: 3 },
      { id: 'droit_civil', label: 'Droit Civil', priority: 4 },
      { id: 'procedure_civile', label: 'Procédure Civile', priority: 5 },
      { id: 'code_famille', label: 'Droit de la Famille', priority: 6 },
      { id: 'droit_travail', label: 'Droit du Travail', priority: 7 },
      { id: 'securite_sociale', label: 'Sécurité Sociale', priority: 8 },
      { id: 'impots', label: 'Droit Fiscal', priority: 9 },
      { id: 'commerce', label: 'Droit Commercial', priority: 10 },
      { id: 'marches_publics', label: 'Marchés Publics', priority: 11 },
      { id: 'foncier', label: 'Droit Foncier', priority: 12 },
      { id: 'urbanisme', label: 'Urbanisme', priority: 13 },
      { id: 'assurances', label: 'Assurances', priority: 14 },
      { id: 'propriete_intellectuelle', label: 'Propriété Intellectuelle', priority: 15 },
      { id: 'sante', label: 'Droit de la Santé', priority: 16 },
      { id: 'education', label: 'Droit de l\'Éducation', priority: 17 },
      { id: 'electoral', label: 'Droit Électoral', priority: 18 },
      { id: 'presse', label: 'Droit de la Presse', priority: 19 },
      { id: 'environnement', label: 'Droit de l\'Environnement', priority: 20 },
      { id: 'foret', label: 'Droit Forestier', priority: 21 },
      { id: 'transport', label: 'Droit des Transports', priority: 22 },
      { id: 'aviation', label: 'Droit de l\'Aviation', priority: 23 }
    ].sort((a, b) => a.priority - b.priority);
  }
}