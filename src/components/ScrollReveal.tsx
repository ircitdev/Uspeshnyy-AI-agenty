import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'motion/react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.55,
  distance = 28,
  className = '',
  viewportMargin = '-40px',
  once = true,
  ...rest
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, x: 0, scale: 1 };
      case 'down':
        return { opacity: 0, y: -distance, x: 0, scale: 1 };
      case 'left':
        return { opacity: 0, x: distance, y: 0, scale: 1 };
      case 'right':
        return { opacity: 0, x: -distance, y: 0, scale: 1 };
      case 'scale':
        return { opacity: 0, y: 15, scale: 0.94 };
      case 'fade':
      default:
        return { opacity: 0, y: 0, x: 0, scale: 1 };
    }
  };

  const initial = getInitialPosition();

  return (
    <motion.div
      initial={initial}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      viewport={{ once, margin: viewportMargin }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const ScrollRevealGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  viewportMargin?: string;
}> = ({ children, className = '', stagger = 0.08, viewportMargin = '-40px' }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: viewportMargin }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
