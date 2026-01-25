import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Sparkles } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface QuestionnaireStepProps {
  title: string;
  description?: string;
  options: Option[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  columns?: 2 | 3 | 4;
}

export const QuestionnaireStep = ({
  title,
  description,
  options,
  selectedValues,
  onSelect,
  multiSelect = false,
  columns = 2,
}: QuestionnaireStepProps) => {
  const handleSelect = (value: string) => {
    onSelect(value);
  };

  const isSelected = (value: string) => selectedValues.includes(value);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className="space-y-6">
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
        {multiSelect && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm text-primary font-medium">Select all that apply</span>
          </motion.div>
        )}
      </div>

      <div className={cn('grid gap-3', gridCols[columns])}>
        {options.map((option, index) => (
          <motion.button
            key={option.value}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative group h-auto py-5 px-5 flex flex-col items-start gap-2 text-left transition-all duration-300 rounded-2xl border-2 overflow-hidden',
              isSelected(option.value)
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10'
            )}
            onClick={() => handleSelect(option.value)}
          >
            {/* Selection Indicator */}
            <motion.div
              initial={false}
              animate={{ 
                scale: isSelected(option.value) ? 1 : 0,
                opacity: isSelected(option.value) ? 1 : 0 
              }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
            >
              <Check className="h-3.5 w-3.5 text-primary-foreground" />
            </motion.div>

            {/* Glow Effect on Selection */}
            {isSelected(option.value) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"
              />
            )}

            <div className="flex items-center gap-3 w-full pr-8">
              {option.icon && (
                <motion.div 
                  className={cn(
                    'p-2.5 rounded-xl transition-all duration-300',
                    isSelected(option.value) 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-white/10 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  )}
                  animate={isSelected(option.value) ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {option.icon}
                </motion.div>
              )}
              <span className={cn(
                'font-semibold text-base transition-colors',
                isSelected(option.value) ? 'text-primary' : 'text-foreground'
              )}>
                {option.label}
              </span>
            </div>
            {option.description && (
              <p className={cn(
                'text-sm transition-colors pl-0',
                isSelected(option.value) ? 'text-primary/70' : 'text-muted-foreground'
              )}>
                {option.description}
              </p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
