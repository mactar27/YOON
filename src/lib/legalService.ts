// Service pour accéder aux données juridiques du Sénégal
export interface LegalText {
  id: number;
  titre: string;
  contenu: string;
  type_texte: 'CONSTITUTION' | 'LOI_ORGANIQUE' | 'LOI_ORDINAIRE' | 'DECRET' | 'ARRETE' | 'CIRCULAIRE';
  date_promulgation: string;
  numero_officiel?: string;
  domaine_juridique?: string;
  mots_cles?: string;
  statut: 'ACTIVE' | 'ABROGEE' | 'SUSPENDUE' | 'MODIFIEE';
  autorite_emettrice?: string;
  date_creation: string;
  date_modification: string;
}

export interface LegalArticle {
  id: number;
  texte_juridique_id: number;
  numero_article: string;
  titre_article?: string;
  contenu_article: string;
  position_ordre: number;
}

export interface LegalDomain {
  id: number;
  nom: string;
  description?: string;
  parent_id?: number;
}

export interface LegalExpert {
  id: number;
  utilisateur_id: number;
  numero_barreau?: string;
  specialites?: string;
  experience_annees?: number;
  tarif_consultation?: number;
  disponibilite?: string;
  evaluation_moyenne: number;
  nombre_evaluations: number;
}

// Base de données simulée des textes juridiques sénégalais
const legalTextsData: LegalText[] = [
  {
    id: 16,
    titre: 'Code pénal du Sénégal',
    contenu: 'Texte intégral de Code pénal du Sénégal',
    type_texte: 'LOI_ORDINAIRE',
    date_promulgation: '1965-07-21',
    numero_officiel: 'Loi n°65-60',
    domaine_juridique: 'Droit pénal',
    mots_cles: 'crime, délit, contravention, peine, prison, infraction',
    statut: 'ACTIVE',
    autorite_emettrice: 'Assemblée nationale du Sénégal',
    date_creation: '2025-08-20 12:36:31',
    date_modification: '2025-08-20 12:36:31'
  },
  {
    id: 17,
    titre: 'Code des Obligations Civiles et Commerciales',
    contenu: 'Texte intégral de Code des Obligations Civiles et Commerciales',
    type_texte: 'LOI_ORDINAIRE',
    date_promulgation: '1960-12-31',
    domaine_juridique: 'Droit civil',
    mots_cles: 'contrat, obligation, responsabilité, dette, succession, créance',
    statut: 'ACTIVE',
    autorite_emettrice: 'Assemblée nationale du Sénégal',
    date_creation: '2025-08-20 12:36:35',
    date_modification: '2025-08-20 12:36:35'
  },
  {
    id: 18,
    titre: 'Code CIMA des Assurances',
    contenu: 'Texte intégral de Code CIMA des Assurances',
    type_texte: 'LOI_ORDINAIRE',
    date_promulgation: '1992-07-10',
    numero_officiel: 'Traité CIMA',
    domaine_juridique: 'Droit des assurances',
    mots_cles: 'assurance, police, sinistre, indemnité, prime, réassurance',
    statut: 'ACTIVE',
    autorite_emettrice: 'Conférence Interafricaine des Marchés d\'Assurances',
    date_creation: '2025-08-20 12:36:55',
    date_modification: '2025-08-20 12:36:55'
  },
  {
    id: 19,
    titre: 'Code de la Famille du Sénégal',
    contenu: 'Texte intégral de Code de la Famille du Sénégal',
    type_texte: 'LOI_ORDINAIRE',
    date_promulgation: '1972-01-01',
    domaine_juridique: 'Droit de la famille',
    mots_cles: 'mariage, divorce, filiation, succession, régime matrimonial',
    statut: 'ACTIVE',
    autorite_emettrice: 'Assemblée nationale du Sénégal',
    date_creation: '2025-08-20 12:36:57',
    date_modification: '2025-08-20 12:36:57'
  },
  {
    id: 20,
    titre: 'Code du Travail du Sénégal',
    contenu: 'Texte intégral de Code du Travail du Sénégal',
    type_texte: 'LOI_ORDINAIRE',
    date_promulgation: '1997-03-01',
    domaine_juridique: 'Droit du travail',
    mots_cles: 'contrat de travail, licenciement, convention collective, sécurité sociale',
    statut: 'ACTIVE',
    autorite_emettrice: 'Assemblée nationale du Sénégal',
    date_creation: '2025-08-20 12:36:59',
    date_modification: '2025-08-20 12:36:59'
  },
  {
    id: 21,
    titre: 'Code Foncier du Sénégal',
    contenu: 'Texte intégral de Code Foncier du Sénégal',
    type_texte: 'LOI_ORDINAIRE',
    date_promulgation: '1964-06-17',
    numero_officiel: 'Loi n°64-46',
    domaine_juridique: 'Droit foncier',
    mots_cles: 'propriété, domaine national, bail, titre foncier',
    statut: 'ACTIVE',
    autorite_emettrice: 'Assemblée nationale du Sénégal',
    date_creation: '2025-08-20 12:37:09',
    date_modification: '2025-08-20 12:37:09'
  },
  {
    id: 22,
    titre: 'Code Général des Impôts du Sénégal (2013)',
    contenu: 'Texte intégral de Code Général des Impôts du Sénégal (2013)',
    type_texte: 'LOI_ORDINAIRE',
    date_promulgation: '2013-01-01',
    domaine_juridique: 'Droit fiscal',
    mots_cles: 'impôts, taxes, fiscalité, contribution, TVA',
    statut: 'ACTIVE',
    autorite_emettrice: 'Assemblée nationale du Sénégal',
    date_creation: '2025-08-20 12:37:23',
    date_modification: '2025-08-20 12:37:23'
  },
  {
    id: 23,
    titre: 'Code de l\'Environnement du Sénégal (2001)',
    contenu: 'Texte intégral de Code de l\'Environnement du Sénégal (2001)',
    type_texte: 'LOI_ORDINAIRE',
    date_promulgation: '2001-01-15',
    domaine_juridique: 'Droit de l\'environnement',
    mots_cles: 'environnement, pollution, nature, ressources naturelles',
    statut: 'ACTIVE',
    autorite_emettrice: 'Assemblée nationale du Sénégal',
    date_creation: '2025-08-20 12:37:24',
    date_modification: '2025-08-20 12:37:24'
  }
];

