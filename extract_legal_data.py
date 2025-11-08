#!/usr/bin/env python3
"""
Script d'extraction automatique des articles juridiques
depuis le fichier senegal_juridique.sql vers un format JSON
"""

import re
import json
import os
from typing import List, Dict, Any

def parse_legal_database():
    """Parse le fichier senegal_juridique.sql et extrait tous les articles"""
    
    # Lire le fichier SQL
    sql_file_path = "senegal_juridique.sql"
    
    if not os.path.exists(sql_file_path):
        print(f"❌ Fichier {sql_file_path} non trouvé")
        return []
    
    print("📖 Lecture du fichier SQL...")
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    articles = []
    
    # Regex pour extraire les articles (plusieurs patterns possibles)
    patterns = [
        # Pattern pour INSERT INTO
        r"INSERT INTO.*?legal_content.*?VALUES\s*\((.*?)\);",
        # Pattern pour les articles avec structure
        r"'(\d+)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'",
    ]
    
    print("🔍 Extraction des articles...")
    
    # Essayer de trouver les articles dans le SQL
    # Pattern pour extraire les articles (formulaire plus général)
    article_matches = re.findall(
        r"INSERT INTO.*?legal_content.*?VALUES\s*\((.*?)\);", 
        sql_content, 
        re.DOTALL | re.IGNORECASE
    )
    
    for match in article_matches:
        # Séparer les valeurs
        values = re.findall(r"'([^']*)'", match)
        
        if len(values) >= 3:  # Au minimum id, title, category
            article = {
                'id': values[0],
                'title': values[1],
                'category': values[2],
                'content': values[3] if len(values) > 3 else '',
                'summary': values[4] if len(values) > 4 else '',
                'language': values[5] if len(values) > 5 else 'fr',
                'tags': values[6].split(',') if len(values) > 6 and values[6] else [],
                'published_by': values[7] if len(values) > 7 else None,
                'is_published': values[8].lower() == 'true' if len(values) > 8 else True,
                'views_count': int(values[9]) if len(values) > 9 and values[9].isdigit() else 0,
                'created_at': values[10] if len(values) > 10 else '2024-01-01T00:00:00Z',
                'updated_at': values[11] if len(values) > 11 else '2024-01-01T00:00:00Z'
            }
            articles.append(article)
    
    # Si pas d'articles trouvés avec le pattern INSERT, essayer de trouver les données différemment
    if not articles:
        print("🔄 Tentative d'extraction alternative...")
        
        # Pattern alternatif pour les articles séparés
        lines = sql_content.split('\n')
        current_article = {}
        in_insert = False
        
        for line in lines:
            line = line.strip()
            
            if 'INSERT INTO' in line and 'legal_content' in line:
                in_insert = True
                continue
                
            if in_insert:
                if line.startswith('(') and line.endswith(');'):
                    # Traiter une ligne d'article
                    values = re.findall(r"'([^']*)'", line)
                    if len(values) >= 3:
                        article = {
                            'id': values[0],
                            'title': values[1],
                            'category': values[2],
                            'content': values[3] if len(values) > 3 else '',
                            'summary': values[4] if len(values) > 4 else '',
                            'language': values[5] if len(values) > 5 else 'fr',
                            'tags': values[6].split(',') if len(values) > 6 and values[6] else [],
                            'published_by': values[7] if len(values) > 7 else None,
                            'is_published': values[8].lower() == 'true' if len(values) > 8 else True,
                            'views_count': int(values[9]) if len(values) > 9 and values[9].isdigit() else 0,
                            'created_at': values[10] if len(values) > 10 else '2024-01-01T00:00:00Z',
                            'updated_at': values[11] if len(values) > 11 else '2024-01-01T00:00:00Z'
                        }
                        articles.append(article)
                elif line == ';':
                    in_insert = False
    
    # Si toujours pas d'articles, créer des articles à partir de structures trouvées
    if not articles:
        print("🔄 Génération d'articles à partir de la structure...")
        
        # Chercher des sections qui ressemblent à des articles
        sections = re.findall(
            r"(CONSTITUTION|CONSTITUTIONAL|CODE PÉNAL|CODE PENAL|CODE CIVIL|CODE DU TRAVAIL|CODE DE LA FAMILLE|CONSTITUTION).*?(?=\n\n|\Z)", 
            sql_content, 
            re.IGNORECASE | re.DOTALL
        )
        
        for i, section in enumerate(sections[:50]):  # Limiter à 50 pour commencer
            article = {
                'id': str(i + 1),
                'title': f"Article juridique {i + 1}",
                'category': 'constitution',
                'content': section[:500] + "..." if len(section) > 500 else section,
                'summary': f"Résumé de l'article {i + 1}",
                'language': 'fr',
                'tags': ['article', 'juridique'],
                'published_by': None,
                'is_published': True,
                'views_count': 0,
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }
            articles.append(article)
    
    print(f"✅ {len(articles)} articles extraits")
    return articles

def categorize_articles(articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Catégoriser les articles selon l'ordre logique"""
    
    # Mappage des catégories par ordre de priorité
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
    
    # Déterminer la catégorie automatiquement si pas définie
    for article in articles:
        title = article.get('title', '').lower()
        content = article.get('content', '').lower()
        
        if not article.get('category') or article.get('category') == '':
            if 'constitution' in title or 'constitutionnel' in content:
                article['category'] = 'constitution'
            elif 'pénal' in title or 'penal' in content or 'infraction' in content:
                article['category'] = 'loi_penale'
            elif 'civil' in title or 'contrat' in content or 'obligation' in content:
                article['category'] = 'droit_civil'
            elif 'famille' in title or 'mariage' in content:
                article['category'] = 'code_famille'
            elif 'travail' in title or 'emploi' in content:
                article['category'] = 'droit_travail'
            elif 'commerce' in title or 'commercial' in content:
                article['category'] = 'commerce'
            elif 'fiscal' in title or 'impôt' in content or 'taxe' in content:
                article['category'] = 'impots'
            elif 'environnement' in title or 'écologie' in content:
                article['category'] = 'environnement'
            else:
                article['category'] = 'droit_civil'  # Catégorie par défaut
    
    # Trier par catégorie
    articles.sort(key=lambda x: category_order.get(x.get('category', ''), 999))
    
    return articles

def save_to_json(articles: List[Dict[str, Any]], filename: str = "legal_articles.json"):
    """Sauvegarder les articles en format JSON"""
    
    output_data = {
        "metadata": {
            "total_articles": len(articles),
            "extracted_at": "2024-01-01T00:00:00Z",
            "source": "senegal_juridique.sql",
            "version": "1.0"
        },
        "articles": articles
    }
    
    output_path = f"public/{filename}"
    
    # Créer le dossier public s'il n'existe pas
    os.makedirs("public", exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Articles sauvegardés dans {output_path}")
    return output_path

def main():
    """Fonction principale"""
    print("🚀 Démarrage de l'extraction des articles juridiques...")
    
    # Extraire les articles
    articles = parse_legal_database()
    
    if not articles:
        print("❌ Aucun article trouvé dans la base de données")
        return
    
    # Catégoriser et trier
    print("📂 Catégorisation des articles...")
    articles = categorize_articles(articles)
    
    # Sauvegarder
    output_file = save_to_json(articles)
    
    print(f"🎉 Extraction terminée !")
    print(f"📊 {len(articles)} articles extraits et sauvegardés")
    print(f"📁 Fichier généré : {output_file}")

if __name__ == "__main__":
    main()