import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface TextAreaStepProps {
  title: string;
  description?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export const TextAreaStep = ({
  title,
  description,
  placeholder = 'Type your answer here...',
  value,
  onChange,
  maxLength = 500,
}: TextAreaStepProps) => {
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
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm">Optional but helps us plan better</span>
        </div>
        
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[150px] bg-background/50 border-border resize-none"
          maxLength={maxLength}
        />
        
        <div className="flex justify-end mt-2">
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength} characters
          </span>
        </div>
      </Card>
    </motion.div>
  );
};
