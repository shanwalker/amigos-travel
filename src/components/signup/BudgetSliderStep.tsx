import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Wallet, IndianRupee, Sparkles, TrendingUp } from 'lucide-react';

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
    if (budget <= 15000) return { label: 'Budget Backpacker', emoji: '🎒', color: 'text-green-400' };
    if (budget <= 50000) return { label: 'Smart Saver', emoji: '💡', color: 'text-blue-400' };
    if (budget <= 150000) return { label: 'Comfort Seeker', emoji: '✨', color: 'text-purple-400' };
    return { label: 'Luxury Lover', emoji: '👑', color: 'text-amber-400' };
  };

  const budgetStyle = getBudgetLabel((minBudget + maxBudget) / 2);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Main Budget Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/10 to-primary/20 rounded-3xl blur-xl" />
        
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          {/* Budget Range Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div 
              className="p-3 rounded-xl bg-primary/20"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wallet className="h-6 w-6 text-primary" />
            </motion.div>
            <div className="text-center">
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-foreground"
                key={`${minBudget}-${maxBudget}`}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {formatCurrency(minBudget)} - {formatCurrency(maxBudget)}
              </motion.div>
              <p className="text-sm text-muted-foreground mt-1">per person</p>
            </div>
          </div>

          {/* Slider */}
          <div className="px-4 mb-6">
            <Slider
              value={[minBudget, maxBudget]}
              onValueChange={handleRangeChange}
              min={min}
              max={max}
              step={step}
              className="w-full"
            />
          </div>

          {/* Range Labels */}
          <div className="flex justify-between text-sm text-muted-foreground px-4">
            <span>{formatCurrency(min)}</span>
            <span>{formatCurrency(max)}</span>
          </div>
        </div>
      </motion.div>

      {/* Budget Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Minimum</p>
            <div className="flex items-center justify-center gap-1 mb-1">
              <IndianRupee className="h-5 w-5 text-green-400" />
              <motion.span 
                className="text-2xl font-bold text-foreground"
                key={minBudget}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {minBudget.toLocaleString()}
              </motion.span>
            </div>
            <p className="text-xs text-green-400">
              {getBudgetLabel(minBudget).emoji} {getBudgetLabel(minBudget).label}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Maximum</p>
            <div className="flex items-center justify-center gap-1 mb-1">
              <IndianRupee className="h-5 w-5 text-purple-400" />
              <motion.span 
                className="text-2xl font-bold text-foreground"
                key={maxBudget}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {maxBudget.toLocaleString()}
              </motion.span>
            </div>
            <p className="text-xs text-purple-400">
              {getBudgetLabel(maxBudget).emoji} {getBudgetLabel(maxBudget).label}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Budget Style Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10"
      >
        <TrendingUp className={`h-4 w-4 ${budgetStyle.color}`} />
        <span className="text-sm text-muted-foreground">
          Your style: <span className={`font-semibold ${budgetStyle.color}`}>{budgetStyle.emoji} {budgetStyle.label}</span>
        </span>
      </motion.div>
    </div>
  );
};
