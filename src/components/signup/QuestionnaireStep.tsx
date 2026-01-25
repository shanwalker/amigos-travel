import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

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
        {multiSelect && (
          <p className="text-sm text-primary mt-2">Select all that apply</p>
        )}
      </div>

      <div className={cn('grid gap-4', gridCols[columns])}>
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant="outline"
            className={cn(
              'h-auto py-4 px-4 flex flex-col items-start gap-2 text-left transition-all duration-200',
              isSelected(option.value)
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5'
            )}
            onClick={() => handleSelect(option.value)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {option.icon && (
                  <div className={cn(
                    'p-2 rounded-lg',
                    isSelected(option.value) ? 'bg-primary/20' : 'bg-muted/30'
                  )}>
                    {option.icon}
                  </div>
                )}
                <span className="font-medium">{option.label}</span>
              </div>
              {isSelected(option.value) && (
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </div>
            {option.description && (
              <p className="text-sm text-muted-foreground pl-0">{option.description}</p>
            )}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
