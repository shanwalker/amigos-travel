import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Users, 
  Compass, 
  Map, 
  Calendar, 
  CheckCircle2,
  Clock,
  Plane
} from 'lucide-react';
import { format } from 'date-fns';
import { getTripTypeLabel } from '@/lib/signupSession';

interface UserJourneyCardProps {
  travelPreferences: {
    signup_trip_type?: string;
    signup_context?: {
      trip_type?: string;
      source_page?: string;
      questionnaire_completed_at?: string;
    };
    interests?: string[];
    budget_style?: string;
    travel_style?: string;
    accommodation_pref?: string;
    activity_level?: string;
    completed_at?: string;
  } | null;
  createdAt: string;
}

const BUDGET_LABELS: Record<string, string> = {
  budget_backpacker: 'Budget Backpacker',
  smart_saver: 'Smart Saver',
  comfort_seeker: 'Comfort Seeker',
  luxury_lover: 'Luxury Lover',
};

const TRAVEL_STYLE_LABELS: Record<string, string> = {
  solo: 'Solo Explorer',
  couple: 'Couple/Partner',
  friends: 'Friends Group',
  family: 'Family',
};

export const UserJourneyCard = ({ travelPreferences, createdAt }: UserJourneyCardProps) => {
  if (!travelPreferences) {
    return (
      <Card className="bg-muted/20 border-border/50">
        <CardContent className="py-8 text-center text-muted-foreground">
          <Plane className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No signup journey data available</p>
        </CardContent>
      </Card>
    );
  }

  const signupTripType = travelPreferences.signup_trip_type;
  const signupContext = travelPreferences.signup_context;

  const getTripTypeIcon = (type: string) => {
    switch (type) {
      case 'surprise': return <Sparkles className="h-5 w-5 text-purple-400" />;
      case 'group': return <Users className="h-5 w-5 text-blue-400" />;
      case 'custom': return <Compass className="h-5 w-5 text-orange-400" />;
      case 'standard': return <Map className="h-5 w-5 text-green-400" />;
      default: return <Plane className="h-5 w-5 text-primary" />;
    }
  };

  const getTripTypeColor = (type: string) => {
    switch (type) {
      case 'surprise': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'group': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'custom': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'standard': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <Card className="bg-muted/20 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Signup Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Entry Point */}
        {signupTripType && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
            <div className="p-2 rounded-lg bg-card">
              {getTripTypeIcon(signupTripType)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Initial Interest</p>
              <p className="font-medium">{getTripTypeLabel(signupTripType as any) || signupTripType}</p>
            </div>
            <Badge variant="outline" className={getTripTypeColor(signupTripType)}>
              Entry Point
            </Badge>
          </div>
        )}

        {/* Timeline */}
        <div className="relative pl-6 border-l-2 border-border/50 space-y-4">
          {/* Account Created */}
          <div className="relative">
            <div className="absolute -left-[1.65rem] w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-3 w-3 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">Account Created</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>

          {/* Questionnaire Completed */}
          {signupContext?.questionnaire_completed_at && (
            <div className="relative">
              <div className="absolute -left-[1.65rem] w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Questionnaire Completed</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(signupContext.questionnaire_completed_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          )}

          {/* Preferences Saved */}
          {travelPreferences.completed_at && (
            <div className="relative">
              <div className="absolute -left-[1.65rem] w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Preferences Saved</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(travelPreferences.completed_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Questionnaire Answers */}
        {(travelPreferences.interests?.length || travelPreferences.budget_style || travelPreferences.travel_style) && (
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm font-medium mb-3">Questionnaire Answers</p>
            
            <div className="grid grid-cols-2 gap-3">
              {travelPreferences.budget_style && (
                <div className="p-2 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Budget Style</p>
                  <p className="text-sm font-medium">
                    {BUDGET_LABELS[travelPreferences.budget_style] || travelPreferences.budget_style}
                  </p>
                </div>
              )}
              
              {travelPreferences.travel_style && (
                <div className="p-2 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Travel Style</p>
                  <p className="text-sm font-medium">
                    {TRAVEL_STYLE_LABELS[travelPreferences.travel_style] || travelPreferences.travel_style}
                  </p>
                </div>
              )}
              
              {travelPreferences.accommodation_pref && (
                <div className="p-2 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Accommodation</p>
                  <p className="text-sm font-medium capitalize">
                    {travelPreferences.accommodation_pref.replace(/_/g, ' ')}
                  </p>
                </div>
              )}
              
              {travelPreferences.activity_level && (
                <div className="p-2 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Activity Level</p>
                  <p className="text-sm font-medium capitalize">{travelPreferences.activity_level}</p>
                </div>
              )}
            </div>

            {travelPreferences.interests && travelPreferences.interests.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {travelPreferences.interests.map((interest) => (
                    <Badge 
                      key={interest} 
                      variant="outline" 
                      className="text-xs bg-primary/10 text-primary border-primary/30"
                    >
                      {interest.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Source Page */}
        {signupContext?.source_page && (
          <div className="text-xs text-muted-foreground">
            Source: <span className="font-mono">{signupContext.source_page}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserJourneyCard;
