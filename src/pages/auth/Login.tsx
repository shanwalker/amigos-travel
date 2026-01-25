import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { 
  getSignupSession, 
  clearSignupSession, 
  prepareForDatabaseInsert,
  getTripTypeLabel 
} from '@/lib/signupSession';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmingUser, setConfirmingUser] = useState(false);
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Function to auto-confirm user via edge function
  const tryAutoConfirm = async (userEmail: string, userPassword: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://whdbtkkgesfgqtkfedne.supabase.co/functions/v1/confirm-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZGJ0a2tnZXNmZ3F0a2ZlZG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTYwODgsImV4cCI6MjA4NDEzMjA4OH0.GeQsaI7LW29-FL1AIm-lMPqduKaWUyRkH_JNEWTBKms',
          },
          body: JSON.stringify({ email: userEmail, password: userPassword }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.session) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
          return true;
        }
        if (data?.confirmed) {
          // Try signing in again
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: userPassword,
          });
          return !signInError;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, isAdmin, navigate, loading]);

  const checkNeedsOnboarding = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('travel_preferences')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) return false;
      if (!data) return true;
      
      const prefs = data?.travel_preferences;
      if (!prefs) return true;
      if (!prefs.completed_at) return true;
      
      return false;
    } catch {
      return false;
    }
  };

  const processSignupSession = async (userId: string) => {
    const sessionData = prepareForDatabaseInsert();
    if (!sessionData) return false;

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
      const getBudgetStyle = (minBudget: number): string => {
        if (minBudget <= 15000) return 'budget_backpacker';
        if (minBudget <= 50000) return 'smart_saver';
        if (minBudget <= 150000) return 'comfort_seeker';
        return 'luxury_lover';
      };

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
          await (supabase as any)
            .from('surprise_requests')
            .insert({
              user_id: userId,
              interests_data: {
                interests: questionnaireAnswers.interests || [],
                activities: questionnaireAnswers.activities || [],
                travel_style: questionnaireAnswers.travel_style || 'solo',
                special_requests: questionnaireAnswers.special_requests || null,
              },
              budget_min: questionnaireAnswers.budget_min || 15000,
              budget_max: questionnaireAnswers.budget_max || 50000,
              preferred_dates: questionnaireAnswers.preferred_dates || null,
              flexible_dates: questionnaireAnswers.flexible_dates ?? true,
              status: 'pending',
            });
          toast({
            title: 'Surprise Trip Request Submitted!',
            description: "We're matching you with the perfect adventure.",
          });
          break;

        case 'custom':
          await (supabase as any)
            .from('custom_trip_requests')
            .insert({
              user_id: userId,
              requirements: {
                destination_ideas: questionnaireAnswers.destination_ideas || [],
                activities: questionnaireAnswers.activities || [],
                accommodation_type: questionnaireAnswers.accommodation_pref || 'mid_range',
                special_requirements: questionnaireAnswers.special_requests || null,
              },
              budget_min: questionnaireAnswers.budget_min || 15000,
              budget_max: questionnaireAnswers.budget_max || 50000,
              num_travelers: questionnaireAnswers.num_travelers || 1,
              preferred_dates: questionnaireAnswers.preferred_dates || null,
              flexible_dates: questionnaireAnswers.flexible_dates ?? true,
              status: 'pending',
            });
          toast({
            title: 'Custom Trip Request Submitted!',
            description: 'Our travel experts will design your perfect itinerary.',
          });
          break;

        case 'group':
          if (questionnaireAnswers.selected_trip_id) {
            await (supabase as any)
              .from('trip_reservations')
              .insert({
                user_id: userId,
                trip_id: questionnaireAnswers.selected_trip_id,
                reservation_fee_paid: false,
                preferred_dates: questionnaireAnswers.preferred_dates ? [questionnaireAnswers.preferred_dates] : null,
                status: 'pending',
              });
            toast({
              title: 'Group Trip Reservation Made!',
              description: 'Your spot is reserved. Complete payment to confirm.',
            });
          }
          break;
      }

      // 4. Clear the signup session
      clearSignupSession();
      return true;
    } catch (error) {
      console.error('Error processing signup session:', error);
      clearSignupSession();
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      // If email not confirmed, try to auto-confirm via edge function
      if (signInError.message?.includes('Email not confirmed')) {
        setConfirmingUser(true);
        setError('');
        
        const confirmed = await tryAutoConfirm(email, password);
        
        if (confirmed) {
          // Successfully confirmed and signed in
          toast({
            title: 'Account Verified!',
            description: 'Your email has been confirmed automatically.',
          });
          setConfirmingUser(false);
          // Continue with the normal flow - the auth state will update
        } else {
          setConfirmingUser(false);
          setError('Your email is not yet confirmed. Please check your inbox for a confirmation link, or contact support.');
          setLoading(false);
          return;
        }
      } else if (signInError.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
        setLoading(false);
        return;
      } else {
        setError(signInError.message);
        setLoading(false);
        return;
      }
    }

    // Get user and check role
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) {
      setError('Authentication failed');
      setLoading(false);
      return;
    }

    // Check for pending signup session and process it
    const hasPendingSession = getSignupSession() !== null;
    if (hasPendingSession) {
      await processSignupSession(currentUser.id);
    }

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.id)
      .eq('role', 'admin')
      .maybeSingle();

    // Redirect based on role
    if (roleData) {
      navigate('/admin', { replace: true });
    } else {
      // Regular user - check if needs onboarding (only if no pending session was processed)
      if (!hasPendingSession) {
        const needsOnboarding = await checkNeedsOnboarding(currentUser.id);
        if (needsOnboarding) {
          navigate('/onboarding', { replace: true });
          return;
        }
      }
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Plane className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your travel dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading || confirmingUser}
              >
                {confirmingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying account...
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don't have an account?{' '}
                <Link to="/get-started" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Get Started
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
