import React from 'react';
import { LegalText, LegalArticle } from '../lib/legalService';
import { Book, Calendar, FileText, ExternalLink, AlertCircle } from 'lucide-react';

interface LegalSearchResultsProps {
  results: LegalText[] | LegalArticle[];
  searchType: 'texts' | 'articles';
  onSelectText?: (text: LegalText) => void;
}

const LegalSearchResults: React.FC<LegalSearchResultsProps> = ({
  results,
  searchType,
  onSelectText
}) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
        <p className="text-gray-500">Essayez avec d'autres mots-clés ou vérifiez l'orthographe</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((item: any) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => searchType === 'texts' && onSelectText && onSelectText(item)}
        >
          {searchType === 'texts' ? (
            // Affichage des textes juridiques
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                  {item.titre}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.statut === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.statut}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3 line-clamp-2">
                {item.contenu}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(item.date_promulgation).toLocaleDateString('fr-FR')}
                  </span>
                  {item.domaine_juridique && (
                    <span className="flex items-center">
                      <Book size={14} className="mr-1" />
                      {item.domaine_juridique}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-blue-600 hover:text-blue-800">
                  <span className="mr-1">Voir les détails</span>
                  <ExternalLink size={14} />
                </div>
              </div>
              
              {item.numero_officiel && (
                <div className="mt-2 text-xs text-gray-500">
                  <strong>Numéro officiel:</strong> {item.numero_officiel}
                </div>
              )}
            </div>
          ) : (
            // Affichage des articles
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-600">
                  {item.numero_article}
                </h3>
                <span className="text-xs text-gray-500">
                  Article {item.position_ordre}
                </span>
              </div>
              
              <p className="text-gray-700 mb-3 leading-relaxed">
                {item.contenu_article}
              </p>
              
              {item.titre_article && (
                <p className="text-sm text-gray-600 italic mb-2">
                  {item.titre_article}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Texte juridique ID: {item.texte_juridique_id}</span>
                <span className="flex items-center">
                  <FileText size={12} className="mr-1" />
                  Article de loi
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LegalSearchResults;