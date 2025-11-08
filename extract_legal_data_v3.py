#!/usr/bin/env python3
"""
Script d'extraction intelligent des articles juridiques individuels
depuis le fichier senegal_juridique.sql avec séparation correcte
"""

import re
import json
import os
from typing import List, Dict, Any

def clean_legal_text(text: str) -> str:
    """Nettoyer le texte juridique des caractères unwanted"""
    # Supprimer les sauts de ligne excessifs
    text = re.sub(r'\n+', ' ', text)
    # Supprimer les espaces multiples
    text = re.sub(r'\s+', ' ', text)
    # Nettoyer les caractères d'échappement
    text = text.replace('\\n', ' ').replace('\\r', ' ')
    # Nettoyer les guillemets
    text = text.replace("'", "\\'").replace('"', '\\"')
    return text.strip()

def extract_individual_articles():
    """Extraire les articles individuels de manière intelligente"""
    
    sql_file_path = "senegal_juridique.sql"
    
    print("📖 Lecture et parsing intelligent du fichier SQL...")
    
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    articles = []
    
    print("🔍 Extraction par codes juridiques spécifiques...")
    
    # Définir les codes avec leurs patterns spécifiques
    legal_codes = [
        {
            'name': 'Constitution du Sénégal',
            'category': 'constitution',
            'pattern': r'PRÉAMBULE.*?(?=(?=LIVRE|TITRE|\Z))',
            'summary': 'Constitution de la République du Sénégal'
        },
        {
            'name': 'Code pénal du Sénégal',
            'category': 'loi_penale', 
            'pattern': r'LIVRE I\s*-\s*DES INFRACTIONS.*?(?=(?=LIVRE II|TITRE CONSTITUTION|\Z))',
            'summary': 'Code pénal définissant les infractions et leurs sanctions'
        },
        {
            'name': 'Code de procédure pénale',
            'category': 'procedure_penale',
            'pattern': r'LIVRE I.*?ENQUÊTE.*?(?=(?=LIVRE II|CODE|\Z))',
            'summary': 'Code de procédure pénale pour les affaires pénales'
        },
        {
            'name': 'Code des Obligations Civiles et Commerciales',
            'category': 'droit_civil',
            'pattern': r'LIVRE I\s*-\s*DES PERSONNES.*?(?=(?=LIVRE II|TITRE|\Z))',
            'summary': 'Code civil définissant les droits et obligations'
        },
        {
            'name': 'Code de procédure civile',
            'category': 'procedure_civile',
            'pattern': r'LIVRE I\s*-\s*DES JURIDICTIONS.*?(?=(?=LIVRE II|CODE|\Z))',
            'summary': 'Code de procédure civile'
        },
        {
            'name': 'Code de la Famille du Sénégal',
            'category': 'code_famille',
            'pattern': r'LIVRE I\s*-\s*DU MARIAGE.*?(?=(?=LIVRE II|CODE|\Z))',
            'summary': 'Code de la famille sénégalaise'
        },
        {
            'name': 'Code du Travail du Sénégal',
            'category': 'droit_travail',
            'pattern': r'TITRE I\s*-\s*DU CONTRAT.*?(?=(?=TITRE II|CODE|\Z))',
            'summary': 'Code du travail et relations professionnelles'
        }
    ]
    
    # Extraction par codes juridiques
    for i, code in enumerate(legal_codes):
        matches = re.findall(code['pattern'], content, re.DOTALL | re.IGNORECASE)
        
        for j, match in enumerate(matches):
            article = {
                'id': f'{code["category"]}_{i+1}_{j+1}',
                'title': f'{code["name"]} - Partie {j+1}',
                'category': code['category'],
                'content': clean_legal_text(match),
                'summary': code['summary'],
                'language': 'fr',
                'tags': [code['category'].replace('_', ' '), 'section', f'partie {j+1}'],
                'published_by': None,
                'is_published': True,
                'views_count': 0,
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }
            articles.append(article)
    
    print(f"🔍 Extraction d'articles individuels...")
    
    # Extraction d'articles individuels numérotés
    article_pattern = r'Art\.\s*(\d+)\.?\s*[-.]?\s*(.+?)(?=\n\n|\nArt\.\s*\d+|\nTITRE|\nLIVRE|\Z)'
    article_matches = re.findall(article_pattern, content, re.DOTALL)
    
    print(f"   {len(article_matches)} articles individuels trouvés")
    
    for match in article_matches:
        article_num = match[0]
        article_content = match[1].strip()
        
        if len(article_content) > 30:  # Seulement les articles substantiels
            # Déterminer la catégorie basée sur le contenu
            category = 'droit_civil'  # Par défaut
            if any(word in article_content.lower() for word in ['pénal', 'penal', 'peine', 'sanction', 'infraction']):
                category = 'loi_penale'
            elif any(word in article_content.lower() for word in ['famille', 'mariage', 'divorce', 'filiation']):
                category = 'code_famille'
            elif any(word in article_content.lower() for word in ['travail', 'salarié', 'employeur', 'contrat de travail']):
                category = 'droit_travail'
            elif any(word in article_content.lower() for word in ['constitution', 'république', 'état', 'droits']):
                category = 'constitution'
            elif any(word in article_content.lower() for word in ['procédure', 'enquête', 'poursuite']):
                category = 'procedure_penale'
            
            # Déterminer le titre basé sur le contexte
            title = f"Article {article_num}"
            if 'constitution' in category:
                title = f"Article Constitutionnel {article_num}"
            elif 'pénal' in category:
                title = f"Article Pénal {article_num}"
            elif 'famille' in category:
                title = f"Article du Code de la Famille {article_num}"
            elif 'travail' in category:
                title = f"Article du Code du Travail {article_num}"
            
            article = {
                'id': f'art_{category}_{article_num}',
                'title': title,
                'category': category,
                'content': clean_legal_text(article_content),
                'summary': f"Article {article_num} du {category.replace('_', ' ').title()}",
                'language': 'fr',
                'tags': [category.replace('_', ' '), f'article {article_num}'],
                'published_by': None,
                'is_published': True,
                'views_count': 0,
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }
            articles.append(article)
    
    return articles

