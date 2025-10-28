/*
  # DroitCitoyen Platform - Initial Database Schema

  ## Overview
  Complete database structure for the DroitCitoyen platform supporting three user roles:
  - Administrators: Platform management and content moderation
  - Citizens/Users: Access legal info, generate documents, contact experts
  - Legal Experts: Provide legal consultation and manage cases

  ## New Tables

  ### 1. `user_profiles`
  Extends auth.users with additional user information
  - `id` (uuid, FK to auth.users)
  - `role` (text): 'admin' | 'citizen' | 'expert'
  - `full_name` (text)
  - `phone` (text, optional)
  - `avatar_url` (text, optional)
  - `is_active` (boolean): Account status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `legal_experts`
  Additional information for legal experts
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to user_profiles)
  - `specialties` (text[]): Areas of expertise
  - `bio` (text): Professional description
  - `certifications` (text[]): Professional certifications
  - `is_verified` (boolean): Admin verification status
  - `is_available` (boolean): Current availability
  - `consultation_fee` (numeric, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `legal_content`
  Legal documents, articles, and educational content
  - `id` (uuid, PK)
  - `title` (text)
  - `category` (text): 'loi_penale' | 'code_famille' | 'droit_civil' | etc.
  - `content` (text): Full legal content
  - `summary` (text): Short description
  - `language` (text): 'fr' | 'wo' | etc.
  - `tags` (text[]): Searchable tags
  - `published_by` (uuid, FK to user_profiles)
  - `is_published` (boolean)
  - `views_count` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `document_templates`
  Templates for generating legal/civic documents
  - `id` (uuid, PK)
  - `name` (text): Template name
  - `type` (text): 'extrait_naissance' | 'certificat_deces' | 'contrat' | etc.
  - `fields` (jsonb): Form fields definition
  - `template_content` (text): Document template with placeholders
  - `category` (text)
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 5. `generated_documents`
  User-generated documents
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to user_profiles)
  - `template_id` (uuid, FK to document_templates)
  - `data` (jsonb): Filled form data
  - `status` (text): 'draft' | 'completed' | 'submitted'
  - `document_url` (text, optional): Generated file URL
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `consultation_cases`
  Legal consultation requests from citizens to experts
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to user_profiles): Citizen requesting help
  - `expert_id` (uuid, FK to legal_experts, optional): Assigned expert
  - `title` (text): Case title
  - `description` (text): Problem description
  - `category` (text): Legal category
  - `status` (text): 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
  - `priority` (text): 'low' | 'medium' | 'high'
  - `appointment_date` (timestamptz, optional)
  - `appointment_location` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  - `closed_at` (timestamptz, optional)

  ### 7. `messages`
  Messaging system for users, experts, and admins
  - `id` (uuid, PK)
  - `conversation_id` (uuid): Group messages by conversation
  - `sender_id` (uuid, FK to user_profiles)
  - `recipient_id` (uuid, FK to user_profiles)
  - `case_id` (uuid, FK to consultation_cases, optional)
  - `content` (text): Message content
  - `is_read` (boolean)
  - `created_at` (timestamptz)

  ### 8. `notifications`
  System notifications for users
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to user_profiles)
  - `title` (text)
  - `message` (text)
  - `type` (text): 'case_update' | 'new_message' | 'system_alert' | etc.
  - `is_read` (boolean)
  - `related_id` (uuid, optional): Related case/message ID
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies ensure users can only access their own data
  - Admins have elevated permissions
  - Experts can only access assigned cases
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'citizen' CHECK (role IN ('admin', 'citizen', 'expert')),
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create legal_experts table
CREATE TABLE IF NOT EXISTS legal_experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  specialties text[] DEFAULT '{}',
  bio text,
  certifications text[] DEFAULT '{}',
  is_verified boolean DEFAULT false,
  is_available boolean DEFAULT true,
  consultation_fee numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create legal_content table
CREATE TABLE IF NOT EXISTS legal_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  summary text,
  language text DEFAULT 'fr',
  tags text[] DEFAULT '{}',
  published_by uuid REFERENCES user_profiles(id),
  is_published boolean DEFAULT false,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document_templates table
CREATE TABLE IF NOT EXISTS document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  fields jsonb NOT NULL DEFAULT '[]',
  template_content text NOT NULL,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create generated_documents table
CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES document_templates(id),
  data jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'submitted')),
  document_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultation_cases table
CREATE TABLE IF NOT EXISTS consultation_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  expert_id uuid REFERENCES legal_experts(id),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  appointment_date timestamptz,
  appointment_location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  case_id uuid REFERENCES consultation_cases(id) ON DELETE SET NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  is_read boolean DEFAULT false,
  related_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_legal_experts_user_id ON legal_experts(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_content_category ON legal_content(category);
CREATE INDEX IF NOT EXISTS idx_legal_content_published ON legal_content(is_published);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_cases_user_id ON consultation_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_cases_expert_id ON consultation_cases(expert_id);
CREATE INDEX IF NOT EXISTS idx_consultation_cases_status ON consultation_cases(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient ON messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON user_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for legal_experts
CREATE POLICY "Anyone can view verified experts"
  ON legal_experts FOR SELECT
  TO authenticated
  USING (is_verified = true);

CREATE POLICY "Experts can update own profile"
  ON legal_experts FOR UPDATE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage experts"
  ON legal_experts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for legal_content
CREATE POLICY "Anyone can view published content"
  ON legal_content FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage all content"
  ON legal_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for document_templates
CREATE POLICY "Anyone can view active templates"
  ON document_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON document_templates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for generated_documents
CREATE POLICY "Users can view own documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own documents"
  ON generated_documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own documents"
  ON generated_documents FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for consultation_cases
CREATE POLICY "Users can view own cases"
  ON consultation_cases FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    expert_id IN (
      SELECT id FROM legal_experts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create cases"
  ON consultation_cases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cases"
  ON consultation_cases FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Experts can update assigned cases"
  ON consultation_cases FOR UPDATE
  TO authenticated
  USING (
    expert_id IN (
      SELECT id FROM legal_experts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all cases"
  ON consultation_cases FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "Admins can view all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'role', 'citizen')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON legal_experts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON legal_content
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON generated_documents
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON consultation_cases
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();