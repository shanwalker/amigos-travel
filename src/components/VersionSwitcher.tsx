import { motion } from 'framer-motion';

interface VersionSwitcherProps {
  currentVersion: 'v1' | 'v2';
  onVersionChange: (version: 'v1' | 'v2') => void;
}

export const VersionSwitcher = ({ currentVersion, onVersionChange }: VersionSwitcherProps) => {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-card px-2 py-2 flex items-center gap-1">
        <button
          onClick={() => onVersionChange('v1')}
          className={`relative px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
            currentVersion === 'v1' 
              ? 'text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {currentVersion === 'v1' && (
            <motion.div
              layoutId="version-indicator"
              className="absolute inset-0 bg-primary rounded-lg"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">V1 - Trip Cards</span>
        </button>
        
        <button
          onClick={() => onVersionChange('v2')}
          className={`relative px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
            currentVersion === 'v2' 
              ? 'text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {currentVersion === 'v2' && (
            <motion.div
              layoutId="version-indicator"
              className="absolute inset-0 bg-primary rounded-lg"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">V2 - Search Box</span>
        </button>
      </div>
    </div>
  );
};
