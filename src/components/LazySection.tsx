import { useEffect, useRef, useState, ReactNode, memo } from 'react';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  fallback?: ReactNode;
}

/**
 * LazySection - Renders children only when they come into view
 * Uses IntersectionObserver for efficient viewport detection
 */
export const LazySection = memo(({ 
  children, 
  className = '',
  rootMargin = '200px',
  threshold = 0.01,
  fallback = null
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          // Once visible, disconnect observer
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {hasBeenVisible ? children : (
        <div className="min-h-[200px] flex items-center justify-center">
          {fallback || (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}
    </div>
  );
});

LazySection.displayName = 'LazySection';
