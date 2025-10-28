import re
import mysql.connector
from PyPDF2 import PdfReader
import logging
from datetime import datetime
import os

# ================================
# Configuration and Logging
# ================================
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ================================
# Database Configuration
# ================================
DB_CONFIG = {
    "host": "localhost",
    "user": "root",          # À adapter selon votre configuration
    "password": "",          # Ajoutez le mot de passe si nécessaire
    "database": "senegal_juridique",
    "charset": "utf8mb4",
    "use_unicode": True
}

# ================================
# Liste des PDF à importer
# ================================
PDFS = [
    {
        "path": "codepenal.pdf",
        "titre": "Code pénal du Sénégal",
        "type": "LOI_ORDINAIRE",
        "date": "1965-07-21",
        "numero": "Loi n°65-60",
        "domaine": "Droit pénal",
        "mots_cles": "crime, délit, contravention, peine, prison, infraction",
        "autorite": "Assemblée nationale du Sénégal"
    },
    {
        "path": "Senegal Civil & Commercial Obligations Code.pdf",
        "titre": "Code des Obligations Civiles et Commerciales",
        "type": "LOI_ORDINAIRE",
        "date": "1960-12-31",
        "numero": "",
        "domaine": "Droit civil",
        "mots_cles": "contrat, obligation, responsabilité, dette, succession, créance",
        "autorite": "Assemblée nationale du Sénégal"
    },
    {
        "path": "CIMA-Code-assurances.pdf",
        "titre": "Code CIMA des Assurances",
        "type": "LOI_ORDINAIRE",
        "date": "1992-07-10",
        "numero": "Traité CIMA",
        "domaine": "Droit des assurances",
        "mots_cles": "assurance, police, sinistre, indemnité, prime, réassurance",
        "autorite": "Conférence Interafricaine des Marchés d'Assurances"
    },
    {
        "path": "CODE-DE-LA-FAMILLE.pdf",
        "titre": "Code de la Famille du Sénégal",
        "type": "LOI_ORDINAIRE",
        "date": "1972-01-01",
        "numero": "",
        "domaine": "Droit de la famille",
        "mots_cles": "mariage, divorce, filiation, succession, régime matrimonial",
        "autorite": "Assemblée nationale du Sénégal"
    },
    {
        "path": "codedutravail.pdf",
        "titre": "Code du Travail du Sénégal",
        "type": "LOI_ORDINAIRE",
        "date": "1997-03-01",
        "numero": "",
        "domaine": "Droit du travail",
        "mots_cles": "contrat de travail, licenciement, convention collective, sécurité sociale",
        "autorite": "Assemblée nationale du Sénégal"
    },
    {
        "path": "code-foncier.pdf",
        "titre": "Code Foncier du Sénégal",
        "type": "LOI_ORDINAIRE",
        "date": "1964-06-17",
        "numero": "Loi n°64-46",
        "domaine": "Droit foncier",
        "mots_cles": "propriété, domaine national, bail, titre foncier",
        "autorite": "Assemblée nationale du Sénégal"
    },
    {
        "path": "code-general-des-impots-2013.pdf",
        "titre": "Code Général des Impôts du Sénégal (2013)",
        "type": "LOI_ORDINAIRE",
        "date": "2013-01-01",
        "numero": "",
        "domaine": "Droit fiscal",
        "mots_cles": "impôts, taxes, fiscalité, contribution, TVA",
        "autorite": "Assemblée nationale du Sénégal"
    },
    {
        "path": "Senegal-Code-2001-environnement.pdf",
        "titre": "Code de l'Environnement du Sénégal (2001)",
        "type": "LOI_ORDINAIRE",
        "date": "2001-01-15",
        "numero": "",
        "domaine": "Droit de l'environnement",
        "mots_cles": "environnement, pollution, nature, ressources naturelles",
        "autorite": "Assemblée nationale du Sénégal"
    }
]

# ================================
# Fonctions utilitaires
# ================================
def check_file_exists(file_path):
    """Vérifie si le fichier PDF existe"""
    if not os.path.exists(file_path):
        logger.error(f"Fichier non trouvé: {file_path}")
        return False
    return True

def connect_to_database():
    """Établit la connexion à la base de données avec gestion d'erreurs"""
    try:
        db = mysql.connector.connect(**DB_CONFIG)
        logger.info("Connexion à la base de données établie")
        return db
    except mysql.connector.Error as err:
        logger.error(f"Erreur de connexion à la base de données: {err}")
        raise

def extraire_articles(full_text):
    """
    Fonction améliorée d'extraction des articles avec plusieurs patterns
    """
    patterns = [
        # Pattern principal: Article + numéro + contenu
        re.compile(r"(Article\s+\d+(?:[.\-]\d+)*)(.*?)(?=(Article\s+\d+|$))", re.S | re.IGNORECASE),
        # Pattern alternatif: Art. + numéro
        re.compile(r"(Art\.\s+\d+(?:[.\-]\d+)*)(.*?)(?=(Art\.\s+\d+|Article\s+\d+|$))", re.S | re.IGNORECASE),
        # Pattern pour sections numérotées
        re.compile(r"(\d+\.\s*[A-Z][^.]*\.?)(.*?)(?=(\d+\.\s*[A-Z]|$))", re.S)
    ]
    
    articles = []
    for pattern in patterns:
        matches = pattern.findall(full_text)
        if matches:
            articles = matches
            break
    
    return articles

