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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      fb_player_grades: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          overall_grade: number | null
          player_id: string | null
          season_id: string | null
          unit_grade: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          overall_grade?: number | null
          player_id?: string | null
          season_id?: string | null
          unit_grade?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          overall_grade?: number | null
          player_id?: string | null
          season_id?: string | null
          unit_grade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fb_player_grades_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "fb_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fb_player_grades_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      fb_player_roles: {
        Row: {
          created_at: string | null
          depth_rank: number | null
          id: string
          player_id: string | null
          replacement_risk: string
          role: string
          season_id: string | null
        }
        Insert: {
          created_at?: string | null
          depth_rank?: number | null
          id?: string
          player_id?: string | null
          replacement_risk?: string
          role?: string
          season_id?: string | null
        }
        Update: {
          created_at?: string | null
          depth_rank?: number | null
          id?: string
          player_id?: string | null
          replacement_risk?: string
          role?: string
          season_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fb_player_roles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "fb_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fb_player_roles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      fb_player_season_usage: {
        Row: {
          created_at: string | null
          games_played: number | null
          id: string
          leverage_snaps: number | null
          player_id: string | null
          season_id: string | null
          snaps: number | null
          snaps_defense: number | null
          snaps_offense: number | null
          snaps_st: number | null
        }
        Insert: {
          created_at?: string | null
          games_played?: number | null
          id?: string
          leverage_snaps?: number | null
          player_id?: string | null
          season_id?: string | null
          snaps?: number | null
          snaps_defense?: number | null
          snaps_offense?: number | null
          snaps_st?: number | null
        }
        Update: {
          created_at?: string | null
          games_played?: number | null
          id?: string
          leverage_snaps?: number | null
          player_id?: string | null
          season_id?: string | null
          snaps?: number | null
          snaps_defense?: number | null
          snaps_offense?: number | null
          snaps_st?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fb_player_season_usage_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "fb_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fb_player_season_usage_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      fb_players: {
        Row: {
          class_year: string | null
          created_at: string | null
          external_ref: string | null
          first_name: string
          height_inches: number | null
          id: string
          last_name: string
          position: string
          position_group: string
          program_id: string | null
          status: string
          weight_lbs: number | null
        }
        Insert: {
          class_year?: string | null
          created_at?: string | null
          external_ref?: string | null
          first_name: string
          height_inches?: number | null
          id?: string
          last_name: string
          position: string
          position_group: string
          program_id?: string | null
          status?: string
          weight_lbs?: number | null
        }
        Update: {
          class_year?: string | null
          created_at?: string | null
          external_ref?: string | null
          first_name?: string
          height_inches?: number | null
          id?: string
          last_name?: string
          position?: string
          position_group?: string
          program_id?: string | null
          status?: string
          weight_lbs?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fb_players_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      fb_revshare_policies: {
        Row: {
          created_at: string | null
          guardrails: Json
          id: string
          is_active: boolean
          name: string
          position_multipliers: Json
          program_id: string | null
          season_id: string | null
          version: number
          weights: Json
        }
        Insert: {
          created_at?: string | null
          guardrails: Json
          id?: string
          is_active?: boolean
          name?: string
          position_multipliers: Json
          program_id?: string | null
          season_id?: string | null
          version?: number
          weights: Json
        }
        Update: {
          created_at?: string | null
          guardrails?: Json
          id?: string
          is_active?: boolean
          name?: string
          position_multipliers?: Json
          program_id?: string | null
          season_id?: string | null
          version?: number
          weights?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fb_revshare_policies_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fb_revshare_policies_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      fb_revshare_pools: {
        Row: {
          created_at: string | null
          id: string
          pool_amount: number
          program_id: string | null
          reserved_amount: number
          season_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pool_amount: number
          program_id?: string | null
          reserved_amount?: number
          season_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pool_amount?: number
          program_id?: string | null
          reserved_amount?: number
          season_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fb_revshare_pools_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fb_revshare_pools_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      fb_value_snapshots: {
        Row: {
          confidence: number
          created_at: string | null
          dollars_high: number
          dollars_low: number
          dollars_mid: number
          id: string
          player_id: string | null
          policy_id: string | null
          program_id: string | null
          rationale: Json
          season_id: string | null
          share_pct: number
          total_score: number
        }
        Insert: {
          confidence: number
          created_at?: string | null
          dollars_high: number
          dollars_low: number
          dollars_mid: number
          id?: string
          player_id?: string | null
          policy_id?: string | null
          program_id?: string | null
          rationale: Json
          season_id?: string | null
          share_pct: number
          total_score: number
        }
        Update: {
          confidence?: number
          created_at?: string | null
          dollars_high?: number
          dollars_low?: number
          dollars_mid?: number
          id?: string
          player_id?: string | null
          policy_id?: string | null
          program_id?: string | null
          rationale?: Json
          season_id?: string | null
          share_pct?: number
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "fb_value_snapshots_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "fb_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fb_value_snapshots_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "fb_revshare_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fb_value_snapshots_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fb_value_snapshots_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      film_assets: {
        Row: {
          confidence_score: number | null
          duration_seconds: number | null
          id: string
          status: string | null
          team_id: string | null
          type: string | null
          uploaded_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          duration_seconds?: number | null
          id?: string
          status?: string | null
          team_id?: string | null
          type?: string | null
          uploaded_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          duration_seconds?: number | null
          id?: string
          status?: string | null
          team_id?: string | null
          type?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      play_tags: {
        Row: {
          id: string
          play_id: string | null
          source: string | null
          tag: string | null
        }
        Insert: {
          id?: string
          play_id?: string | null
          source?: string | null
          tag?: string | null
        }
        Update: {
          id?: string
          play_id?: string | null
          source?: string | null
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "play_tags_play_id_fkey"
            columns: ["play_id"]
            isOneToOne: false
            referencedRelation: "plays"
            referencedColumns: ["id"]
          },
        ]
      }
      playbook_concepts: {
        Row: {
          ai_label: string | null
          coach_label: string | null
          id: string
          team_id: string | null
        }
        Insert: {
          ai_label?: string | null
          coach_label?: string | null
          id?: string
          team_id?: string | null
        }
        Update: {
          ai_label?: string | null
          coach_label?: string | null
          id?: string
          team_id?: string | null
        }
        Relationships: []
      }
      player_development: {
        Row: {
          confidence: number | null
          id: string
          issue: string | null
          player_id: string | null
          recommended_drill: string | null
        }
        Insert: {
          confidence?: number | null
          id?: string
          issue?: string | null
          player_id?: string | null
          recommended_drill?: string | null
        }
        Update: {
          confidence?: number | null
          id?: string
          issue?: string | null
          player_id?: string | null
          recommended_drill?: string | null
        }
        Relationships: []
      }
      player_tracks: {
        Row: {
          avg_speed: number | null
          distance: number | null
          heatmap: Json | null
          id: string
          max_speed: number | null
          play_id: string | null
          player_id: string | null
        }
        Insert: {
          avg_speed?: number | null
          distance?: number | null
          heatmap?: Json | null
          id?: string
          max_speed?: number | null
          play_id?: string | null
          player_id?: string | null
        }
        Update: {
          avg_speed?: number | null
          distance?: number | null
          heatmap?: Json | null
          id?: string
          max_speed?: number | null
          play_id?: string | null
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_tracks_play_id_fkey"
            columns: ["play_id"]
            isOneToOne: false
            referencedRelation: "plays"
            referencedColumns: ["id"]
          },
        ]
      }
      plays: {
        Row: {
          confidence: number | null
          distance: number | null
          down: number | null
          film_id: string | null
          id: string
          play_type: string | null
          quarter: number | null
          yardline: number | null
        }
        Insert: {
          confidence?: number | null
          distance?: number | null
          down?: number | null
          film_id?: string | null
          id?: string
          play_type?: string | null
          quarter?: number | null
          yardline?: number | null
        }
        Update: {
          confidence?: number | null
          distance?: number | null
          down?: number | null
          film_id?: string | null
          id?: string
          play_type?: string | null
          quarter?: number | null
          yardline?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plays_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "film_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          created_at: string | null
          id: string
          label: string
          program_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          program_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          program_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seasons_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
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
