import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Download, Filter } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

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

const CATEGORIES = [
  { id: 'all', label: 'Tout', icon: '' },
  { id: 'loi_penale', label: 'Loi Pénale', icon: '' },
  { id: 'code_famille', label: 'Code Famille', icon: '' },
  { id: 'droit_civil', label: 'Droit Civil', icon: '' },
  { id: 'droit_travail', label: 'Droit du Travail', icon: '' },
  { id: 'foncier', label: 'Foncier', icon: '' },
  { id: 'impots', label: 'Impôts', icon: '' },
  { id: 'assurances', label: 'Assurances', icon: '' },
  { id: 'environnement', label: 'Environnement', icon: '' },
  { id: 'constitution', label: 'Constitution', icon: '' },
  { id: 'procedure_penale', label: 'Procédure Pénale', icon: '' },
  { id: 'procedure_civile', label: 'Procédure Civile', icon: '' },
  { id: 'commerce', label: 'Commerce', icon: '' },
  { id: 'sante', label: 'Santé', icon: '' },
  { id: 'education', label: 'Éducation', icon: '' },
  { id: 'electoral', label: 'Électoral', icon: '' },
  { id: 'presse', label: 'Presse', icon: '' },
  { id: 'transport', label: 'Transport', icon: '' },
  { id: 'foret', label: 'Forêt', icon: '' },
  { id: 'urbanisme', label: 'Urbanisme', icon: '' },
  { id: 'marches_publics', label: 'Marchés Publics', icon: '' },
  { id: 'propriete_intellectuelle', label: 'Propriété Intellectuelle', icon: '' },
  { id: 'securite_sociale', label: 'Sécurité Sociale', icon: '' },
  { id: 'aviation', label: 'Aviation', icon: '' },
];

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contents, setContents] = useState<LegalContent[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  // Charger les contenus seulement après que les favoris sont chargés
  useEffect(() => {
    if (favorites.size > 0 || localStorage.getItem('yoon_favorites')) {
      loadContents();
    }
  }, [favorites, selectedCategory]);

  // Recharger automatiquement les favoris quand on revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      console.log('FavoritesPage: focus event, reloading favorites');
      loadFavorites();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Recharger aussi quand on revient via navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('FavoritesPage: visibility change, reloading favorites');
        loadFavorites();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('yoon_favorites');
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      console.log('FavoritesPage: loaded favorites from localStorage:', parsedFavorites.length, 'items');
      setFavorites(new Set(parsedFavorites));
    } else {
      console.log('FavoritesPage: no favorites found in localStorage');
      setFavorites(new Set());
    }
  };

  const loadContents = async () => {
    try {
      // Simulation de chargement des contenus (avec données mock pour la démonstration)
      const mockContents: LegalContent[] = [
        {
          id: '1',
          title: 'Code pénal du Sénégal',
          category: 'loi_penale',
          content: 'Contenu complet du code pénal...',
          summary: 'Code pénal complet du Sénégal avec toutes les infractions et sanctions',
          language: 'fr',
          tags: ['pénal', 'justice', 'infractions'],
          published_by: null,
          is_published: true,
          views_count: 1250,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Code de la Famille du Sénégal',
          category: 'code_famille',
          content: 'Contenu complet du code de la famille...',
          summary: 'Législation complète sur le droit de la famille au Sénégal',
          language: 'fr',
          tags: ['famille', 'mariage', 'succession'],
          published_by: null,
          is_published: true,
          views_count: 980,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Code du Travail du Sénégal',
          category: 'droit_travail',
          content: 'Contenu complet du code du travail...',
          summary: 'Réglementation du travail et relations employeur-employé',
          language: 'fr',
          tags: ['travail', 'emploi', 'syndicats'],
          published_by: null,
          is_published: true,
          views_count: 750,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          title: 'Code Foncier du Sénégal',
          category: 'foncier',
          content: 'Contenu complet du code foncier...',
          summary: 'Législation sur la propriété foncière et l\'urbanisme',
          language: 'fr',
          tags: ['foncier', 'propriété', 'urbanisme'],
          published_by: null,
          is_published: true,
          views_count: 620,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          title: 'Code Général des Impôts du Sénégal (2013)',
          category: 'impots',
          content: 'Contenu complet du code des impôts...',
          summary: 'Législation fiscale complète du Sénégal',
          language: 'fr',
          tags: ['impôts', 'fiscal', 'taxes'],
          published_by: null,
          is_published: true,
          views_count: 890,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '6',
          title: 'Code CIMA des Assurances',
          category: 'assurances',
          content: 'Contenu complet du code CIMA...',
          summary: 'Réglementation des assurances en Afrique de l\'Ouest',
          language: 'fr',
          tags: ['assurances', 'CIMA', 'risques'],
          published_by: null,
          is_published: true,
          views_count: 540,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '7',
          title: 'Code des Obligations Civiles et Commerciales',
          category: 'droit_civil',
          content: 'Contenu complet du code civil...',
          summary: 'Droit des contrats et obligations civiles au Sénégal',
          language: 'fr',
          tags: ['civil', 'contrats', 'obligations'],
          published_by: null,
          is_published: true,
          views_count: 1100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '8',
          title: 'Constitution du Sénégal',
          category: 'constitution',
          content: 'Texte intégral de la Constitution...',
          summary: 'Constitution de la République du Sénégal',
          language: 'fr',
          tags: ['constitution', 'état', 'droits'],
          published_by: null,
          is_published: true,
          views_count: 1450,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '9',
          title: 'Code de procédure pénale',
          category: 'procedure_penale',
          content: 'Procédures pénales complètes...',
          summary: 'Procédures judiciaires en matière pénale',
          language: 'fr',
          tags: ['procédure', 'pénal', 'justice'],
          published_by: null,
          is_published: true,
          views_count: 780,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '10',
          title: 'Code de procédure civile',
          category: 'procedure_civile',
          content: 'Procédures civiles complètes...',
          summary: 'Procédures judiciaires en matière civile',
          language: 'fr',
          tags: ['procédure', 'civil', 'justice'],
          published_by: null,
          is_published: true,
          views_count: 690,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '11',
          title: 'Code de commerce',
          category: 'commerce',
          content: 'Législation commerciale complète...',
          summary: 'Droit commercial et des sociétés',
          language: 'fr',
          tags: ['commerce', 'sociétés', 'entreprises'],
          published_by: null,
          is_published: true,
          views_count: 920,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '12',
          title: 'Code de la santé publique',
          category: 'sante',
          content: 'Législation sanitaire complète...',
          summary: 'Réglementation de la santé publique',
          language: 'fr',
          tags: ['santé', 'publique', 'médical'],
          published_by: null,
          is_published: true,
          views_count: 560,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '13',
          title: 'Code de l\'éducation',
          category: 'education',
          content: 'Système éducatif complet...',
          summary: 'Législation sur l\'éducation nationale',
          language: 'fr',
          tags: ['éducation', 'enseignement', 'scolaire'],
          published_by: null,
          is_published: true,
          views_count: 480,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '14',
          title: 'Code électoral',
          category: 'electoral',
          content: 'Législation électorale complète...',
          summary: 'Réglementation des élections et processus démocratique',
          language: 'fr',
          tags: ['élections', 'démocratie', 'vote'],
          published_by: null,
          is_published: true,
          views_count: 720,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '15',
          title: 'Code de la presse',
          category: 'presse',
          content: 'Liberté de presse et médias...',
          summary: 'Réglementation de la presse et des médias',
          language: 'fr',
          tags: ['presse', 'médias', 'liberté'],
          published_by: null,
          is_published: true,
          views_count: 430,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '16',
          title: 'Code de la route',
          category: 'transport',
          content: 'Code de la route complet...',
          summary: 'Réglementation du transport routier',
          language: 'fr',
          tags: ['transport', 'route', 'circulation'],
          published_by: null,
          is_published: true,
          views_count: 1200,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '17',
          title: 'Code forestier',
          category: 'foret',
          content: 'Protection des forêts...',
          summary: 'Législation sur les forêts et environnement',
          language: 'fr',
          tags: ['forêt', 'environnement', 'protection'],
          published_by: null,
          is_published: true,
          views_count: 380,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '18',
          title: 'Code de l\'environnement (2001)',
          category: 'environnement',
          content: 'Protection environnementale...',
          summary: 'Législation sur la protection de l\'environnement',
          language: 'fr',
          tags: ['environnement', 'protection', 'écologie'],
          published_by: null,
          is_published: true,
          views_count: 650,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '19',
          title: 'Code de l\'urbanisme',
          category: 'urbanisme',
          content: 'Aménagement urbain...',
          summary: 'Réglementation de l\'urbanisme et construction',
          language: 'fr',
          tags: ['urbanisme', 'construction', 'aménagement'],
          published_by: null,
          is_published: true,
          views_count: 520,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '20',
          title: 'Code des marchés publics',
          category: 'marches_publics',
          content: 'Marchés publics et appels d\'offres...',
          summary: 'Réglementation des marchés publics',
          language: 'fr',
          tags: ['marchés', 'publics', 'appels d\'offres'],
          published_by: null,
          is_published: true,
          views_count: 410,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '21',
          title: 'Code de la propriété intellectuelle',
          category: 'propriete_intellectuelle',
          content: 'Protection de la propriété intellectuelle...',
          summary: 'Droits d\'auteur, brevets et marques',
          language: 'fr',
          tags: ['propriété', 'intellectuelle', 'brevets'],
          published_by: null,
          is_published: true,
          views_count: 580,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '22',
          title: 'Code de la sécurité sociale',
          category: 'securite_sociale',
          content: 'Sécurité sociale et protection sociale...',
          summary: 'Réglementation de la sécurité sociale',
          language: 'fr',
          tags: ['sécurité', 'sociale', 'protection'],
          published_by: null,
          is_published: true,
          views_count: 670,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '23',
          title: 'Code de l\'aviation civile',
          category: 'aviation',
          content: 'Aviation civile et transport aérien...',
          summary: 'Réglementation de l\'aviation civile',
          language: 'fr',
          tags: ['aviation', 'aérien', 'transport'],
          published_by: null,
          is_published: true,
          views_count: 340,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Filtrer seulement les favoris
      let favoriteContents = mockContents.filter((content: LegalContent) => favorites.has(content.id));

      // Filtrer par catégorie si nécessaire
      if (selectedCategory !== 'all') {
        favoriteContents = favoriteContents.filter(content => content.category === selectedCategory);
      }

      setContents(favoriteContents);
    } catch (error) {
      console.error('Error loading contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (contentId: string) => {
    const newFavorites = new Set(favorites);
    newFavorites.delete(contentId);
    setFavorites(newFavorites);

    // Sauvegarder dans le localStorage
    localStorage.setItem('yoon_favorites', JSON.stringify(Array.from(newFavorites)));

    // Recharger les contenus pour refléter le changement
    loadContents();
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = CATEGORIES.find(c => c.id === category);
    return categoryData?.icon || '';
  };

  const handleDownload = (content: LegalContent) => {
    // Mapper les titres aux fichiers PDF dans le dossier public
    const pdfMapping: { [key: string]: string } = {
      'Code pénal du Sénégal': 'codepenal.pdf',
      'Code des Obligations Civiles et Commerciales': 'Senegal Civil & Commercial Obligations Code.pdf',
      'Code CIMA des Assurances': 'CIMA-Code-assurances.pdf',
      'Code de la Famille du Sénégal': 'CODE-DE-LA-FAMILLE.pdf',
      'Code du Travail du Sénégal': 'codedutravail.pdf',
      'Code Foncier du Sénégal': 'code-foncier.pdf',
      'Code Général des Impôts du Sénégal (2013)': 'code-general-des-impots-2013.pdf',
      'Code de l\'Environnement du Sénégal (2001)': 'Senegal-Code-2001-environnement.pdf',
      'Constitution du Sénégal': 'constitution.pdf',
      'Code de procédure pénale': 'procedure_penale.pdf',
      'Code de procédure civile': 'procedure_civile.pdf',
      'Code de commerce': 'commerce.pdf',
      'Code de la santé publique': 'sante.pdf',
      'Code de l\'éducation': 'education.pdf',
      'Code électoral': 'electoral.pdf',
      'Code de la presse': 'presse.pdf',
      'Code de la route': 'transport.pdf',
      'Code forestier': 'foret.pdf',
      'Code de l\'urbanisme': 'urbanisme.pdf',
      'Code des marchés publics': 'marches_publics.pdf',
      'Code de la propriété intellectuelle': 'propriete_intellectuelle.pdf',
      'Code de la sécurité sociale': 'securite_sociale.pdf',
      'Code de l\'aviation civile': 'aviation.pdf'
    };

    const pdfFile = pdfMapping[content.title];
    if (pdfFile) {
      // Télécharger le PDF directement avec effet visuel
      const link = document.createElement('a');
      link.href = `/${pdfFile}`;
      link.download = pdfFile;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleContentClick = (content: LegalContent) => {
    // Ouvrir le PDF dans le viewer intégré
    const pdfMapping: { [key: string]: string } = {
      'Code pénal du Sénégal': 'codepenal.pdf',
      'Code des Obligations Civiles et Commerciales': 'Senegal Civil & Commercial Obligations Code.pdf',
      'Code CIMA des Assurances': 'CIMA-Code-assurances.pdf',
      'Code de la Famille du Sénégal': 'CODE-DE-LA-FAMILLE.pdf',
      'Code du Travail du Sénégal': 'codedutravail.pdf',
      'Code Foncier du Sénégal': 'code-foncier.pdf',
      'Code Général des Impôts du Sénégal (2013)': 'code-general-des-impots-2013.pdf',
      'Code de l\'Environnement du Sénégal (2001)': 'Senegal-Code-2001-environnement.pdf',
      'Constitution du Sénégal': 'constitution.pdf',
      'Code de procédure pénale': 'procedure_penale.pdf',
      'Code de procédure civile': 'procedure_civile.pdf',
      'Code de commerce': 'commerce.pdf',
      'Code de la santé publique': 'sante.pdf',
      'Code de l\'éducation': 'education.pdf',
      'Code électoral': 'electoral.pdf',
      'Code de la presse': 'presse.pdf',
      'Code de la route': 'transport.pdf',
      'Code forestier': 'foret.pdf',
      'Code de l\'urbanisme': 'urbanisme.pdf',
      'Code des marchés publics': 'marches_publics.pdf',
      'Code de la propriété intellectuelle': 'propriete_intellectuelle.pdf',
      'Code de la sécurité sociale': 'securite_sociale.pdf',
      'Code de l\'aviation civile': 'aviation.pdf'
    };

    const pdfFile = pdfMapping[content.title];
    if (pdfFile) {
      // Pour l'instant, on télécharge directement
      handleDownload(content);
    } else {
      alert(`Contenu sélectionné: ${content.title}\n\nRésumé: ${content.summary || 'Aucun résumé disponible'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#7B8A52]/5 to-white pb-24">
      {/* Header moderne avec notifications */}
      <Header title="Mes Favoris" />
      
      {/* Contenu principal */}
      <div className="px-6 py-6">
        {/* Titre et actions moderne */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-[#6B4C4C]">Documents favoris</h1>
          <span className="text-sm text-gray-600 bg-[#7B8A52]/20 px-3 py-1 rounded-full">
            {contents.length} document{contents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filtres modernes */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-[#7B8A52]/30 text-[#6B4C4C] rounded-2xl hover:bg-[#7B8A52]/10 transition-all duration-200 font-semibold shadow-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filtrer par catégorie</span>
          </button>

          {showFilters && (
            <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#7B8A52]/20">
              <h4 className="text-sm font-semibold text-[#6B4C4C] mb-3">Catégories disponibles</h4>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-[#6B4C4C] text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-[#7B8A52]/20 hover:text-[#6B4C4C]'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Liste des contenus */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl h-40 border border-[#7B8A52]/20"></div>
            ))}
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <Heart className="w-24 h-24 text-[#7B8A52] mx-auto" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#6B4C4C]/20 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-[#6B4C4C] mb-3">
              Aucun document favori
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6 text-lg">
              Vous n'avez encore ajouté aucun document à vos favoris. Parcourez les contenus juridiques et cliquez sur le cœur pour les ajouter.
            </p>
            <button
              onClick={() => navigate('/home')}
              className="bg-[#6B4C4C] text-white px-8 py-4 rounded-2xl hover:bg-[#5A3E3E] transition-all duration-200 font-semibold shadow-lg transform hover:scale-105"
            >
              Explorer les documents
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <div
                key={content.id}
                className="bg-white/80 backdrop-blur-sm border border-[#7B8A52]/20 rounded-2xl p-5 hover:bg-white hover:shadow-lg hover:border-[#6B4C4C]/40 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] relative group"
                onClick={() => handleContentClick(content)}
              >
                <div className="flex items-start gap-4 h-full">
                  {/* Icône moderne à gauche */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#7B8A52]/20 to-[#6B4C4C]/20 rounded-2xl border border-[#7B8A52]/30">
                      <div className="text-2xl">⚖️</div>
                    </div>
                  </div>
                  
                  {/* Contenu à droite */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#6B4C4C] leading-tight mb-2 line-clamp-2">
                      {content.title}
                    </h4>
                    {content.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {content.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#7B8A52] rounded-full"></div>
                        <span className="text-xs text-gray-500">{content.views_count} vues</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action en overlay */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(content.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg"
                    title="Retirer des favoris"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(content);
                    }}
                    className="p-2 bg-white/80 backdrop-blur-sm text-[#6B4C4C] rounded-2xl hover:bg-[#7B8A52]/20 transition-colors shadow-lg border border-[#7B8A52]/30"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}