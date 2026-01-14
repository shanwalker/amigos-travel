import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorSpotlightProps {
  children: React.ReactNode;
}

export const CursorSpotlight = ({ children }: CursorSpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Motion values for smooth cursor following
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for smooth, lagging follow effect
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Trail dots with different delays
  const trail1X = useSpring(cursorX, { damping: 30, stiffness: 100, mass: 0.8 });
  const trail1Y = useSpring(cursorY, { damping: 30, stiffness: 100, mass: 0.8 });
  const trail2X = useSpring(cursorX, { damping: 35, stiffness: 80, mass: 1 });
  const trail2Y = useSpring(cursorY, { damping: 35, stiffness: 80, mass: 1 });
  const trail3X = useSpring(cursorX, { damping: 40, stiffness: 60, mass: 1.2 });
  const trail3Y = useSpring(cursorY, { damping: 40, stiffness: 60, mass: 1.2 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        cursorX.set(e.clientX - rect.left);
        cursorY.set(e.clientY - rect.top);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovering(true));
      container.addEventListener('mouseleave', () => setIsHovering(false));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', () => setIsHovering(true));
        container.removeEventListener('mouseleave', () => setIsHovering(false));
      }
    };
  }, [cursorX, cursorY]);

  return (
    <div ref={containerRef} className="relative cursor-none">
      {children}
      
      {/* Main cursor glow */}
      <motion.div
        className="pointer-events-none fixed z-50 mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1 : 0,
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-8 rounded-full bg-gradient-radial from-amigo-orange/30 via-amigo-orange/10 to-transparent blur-xl" />
          
          {/* Main cursor dot */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 rounded-full bg-gradient-to-br from-amigo-orange to-amigo-glow shadow-[0_0_20px_rgba(255,180,0,0.6)]"
          />
        </motion.div>
      </motion.div>

      {/* Trail dot 1 */}
      <motion.div
        className="pointer-events-none fixed z-40"
        style={{
          x: trail1X,
          y: trail1Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{ opacity: isHovering ? 0.6 : 0 }}
          className="w-2 h-2 rounded-full bg-amigo-orange/60"
        />
      </motion.div>

      {/* Trail dot 2 */}
      <motion.div
        className="pointer-events-none fixed z-40"
        style={{
          x: trail2X,
          y: trail2Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{ opacity: isHovering ? 0.4 : 0 }}
          className="w-1.5 h-1.5 rounded-full bg-amigo-orange/40"
        />
      </motion.div>

      {/* Trail dot 3 */}
      <motion.div
        className="pointer-events-none fixed z-40"
        style={{
          x: trail3X,
          y: trail3Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{ opacity: isHovering ? 0.2 : 0 }}
          className="w-1 h-1 rounded-full bg-amigo-orange/20"
        />
      </motion.div>

      {/* Spotlight reveal effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: `radial-gradient(600px circle at ${cursorXSpring.get()}px ${cursorYSpring.get()}px, transparent 0%, rgba(0,0,0,0.03) 100%)`,
        }}
      />
    </div>
  );
};

// Mask reveal text effect
interface MaskRevealTextProps {
  children: React.ReactNode;
  revealText?: React.ReactNode;
  className?: string;
}

export const MaskRevealText = ({ children, revealText, className = '' }: MaskRevealTextProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const size = isHovered ? 300 : 40;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden reveal layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-primary font-luxury"
        animate={{
          WebkitMaskPosition: `${mousePosition.x - size / 2}px ${mousePosition.y - size / 2}px`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
        style={{
          WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'50\' fill=\'white\'/%3E%3C/svg%3E")',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        {revealText || children}
      </motion.div>
      
      {/* Visible base layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
