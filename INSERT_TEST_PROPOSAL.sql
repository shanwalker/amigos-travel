-- Test Proposal Data for Trip Proposal System
-- This creates a sample proposal that you can view in the user dashboard

-- First, let's get a user ID (replace with your actual user ID)
-- You can find your user ID by running: SELECT id, email FROM auth.users;

-- Insert a test proposal
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with an actual user ID from your database
INSERT INTO trip_proposals (
    user_id,
    status,
    title,
    destination_name,
    destination_tagline,
    hero_image_url,
    matched_preferences,
    destination_highlights,
    destination_description,
    booked_experiences,
    departure_date,
    return_date,
    duration_days,
    total_price,
    currency,
    deposit_amount,
    deposit_percentage,
    flexible_payments,
    expiry_date
) VALUES (
    'YOUR_USER_ID_HERE', -- Replace this with actual user ID
    'published',
    'Sarah, LET''S SEND YOU SOMEWHERE AMAZING!',
    'Bali, Indonesia',
    'Paradise awaits - matched to your style and ready to book',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=800&fit=crop',
    '{
        "main_thing": "Relaxation and adventure",
        "vibe": ["Chill", "Adventurous", "Cultural"],
        "travel_style": "Balanced",
        "interests": ["Beaches", "Temples", "Food"]
    }'::jsonb,
    ARRAY[
        'Pristine beaches with crystal-clear waters',
        'Ancient temples and rich cultural heritage',
        'World-class surfing and water sports',
        'Delicious local cuisine and vibrant food scene',
        'Affordable luxury accommodations',
        'Friendly locals and welcoming atmosphere'
    ],
    'Bali is the ultimate tropical paradise that perfectly balances relaxation and adventure. From stunning rice terraces to sacred temples, pristine beaches to vibrant nightlife, this Indonesian gem offers something for every traveler. Experience the warmth of Balinese hospitality, indulge in world-class spa treatments, and explore hidden waterfalls and volcanic landscapes.',
    '[
        {
            "title": "Surfing Lesson at Kuta Beach",
            "description": "Learn to ride the waves with professional instructors at one of Bali''s most famous surf spots. Perfect for beginners!",
            "category": "Adventure",
            "icon": "🏄",
            "image_url": "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&h=600&fit=crop"
        },
        {
            "title": "Ubud Temple & Rice Terrace Tour",
            "description": "Explore the spiritual heart of Bali with visits to ancient temples and the iconic Tegalalang Rice Terraces.",
            "category": "Cultural",
            "icon": "🛕",
            "image_url": "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop"
        },
        {
            "title": "Traditional Balinese Cooking Class",
            "description": "Master the art of Balinese cuisine with a hands-on cooking class in a traditional village setting.",
            "category": "Culinary",
            "icon": "🍜",
            "image_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
        },
        {
            "title": "Sunset at Tanah Lot Temple",
            "description": "Witness a breathtaking sunset at this iconic sea temple, one of Bali''s most photographed landmarks.",
            "category": "Sightseeing",
            "icon": "🌅",
            "image_url": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop"
        },
        {
            "title": "Spa Day at Luxury Resort",
            "description": "Indulge in a full day of pampering with traditional Balinese massage and spa treatments.",
            "category": "Wellness",
            "icon": "💆",
            "image_url": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop"
        },
        {
            "title": "Snorkeling at Nusa Penida",
            "description": "Discover vibrant coral reefs and swim with manta rays at this pristine island paradise.",
            "category": "Adventure",
            "icon": "🤿",
            "image_url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
        }
    ]'::jsonb,
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '37 days',
    7,
    85000,
    'INR',
    21250,
    25,
    true,
    CURRENT_DATE + INTERVAL '14 days'
);

-- Verify the insert
SELECT 
    id,
    title,
    destination_name,
    status,
    total_price,
    created_at
FROM trip_proposals
ORDER BY created_at DESC
LIMIT 1;

-- To find your user ID, run this query:
-- SELECT id, email, full_name FROM profiles;
