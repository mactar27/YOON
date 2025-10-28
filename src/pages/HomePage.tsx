import { useEffect, useState } from 'react';
import { Bell, Heart, Scale, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import ChatBot from '../components/ChatBot/ChatBot';
import PDFViewer from '../components/PDFViewer';
import NotificationBell from '../components/NotificationBell';

type LegalContent = Database['public']['Tables']['legal_content']['Row'];

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

export default function HomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [contents, setContents] = useState<LegalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [pdfViewer, setPdfViewer] = useState<{
    isOpen: boolean;
    pdfUrl: string;
    title: string;
  }>({ isOpen: false, pdfUrl: '', title: '' });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadContents();
  }, [selectedCategory]);

  // Recharger automatiquement les contenus quand on revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      loadContents();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadContents = async () => {
    try {
      // Simulation de chargement des contenus (sans Supabase pour éviter les erreurs)
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

      // Filtrer par catégorie si nécessaire
      let filteredContents = mockContents;
      if (selectedCategory !== 'all') {
        filteredContents = mockContents.filter(content => content.category === selectedCategory);
      }

      setContents(filteredContents);
    } catch (error) {
      console.error('Error loading contents:', error);
      // En cas d'erreur, utiliser quand même les données mock
      setContents([]);
    } finally {
      setLoading(false);
    }
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
      setPdfViewer({
        isOpen: true,
        pdfUrl: `/${pdfFile}`,
        title: content.title
      });
    } else {
      alert(`Contenu sélectionné: ${content.title}\n\nRésumé: ${content.summary || 'Aucun résumé disponible'}`);
    }
  };

  const handleClosePDF = () => {
    setPdfViewer({ isOpen: false, pdfUrl: '', title: '' });
  };

  const handleDownloadFromViewer = () => {
    const link = document.createElement('a');
    link.href = pdfViewer.pdfUrl;
    link.download = pdfViewer.pdfUrl.split('/').pop() || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFavorite = (contentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(contentId)) {
      newFavorites.delete(contentId);
      // Afficher un message de suppression
      showToast('Document retiré des favoris', 'info');
    } else {
      newFavorites.add(contentId);
      // Afficher un message d'ajout
      showToast('Document ajouté aux favoris !', 'success');
    }
    setFavorites(newFavorites);

    // Sauvegarder dans le localStorage (simulation)
    localStorage.setItem('yoon_favorites', JSON.stringify(Array.from(newFavorites)));
  };

  const showToast = (message: string, type: 'success' | 'info') => {
    // Créer un conteneur de toast professionnel
    const toastContainer = document.createElement('div');
    toastContainer.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border-l-4 bg-white text-gray-800 font-medium animate-slide-down';

    // Couleur de la bordure selon le type
    const borderColor = type === 'success' ? 'border-green-500' : 'border-blue-500';
    toastContainer.classList.add(borderColor);

    // Icône selon le type
    const icon = type === 'success'
      ? '<svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      : '<svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

    toastContainer.innerHTML = `
      ${icon}
      <span class="text-sm font-medium">${message}</span>
      <button class="ml-auto text-gray-400 hover:text-gray-600 transition-colors" onclick="this.parentElement.remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;

    document.body.appendChild(toastContainer);

    // Supprimer automatiquement après 4 secondes
    setTimeout(() => {
      toastContainer.classList.add('animate-slide-up');
      setTimeout(() => {
        if (document.body.contains(toastContainer)) {
          document.body.removeChild(toastContainer);
        }
      }, 300);
    }, 4000);
  };

  // Charger les favoris au démarrage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('yoon_favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide">
            <span className="text-[#A9B299]">YOO</span>
            <span className="text-[#6B4C4C]">N</span>
          </h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button
              onClick={() => navigate('/favorites')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-[#A9B299] to-[#8A9279] rounded-2xl p-4 mb-4 text-white">
          <h2 className="text-xl font-bold mb-2">
            {profile ? `Bienvenue, ${profile.full_name}` : 'Bienvenue'}
          </h2>
          <p className="opacity-90 text-sm">
            Explorez vos droits et devoirs juridiques
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800">
              Contenus juridiques
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtrer</span>
            </button>
          </div>

          {showFilters && (
            <div className="mb-4 p-3 bg-white rounded-xl shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Catégories</h4>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-2 rounded-full text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-[#6B4C4C] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl h-36 animate-pulse"></div>
              ))}
            </div>
          ) : contents.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Aucun contenu disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {contents.map((content) => (
                <button
                  key={content.id}
                  onClick={() => handleContentClick(content)}
                  className="bg-gradient-to-br from-[#6B4C4C] to-[#5A3E3E] rounded-xl p-4 text-white hover:shadow-lg transition-all transform hover:scale-105 flex flex-col items-center justify-center text-center min-h-[150px] relative group"
                >
                  <div className="text-3xl mb-2">
                    {getCategoryIcon(content.category)}
                  </div>
                  <h4 className="font-bold text-sm leading-tight line-clamp-3">
                    {content.title}
                  </h4>
                  {content.summary && (
                    <p className="text-xs opacity-80 mt-2 line-clamp-2">
                      {content.summary}
                    </p>
                  )}
                  {/* Boutons d'action */}
                  <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleFavorite(content.id, e)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.has(content.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                      }`}
                      title={favorites.has(content.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(content.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(content);
                      }}
                      className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* PDF Viewer Modal */}
      {pdfViewer.isOpen && (
        <PDFViewer
          pdfUrl={pdfViewer.pdfUrl}
          title={pdfViewer.title}
          onClose={handleClosePDF}
          onDownload={handleDownloadFromViewer}
        />
      )}

      {/* Ajout du composant ChatBot */}
      <ChatBot />
    </div>
  );
}
