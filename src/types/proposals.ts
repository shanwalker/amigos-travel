export interface TripProposal {
    id: string;
    user_id: string;
    quiz_response_id?: string;

    // Status Tracking (NEW)
    status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';
    sent_at?: string;
    viewed_at?: string;
    responded_at?: string;
    response_notes?: string;
    admin_notes?: string;

    // Metadata
    title: string;
    destination_name: string;
    destination_tagline?: string;

    // Hero
    hero_image_url?: string;
    hero_video_url?: string;

    // User Preferences
    matched_preferences?: {
        main_thing?: string;
        vibe?: string[];
        travel_style?: string;
        interests?: string[];
    };

    // Destination
    destination_highlights?: string[];
    destination_description?: string;
    weather_info?: string;
    entry_requirements?: string;
    medical_requirements?: string;
    excluded_places?: string[];

    // Experiences
    booked_experiences?: BookedExperience[];

    // Dates & Logistics
    departure_date?: string;
    return_date?: string;
    duration_days?: number;
    departure_airport?: string;
    return_airport?: string;
    accommodation_details?: string;
    airport_transfer_included?: boolean;

    // Pricing
    total_price: number;
    currency?: string;
    deposit_amount?: number;
    deposit_percentage?: number;
    payment_deadline?: string;
    flexible_payments?: boolean;

    // Destination Reveal
    reveal_destination?: boolean;

    // CTA
    expiry_date?: string;
    reservation_url?: string;

    // Admin
    created_by?: string;

    created_at?: string;
    updated_at?: string;
}

export interface BookedExperience {
    id?: string;
    title: string;
    description: string;
    image_url?: string;
    category?: string;
    icon?: string;
    duration?: string;
    included?: boolean;
}

export interface CreateProposalInput {
    user_id: string;
    quiz_response_id?: string;
    title: string;
    destination_name: string;
    destination_tagline?: string;
    hero_image_url?: string;
    matched_preferences?: TripProposal['matched_preferences'];
    destination_highlights?: string[];
    destination_description?: string;
    booked_experiences?: BookedExperience[];
    departure_date?: string;
    return_date?: string;
    duration_days?: number;
    total_price: number;
    currency?: string;
    deposit_percentage?: number;
    expiry_date?: string;
}

export interface UpdateProposalInput extends Partial<CreateProposalInput> {
    id: string;
    status?: TripProposal['status'];
}
