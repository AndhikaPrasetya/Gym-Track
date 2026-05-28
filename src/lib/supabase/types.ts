export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          height_cm: number | null
          weight_kg: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          height_cm?: number | null
          weight_kg?: number | null
        }
        Update: Partial<{
          username: string | null
          full_name: string | null
          avatar_url: string | null
          height_cm: number | null
          weight_kg: number | null
          updated_at: string
        }>
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          notes: string | null
          started_at: string
          finished_at: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          notes?: string | null
          started_at?: string
          finished_at?: string | null
        }
        Update: {
          name?: string
          notes?: string | null
          started_at?: string
          finished_at?: string | null
        }
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          exercise_name: string
          exercise_body_part: string | null
          exercise_target: string | null
          exercise_gif_url: string | null
          exercise_equipment: string | null
          order_index: number
          notes: string | null
          created_at: string
        }
        Insert: {
          workout_id: string
          exercise_id: string
          exercise_name: string
          exercise_body_part?: string | null
          exercise_target?: string | null
          exercise_gif_url?: string | null
          exercise_equipment?: string | null
          order_index?: number
          notes?: string | null
        }
        Update: {
          order_index?: number
          notes?: string | null
        }
      }
      workout_sets: {
        Row: {
          id: string
          workout_exercise_id: string
          set_number: number
          weight_kg: number | null
          reps: number | null
          duration_seconds: number | null
          distance_meters: number | null
          rpe: number | null
          completed: boolean
          created_at: string
        }
        Insert: {
          workout_exercise_id: string
          set_number: number
          weight_kg?: number | null
          reps?: number | null
          duration_seconds?: number | null
          distance_meters?: number | null
          rpe?: number | null
          completed?: boolean
        }
        Update: {
          weight_kg?: number | null
          reps?: number | null
          duration_seconds?: number | null
          distance_meters?: number | null
          rpe?: number | null
          completed?: boolean
        }
      }
      personal_records: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          exercise_name: string
          weight_kg: number | null
          reps: number | null
          achieved_at: string
          workout_set_id: string | null
        }
        Insert: {
          user_id: string
          exercise_id: string
          exercise_name: string
          weight_kg?: number | null
          reps?: number | null
          achieved_at?: string
          workout_set_id?: string | null
        }
        Update: {
          weight_kg?: number | null
          reps?: number | null
          achieved_at?: string
        }
      }
      body_measurements: {
        Row: {
          id: string
          user_id: string
          weight_kg: number | null
          body_fat_percent: number | null
          chest_cm: number | null
          waist_cm: number | null
          hips_cm: number | null
          bicep_cm: number | null
          thigh_cm: number | null
          measured_at: string
        }
        Insert: {
          user_id: string
          weight_kg?: number | null
          body_fat_percent?: number | null
          chest_cm?: number | null
          waist_cm?: number | null
          hips_cm?: number | null
          bicep_cm?: number | null
          thigh_cm?: number | null
          measured_at?: string
        }
        Update: {
          weight_kg?: number | null
          body_fat_percent?: number | null
          chest_cm?: number | null
          waist_cm?: number | null
          hips_cm?: number | null
          bicep_cm?: number | null
          thigh_cm?: number | null
          measured_at?: string
        }
      }
    }
  }
}
