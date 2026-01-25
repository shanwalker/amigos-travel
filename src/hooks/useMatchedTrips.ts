import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Trip, SurpriseRequest } from '@/integrations/supabase/database.types';

export interface MatchedTrip extends Trip {
  matchScore: number;
  matchReasons: string[];
}

interface MatchCriteria {
  interests: string[];
  activities: string[];
  budget_min: number;
  budget_max: number;
  travel_style?: string;
}

// Calculate how well a trip matches user preferences
const calculateMatchScore = (trip: Trip, criteria: MatchCriteria): { score: number; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];

  // Budget match (0-30 points)
  const tripPrice = trip.price || 0;
  if (tripPrice >= criteria.budget_min && tripPrice <= criteria.budget_max) {
    score += 30;
    reasons.push('Within your budget');
  } else if (tripPrice < criteria.budget_min) {
    score += 20;
    reasons.push('Below budget - great value!');
  } else if (tripPrice <= criteria.budget_max * 1.2) {
    score += 10;
    reasons.push('Slightly above budget');
  }

  // Category/Interest match (0-40 points)
  const tripCategory = (trip.category || '').toLowerCase();
  const tripDesc = (trip.description || '').toLowerCase();
  const tripTitle = trip.title.toLowerCase();
  const combinedTripText = `${tripCategory} ${tripDesc} ${tripTitle}`;

  const interestKeywords: Record<string, string[]> = {
    'adventure': ['adventure', 'trekking', 'hiking', 'rafting', 'safari', 'extreme'],
    'culture': ['culture', 'heritage', 'temple', 'historical', 'museum', 'traditional'],
    'nature': ['nature', 'wildlife', 'forest', 'mountain', 'beach', 'island', 'scenic'],
    'food': ['food', 'culinary', 'cuisine', 'gastronomy', 'cooking', 'street food'],
    'relaxation': ['relax', 'spa', 'wellness', 'peaceful', 'retreat', 'beach'],
    'nightlife': ['nightlife', 'party', 'club', 'bar', 'entertainment'],
    'photography': ['photography', 'scenic', 'landscape', 'viewpoint', 'instagram'],
    'spiritual': ['spiritual', 'meditation', 'yoga', 'temple', 'monastery'],
  };

  let interestMatches = 0;
  const allUserInterests = [...criteria.interests, ...criteria.activities];
  
  allUserInterests.forEach(interest => {
    const normalizedInterest = interest.toLowerCase();
    const keywords = interestKeywords[normalizedInterest] || [normalizedInterest];
    
    if (keywords.some(kw => combinedTripText.includes(kw))) {
      interestMatches++;
    }
  });

  if (allUserInterests.length > 0) {
    const interestScore = Math.min(40, (interestMatches / allUserInterests.length) * 40);
    score += interestScore;
    if (interestMatches > 0) {
      reasons.push(`Matches ${interestMatches} of your interests`);
    }
  }

  // Availability bonus (0-15 points)
  if (trip.spots_left > 0) {
    score += 15;
    if (trip.spots_left <= 3) {
      reasons.push('Limited spots available!');
    }
  }

  // Rating bonus (0-15 points)
  if (trip.rating) {
    score += Math.min(15, trip.rating * 3);
    if (trip.rating >= 4.5) {
      reasons.push('Highly rated by travelers');
    }
  }

  return { score: Math.round(score), reasons };
};

// Hook to get trips matched to a specific surprise request
export const useMatchedTripsForRequest = (request: SurpriseRequest | null) => {
  return useQuery({
    queryKey: ['matched-trips', request?.id],
    queryFn: async () => {
      if (!request) return [];

      // Fetch active trips
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('status', 'active')
        .gt('spots_left', 0);

      if (error) throw error;

      const criteria: MatchCriteria = {
        interests: request.interests_data?.interests || [],
        activities: request.interests_data?.activities || [],
        budget_min: request.budget_min,
        budget_max: request.budget_max,
        travel_style: request.interests_data?.travel_style,
      };

      // Calculate match scores and sort by score
      const matchedTrips: MatchedTrip[] = (trips as Trip[])
        .map(trip => {
          const { score, reasons } = calculateMatchScore(trip, criteria);
          return { ...trip, matchScore: score, matchReasons: reasons };
        })
        .filter(trip => trip.matchScore > 20) // Only include reasonable matches
        .sort((a, b) => b.matchScore - a.matchScore);

      return matchedTrips;
    },
    enabled: !!request,
  });
};

// Hook to get top matched trips for current user's latest surprise request
export const useMyMatchedTrips = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['my-matched-trips', userId],
    queryFn: async () => {
      if (!userId) return { request: null, trips: [] };

      // Get user's latest surprise request
      const { data: requests, error: reqError } = await supabase
        .from('surprise_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (reqError) throw reqError;
      if (!requests || requests.length === 0) return { request: null, trips: [] };

      const request = requests[0] as SurpriseRequest;

      // Fetch active trips
      const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('status', 'active')
        .gt('spots_left', 0);

      if (tripsError) throw tripsError;

      const criteria: MatchCriteria = {
        interests: request.interests_data?.interests || [],
        activities: request.interests_data?.activities || [],
        budget_min: request.budget_min,
        budget_max: request.budget_max,
        travel_style: request.interests_data?.travel_style,
      };

      // Calculate match scores
      const matchedTrips: MatchedTrip[] = (trips as Trip[])
        .map(trip => {
          const { score, reasons } = calculateMatchScore(trip, criteria);
          return { ...trip, matchScore: score, matchReasons: reasons };
        })
        .filter(trip => trip.matchScore > 20)
        .sort((a, b) => b.matchScore - a.matchScore);

      return { request, trips: matchedTrips };
    },
    enabled: !!userId,
  });
};
