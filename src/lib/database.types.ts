export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          role: 'admin' | 'citizen' | 'expert'
          full_name: string
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'citizen' | 'expert'
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'citizen' | 'expert'
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      legal_experts: {
        Row: {
          id: string
          user_id: string
          specialties: string[]
          bio: string | null
          certifications: string[]
          is_verified: boolean
          is_available: boolean
          consultation_fee: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          specialties?: string[]
          bio?: string | null
          certifications?: string[]
          is_verified?: boolean
          is_available?: boolean
          consultation_fee?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          specialties?: string[]
          bio?: string | null
          certifications?: string[]
          is_verified?: boolean
          is_available?: boolean
          consultation_fee?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      legal_content: {
        Row: {
          id: string
          title: string
          category: string
          content: string
          summary: string | null
          language: string
          tags: string[]
          published_by: string | null
          is_published: boolean
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          content: string
          summary?: string | null
          language?: string
          tags?: string[]
          published_by?: string | null
          is_published?: boolean
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          content?: string
          summary?: string | null
          language?: string
          tags?: string[]
          published_by?: string | null
          is_published?: boolean
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      document_templates: {
        Row: {
          id: string
          name: string
          type: string
          fields: Json
          template_content: string
          category: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          fields?: Json
          template_content: string
          category: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          fields?: Json
          template_content?: string
          category?: string
          is_active?: boolean
          created_at?: string
        }
      }
      generated_documents: {
        Row: {
          id: string
          user_id: string
          template_id: string
          data: Json
          status: 'draft' | 'completed' | 'submitted'
          document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          data?: Json
          status?: 'draft' | 'completed' | 'submitted'
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          data?: Json
          status?: 'draft' | 'completed' | 'submitted'
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      consultation_cases: {
        Row: {
          id: string
          user_id: string
          expert_id: string | null
          title: string
          description: string
          category: string
          status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high'
          appointment_date: string | null
          appointment_location: string | null
          created_at: string
          updated_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          expert_id?: string | null
          title: string
          description: string
          category: string
          status?: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          appointment_date?: string | null
          appointment_location?: string | null
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          expert_id?: string | null
          title?: string
          description?: string
          category?: string
          status?: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          appointment_date?: string | null
          appointment_location?: string | null
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          case_id: string | null
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          case_id?: string | null
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          recipient_id?: string
          case_id?: string | null
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          related_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          related_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          related_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
