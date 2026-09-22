import React from 'react';
import { motion } from 'motion/react';

interface RevealTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  delay?: number;
  duration?: number;
  stagger?: number;
  blur?: boolean;
  once?: boolean;
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  className = '',
  as: Component = 'h2',
  delay = 0.05,
  duration = 0.6,
  stagger = 0.06,
  blur = true,
  once = true,
}) => {
  // Split the text into words
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
      filter: blur ? 'blur(8px)' : 'none',
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9] as const,
      },
    },
  };

  const MotionComponent = motion[Component as keyof typeof motion] as any;

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      className={`inline-flex flex-wrap items-baseline gap-x-[0.3em] ${className}`}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden align-top py-0.5 leading-[1.2]"
        >
          <motion.span
            variants={wordVariants}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
};
