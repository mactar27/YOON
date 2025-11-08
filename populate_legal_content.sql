-- Script pour insérer les contenus juridiques sénégalais dans Supabase
-- À exécuter dans l'interface SQL de Supabase

-- Code pénal du Sénégal
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Code pénal du Sénégal', 'loi_penale', 'Consultez le Code pénal complet du Sénégal au format PDF.', 'Code définissant les infractions pénales et leurs sanctions', 'fr', ARRAY['pénal', 'infraction', 'peine', 'prison', 'crime', 'délit', 'contravention'], true);

-- Code des Obligations Civiles et Commerciales
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Code des Obligations Civiles et Commerciales', 'droit_civil', 'Consultez le Code des Obligations Civiles et Commerciales complet du Sénégal au format PDF.', 'Réglementation des contrats et obligations civiles', 'fr', ARRAY['civil', 'contrat', 'obligation', 'responsabilité', 'dette', 'créance'], true);

-- Code CIMA des Assurances
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Code CIMA des Assurances', 'assurances', 'Consultez le Code CIMA des Assurances complet au format PDF.', 'Réglementation du secteur des assurances', 'fr', ARRAY['assurance', 'police', 'sinistre', 'indemnité', 'prime', 'réassurance'], true);

-- Code de la Famille du Sénégal
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Code de la Famille du Sénégal', 'code_famille', 'Consultez le Code de la Famille complet du Sénégal au format PDF.', 'Réglementation des relations familiales et matrimoniales', 'fr', ARRAY['famille', 'mariage', 'divorce', 'filiation', 'succession', 'régime matrimonial'], true);

-- Code du Travail du Sénégal
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Code du Travail du Sénégal', 'droit_travail', 'Consultez le Code du Travail complet du Sénégal au format PDF.', 'Réglementation du droit du travail', 'fr', ARRAY['travail', 'contrat de travail', 'licenciement', 'convention collective', 'sécurité sociale'], true);

-- Code Foncier du Sénégal
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Code Foncier du Sénégal', 'foncier', 'Consultez le Code Foncier complet du Sénégal au format PDF.', 'Réglementation des droits fonciers et immobiliers', 'fr', ARRAY['foncier', 'propriété', 'domaine national', 'bail', 'titre foncier'], true);

-- Code Général des Impôts du Sénégal
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Code Général des Impôts du Sénégal (2013)', 'impots', 'Consultez le Code Général des Impôts complet du Sénégal (2013) au format PDF.', 'Réglementation fiscale complète du Sénégal', 'fr', ARRAY['impôt', 'taxe', 'fiscalité', 'contribution', 'TVA', 'IS', 'IR'], true);

-- Code de l'Environnement du Sénégal
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Code de l''Environnement du Sénégal (2001)', 'environnement', 'Consultez le Code de l''Environnement complet du Sénégal (2001) au format PDF.', 'Protection et gestion de l''environnement', 'fr', ARRAY['environnement', 'pollution', 'nature', 'ressources naturelles', 'développement durable'], true);

-- Articles supplémentaires pour enrichir le contenu
INSERT INTO legal_content (title, category, content, summary, language, tags, is_published) VALUES
('Constitution du Sénégal', 'constitution', 'Consultez la Constitution de la République du Sénégal.', 'Texte fondamental de l''organisation de l''Etat', 'fr', ARRAY['constitution', 'état', 'loi fondamentale', 'droits', 'devoirs'], true),

('Code de procédure pénale', 'procedure_penale', 'Consultez le Code de procédure pénale du Sénégal.', 'Procédures judiciaires pénales', 'fr', ARRAY['procédure', 'pénal', 'justice', 'procès', 'enquête'], true),

('Code de procédure civile', 'procedure_civile', 'Consultez le Code de procédure civile du Sénégal.', 'Procédures judiciaires civiles', 'fr', ARRAY['procédure', 'civil', 'justice', 'procès', 'tribunal'], true),

('Code de commerce', 'commerce', 'Consultez le Code de commerce du Sénégal.', 'Réglementation du commerce et des sociétés', 'fr', ARRAY['commerce', 'société', 'entreprise', 'marchandises'], true),

('Code de la santé publique', 'sante', 'Consultez le Code de la santé publique du Sénégal.', 'Protection et promotion de la santé', 'fr', ARRAY['santé', 'publique', 'médecine', 'prévention'], true),

('Code de l''éducation', 'education', 'Consultez le Code de l''éducation du Sénégal.', 'Système éducatif national', 'fr', ARRAY['éducation', 'enseignement', 'école', 'université'], true),

('Code électoral', 'electoral', 'Consultez le Code électoral du Sénégal.', 'Organisation des élections', 'fr', ARRAY['élection', 'vote', 'démocratie', 'scrutin'], true),

('Code de la presse', 'presse', 'Consultez le Code de la presse du Sénégal.', 'Liberté de la presse et communication', 'fr', ARRAY['presse', 'médias', 'communication', 'liberté'], true),

('Code de la route', 'transport', 'Consultez le Code de la route du Sénégal.', 'Circulation routière et sécurité', 'fr', ARRAY['route', 'transport', 'circulation', 'sécurité'], true),

('Code forestier', 'foret', 'Consultez le Code forestier du Sénégal.', 'Gestion et protection des forêts', 'fr', ARRAY['forêt', 'environnement', 'ressources', 'protection'], true),

('Code de l''urbanisme', 'urbanisme', 'Consultez le Code de l''urbanisme du Sénégal.', 'Aménagement du territoire urbain', 'fr', ARRAY['urbanisme', 'ville', 'aménagement', 'construction'], true),

('Code des marchés publics', 'marches_publics', 'Consultez le Code des marchés publics du Sénégal.', 'Passation des marchés publics', 'fr', ARRAY['marchés', 'publics', 'appels d''offres', 'contrats'], true),

('Code de la propriété intellectuelle', 'propriete_intellectuelle', 'Consultez le Code de la propriété intellectuelle du Sénégal.', 'Protection des droits intellectuels', 'fr', ARRAY['propriété', 'intellectuelle', 'brevets', 'marques'], true),

('Code de la sécurité sociale', 'securite_sociale', 'Consultez le Code de la sécurité sociale du Sénégal.', 'Protection sociale des travailleurs', 'fr', ARRAY['sécurité sociale', 'retraite', 'assurance', 'travailleur'], true),

('Code de l''aviation civile', 'aviation', 'Consultez le Code de l''aviation civile du Sénégal.', 'Réglementation de l''aviation', 'fr', ARRAY['aviation', 'transport aérien', 'aéroport', 'sécurité'], true);