import { memo } from 'react';

/**
 * PageLoader - Lightweight loading state for lazy-loaded routes
 */
export const PageLoader = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm font-sans">Loading...</p>
    </div>
  </div>
));

PageLoader.displayName = 'PageLoader';