def categorize_and_organize_articles(articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Catégoriser et organiser les articles par ordre juridique logique"""
    
    # Ordre de priorité des catégories
    category_order = {
        'constitution': 1,
        'loi_penale': 2,
        'procedure_penale': 3,
        'droit_civil': 4,
        'procedure_civile': 5,
        'code_famille': 6,
        'droit_travail': 7,
        'securite_sociale': 8,
        'impots': 9,
        'commerce': 10,
        'marches_publics': 11,
        'foncier': 12,
        'urbanisme': 13,
        'assurances': 14,
        'propriete_intellectuelle': 15,
        'sante': 16,
        'education': 17,
        'electoral': 18,
        'presse': 19,
        'environnement': 20,
        'foret': 21,
        'transport': 22,
        'aviation': 23
    }
    
    # Trier par catégorie puis par ID pour un ordre cohérent
    articles.sort(key=lambda x: (
        category_order.get(x.get('category', ''), 999),
        x.get('id', '')
    ))
    
    return articles

def save_improved_articles(articles: List[Dict[str, Any]]) -> str:
    """Sauvegarder les articles améliorés en TypeScript"""
    
    output_data = {
        "metadata": {
            "total_articles": len(articles),
            "extracted_at": "2024-01-01T00:00:00Z",
            "source": "senegal_juridique.sql",
            "version": "3.0 - Amélioré",
            "extraction_method": "individual_articles_smart_extraction"
        },
        "articles": articles
    }
    
    # Créer le contenu TypeScript
    ts_content = '''// Articles juridiques individuels extraits de senegal_juridique.sql
// Généré avec extraction intelligente le 2024-01-01

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
    title: '{article.get('title', '')}',
    category: '{article.get('category', 'droit_civil')}',
    content: `{article.get('content', '')}`,
    summary: '{article.get('summary', '')}',
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
  version: "3.0 - Amélioré"
};
'''
    
    # Créer le dossier src/data s'il n'existe pas
    os.makedirs("src/data", exist_ok=True)
    
    # Écrire le fichier TypeScript
    output_path = "src/data/legalArticles.ts"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    return output_path

def main():
    """Fonction principale"""
    print("🚀 Extraction intelligente des articles juridiques individuels...")
    
    # Extraire les articles individuels
    articles = extract_individual_articles()
    
    if not articles:
        print("❌ Aucun article trouvé")
        return
    
    print(f"📊 {len(articles)} articles individuels extraits")
    
    # Catégoriser et organiser
    print("📂 Catégorisation et organisation...")
    articles = categorize_and_organize_articles(articles)
    
    # Sauvegarder
    output_file = save_improved_articles(articles)
    
    # Statistiques finales
    categories = {}
    for article in articles:
        cat = article.get('category', 'unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"🎉 Extraction terminée avec succès !")
    print(f"📁 Fichier généré : {output_file}")
    print(f"📊 Articles individuels par catégorie :")
    for cat, count in categories.items():
        print(f"   - {cat}: {count} articles")
    
    # Afficher quelques exemples
    print(f"\n📄 Exemples d'articles extraits :")
    for i, article in enumerate(articles[:3]):
        print(f"   {i+1}. {article['title']} ({article['category']})")
        print(f"      Contenu: {article['content'][:100]}...")

if __name__ == "__main__":
    main()