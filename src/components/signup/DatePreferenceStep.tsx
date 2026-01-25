import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarDays, CalendarRange } from 'lucide-react';
import { format } from 'date-fns';

interface DatePreferenceStepProps {
  title: string;
  description?: string;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  flexibleDates: boolean;
  onFlexibleChange: (flexible: boolean) => void;
}

export const DatePreferenceStep = ({
  title,
  description,
  selectedDate,
  onDateSelect,
  flexibleDates,
  onFlexibleChange,
}: DatePreferenceStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      <Card className="bg-card/50 border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CalendarRange className="h-5 w-5 text-primary" />
            <Label htmlFor="flexible" className="text-foreground font-medium">
              I'm flexible with dates
            </Label>
          </div>
          <Switch
            id="flexible"
            checked={flexibleDates}
            onCheckedChange={onFlexibleChange}
          />
        </div>

        {!flexibleDates && (
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) => date < new Date()}
              className="rounded-md border border-border/50"
            />
          </div>
        )}

        {flexibleDates && (
          <div className="text-center py-8">
            <CalendarDays className="h-16 w-16 text-primary/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No worries! We'll find the best dates for your adventure.
            </p>
          </div>
        )}
      </Card>

      {selectedDate && !flexibleDates && (
        <Card className="bg-primary/5 border-primary/20 p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Preferred Start Date</p>
          <p className="text-lg font-semibold text-foreground">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </Card>
      )}
    </motion.div>
  );
};
