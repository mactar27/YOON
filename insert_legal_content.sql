-- Script pour insérer les contenus juridiques du Sénégal dans Supabase
-- À exécuter dans l'interface SQL de Supabase ou via la CLI

-- Insertion des textes juridiques principaux
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Code pénal du Sénégal', 'loi_penale', 'Le Code pénal du Sénégal définit les infractions et les peines applicables...', 'Code définissant les infractions pénales et leurs sanctions', 'fr', ARRAY['pénal', 'infraction', 'peine', 'justice'], true),

('Code de la famille', 'code_famille', 'Le Code de la famille réglemente les relations familiales au Sénégal...', 'Réglementation des relations familiales et matrimoniales', 'fr', ARRAY['famille', 'mariage', 'enfants', 'succession'], true),

('Code du travail', 'droit_travail', 'Le Code du travail fixe les règles applicables aux relations de travail...', 'Réglementation du droit du travail au Sénégal', 'fr', ARRAY['travail', 'salarié', 'employeur', 'syndicat'], true),

('Code général des impôts', 'impots', 'Le Code général des impôts définit le régime fiscal applicable au Sénégal...', 'Réglementation fiscale complète du Sénégal', 'fr', ARRAY['impôt', 'taxe', 'fiscal', 'contribution'], true),

('Code foncier et domanial', 'foncier', 'Le Code foncier réglemente les droits réels immobiliers...', 'Réglementation des droits fonciers et immobiliers', 'fr', ARRAY['foncier', 'immobilier', 'propriété', 'domaine'], true),

('Code des assurances', 'assurances', 'Le Code des assurances réglemente l''activité d''assurance...', 'Réglementation du secteur des assurances', 'fr', ARRAY['assurance', 'risque', 'contrat', 'sinistre'], true),

('Code de l''environnement', 'environnement', 'Le Code de l''environnement protège l''environnement sénégalais...', 'Protection et gestion de l''environnement', 'fr', ARRAY['environnement', 'pollution', 'protection', 'développement'], true),

('Code des obligations civiles et commerciales', 'droit_civil', 'Le Code des obligations définit les règles des contrats...', 'Réglementation des obligations contractuelles', 'fr', ARRAY['contrat', 'obligation', 'responsabilité', 'commerce'], true);

-- Insertion d'articles pour le Code pénal (exemples)
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Article 1 - Définition des infractions', 'loi_penale', 'L''infraction que les lois punissent de peines de police est une contravention. L''infraction que les lois punissent de peines correctionnelles est un délit. L''infraction que les lois punissent d''une peine afflictive ou infamante est un crime.', 'Classification des infractions pénales', 'fr', ARRAY['pénal', 'infraction', 'contravention', 'délit', 'crime'], true),

('Article 2 - Territorialité', 'loi_penale', 'Les infractions commises sur le territoire de la République du Sénégal sont punissables...', 'Principe de territorialité des infractions', 'fr', ARRAY['pénal', 'territoire', 'juridiction'], true);

-- Insertion d'articles pour le Code de la famille (exemples)
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Article 1 - Nom et prénoms', 'code_famille', 'La personne s''identifie par son ou ses prénoms et par son nom patronymique...', 'Règles d''identification personnelle', 'fr', ARRAY['famille', 'nom', 'prénoms', 'identité'], true),

('Article 2 - Puissance maritale', 'code_famille', 'Le mari est le chef de la famille, il exerce ce pouvoir dans l''intérêt commun...', 'Rôles respectifs des époux', 'fr', ARRAY['famille', 'mariage', 'époux', 'autorité'], true);

-- Insertion d'articles pour le Code du travail (exemples)
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Article 1 - Champ d''application', 'droit_travail', 'Le présent code s''applique à tous les employeurs et travailleurs...', 'Champ d''application du Code du travail', 'fr', ARRAY['travail', 'employeur', 'travailleur', 'application'], true),

('Article 2 - Définitions', 'droit_travail', 'Au sens du présent code, on entend par : - Employeur... - Travailleur...', 'Définitions des termes clés', 'fr', ARRAY['travail', 'définition', 'termes'], true);

-- Insertion d'articles pour le Code des impôts (exemples)
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Article 1 - Impôt sur les sociétés', 'impots', 'Sont soumises à l''impôt sur les sociétés les sociétés anonymes...', 'Champ d''application de l''IS', 'fr', ARRAY['impôt', 'société', 'IS', 'personne morale'], true),

('Article 2 - Impôt sur le revenu', 'impots', 'L''impôt sur le revenu frappe les personnes physiques...', 'Champ d''application de l''IR', 'fr', ARRAY['impôt', 'revenu', 'IR', 'personne physique'], true);

-- Insertion d'articles pour le Code foncier (exemples)
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Article 1 - Définition du domaine national', 'foncier', 'Le domaine national comprend les biens appartenant à l''Etat...', 'Composition du domaine national', 'fr', ARRAY['foncier', 'domaine', 'national', 'Etat'], true),

('Article 2 - Biens domaniaux', 'foncier', 'Les biens domaniaux sont inaliénables et imprescriptibles...', 'Nature des biens domaniaux', 'fr', ARRAY['foncier', 'domaniaux', 'inaliénables'], true);

-- Insertion d'articles pour le Code des assurances (exemples)
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Article 1 - Objet du contrat d''assurance', 'assurances', 'Le contrat d''assurance est celui par lequel l''assureur s''engage...', 'Définition du contrat d''assurance', 'fr', ARRAY['assurance', 'contrat', 'assureur', 'souscripteur'], true),

('Article 2 - Bonne foi', 'assurances', 'Le contrat d''assurance est fondé sur la bonne foi...', 'Principe de bonne foi en assurance', 'fr', ARRAY['assurance', 'bonne foi', 'déclaration'], true);

-- Insertion d'articles pour le Code de l'environnement (exemples)
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Article 1 - Objet du code', 'environnement', 'Le présent code a pour objet de définir le régime juridique...', 'Objet et champ d''application', 'fr', ARRAY['environnement', 'protection', 'développement'], true),

('Article 2 - Définitions', 'environnement', 'Au sens du présent code, on entend par environnement...', 'Définitions environnementales', 'fr', ARRAY['environnement', 'définitions', 'termes'], true);

-- Insertion d'articles pour le Code civil (exemples)
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Article 1 - Conditions de validité des contrats', 'droit_civil', 'Quatre conditions sont essentielles à la validité d''un contrat...', 'Conditions de validité des contrats', 'fr', ARRAY['civil', 'contrat', 'validité', 'consentement'], true),

('Article 2 - Capacité de contracter', 'droit_civil', 'Toute personne peut contracter si elle n''en est pas déclarée incapable...', 'Capacité juridique de contracter', 'fr', ARRAY['civil', 'capacité', 'contrat', 'mineur'], true);