export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Trip {
  id: string
  title: string
  destination: string
  country: string
  description: string | null
  image_url: string | null
  price: number | null
  duration_days: number
  start_date: string | null
  spots_left: number
  total_spots: number
  rating: number | null
  created_at: string
}

export interface Testimonial {
  id: string
  quote: string
  highlight_word: string | null
  author_name: string
  author_role: string | null
  author_image: string | null
  rating: number
  created_at: string
}

export interface ItineraryItem {
  id: string
  trip_id: string
  day_number: number
  title: string
  description: string | null
  icon: string | null
  image_url: string | null
  gradient: string | null
  created_at: string
}

export interface TravelStory {
  id: string
  title: string
  excerpt: string | null
  category: string | null
  author_name: string
  author_initials: string | null
  author_location: string | null
  image_url: string | null
  read_time: number | null
  published_at: string
  featured: boolean
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: Trip
        Insert: Omit<Trip, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Trip>
        Relationships: []
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Testimonial>
        Relationships: []
      }
      itinerary_items: {
        Row: ItineraryItem
        Insert: Omit<ItineraryItem, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<ItineraryItem>
        Relationships: []
      }
      travel_stories: {
        Row: TravelStory
        Insert: Omit<TravelStory, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<TravelStory>
        Relationships: []
      }
      profiles: {
        Row: Profile
        Insert: Profile
        Update: Partial<Profile>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
