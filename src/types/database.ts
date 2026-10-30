export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          actual_hours: number | null
          course_id: string
          created_at: string | null
          description: string | null
          due_date: string
          estimated_hours: number | null
          feedback: string | null
          grade: string | null
          id: string
          instructions: string | null
          last_notification_sent: string | null
          last_submission_at: string | null
          material_id: string | null
          notification_active: boolean | null
          notification_count: number | null
          notification_silenced_until: string | null
          priority: string | null
          requirements: string[] | null
          start_date: string | null
          status: string | null
          title: string
          topics: string[] | null
          updated_at: string | null
          user_id: string
          work_submitted: boolean | null
          work_validated: boolean | null
        }
        Insert: {
          actual_hours?: number | null
          course_id: string
          created_at?: string | null
          description?: string | null
          due_date: string
          estimated_hours?: number | null
          feedback?: string | null
          grade?: string | null
          id?: string
          instructions?: string | null
          last_notification_sent?: string | null
          last_submission_at?: string | null
          material_id?: string | null
          notification_active?: boolean | null
          notification_count?: number | null
          notification_silenced_until?: string | null
          priority?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string | null
          user_id: string
          work_submitted?: boolean | null
          work_validated?: boolean | null
        }
        Update: {
          actual_hours?: number | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string
          estimated_hours?: number | null
          feedback?: string | null
          grade?: string | null
          id?: string
          instructions?: string | null
          last_notification_sent?: string | null
          last_submission_at?: string | null
          material_id?: string | null
          notification_active?: boolean | null
          notification_count?: number | null
          notification_silenced_until?: string | null
          priority?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string | null
          user_id?: string
          work_submitted?: boolean | null
          work_validated?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          assignment_id: string | null
          color: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          end_time: string | null
          event_type: string
          id: string
          is_recurring: boolean | null
          recurrence_rule: string | null
          start_time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          assignment_id?: string | null
          color?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type: string
          id?: string
          is_recurring?: boolean | null
          recurrence_rule?: string | null
          start_time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          assignment_id?: string | null
          color?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string
          id?: string
          is_recurring?: boolean | null
          recurrence_rule?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          helpful_rating: number | null
          id: string
          injected_context: Json | null
          referenced_materials: string[] | null
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          helpful_rating?: number | null
          id?: string
          injected_context?: Json | null
          referenced_materials?: string[] | null
          role: string
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          helpful_rating?: number | null
          id?: string
          injected_context?: Json | null
          referenced_materials?: string[] | null
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          summary: string | null
          title: string | null
          topics_discussed: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          summary?: string | null
          title?: string | null
          topics_discussed?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          summary?: string | null
          title?: string | null
          topics_discussed?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string | null
          color: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          professor: string | null
          schedule: Json | null
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          code?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          professor?: string | null
          schedule?: Json | null
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          code?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          professor?: string | null
          schedule?: Json | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      material_embeddings: {
        Row: {
          chunk_index: number
          chunk_text: string
          course_id: string
          created_at: string | null
          embedding: string | null
          id: string
          material_id: string
          topics: string[] | null
        }
        Insert: {
          chunk_index: number
          chunk_text: string
          course_id: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          material_id: string
          topics?: string[] | null
        }
        Update: {
          chunk_index?: number
          chunk_text?: string
          course_id?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          material_id?: string
          topics?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "material_embeddings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_embeddings_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          extracted_action_items: Json | null
          extracted_dates: Json | null
          extracted_requirements: string[] | null
          extracted_topics: string[] | null
          file_size: number | null
          file_url: string | null
          id: string
          is_processed: boolean | null
          material_type: string
          original_filename: string | null
          processing_error: string | null
          raw_text: string | null
          source_text: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          extracted_action_items?: Json | null
          extracted_dates?: Json | null
          extracted_requirements?: string[] | null
          extracted_topics?: string[] | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_processed?: boolean | null
          material_type: string
          original_filename?: string | null
          processing_error?: string | null
          raw_text?: string | null
          source_text?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          extracted_action_items?: Json | null
          extracted_dates?: Json | null
          extracted_requirements?: string[] | null
          extracted_topics?: string[] | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_processed?: boolean | null
          material_type?: string
          original_filename?: string | null
          processing_error?: string | null
          raw_text?: string | null
          source_text?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          assignment_id: string | null
          channel: string
          created_at: string | null
          days_until_due: number | null
          escalation_level: number | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          is_sent: boolean | null
          message: string
          notification_type: string
          scheduled_for: string
          sent_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          assignment_id?: string | null
          channel: string
          created_at?: string | null
          days_until_due?: number | null
          escalation_level?: number | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          is_sent?: boolean | null
          message: string
          notification_type: string
          scheduled_for: string
          sent_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          assignment_id?: string | null
          channel?: string
          created_at?: string | null
          days_until_due?: number | null
          escalation_level?: number | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          is_sent?: boolean | null
          message?: string
          notification_type?: string
          scheduled_for?: string
          sent_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          current_semester: string | null
          email: string
          full_name: string | null
          id: string
          notification_email: string | null
          notification_preferences: Json | null
          semester_start_date: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_semester?: string | null
          email: string
          full_name?: string | null
          id: string
          notification_email?: string | null
          notification_preferences?: Json | null
          semester_start_date?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_semester?: string | null
          email?: string
          full_name?: string | null
          id?: string
          notification_email?: string | null
          notification_preferences?: Json | null
          semester_start_date?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_context: {
        Row: {
          context_summary: string | null
          course_id: string | null
          created_at: string | null
          current_week: number | null
          id: string
          instructor_notes: string | null
          last_study_session: string | null
          learning_style: string | null
          personal_goals: string[] | null
          preferred_explanation_depth: string | null
          recent_topics_studied: string[] | null
          strength_areas: string[] | null
          struggle_areas: string[] | null
          total_study_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_summary?: string | null
          course_id?: string | null
          created_at?: string | null
          current_week?: number | null
          id?: string
          instructor_notes?: string | null
          last_study_session?: string | null
          learning_style?: string | null
          personal_goals?: string[] | null
          preferred_explanation_depth?: string | null
          recent_topics_studied?: string[] | null
          strength_areas?: string[] | null
          struggle_areas?: string[] | null
          total_study_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_summary?: string | null
          course_id?: string | null
          created_at?: string | null
          current_week?: number | null
          id?: string
          instructor_notes?: string | null
          last_study_session?: string | null
          learning_style?: string | null
          personal_goals?: string[] | null
          preferred_explanation_depth?: string | null
          recent_topics_studied?: string[] | null
          strength_areas?: string[] | null
          struggle_areas?: string[] | null
          total_study_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_context_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_context_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_submissions: {
        Row: {
          assignment_id: string
          content: string | null
          created_at: string | null
          file_name: string | null
          file_url: string | null
          id: string
          is_validated: boolean | null
          line_count: number | null
          silenced_notifications: boolean | null
          submission_type: string
          user_id: string
          validation_feedback: string | null
          validation_score: number | null
          validation_timestamp: string | null
          word_count: number | null
        }
        Insert: {
          assignment_id: string
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_validated?: boolean | null
          line_count?: number | null
          silenced_notifications?: boolean | null
          submission_type: string
          user_id: string
          validation_feedback?: string | null
          validation_score?: number | null
          validation_timestamp?: string | null
          word_count?: number | null
        }
        Update: {
          assignment_id?: string
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_validated?: boolean | null
          line_count?: number | null
          silenced_notifications?: boolean | null
          submission_type?: string
          user_id?: string
          validation_feedback?: string | null
          validation_score?: number | null
          validation_timestamp?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_student_context: {
        Args: { p_course_id?: string; p_user_id: string }
        Returns: Json
      }
      should_send_notification: {
        Args: { assignment_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
