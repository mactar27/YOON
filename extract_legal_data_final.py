#!/usr/bin/env python3
"""
Script d'extraction final des articles juridiques individuels
depuis la vraie base de données senegal_juridique.sql
"""

import re
import json
import os
from typing import List, Dict, Any

def clean_text(text: str) -> str:
    """Nettoyer le texte"""
    if not text or text == 'NULL':
        return ""
    
    # Nettoyer d'abord
    text = text.strip()
    
    # Échapper les caractères problématique pour TypeScript
    text = text.replace('\\', '\\\\')
    text = text.replace("'", "\\'")
    text = text.replace('"', '\\"')
    text = text.replace('\n', ' ')
    text = text.replace('\r', ' ')
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def extract_text_mapping():
    """Extraire la correspondance entre texte_juridique_id et le nom du code"""
    
    # Mapper les IDs aux noms de codes juridiques
    text_mapping = {
        1: {'name': 'Constitution du Sénégal', 'category': 'constitution'},
        2: {'name': 'Code de la famille', 'category': 'code_famille'},
        3: {'name': 'Code du travail', 'category': 'droit_travail'},
        4: {'name': 'Code pénal', 'category': 'loi_penale'},
        5: {'name': 'Code de procédure pénale', 'category': 'procedure_penale'},
        6: {'name': 'Code civil', 'category': 'droit_civil'},
        7: {'name': 'Code de procédure civile', 'category': 'procedure_civile'},
        8: {'name': 'Code de commerce', 'category': 'commerce'},
        9: {'name': 'Code des impôts', 'category': 'impots'},
        10: {'name': 'Code des assurances', 'category': 'assurances'},
        11: {'name': 'Code de l\'environnement', 'category': 'environnement'},
        12: {'name': 'Code forestier', 'category': 'foret'},
        13: {'name': 'Code de l\'urbanisme', 'category': 'urbanisme'},
        14: {'name': 'Code des marchés publics', 'category': 'marches_publics'},
        15: {'name': 'Code de la propriété intellectuelle', 'category': 'propriete_intellectuelle'},
        16: {'name': 'Code pénal (Article spécifique)', 'category': 'loi_penale'},
        17: {'name': 'Code de procédure civile (Article spécifique)', 'category': 'procedure_civile'},
        18: {'name': 'Code CIMA des Assurances', 'category': 'assurances'},
        19: {'name': 'Code de l\'éducation', 'category': 'education'},
        20: {'name': 'Code de la santé', 'category': 'sante'},
        21: {'name': 'Code de la sécurité sociale', 'category': 'securite_sociale'},
        22: {'name': 'Code de l\'aviation', 'category': 'aviation'},
        23: {'name': 'Code de l\'environnement (Règlement)', 'category': 'environnement'},
        24: {'name': 'Code sportif', 'category': 'sport'},
    }
    
    return text_mapping

def extract_all_articles():
    """Extraire tous les articles individuels de la base"""
    
    sql_file_path = "senegal_juridique.sql"
    
    print("📖 Lecture du fichier SQL avec structure réelle...")
    
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Obtenir le mapping des textes juridiques
    text_mapping = extract_text_mapping()
    
    # Pattern pour extraire les INSERT statements
    insert_pattern = r'INSERT INTO `articles` \(.*?\) VALUES\s*\((.*?)\);'
    
    articles = []
    
    # Trouver tous les INSERT statements
    insert_matches = re.findall(insert_pattern, content, re.DOTALL)
    
    print(f"🔍 {len(insert_matches)} articles trouvés dans la base")
    
    for match in insert_matches:
        # Parser chaque ligne d'article
        # Format: (id, texte_juridique_id, numero_article, titre_article, contenu_article, position_ordre)
        
        # Utiliser une regex plus robuste pour parser les valeurs
        values_pattern = r'\((\d+),\s*(\d+),\s*\'([^\']*)\',\s*\'?([^\']*?)\'?,\s*\'([^\']*)\',\s*(\d+)\)'
        value_matches = re.findall(values_pattern, match, re.DOTALL)
        
        for value_match in value_matches:
            try:
                article_id = value_match[0]
                texte_juridique_id = int(value_match[1])
                numero_article = clean_text(value_match[2])
                titre_article = clean_text(value_match[3])
                contenu_article = clean_text(value_match[4])
                position_ordre = int(value_match[5])
                
                # Obtenir les informations du texte juridique
                text_info = text_mapping.get(texte_juridique_id, {
                    'name': f'Texte {texte_juridique_id}',
                    'category': 'droit_civil'
                })
                
                # Construire le titre final
                if titre_article and titre_article != numero_article:
                    final_title = f"{text_info['name']} - {titre_article}"
                else:
                    final_title = f"{text_info['name']} - {numero_article}"
                
                # Créer l'article
                article = {
                    'id': article_id,
                    'title': final_title,
                    'category': text_info['category'],
                    'content': contenu_article,
                    'summary': f"Article {numero_article} du {text_info['name']}",
                    'language': 'fr',
                    'tags': [text_info['category'].replace('_', ' '), numero_article.replace('Article ', '')],
                    'published_by': None,
                    'is_published': True,
                    'views_count': 0,
                    'created_at': '2024-01-01T00:00:00Z',
                    'updated_at': '2024-01-01T00:00:00Z',
                    'texte_juridique_id': texte_juridique_id,
                    'position_ordre': position_ordre
                }
                
                articles.append(article)
                
            except (ValueError, IndexError) as e:
                print(f"⚠️ Erreur lors du parsing d'un article: {e}")
                continue
    
    # Trier par texte juridique puis par position
    articles.sort(key=lambda x: (x['texte_juridique_id'], x['position_ordre']))
    
    return articles

