import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Users } from 'lucide-react';

interface TravelerCountStepProps {
  title: string;
  description?: string;
  count: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}

export const TravelerCountStep = ({
  title,
  description,
  count,
  onChange,
  min = 1,
  max = 20,
}: TravelerCountStepProps) => {
  const handleDecrement = () => {
    if (count > min) onChange(count - 1);
  };

  const handleIncrement = () => {
    if (count < max) onChange(count + 1);
  };

  const getTravelerLabel = () => {
    if (count === 1) return 'Solo Adventure';
    if (count === 2) return 'Duo Journey';
    if (count <= 4) return 'Small Group';
    if (count <= 8) return 'Group Trip';
    return 'Large Group';
  };

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

      <Card className="bg-card/50 border-border/50 p-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-12 w-12 text-primary" />
          </div>

          <div className="flex items-center gap-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-border"
              onClick={handleDecrement}
              disabled={count <= min}
            >
              <Minus className="h-5 w-5" />
            </Button>

            <div className="text-center min-w-[100px]">
              <span className="text-5xl font-bold text-foreground">{count}</span>
              <p className="text-sm text-muted-foreground mt-1">
                {count === 1 ? 'Traveler' : 'Travelers'}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-border"
              onClick={handleIncrement}
              disabled={count >= max}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {getTravelerLabel()}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
