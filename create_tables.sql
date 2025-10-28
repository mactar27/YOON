-- Script pour créer les tables dans Supabase avant d'insérer les données
-- À exécuter dans l'interface SQL de Supabase

-- Créer la table legal_content
CREATE TABLE IF NOT EXISTS legal_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  summary text,
  language text DEFAULT 'fr',
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer les index pour de meilleures performances
CREATE INDEX IF NOT EXISTS idx_legal_content_category ON legal_content(category);
CREATE INDEX IF NOT EXISTS idx_legal_content_published ON legal_content(is_published);

-- Activer RLS
ALTER TABLE legal_content ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre la lecture publique des contenus publiés
CREATE POLICY "Anyone can view published content"
  ON legal_content FOR SELECT
  TO authenticated
  USING (is_published = true);