def save_articles_to_typescript(articles: List[Dict[str, Any]]) -> str:
    """Sauvegarder les articles en format TypeScript avec échappement correct"""
    
    print(f"💾 Sauvegarde de {len(articles)} articles en TypeScript...")
    
    # Créer le dossier src/data s'il n'existe pas
    os.makedirs("src/data", exist_ok=True)
    
    output_path = "src/data/legalArticles.ts"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        # En-tête
        f.write('''// Articles juridiques individuels extraits de senegal_juridique.sql
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
''')
        
        # Ajouter chaque article avec échappement correct
        for i, article in enumerate(articles):
            # Échapper correctement tous les caractères spéciaux
            title = article['title'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
            summary = article['summary'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
            content = article['content'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
            
            f.write(f'''  {{
    id: '{article['id']}',
    title: `{title}`,
    category: '{article['category']}',
    content: `{content}`,
    summary: `{summary}`,
    language: '{article['language']}',
    tags: {json.dumps(article['tags'])},
    published_by: null,
    is_published: {str(article['is_published']).lower()},
    views_count: {article['views_count']},
    created_at: '{article['created_at']}',
    updated_at: '{article['updated_at']}'
  }}''')
            
            # Ajouter une virgule sauf pour le dernier élément
            if i < len(articles) - 1:
                f.write(',')
            
            f.write('\n')
        
        # Métadonnées
        f.write(f'''];

export const LEGAL_ARTICLES_METADATA = {{
  total_articles: {len(articles)},
  extracted_at: "2024-01-01T00:00:00Z",
  source: "senegal_juridique.sql",
  version: "Final - Base de données réelle"
}};
''')
    
    return output_path

def main():
    """Fonction principale"""
    print("🚀 Extraction finale des articles juridiques individuels...")
    
    # Extraire tous les articles
    articles = extract_all_articles()
    
    if not articles:
        print("❌ Aucun article extrait")
        return
    
    print(f"📊 {len(articles)} articles individuels extraits")
    
    # Statistiques par catégorie
    categories = {}
    texts = {}
    
    for article in articles:
        cat = article['category']
        categories[cat] = categories.get(cat, 0) + 1
        
        text_id = article['texte_juridique_id']
        texts[text_id] = texts.get(text_id, 0) + 1
    
    print(f"\n📊 Répartition par catégorie :")
    for cat, count in sorted(categories.items()):
        print(f"   - {cat}: {count} articles")
    
    print(f"\n📊 Répartition par texte juridique :")
    for text_id, count in sorted(texts.items()):
        print(f"   - Texte {text_id}: {count} articles")
    
    # Sauvegarder
    output_file = save_articles_to_typescript(articles)
    
    print(f"\n🎉 Extraction terminée !")
    print(f"📁 Fichier généré : {output_file}")
    
    # Afficher quelques exemples
    print(f"\n📄 Exemples d'articles extraits :")
    for i, article in enumerate(articles[:3]):
        print(f"   {i+1}. {article['title']}")
        print(f"      Contenu: {article['content'][:80]}...")

if __name__ == "__main__":
    main()