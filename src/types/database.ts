// Database type definitions for Supabase
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          user_id: string
          email: string
          is_lumin_plus: boolean
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email: string
          is_lumin_plus?: boolean
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          is_lumin_plus?: boolean
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          text: string
          completed: boolean
          completed_at: string | null
          total_work_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed?: boolean
          completed_at?: string | null
          total_work_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed?: boolean
          completed_at?: string | null
          total_work_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          auto_hide_completed: boolean
          collapse_completed: boolean
          show_confetti: boolean
          show_stats: boolean
          focus_time: number
          break_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          auto_hide_completed?: boolean
          collapse_completed?: boolean
          show_confetti?: boolean
          show_stats?: boolean
          focus_time?: number
          break_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          auto_hide_completed?: boolean
          collapse_completed?: boolean
          show_confetti?: boolean
          show_stats?: boolean
          focus_time?: number
          break_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      task_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string
          duration_minutes: number
          completed: boolean
          session_type: 'focus' | 'break'
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          duration_minutes: number
          completed?: boolean
          session_type?: 'focus' | 'break'
          started_at: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          duration_minutes?: number
          completed?: boolean
          session_type?: 'focus' | 'break'
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
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
  }
}