// Articles du Code pénal (extraits)
const legalArticlesData: LegalArticle[] = [
  {
    id: 3118,
    texte_juridique_id: 16,
    numero_article: 'Article 1',
    contenu_article: 'L\'infraction que les lois punissent de peines de police est une contravention. L\'infraction que les lois punissent de peines correctionnelles est un délit. L\'infraction que les lois punissent d\'une peine afflictive ou infamante est un crime.',
    position_ordre: 1
  },
  {
    id: 3119,
    texte_juridique_id: 16,
    numero_article: 'Article 2',
    contenu_article: 'Toute tentative de crime qui aura été manifestée par un commencement d\'exécution, si elle n\'a été suspendue ou si elle n\'a manqué son effet que par des circonstances indépendantes de la volonté de son auteur, est considérée comme le crime même.',
    position_ordre: 2
  },
  {
    id: 3120,
    texte_juridique_id: 16,
    numero_article: 'Article 3',
    contenu_article: 'Les tentatives de délits ne sont considérées comme délits que dans les cas déterminés par une disposition spéciale de la loi.',
    position_ordre: 3
  },
  {
    id: 3121,
    texte_juridique_id: 16,
    numero_article: 'Article 4',
    contenu_article: '(Loi n° 99-05 du 29/01/99) Nul crime, nul délit, nulle contravention ne peuvent être punis de peines qui n\'étaient pas prévues par la loi ou le règlement avant qu\'ils fussent commis',
    position_ordre: 4
  },
  {
    id: 3122,
    texte_juridique_id: 16,
    numero_article: 'Article 5',
    contenu_article: 'En cas de commission de plusieurs crimes ou délits, la peine la plus forte est seule prononcée.',
    position_ordre: 5
  }
];

class LegalService {
  // Obtenir tous les textes juridiques
  async getLegalTexts(): Promise<LegalText[]> {
    // Simulation d'un appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(legalTextsData);
      }, 100);
    });
  }

  // Obtenir un texte juridique par ID
  async getLegalText(id: number): Promise<LegalText | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const text = legalTextsData.find(t => t.id === id);
        resolve(text || null);
      }, 100);
    });
  }

  // Obtenir les articles d'un texte juridique
  async getArticles(texteJuridiqueId: number): Promise<LegalArticle[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const articles = legalArticlesData.filter(a => a.texte_juridique_id === texteJuridiqueId);
        resolve(articles);
      }, 100);
    });
  }

  // Rechercher dans les textes juridiques
  async searchLegalTexts(query: string, domain?: string): Promise<LegalText[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = legalTextsData.filter(text => {
          const matchesQuery = query === '' || 
            text.titre.toLowerCase().includes(query.toLowerCase()) ||
            text.contenu.toLowerCase().includes(query.toLowerCase()) ||
            (text.mots_cles && text.mots_cles.toLowerCase().includes(query.toLowerCase()));
          
          const matchesDomain = !domain || domain === 'all' || 
            text.domaine_juridique?.toLowerCase().includes(domain.toLowerCase());
          
          return matchesQuery && matchesDomain;
        });
        resolve(results);
      }, 200);
    });
  }

  // Rechercher dans les articles
  async searchArticles(query: string, texteJuridiqueId?: number): Promise<LegalArticle[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = legalArticlesData.filter(article => {
          const matchesQuery = query === '' || 
            article.contenu_article.toLowerCase().includes(query.toLowerCase()) ||
            (article.titre_article && article.titre_article.toLowerCase().includes(query.toLowerCase()));
          
          const matchesText = !texteJuridiqueId || article.texte_juridique_id === texteJuridiqueId;
          
          return matchesQuery && matchesText;
        });
        resolve(results);
      }, 200);
    });
  }

  // Obtenir tous les domaines juridiques
  async getLegalDomains(): Promise<LegalDomain[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const domains = Array.from(new Set(legalTextsData.map(t => t.domaine_juridique).filter(Boolean)));
        const domainObjects: LegalDomain[] = domains.map((domaine, index) => ({
          id: index + 1,
          nom: domaine!,
          description: `Domaine juridique : ${domaine}`
        }));
        resolve(domainObjects);
      }, 100);
    });
  }

  // Sauvegarder l'historique de recherche
  async saveSearchHistory(userId: string | number, query: string, resultsCount: number): Promise<void> {
    // Simulation de sauvegarde
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Historique sauvegardé pour utilisateur ${userId}: "${query}" (${resultsCount} résultats)`);
        resolve();
      }, 50);
    });
  }
}

export const legalService = new LegalService();