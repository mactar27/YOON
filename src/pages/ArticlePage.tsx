import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Tag, Calendar, Eye, Download, BookOpen } from 'lucide-react';
import { LegalContent, LegalServiceFinal } from '../lib/legalServiceFinal';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedContent, setHighlightedContent] = useState('');

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  useEffect(() => {
    if (article && searchTerm) {
      // Surligner les termes de recherche
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const highlighted = article.content.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
      setHighlightedContent(highlighted);
    } else if (article) {
      setHighlightedContent(article.content);
    }
  }, [article, searchTerm]);

  const loadArticle = async (articleId: string) => {
    try {
      // Charger l'article depuis la vraie base de données
      console.log(`Chargement de l'article ${articleId}...`);
      const article = await LegalServiceFinal.getArticleById(articleId);
      console.log('Article chargé:', article);
      setArticle(article);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche est gérée par l'useEffect avec le highlight
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'loi_penale': 'Loi Pénale',
      'code_famille': 'Code Famille',
      'droit_civil': 'Droit Civil',
      'droit_travail': 'Droit du Travail',
      'foncier': 'Foncier',
      'impots': 'Impôts',
      'assurances': 'Assurances',
      'environnement': 'Environnement',
      'constitution': 'Constitution'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white">
        <div className="px-6 py-6 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#A9B299] border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white">
        <div className="px-6 py-6 text-center">
          <h1 className="text-2xl font-bold text-[#6B4C4C] mb-4">Article non trouvé</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-[#6B4C4C] hover:underline"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white">
      {/* Header moderne */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-[#A9B299]/10 rounded-full transition-all duration-200 backdrop-blur-sm mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B4C4C]" />
          </button>
          <h1 className="text-2xl font-bold tracking-wide">
            <span className="text-[#A9B299]">YOO</span>
            <span className="text-[#6B4C4C]">N</span>
            <span className="text-gray-700 ml-2">• Article juridique</span>
          </h1>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans l'article..."
              className="w-full pl-12 pr-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299]/50 bg-white/50 backdrop-blur-sm"
            />
          </form>
        </div>

        {/* Informations de l'article */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#A9B299]/20 shadow-lg">
          <h1 className="text-2xl font-bold text-[#6B4C4C] mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">{getCategoryLabel(article.category)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Publié le {formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views_count} vues</span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#A9B299]/20 text-[#6B4C4C] rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Résumé */}
          {article.summary && (
            <div className="mt-4 p-4 bg-[#A9B299]/10 rounded-xl">
              <h3 className="font-semibold text-[#6B4C4C] mb-2">Résumé</h3>
              <p className="text-gray-700">{article.summary}</p>
            </div>
          )}
        </div>

        {/* Contenu de l'article */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h2 className="text-xl font-bold text-[#6B4C4C] mb-4">Contenu</h2>
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightedContent }}
            style={{
              lineHeight: '1.8',
              fontSize: '16px'
            }}
          />
        </div>
      </div>
    </div>
  );
}