def clean_text(text):
    """Nettoie le texte des caractères indésirables"""
    if not text:
        return ""
    
    # Supprime les caractères de contrôle et normalise les espaces
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
    return text.strip()

def extract_article_info(numero_complet):
    """Extrait le numéro d'article et le titre éventuel"""
    numero = numero_complet.strip()
    titre_article = None
    
    # Recherche de séparateurs pour le titre
    separators = ['–', '-', ':', '.-', '. -']
    for sep in separators:
        if sep in numero:
            parts = numero.split(sep, 1)
            numero = parts[0].strip()
            titre_article = parts[1].strip() if len(parts) > 1 else None
            break
    
    return numero, titre_article

# ================================
# Fonction principale d'import
# ================================
def import_legal_documents():
    """Fonction principale d'importation des documents juridiques"""
    db = connect_to_database()
    cursor = db.cursor()
    
    try:
        total_articles = 0
        successful_imports = 0
        
        for pdf in PDFS:
            logger.info(f"📘 Traitement de {pdf['titre']}...")
            
            # Vérification de l'existence du fichier
            if not check_file_exists(pdf["path"]):
                logger.warning(f"Fichier {pdf['path']} ignoré (non trouvé)")
                continue
            
            try:
                # Vérification si le document existe déjà
                cursor.execute("SELECT id FROM textes_juridiques WHERE titre = %s", (pdf["titre"],))
                if cursor.fetchone():
                    logger.warning(f"Document '{pdf['titre']}' déjà présent dans la base")
                    continue
                
                # Lecture du PDF
                reader = PdfReader(pdf["path"])
                full_text = ""
                
                for page_num, page in enumerate(reader.pages, 1):
                    try:
                        text = page.extract_text()
                        if text:
                            full_text += clean_text(text) + "\n"
                    except Exception as e:
                        logger.warning(f"Erreur lors de la lecture de la page {page_num}: {e}")
                
                if not full_text.strip():
                    logger.error(f"Aucun texte extrait de {pdf['path']}")
                    continue
                
                # Insertion du texte global
                insert_texte = """
                INSERT INTO textes_juridiques 
                (titre, contenu, type_texte, date_promulgation, numero_officiel, 
                 domaine_juridique, mots_cles, statut, autorite_emettrice)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                
                values = (
                    pdf["titre"],
                    f"Texte intégral de {pdf['titre']} (détails dans la table articles).",
                    pdf["type"],
                    pdf["date"],
                    pdf["numero"],
                    pdf["domaine"],
                    pdf["mots_cles"],
                    "ACTIVE",
                    pdf["autorite"]
                )
                
                cursor.execute(insert_texte, values)
                db.commit()
                texte_id = cursor.lastrowid
                logger.info(f"✅ {pdf['titre']} inséré avec ID {texte_id}")
                
                # Extraction et insertion des articles
                articles = extraire_articles(full_text)
                logger.info(f"📖 {len(articles)} articles trouvés pour {pdf['titre']}")
                
                if articles:
                    insert_article = """
                    INSERT INTO articles 
                    (texte_juridique_id, numero_article, titre_article, contenu_article, position_ordre)
                    VALUES (%s, %s, %s, %s, %s)
                    """
                    
                    position = 1
                    articles_inserted = 0
                    
                    for match in articles:
                        try:
                            numero_complet = match[0].strip()
                            contenu = clean_text(match[1])
                            
                            # Ignorer les articles trop courts (probablement des erreurs d'extraction)
                            if len(contenu) < 10:
                                continue
                            
                            numero, titre_article = extract_article_info(numero_complet)
                            
                            values = (
                                texte_id, 
                                numero, 
                                titre_article, 
                                contenu, 
                                position
                            )
                            
                            cursor.execute(insert_article, values)
                            position += 1
                            articles_inserted += 1
                            
                        except Exception as e:
                            logger.error(f"Erreur lors de l'insertion de l'article {numero_complet}: {e}")
                            continue
                    
                    db.commit()
                    logger.info(f"✅ {articles_inserted} articles insérés pour {pdf['titre']}")
                    total_articles += articles_inserted
                    successful_imports += 1
                
                else:
                    logger.warning(f"Aucun article extrait de {pdf['titre']}")
                    
            except Exception as e:
                logger.error(f"Erreur lors du traitement de {pdf['titre']}: {e}")
                db.rollback()
                continue
        
        logger.info(f"🎉 Import terminé: {successful_imports} documents traités, {total_articles} articles au total")
        
    except Exception as e:
        logger.error(f"Erreur générale: {e}")
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()
        logger.info("Connexion à la base de données fermée")

# ================================
# Point d'entrée
# ================================
if __name__ == "__main__":
    try:
        import_legal_documents()
    except KeyboardInterrupt:
        logger.info("Import interrompu par l'utilisateur")
    except Exception as e:
        logger.error(f"Échec de l'import: {e}")
        exit(1)