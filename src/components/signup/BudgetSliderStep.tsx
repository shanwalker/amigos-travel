import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Wallet, IndianRupee } from 'lucide-react';

interface BudgetSliderStepProps {
  title: string;
  description?: string;
  minBudget: number;
  maxBudget: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const formatCurrency = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value}`;
};

export const BudgetSliderStep = ({
  title,
  description,
  minBudget,
  maxBudget,
  onMinChange,
  onMaxChange,
  min = 5000,
  max = 500000,
  step = 5000,
}: BudgetSliderStepProps) => {
  const handleRangeChange = (values: number[]) => {
    if (values[0] !== minBudget) onMinChange(values[0]);
    if (values[1] !== maxBudget) onMaxChange(values[1]);
  };

  const getBudgetLabel = (budget: number) => {
    if (budget <= 15000) return 'Budget Backpacker';
    if (budget <= 50000) return 'Smart Saver';
    if (budget <= 150000) return 'Comfort Seeker';
    return 'Luxury Lover';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      <Card className="bg-card/50 border-border/50 p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="text-lg font-medium text-foreground">
            {formatCurrency(minBudget)} - {formatCurrency(maxBudget)}
          </span>
        </div>

        <div className="px-4 mb-8">
          <Slider
            value={[minBudget, maxBudget]}
            onValueChange={handleRangeChange}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatCurrency(min)}</span>
          <span>{formatCurrency(max)}</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20 p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Minimum Budget</p>
          <div className="flex items-center justify-center gap-1">
            <IndianRupee className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              {minBudget.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {getBudgetLabel(minBudget)}
          </p>
        </Card>
        <Card className="bg-primary/5 border-primary/20 p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Maximum Budget</p>
          <div className="flex items-center justify-center gap-1">
            <IndianRupee className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              {maxBudget.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {getBudgetLabel(maxBudget)}
          </p>
        </Card>
      </div>
    </motion.div>
  );
};
