import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { legalService, LegalText, LegalArticle } from '../lib/legalService';
import { legalNotificationService } from '../lib/legalNotificationService';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, Book, Calendar, FileText, ExternalLink } from 'lucide-react';

const LegalSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [searchType, setSearchType] = useState<'texts' | 'articles'>('texts');
  const [results, setResults] = useState<LegalText[] | LegalArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<any[]>([]);
  const [selectedText, setSelectedText] = useState<LegalText | null>(null);
  const [selectedTextArticles, setSelectedTextArticles] = useState<LegalArticle[]>([]);
  
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Charger les domaines juridiques
  useEffect(() => {
    const loadDomains = async () => {
      try {
        const domainList = await legalService.getLegalDomains();
        setDomains(domainList);
      } catch (error) {
        addNotification({
          title: 'Erreur',
          message: 'Erreur lors du chargement des domaines',
          type: 'error'
        });
      }
    };
    loadDomains();
  }, [addNotification]);

  // Effectuer la recherche
  const handleSearch = async () => {
    if (!query.trim()) {
      addNotification({
        title: 'Attention',
        message: 'Veuillez saisir un terme de recherche',
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      let searchResults;
      if (searchType === 'texts') {
        searchResults = await legalService.searchLegalTexts(query, selectedDomain);
        setResults(searchResults);
      } else {
        searchResults = await legalService.searchArticles(query);
        setResults(searchResults);
      }

      // Sauvegarder l'historique si l'utilisateur est connecté
      if (user) {
        await legalService.saveSearchHistory(user.id, query, searchResults.length);
        
        // Créer une notification personnalisée pour cette recherche
        const searchNotification = legalNotificationService.notifySearchCompletion(
          user.id,
          query,
          searchResults.length
        );
        addNotification(searchNotification);
      }

      addNotification({
        title: 'Succès',
        message: `${searchResults.length} résultat(s) trouvé(s)`,
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Erreur',
        message: 'Erreur lors de la recherche',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les articles d'un texte sélectionné
  const loadTextArticles = async (text: LegalText) => {
    setSelectedText(text);
    try {
      const articles = await legalService.getArticles(text.id);
      setSelectedTextArticles(articles);
    } catch (error) {
      addNotification({
        title: 'Erreur',
        message: 'Erreur lors du chargement des articles',
        type: 'error'
      });
    }
  };

  // Gérer les touches du clavier
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center">
              <Book className="mr-3" size={28} />
              Recherche Juridique
            </h1>
            <div className="text-sm text-gray-500">
              Base de données juridique du Sénégal
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Interface de recherche */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            {/* Type de recherche */}
            <div className="flex space-x-4">
              <button
                onClick={() => setSearchType('texts')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  searchType === 'texts'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Textes de loi
              </button>
              <button
                onClick={() => setSearchType('articles')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  searchType === 'articles'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Articles spécifiques
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    searchType === 'texts'
                      ? "Rechercher dans les textes de loi (ex: 'contrat', 'divorce')..."
                      : "Rechercher dans les articles (ex: 'infraction', 'peine')..."
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filtre par domaine */}
              {searchType === 'texts' && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="all">Tous les domaines</option>
                    {domains.map((domain) => (
                      <option key={domain.id} value={domain.nom}>
                        {domain.nom}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des résultats */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="mr-2" size={20} />
                {searchType === 'texts' ? 'Textes juridiques' : 'Articles de loi'}
              </h2>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Book className="mx-auto mb-4 text-gray-300" size={48} />
                  <p>Aucun résultat pour le moment</p>
                  <p className="text-sm">Effectuez une recherche pour voir les résultats</p>
                </div>
              ) : (
                results.map((item: any) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                    {searchType === 'texts' ? (
                      <div onClick={() => loadTextArticles(item as LegalText)}>
                        <h3 className="font-semibold text-blue-600 hover:underline">
                          {item.titre}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.contenu}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {new Date(item.date_promulgation).toLocaleDateString('fr-FR')}
                          </span>
                          <span>{item.domaine_juridique}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.statut === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.statut}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-blue-600">{item.numero_article}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                          {item.contenu_article}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Article {item.position_ordre} du texte juridique
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Détails du texte sélectionné */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <ExternalLink className="mr-2" size={20} />
                Détails du texte
              </h2>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {selectedText ? (
                <div>
                  <h3 className="text-xl font-bold text-blue-600 mb-3">
                    {selectedText.titre}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>Promulgué le {new Date(selectedText.date_promulgation).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {selectedText.numero_officiel && (
                      <div className="text-gray-600">
                        <strong>Numéro officiel:</strong> {selectedText.numero_officiel}
                      </div>
                    )}
                    <div className="text-gray-600">
                      <strong>Domaine:</strong> {selectedText.domaine_juridique}
                    </div>
                    <div className="text-gray-600">
                      <strong>Autorité émettrice:</strong> {selectedText.autorite_emettrice}
                    </div>
                    <div className="text-gray-600">
                      <strong>Type:</strong> {selectedText.type_texte.replace(/_/g, ' ')}
                    </div>
                    <div className="text-gray-600">
                      <strong>Statut:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedText.statut === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedText.statut}
                      </span>
                    </div>
                    {selectedText.mots_cles && (
                      <div className="text-gray-600">
                        <strong>Mots-clés:</strong> {selectedText.mots_cles}
                      </div>
                    )}
                  </div>

                  {/* Articles du texte */}
                  {selectedTextArticles.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Articles du texte ({selectedTextArticles.length})
                      </h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedTextArticles.map((article) => (
                          <div key={article.id} className="border-l-4 border-blue-200 pl-4">
                            <h5 className="font-medium text-blue-600">{article.numero_article}</h5>
                            <p className="text-sm text-gray-700 mt-1">
                              {article.contenu_article}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="mx-auto mb-4 text-gray-300" size={48} />
                  <p>Sélectionnez un texte pour voir ses détails</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {results.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-blue-800">
                <strong>Résultats de la recherche:</strong> {results.length} {searchType === 'texts' ? 'texte(s) juridique(s)' : 'article(s)'} trouvé(s)
              </div>
              <div className="text-sm text-blue-600">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalSearchPage;