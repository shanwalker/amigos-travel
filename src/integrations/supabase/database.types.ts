export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type TripType = 'surprise' | 'group_fixed' | 'group_reservable' | 'standard' | 'custom';
export type TripStatus = 'draft' | 'active' | 'confirmed' | 'completed' | 'cancelled';
export type RequestStatus = 'pending' | 'matched' | 'planning' | 'confirmed' | 'completed' | 'cancelled';
export type ReservationStatus = 'pending' | 'confirmed' | 'refunded' | 'cancelled';

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
  // New fields for trip types
  trip_type: TripType
  category: string | null
  min_budget: number | null
  max_budget: number | null
  is_featured: boolean
  min_reservations: number | null
  reservation_fee: number | null
  reservation_count: number
  status: TripStatus
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

export interface TravelPreferences {
  interests: string[]
  budget_style: 'budget_backpacker' | 'smart_saver' | 'comfort_seeker' | 'luxury_lover'
  travel_style: 'solo' | 'couple' | 'friends' | 'family'
  accommodation_pref: 'hostels' | 'budget_hotels' | 'mid_range' | 'luxury' | 'unique_stays'
  activity_level: 'chill' | 'moderate' | 'active'
  dietary: string[]
  completed_at: string | null
  [key: string]: unknown
}

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  phone: string | null
  bio: string | null
  travel_preferences: TravelPreferences | null
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

// New interfaces for Trip Types System
export interface SurpriseRequest {
  id: string
  user_id: string
  interests_data: {
    interests: string[]
    activities: string[]
    travel_style: string
    special_requests: string | null
  }
  budget_min: number
  budget_max: number
  preferred_dates: string | null
  flexible_dates: boolean
  matched_buddy_id: string | null
  assigned_trip_id: string | null
  status: RequestStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface LocalBuddy {
  id: string
  user_id: string
  location: string
  city: string
  country: string
  bio: string | null
  interests: string[]
  has_vehicle: boolean
  vehicle_type: string | null
  languages: string[]
  is_active: boolean
  is_verified: boolean
  rating: number | null
  total_trips: number
  created_at: string
}

export interface TripReservation {
  id: string
  trip_id: string
  user_id: string
  reservation_fee_paid: boolean
  preferred_dates: string[] | null
  status: ReservationStatus
  created_at: string
  updated_at: string
}

export interface CustomTripRequest {
  id: string
  user_id: string
  requirements: {
    destination_ideas: string[]
    activities: string[]
    accommodation_type: string
    special_requirements: string | null
  }
  budget_min: number
  budget_max: number
  num_travelers: number
  preferred_dates: string | null
  flexible_dates: boolean
  status: RequestStatus
  assigned_trip_id: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: Trip
        Insert: Partial<Omit<Trip, 'id' | 'created_at'>> & { title: string; slug: string; destination: string; country: string; duration_days: number; spots_left: number; total_spots: number }
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
      surprise_requests: {
        Row: SurpriseRequest
        Insert: Omit<SurpriseRequest, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<SurpriseRequest>
        Relationships: []
      }
      local_buddies: {
        Row: LocalBuddy
        Insert: Omit<LocalBuddy, 'id' | 'created_at' | 'total_trips'> & { id?: string; created_at?: string; total_trips?: number }
        Update: Partial<LocalBuddy>
        Relationships: []
      }
      trip_reservations: {
        Row: TripReservation
        Insert: Omit<TripReservation, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<TripReservation>
        Relationships: []
      }
      custom_trip_requests: {
        Row: CustomTripRequest
        Insert: Omit<CustomTripRequest, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<CustomTripRequest>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: 'admin' | 'moderator' | 'user'
      trip_type: TripType
      trip_status: TripStatus
      request_status: RequestStatus
      reservation_status: ReservationStatus
    }
    CompositeTypes: Record<string, never>
  }
}
