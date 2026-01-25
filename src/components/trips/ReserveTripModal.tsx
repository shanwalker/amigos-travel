import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateReservation } from '@/hooks/useReservations';
import { toast } from 'sonner';
import { Users, Calendar, MapPin, Check, Loader2, Sparkles } from 'lucide-react';

import type { Trip } from '@/integrations/supabase/database.types';

interface ReserveTripModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}

export const ReserveTripModal = ({ trip, isOpen, onClose }: ReserveTripModalProps) => {
  const { user } = useAuth();
  const createReservation = useCreateReservation();
  const [spots, setSpots] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const reservedCount = trip.reservation_count || 0;
  const minSpots = trip.min_reservations || 5;
  const spotsNeeded = Math.max(0, minSpots - reservedCount);
  const progress = Math.min(100, (reservedCount / minSpots) * 100);

  const handleReserve = async () => {
    if (!user) {
      toast.error('Please login to reserve a spot');
      return;
    }

    try {
      await createReservation.mutateAsync({
        user_id: user.id,
        trip_id: trip.id,
        reservation_fee_paid: false,
        preferred_dates: null,
        status: 'pending',
      });

      toast.success(
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-green-500" />
          <span>Spot reserved! We'll confirm once the trip is live.</span>
        </div>
      );
      onClose();
    } catch (error) {
      toast.error('Failed to reserve spot. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-foreground">
            Reserve Your Spot
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Show your interest and help this trip happen!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Trip Summary */}
          <div className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
            <div 
              className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url(${trip.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200'})` }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{trip.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {trip.destination}, {trip.country}
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {trip.duration_days} days
                </span>
                <span className="text-primary font-semibold">
                  ₹{trip.price?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trip Progress</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Users className="w-3 h-3 mr-1" />
                {reservedCount}/{minSpots} reserved
              </Badge>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {spotsNeeded > 0 ? (
              <p className="text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 inline mr-1 text-primary" />
                {spotsNeeded} more {spotsNeeded === 1 ? 'reservation' : 'reservations'} needed to confirm this trip!
              </p>
            ) : (
              <p className="text-sm text-green-500 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Trip is confirmed! Limited spots remaining.
              </p>
            )}
          </div>

          {/* Spots Selection */}
          <div className="space-y-2">
            <Label>Number of spots</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSpots(Math.max(1, spots - 1))}
              >
                -
              </Button>
              <span className="text-2xl font-semibold text-foreground w-12 text-center">
                {spots}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSpots(Math.min(10, spots + 1))}
              >
                +
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 99999 99999"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            💡 This is a free reservation. You'll only pay once the trip is confirmed. 
            We'll notify you when it reaches the minimum spots needed.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleReserve}
              disabled={createReservation.isPending}
            >
              {createReservation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reserving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Reserve {spots} {spots === 1 ? 'Spot' : 'Spots'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReserveTripModal;
