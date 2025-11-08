#!/usr/bin/env python3
"""
Script d'extraction automatique avancé des articles juridiques
depuis le fichier senegal_juridique.sql vers un format JSON
"""

import re
import json
import os
from typing import List, Dict, Any

def analyze_sql_structure():
    """Analyser la structure du fichier SQL pour comprendre le format"""
    
    sql_file_path = "senegal_juridique.sql"
    
    print("🔍 Analyse de la structure du fichier SQL...")
    
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Chercher différents patterns
    patterns = {
        'insert_statements': re.findall(r"INSERT INTO.*?VALUES", content, re.IGNORECASE | re.DOTALL),
        'table_creations': re.findall(r"CREATE TABLE.*?legal_content", content, re.IGNORECASE | re.DOTALL),
        'data_sections': re.findall(r"VALUES\s*\(.*?\);", content, re.DOTALL),
        'text_sections': re.findall(r"TEXT\s*=\s*'([^']*)'", content, re.IGNORECASE),
        'title_sections': re.findall(r"title\s*=\s*'([^']*)'", content, re.IGNORECASE),
        'category_sections': re.findall(r"category\s*=\s*'([^']*)'", content, re.IGNORECASE)
    }
    
    print(f"📊 Statistiques trouvées :")
    print(f"   - {len(patterns['insert_statements'])} statements INSERT")
    print(f"   - {len(patterns['table_creations'])} définitions de table")
    print(f"   - {len(patterns['data_sections'])} sections de données")
    print(f"   - {len(patterns['text_sections'])} textes trouvés")
    print(f"   - {len(patterns['title_sections'])} titres trouvés")
    print(f"   - {len(patterns['category_sections'])} catégories trouvées")
    
    return patterns

def extract_legal_articles_advanced():
    """Extraction avancée des articles avec plusieurs méthodes"""
    
    sql_file_path = "senegal_juridique.sql"
    
    print("📖 Lecture avancée du fichier SQL...")
    
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    articles = []
    
    # Méthode 1: Extraire les articles avec structure complète
    print("🔍 Méthode 1: Extraction des articles structurés...")
    
    # Pattern pour extraire les articles avec structure
    article_pattern = r"'(\d+)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*(\w+),\s*(\d+),"
    matches = re.findall(article_pattern, content)
    
    print(f"   {len(matches)} articles trouvés avec la structure complète")
    
    for i, match in enumerate(matches):
        article = {
            'id': match[0],
            'title': match[1],
            'category': match[2],
            'content': match[3],
            'summary': match[4],
            'language': match[5],
            'tags': match[6].split(',') if match[6] else [],
            'published_by': match[7] if match[7] != 'NULL' else None,
            'is_published': match[8].lower() == 'true',
            'views_count': int(match[9]),
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z'
        }
        articles.append(article)
    
    # Méthode 2: Extraire par sections textuelles
    if len(articles) < 10:  # Si peu d'articles trouvés
        print("🔍 Méthode 2: Extraction par sections textuelles...")
        
        # Chercher des sections importantes
        important_sections = [
            (r"PREAMBULE.*?(?=TITRE|TEXT|$)", "Préambule", "constitution"),
            (r"TITRE I.*?(?=TITRE II|TEXT|$)", "Titre I - De l'État", "constitution"),
            (r"TITRE II.*?(?=TITRE III|TEXT|$)", "Titre II - Du Président", "constitution"),
            (r"LIVRE I.*?(?=LIVRE II|TEXT|$)", "Livre I - Des Infractions", "loi_penale"),
            (r"LIVRE II.*?(?=LIVRE III|TEXT|$)", "Livre II - Des Délits", "loi_penale"),
            (r"CODE DE LA FAMILLE.*?(?=CODE|$)", "Code de la Famille", "code_famille"),
            (r"CODE DU TRAVAIL.*?(?=CODE|$)", "Code du Travail", "droit_travail"),
            (r"CODE CIVIL.*?(?=CODE|$)", "Code Civil", "droit_civil"),
            (r"CODE PENAL.*?(?=CODE|$)", "Code Pénal", "loi_penale"),
            (r"CODE DE COMMERCE.*?(?=CODE|$)", "Code de Commerce", "commerce"),
            (r"CODE GENERAL DES IMPOTS.*?(?=CODE|$)", "Code Général des Impôts", "impots"),
            (r"CONSTITUTION.*?(?=CODE|$)", "Constitution", "constitution"),
        ]
        
        for pattern, title, category in important_sections:
            matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
            
            for i, match in enumerate(matches):
                if len(match.strip()) > 100:  # Seulement les sections substantielles
                    article = {
                        'id': str(len(articles) + 1),
                        'title': f"{title} - Partie {i+1}",
                        'category': category,
                        'content': match[:1000] + "..." if len(match) > 1000 else match,
                        'summary': f"Section {title} du {category.replace('_', ' ').title()}",
                        'language': 'fr',
                        'tags': [category.replace('_', ' '), 'section'],
                        'published_by': None,
                        'is_published': True,
                        'views_count': 0,
                        'created_at': '2024-01-01T00:00:00Z',
                        'updated_at': '2024-01-01T00:00:00Z'
                    }
                    articles.append(article)
    
    # Méthode 3: Extraire par articles individuels
    if len(articles) < 20:  # Si toujours peu d'articles
        print("🔍 Méthode 3: Extraction d'articles individuels...")
        
        # Chercher des articles avec numérotation
        article_matches = re.findall(r"Art\.\s*(\d+)\.?\s*[-.]?\s*(.+?)(?=Art\.\s*\d+|TITRE|LIVRE|$)", content, re.DOTALL)
        
        for match in article_matches:
            article_num = match[0]
            article_text = match[1].strip()
            
            if len(article_text) > 50:  # Seulement les articles substantiels
                # Déterminer la catégorie basée sur le contexte
                category = 'droit_civil'  # Par défaut
                if 'pénal' in article_text.lower() or 'peine' in article_text.lower():
                    category = 'loi_penale'
                elif 'famille' in article_text.lower() or 'mariage' in article_text.lower():
                    category = 'code_famille'
                elif 'travail' in article_text.lower() or 'salarié' in article_text.lower():
                    category = 'droit_travail'
                elif 'commercial' in article_text.lower() or 'société' in article_text.lower():
                    category = 'commerce'
                
                article = {
                    'id': f"art_{article_num}",
                    'title': f"Article {article_num}",
                    'category': category,
                    'content': article_text,
                    'summary': f"Article {article_num} de la législation sénégalaise",
                    'language': 'fr',
                    'tags': [category.replace('_', ' '), f"article {article_num}"],
                    'published_by': None,
                    'is_published': True,
                    'views_count': 0,
                    'created_at': '2024-01-01T00:00:00Z',
                    'updated_at': '2024-01-01T00:00:00Z'
                }
                articles.append(article)
    
    return articles

