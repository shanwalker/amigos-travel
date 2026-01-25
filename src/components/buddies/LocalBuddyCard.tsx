import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { LocalBuddy } from '@/integrations/supabase/database.types';
import { 
  MapPin, Star, CheckCircle2, Globe, Car, MessageCircle,
  Shield
} from 'lucide-react';

interface LocalBuddyCardProps {
  buddy: LocalBuddy;
  onContact?: (buddy: LocalBuddy) => void;
  showAdminControls?: boolean;
  onVerify?: (buddy: LocalBuddy) => void;
  onDeactivate?: (buddy: LocalBuddy) => void;
}

export const LocalBuddyCard = ({ 
  buddy, 
  onContact,
  showAdminControls,
  onVerify,
  onDeactivate
}: LocalBuddyCardProps) => {
  const initials = buddy.city.slice(0, 2).toUpperCase();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 h-full">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${buddy.id}`} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  Local Buddy
                </h3>
                {buddy.is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{buddy.city}, {buddy.country}</span>
              </div>
              
              {buddy.rating && buddy.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-foreground">{buddy.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({buddy.total_trips} trips)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {buddy.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {buddy.bio}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Languages */}
            <Badge variant="outline" className="text-xs gap-1">
              <Globe className="w-3 h-3" />
              {buddy.languages?.slice(0, 2).join(', ')}
              {(buddy.languages?.length || 0) > 2 && ` +${buddy.languages!.length - 2}`}
            </Badge>
            
            {/* Vehicle */}
            {buddy.has_vehicle && (
              <Badge variant="outline" className="text-xs gap-1 border-green-500/30 text-green-500">
                <Car className="w-3 h-3" />
                {buddy.vehicle_type || 'Vehicle'}
              </Badge>
            )}
          </div>

          {/* Interests */}
          {buddy.interests && buddy.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {buddy.interests.slice(0, 4).map(interest => (
                <Badge 
                  key={interest} 
                  variant="secondary" 
                  className="text-xs capitalize bg-primary/10 text-primary border-0"
                >
                  {interest}
                </Badge>
              ))}
              {buddy.interests.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{buddy.interests.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Status Badges for Admin */}
          {showAdminControls && (
            <div className="flex gap-2 mb-4">
              <Badge 
                variant={buddy.is_verified ? 'default' : 'outline'}
                className={buddy.is_verified ? 'bg-green-500' : 'border-yellow-500 text-yellow-500'}
              >
                {buddy.is_verified ? 'Verified' : 'Pending Review'}
              </Badge>
              <Badge 
                variant={buddy.is_active ? 'default' : 'outline'}
                className={buddy.is_active ? 'bg-blue-500' : 'border-red-500 text-red-500'}
              >
                {buddy.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          )}

          {/* Actions */}
          {showAdminControls ? (
            <div className="flex gap-2">
              {!buddy.is_verified && (
                <Button 
                  size="sm" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => onVerify?.(buddy)}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Verify
                </Button>
              )}
              <Button 
                size="sm" 
                variant={buddy.is_active ? 'destructive' : 'default'}
                className="flex-1"
                onClick={() => onDeactivate?.(buddy)}
              >
                {buddy.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => onContact?.(buddy)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LocalBuddyCard;
