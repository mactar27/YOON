import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Scale, Download } from 'lucide-react';
import { LegalServiceFinal, LegalContent } from '../lib/legalServiceFinal';

const CATEGORIES = [
  { id: 'loi_penale', label: 'Code Pénal', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'code_famille', label: 'Code Famille', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'droit_civil', label: 'Droit Civil', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'droit_travail', label: 'Droit du Travail', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'foncier', label: 'Foncier', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'impots', label: 'Impôts', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'assurances', label: 'Assurances', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'environnement', label: 'Environnement', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'constitution', label: 'Constitution', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'procedure_penale', label: 'Procédure Pénale', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'procedure_civile', label: 'Procédure Civile', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'commerce', label: 'Commerce', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'sante', label: 'Santé', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'education', label: 'Éducation', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'electoral', label: 'Électoral', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'presse', label: 'Presse', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'transport', label: 'Transport', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'foret', label: 'Forêt', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'urbanisme', label: 'Urbanisme', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'marches_publics', label: 'Marchés Publics', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'propriete_intellectuelle', label: 'Propriété Intellectuelle', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'securite_sociale', label: 'Sécurité Sociale', color: 'from-[#7B8A52] to-[#6B4C4C]' },
  { id: 'aviation', label: 'Aviation', color: 'from-[#7B8A52] to-[#6B4C4C]' },
];

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<LegalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (categoryId) {
      loadCategoryArticles();
    }
  }, [categoryId, searchQuery]);

  const loadCategoryArticles = async () => {
    try {
      console.log(`Chargement des articles pour la catégorie: ${categoryId}`);
      const loadedArticles = await LegalServiceFinal.loadContents(categoryId, searchQuery);
      console.log(`${loadedArticles.length} articles trouvés pour la catégorie ${categoryId}`);
      setArticles(loadedArticles);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article: LegalContent) => {
    navigate(`/article/${article.id}`);
  };

  const handleDownload = (article: LegalContent, e: React.MouseEvent) => {
    e.stopPropagation();
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

    const pdfFile = pdfMapping[article.title];
    if (pdfFile) {
      const link = document.createElement('a');
      link.href = `/${pdfFile}`;
      link.download = pdfFile;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const category = CATEGORIES.find(cat => cat.id === categoryId);
  const categoryTitle = category ? category.label : 'Catégorie';
  const categoryIcon = <Scale className="w-6 h-6" />;
  const categoryColor = category ? category.color : 'from-gray-500 to-gray-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white pb-20">
      {/* Header moderne */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-[#A9B299]/10 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B4C4C]" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br ${categoryColor} rounded-2xl border border-white/30`}>
              <div className="text-white text-2xl">⚖️</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#6B4C4C]">
                {categoryTitle}
              </h1>
              <p className="text-sm text-gray-600">
                {articles.length} articles disponibles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Rechercher dans ${categoryTitle}...`}
              className="w-full pl-12 pr-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Liste des articles */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl h-24 border border-[#A9B299]/20"></div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-[#6B4C4C] mb-3">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 text-lg">
              {searchQuery ? 'Aucun résultat pour votre recherche' : `Aucun article disponible pour ${categoryTitle}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-5 hover:bg-white hover:shadow-lg hover:border-[#A9B299]/40 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-4 h-full">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#A9B299]/20 to-[#6B4C4C]/20 rounded-2xl border border-[#A9B299]/30">
                      <div className="text-2xl">⚖️</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#6B4C4C] leading-tight mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    {article.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#A9B299] rounded-full"></div>
                        <span className="text-xs text-gray-500">{article.views_count} vues</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(article, e);
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
    </div>
  );
}