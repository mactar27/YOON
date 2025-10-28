import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronRight, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import PDFViewer from '../components/PDFViewer';

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

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contents, setContents] = useState<LegalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfViewer, setPdfViewer] = useState<{
    isOpen: boolean;
    pdfUrl: string;
    title: string;
  }>({ isOpen: false, pdfUrl: '', title: '' });

  useEffect(() => {
    loadContents();
  }, [selectedCategory, searchQuery]);

  const loadContents = async () => {
    setLoading(true);
    try {
      // Simulation de chargement des contenus (avec données mock pour éviter les erreurs Supabase)
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

      // Filtrer par catégorie et recherche
      let filteredContents = mockContents;

      // Filtre par catégorie
      if (selectedCategory !== 'all') {
        filteredContents = filteredContents.filter(content => content.category === selectedCategory);
      }

      // Filtre par recherche
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filteredContents = filteredContents.filter(content =>
          content.title.toLowerCase().includes(query) ||
          content.summary?.toLowerCase().includes(query) ||
          content.tags?.some(tag => tag.toLowerCase().includes(query))
        );
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-10 border-b">
        <div className="px-4 py-3">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher texte de juridique"
              className="w-full pl-12 pr-12 py-3 bg-[#A9B299] bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A9B299] text-gray-800 placeholder-gray-600 text-base"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#6B4C4C] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl h-36 animate-pulse"></div>
            ))}
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Aucun résultat
            </h3>
            <p className="text-gray-500 text-sm">
              Essayez d'autres mots-clés ou catégories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {contents.map((content) => (
              <div
                key={content.id}
                onClick={() => handleContentClick(content)}
                className="bg-gradient-to-br from-[#6B4C4C] to-[#5A3E3E] rounded-xl p-4 text-white hover:shadow-lg transition-all transform hover:scale-105 flex flex-col items-center justify-center text-center min-h-[150px] cursor-pointer relative group"
              >
                <div className="text-3xl mb-2">
                  {CATEGORIES.find(c => c.id === content.category)?.icon || ''}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(content);
                    }}
                    className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
}
