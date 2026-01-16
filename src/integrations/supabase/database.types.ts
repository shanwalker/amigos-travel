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
  slug: string
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
  email: string | null
  avatar_url: string | null
  phone: string | null
  bio: string | null
  travel_preferences: Json | null
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'moderator' | 'user'
}

export interface Booking {
  id: string
  user_id: string
  trip_id: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  num_travelers: number
  total_amount: number | null
  payment_status: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
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
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
        Relationships: []
      }
      user_roles: {
        Row: UserRole
        Insert: Omit<UserRole, 'id'> & { id?: string }
        Update: Partial<UserRole>
        Relationships: []
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Booking>
        Relationships: []
      }
      newsletter_subscribers: {
        Row: NewsletterSubscriber
        Insert: Omit<NewsletterSubscriber, 'id' | 'subscribed_at'> & { id?: string; subscribed_at?: string }
        Update: Partial<NewsletterSubscriber>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      app_role: 'admin' | 'moderator' | 'user'
    }
    CompositeTypes: Record<string, never>
  }
}