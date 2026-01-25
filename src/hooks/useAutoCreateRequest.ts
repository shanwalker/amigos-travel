import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getSignupSession, clearSignupSession, prepareForDatabaseInsert } from '@/lib/signupSession';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to automatically create trip requests after user signs up and verifies email
 * Call this hook after successful login
 */
export const useAutoCreateRequest = (userId: string | undefined) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const processSignupSession = async () => {
      const sessionData = prepareForDatabaseInsert();
      if (!sessionData) return;

      const { tripType, questionnaireAnswers, profileData, signupContext } = sessionData;

      try {
        // 1. Update profile with additional data
        if (profileData) {
          const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
          await (supabase as any)
            .from('profiles')
            .update({
              full_name: fullName,
              phone: profileData.phone,
            })
            .eq('id', userId);
        }

        // 2. Update travel preferences with questionnaire answers
        const travelPreferences = {
          interests: questionnaireAnswers.interests || [],
          budget_style: getBudgetStyle(questionnaireAnswers.budget_min || 0),
          travel_style: questionnaireAnswers.travel_style || 'solo',
          accommodation_pref: questionnaireAnswers.accommodation_pref || 'mid_range',
          activity_level: questionnaireAnswers.activity_level || 'moderate',
          dietary: [],
          completed_at: new Date().toISOString(),
          signup_trip_type: tripType,
          signup_context: signupContext,
        };

        await (supabase as any)
          .from('profiles')
          .update({ travel_preferences: travelPreferences })
          .eq('id', userId);

        // 3. Create appropriate request based on trip type
        switch (tripType) {
          case 'surprise':
            await createSurpriseRequest(userId, questionnaireAnswers);
            toast({
              title: 'Surprise Trip Request Submitted!',
              description: "We're matching you with the perfect adventure. Check your dashboard for updates.",
            });
            break;

          case 'custom':
            await createCustomRequest(userId, questionnaireAnswers);
            toast({
              title: 'Custom Trip Request Submitted!',
              description: 'Our travel experts will design your perfect itinerary. Check your dashboard for updates.',
            });
            break;

          case 'group':
            if (questionnaireAnswers.selected_trip_id) {
              await createGroupReservation(userId, questionnaireAnswers);
              toast({
                title: 'Group Trip Reservation Made!',
                description: 'Your spot is reserved. Complete payment to confirm your booking.',
              });
            }
            break;

          case 'standard':
          default:
            // Standard trips don't auto-create requests
            break;
        }

        // 4. Clear the signup session
        clearSignupSession();

        // 5. Navigate to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error processing signup session:', error);
        // Still clear session and navigate to prevent loops
        clearSignupSession();
        navigate('/dashboard');
      }
    };

    processSignupSession();
  }, [userId, navigate]);
};

const getBudgetStyle = (minBudget: number): string => {
  if (minBudget <= 15000) return 'budget_backpacker';
  if (minBudget <= 50000) return 'smart_saver';
  if (minBudget <= 150000) return 'comfort_seeker';
  return 'luxury_lover';
};

const createSurpriseRequest = async (userId: string, answers: any) => {
  const { error } = await (supabase as any)
    .from('surprise_requests')
    .insert({
      user_id: userId,
      interests_data: {
        interests: answers.interests || [],
        activities: answers.activities || [],
        travel_style: answers.travel_style || 'solo',
        special_requests: answers.special_requests || null,
      },
      budget_min: answers.budget_min || 15000,
      budget_max: answers.budget_max || 50000,
      preferred_dates: answers.preferred_dates || null,
      flexible_dates: answers.flexible_dates ?? true,
      status: 'pending',
    });

  if (error) throw error;
};

const createCustomRequest = async (userId: string, answers: any) => {
  const { error } = await (supabase as any)
    .from('custom_trip_requests')
    .insert({
      user_id: userId,
      requirements: {
        destination_ideas: answers.destination_ideas || [],
        activities: answers.activities || [],
        accommodation_type: answers.accommodation_pref || 'mid_range',
        special_requirements: answers.special_requests || null,
      },
      budget_min: answers.budget_min || 15000,
      budget_max: answers.budget_max || 50000,
      num_travelers: answers.num_travelers || 1,
      preferred_dates: answers.preferred_dates || null,
      flexible_dates: answers.flexible_dates ?? true,
      status: 'pending',
    });

  if (error) throw error;
};

const createGroupReservation = async (userId: string, answers: any) => {
  const { error } = await (supabase as any)
    .from('trip_reservations')
    .insert({
      user_id: userId,
      trip_id: answers.selected_trip_id,
      reservation_fee_paid: false,
      preferred_dates: answers.preferred_dates ? [answers.preferred_dates] : null,
      status: 'pending',
    });

  if (error) throw error;
};

export default useAutoCreateRequest;
