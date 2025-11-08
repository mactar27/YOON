#!/usr/bin/env python3
"""
Convertir le fichier JSON des articles juridiques en TypeScript
pour intégration directe dans l'application React
"""

import json
import os

def convert_json_to_typescript():
    """Convertir le JSON en TypeScript"""
    
    # Lire le fichier JSON
    with open('public/legal_articles.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    articles = data.get('articles', [])
    
    print(f"📄 Conversion de {len(articles)} articles en TypeScript...")
    
    # Créer le contenu TypeScript
    ts_content = '''// Articles juridiques extraits de senegal_juridique.sql
// Généré automatiquement le 2024-01-01

export interface LegalContent {
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
}

export const LEGAL_ARTICLES: LegalContent[] = [
'''
    
    # Ajouter chaque article
    for i, article in enumerate(articles):
        ts_content += f'''  {{
    id: '{article.get('id', '')}',
    title: '{article.get('title', '').replace("'", "\\'")}',
    category: '{article.get('category', 'droit_civil')}',
    content: `{article.get('content', '').replace('`', '\\`')}`,
    summary: '{article.get('summary', '').replace("'", "\\'")}',
    language: '{article.get('language', 'fr')}',
    tags: {json.dumps(article.get('tags', []))},
    published_by: {f"'{article.get('published_by')}'" if article.get('published_by') else 'null'},
    is_published: {str(article.get('is_published', True)).lower()},
    views_count: {article.get('views_count', 0)},
    created_at: '{article.get('created_at', '2024-01-01T00:00:00Z')}',
    updated_at: '{article.get('updated_at', '2024-01-01T00:00:00Z')}'
  }}'''
        
        # Ajouter une virgule sauf pour le dernier élément
        if i < len(articles) - 1:
            ts_content += ','
        
        ts_content += '\n'
    
    ts_content += '''];

export const LEGAL_ARTICLES_METADATA = {
  total_articles: ''' + str(len(articles)) + ''',
  extracted_at: "2024-01-01T00:00:00Z",
  source: "senegal_juridique.sql",
  version: "2.0"
};
'''
    
    # Créer le dossier src/data s'il n'existe pas
    os.makedirs("src/data", exist_ok=True)
    
    # Écrire le fichier TypeScript
    output_path = "src/data/legalArticles.ts"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"💾 Fichier TypeScript généré : {output_path}")
    print(f"📊 {len(articles)} articles convertis")
    
    return output_path

def main():
    """Fonction principale"""
    print("🚀 Conversion JSON vers TypeScript...")
    
    if not os.path.exists('public/legal_articles.json'):
        print("❌ Fichier legal_articles.json non trouvé")
        return
    
    output_file = convert_json_to_typescript()
    print(f"🎉 Conversion terminée !")
    print(f"📁 Fichier généré : {output_file}")

if __name__ == "__main__":
    main()