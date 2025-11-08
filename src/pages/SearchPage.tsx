import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronRight, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { LegalContent, LegalServiceFinal } from '../lib/legalServiceFinal';

// Mapping des images aux catégories juridiques
const getCategoryImage = (category: string) => {
  const imageMap: { [key: string]: string } = {
    'loi_penale': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'code_famille': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'droit_civil': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'droit_travail': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'foncier': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'impots': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'assurances': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'environnement': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'constitution': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'procedure_penale': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'procedure_civile': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'commerce': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'sante': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'education': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'electoral': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'presse': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'transport': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'foret': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'urbanisme': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'marches_publics': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'propriete_intellectuelle': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'securite_sociale': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'aviation': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png',
    'all': '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png'
  };
  return imageMap[category] || '/dd7e69aac3372fec439e9b8f60b2a64892e36b0e.png';
};

// Seules les catégories qui ont réellement des données dans la base
const AVAILABLE_CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'loi_penale', label: 'Code Pénal' },
  { id: 'procedure_civile', label: 'Procédure Civile' },
  { id: 'assurances', label: 'Assurances' },
  { id: 'aviation', label: 'Aviation' },
  { id: 'education', label: 'Éducation' },
  { id: 'environnement', label: 'Environnement' },
  { id: 'sante', label: 'Santé' },
  { id: 'securite_sociale', label: 'Sécurité Sociale' },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contents, setContents] = useState<LegalContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContents();
  }, [selectedCategory, searchQuery]);

  const loadContents = async () => {
    setLoading(true);
    try {
      console.log(`Recherche: "${searchQuery}" dans la catégorie: ${selectedCategory}`);
      // Charger les contenus depuis la base de données senegal_juridique.sql
      const loadedContents = await LegalServiceFinal.loadContents(selectedCategory, searchQuery);
      console.log(`${loadedContents.length} articles trouvés pour la recherche`);
      
      setContents(loadedContents);
    } catch (error) {
      console.error('Error loading contents from database:', error);
      // En cas d'erreur, retourner des données de fallback
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
    // Naviguer vers la page d'article pour afficher le contenu en texte
    navigate(`/article/${content.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white pb-20">
      {/* Header moderne */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4">
          <h1 className="text-2xl font-bold text-[#6B4C4C]">
            Recherche juridique
          </h1>
        </div>
      </div>
      
      {/* Barre de recherche moderne sticky */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-[#A9B299]/20">
        <div className="px-6 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A9B299]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans les textes juridiques..."
              className="w-full pl-14 pr-14 py-4 bg-white/50 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] text-gray-800 placeholder-gray-500 text-base backdrop-blur-sm shadow-sm"
            />
            <button className="absolute right-5 top-1/2 transform -translate-y-1/2 p-2 hover:bg-[#A9B299]/10 rounded-full transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-[#6B4C4C]" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {AVAILABLE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#6B4C4C] text-white shadow-lg transform scale-105'
                    : 'bg-white/50 text-[#6B4C4C] border border-[#A9B299]/30 hover:bg-[#A9B299]/20'
                }`}
              >
                <span className="text-sm">⚖️</span>
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl h-40 border border-[#A9B299]/20"></div>
            ))}
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-[#6B4C4C] mb-3">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 text-lg">
              Essayez d'autres mots-clés ou catégories
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-[#A9B299] rounded-full"></div>
              <div className="w-2 h-2 bg-[#A9B299] rounded-full"></div>
              <div className="w-2 h-2 bg-[#A9B299] rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <div
                key={content.id}
                onClick={() => handleContentClick(content)}
                className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-5 hover:bg-white hover:shadow-lg hover:border-[#A9B299]/40 transition-all duration-300 cursor-pointer group relative"
              >
                <div className="flex items-center gap-4 h-full">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#A9B299]/20 to-[#6B4C4C]/20 rounded-2xl border border-[#A9B299]/30">
                      <div className="text-2xl">⚖️</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#6B4C4C] leading-tight mb-2 line-clamp-2">
                      {content.title}
                    </h4>
                    {content.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {content.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#A9B299] rounded-full"></div>
                        <span className="text-xs text-gray-500">{content.views_count} vues</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(content);
                          }}
                          className="p-2 bg-[#6B4C4C]/10 hover:bg-[#6B4C4C]/20 rounded-full transition-colors"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4 text-[#6B4C4C]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
