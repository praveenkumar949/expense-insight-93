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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          preferred_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          preferred_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          preferred_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bug_reports: {
        Row: {
          created_at: string | null
          description: string
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      finnotes: {
        Row: {
          attachment_url: string | null
          category: string | null
          color: string | null
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachment_url?: string | null
          category?: string | null
          color?: string | null
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachment_url?: string | null
          category?: string | null
          color?: string | null
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      policies: {
        Row: {
          created_at: string
          due_date: string
          expiry_date: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          policy_name: string
          policy_number: string | null
          policy_type: string
          premium_amount: number
          provider: string | null
          renewal_frequency: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_date: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          policy_name: string
          policy_number?: string | null
          policy_type: string
          premium_amount: number
          provider?: string | null
          renewal_frequency?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          due_date?: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          policy_name?: string
          policy_number?: string | null
          policy_type?: string
          premium_amount?: number
          provider?: string | null
          renewal_frequency?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          last_report_sent_at: string | null
          monthly_report_enabled: boolean | null
          phone_number: string | null
          report_frequency: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          last_report_sent_at?: string | null
          monthly_report_enabled?: boolean | null
          phone_number?: string | null
          report_frequency?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          last_report_sent_at?: string | null
          monthly_report_enabled?: boolean | null
          phone_number?: string | null
          report_frequency?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          amount: number | null
          category: string
          created_at: string
          description: string | null
          due_date: string
          frequency: string
          id: string
          is_active: boolean | null
          is_auto_debit: boolean | null
          is_paid: boolean | null
          last_notified_at: string | null
          reminder_days: number[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          category: string
          created_at?: string
          description?: string | null
          due_date: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          is_auto_debit?: boolean | null
          is_paid?: boolean | null
          last_notified_at?: string | null
          reminder_days?: number[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          category?: string
          created_at?: string
          description?: string | null
          due_date?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          is_auto_debit?: boolean | null
          is_paid?: boolean | null
          last_notified_at?: string | null
          reminder_days?: number[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          created_at: string | null
          current_amount: number | null
          goal_name: string
          id: string
          notes: string | null
          target_amount: number
          target_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          goal_name: string
          id?: string
          notes?: string | null
          target_amount: number
          target_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          goal_name?: string
          id?: string
          notes?: string | null
          target_amount?: number
          target_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          billing_date: string
          category: string
          created_at: string
          frequency: string
          id: string
          is_active: boolean | null
          is_auto_debit: boolean | null
          name: string
          notes: string | null
          provider: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_date: string
          category: string
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          is_auto_debit?: boolean | null
          name: string
          notes?: string | null
          provider?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_date?: string
          category?: string
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          is_auto_debit?: boolean | null
          name?: string
          notes?: string | null
          provider?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
