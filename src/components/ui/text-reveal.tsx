import { motion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  animationType?: 'words' | 'chars';
}

export const TextReveal = ({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.05,
  animationType = 'words',
}: TextRevealProps) => {
  const items = animationType === 'words' ? text.split(' ') : text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: delay },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ perspective: '1000px' }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block origin-bottom"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {item}
          {animationType === 'words' && index < items.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Glowing text effect
interface GlowingTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GlowingText = ({ children, className = '' }: GlowingTextProps) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Glow layer */}
      <span className="absolute inset-0 blur-lg bg-gradient-to-r from-amigo-orange via-amigo-glow to-amigo-orange bg-clip-text text-transparent animate-pulse">
        {children}
      </span>
      {/* Main text */}
      <span className="relative bg-gradient-to-r from-amigo-orange via-amigo-glow to-amigo-orange bg-clip-text text-transparent">
        {children}
      </span>
    </span>
  );
};

// Scramble text effect
interface ScrambleTextProps {
  text: string;
  className?: string;
}

export const ScrambleText = ({ text, className = '' }: ScrambleTextProps) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.03,
          }}
        >
          <motion.span
            animate={{
              content: [
                chars[Math.floor(Math.random() * chars.length)],
                chars[Math.floor(Math.random() * chars.length)],
                chars[Math.floor(Math.random() * chars.length)],
                char,
              ],
            }}
            transition={{
              duration: 0.4,
              delay: index * 0.03,
              times: [0, 0.3, 0.6, 1],
            }}
          >
            {char}
          </motion.span>
        </motion.span>
      ))}
    </motion.span>
  );
};

// Typewriter with cursor
interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export const TypewriterText = ({ text, className = '', speed = 50 }: TypewriterTextProps) => {
  return (
    <motion.span className={`inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.01,
            delay: index * (speed / 1000),
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-0.5 h-[1em] bg-primary ml-0.5 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </motion.span>
  );
};