def categorize_and_sort_articles(articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Catégoriser et trier les articles par ordre juridique logique"""
    
    category_mapping = {
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
    
    # Mise à jour automatique des catégories
    for article in articles:
        title = article.get('title', '').lower()
        content = article.get('content', '').lower()
        
        if not article.get('category') or article.get('category') == 'droit_civil':
            # Auto-catégorisation basée sur le contenu
            if any(word in title + content for word in ['constitution', 'constitutionnel', 'état', 'république']):
                article['category'] = 'constitution'
            elif any(word in title + content for word in ['pénal', 'penal', 'infraction', 'peine', 'sanction']):
                article['category'] = 'loi_penale'
            elif any(word in title + content for word in ['famille', 'mariage', 'divorce', 'filiation']):
                article['category'] = 'code_famille'
            elif any(word in title + content for word in ['travail', 'emploi', 'salarié', 'employeur']):
                article['category'] = 'droit_travail'
            elif any(word in title + content for word in ['commercial', 'société', 'entreprise']):
                article['category'] = 'commerce'
            elif any(word in title + content for word in ['fiscal', 'impôt', 'taxe', 'revenu']):
                article['category'] = 'impots'
            elif any(word in title + content for word in ['environnement', 'écologie', 'nature']):
                article['category'] = 'environnement'
    
    # Trier par catégorie puis par titre
    articles.sort(key=lambda x: (
        category_mapping.get(x.get('category', ''), 999),
        x.get('title', '')
    ))
    
    return articles

def save_legal_data_to_json(articles: List[Dict[str, Any]]) -> str:
    """Sauvegarder les données légales en JSON"""
    
    output_data = {
        "metadata": {
            "total_articles": len(articles),
            "extracted_at": "2024-01-01T00:00:00Z",
            "source": "senegal_juridique.sql",
            "version": "2.0",
            "extraction_methods": [
                "structured_extraction",
                "textual_sections",
                "individual_articles"
            ]
        },
        "articles": articles
    }
    
    # Créer le dossier public s'il n'existe pas
    os.makedirs("public", exist_ok=True)
    
    output_path = "public/legal_articles.json"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    return output_path

def main():
    """Fonction principale"""
    print("🚀 Extraction avancée des articles juridiques...")
    
    # Analyser la structure du SQL
    patterns = analyze_sql_structure()
    
    # Extraire tous les articles
    articles = extract_legal_articles_advanced()
    
    if not articles:
        print("❌ Aucun article trouvé")
        return
    
    print(f"📊 {len(articles)} articles extraits au total")
    
    # Catégoriser et trier
    print("📂 Catégorisation et tri par ordre juridique...")
    articles = categorize_and_sort_articles(articles)
    
    # Sauvegarder
    output_file = save_legal_data_to_json(articles)
    
    # Statistiques finales
    categories = {}
    for article in articles:
        cat = article.get('category', 'unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"🎉 Extraction terminée avec succès !")
    print(f"📁 Fichier généré : {output_file}")
    print(f"📊 Statistiques par catégorie :")
    for cat, count in categories.items():
        print(f"   - {cat}: {count} articles")

if __name__ == "__main__":
    main()