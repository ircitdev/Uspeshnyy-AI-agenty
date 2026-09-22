import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface TextRevealMaskProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  as?: 'p' | 'span' | 'div' | 'h2' | 'h3' | 'h4';
  maskGradient?: boolean;
}

/**
 * TextRevealMask component inspired by 21st.dev/@soralabs/components/text-reveal-mask
 * Masks text and smoothly reveals words or text lines with vertical translation,
 * soft blur clearance, and an optical gradient mask overlay.
 */
export const TextRevealMask: React.FC<TextRevealMaskProps> = ({
  text,
  children,
  className = '',
  delay = 0.1,
  duration = 0.55,
  stagger = 0.025,
  as = 'p',
  maskGradient = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-30px' });

  const Component = motion[as] as any;

  if (text) {
    const words = text.split(' ');

    return (
      <Component
        ref={containerRef}
        className={`relative inline-block ${className}`}
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" className="inline flex-wrap">
          {words.map((word, idx) => (
            <span
              key={idx}
              className="inline-block overflow-hidden align-top mr-[0.26em] last:mr-0 py-[1px]"
            >
              <motion.span
                className="inline-block will-change-transform will-change-[filter,opacity]"
                initial={{
                  y: '105%',
                  opacity: 0,
                  filter: 'blur(4px)',
                }}
                animate={
                  isInView
                    ? {
                        y: '0%',
                        opacity: 1,
                        filter: 'blur(0px)',
                      }
                    : {
                        y: '105%',
                        opacity: 0,
                        filter: 'blur(4px)',
                      }
                }
                transition={{
                  duration,
                  delay: delay + idx * stagger,
                  ease: [0.22, 1, 0.36, 1], // Custom smooth easeOutCubic/Quart
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </span>

        {/* Ambient subtle mask sheen overlay */}
        {maskGradient && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full"
            initial={{ translateX: '-100%' }}
            animate={isInView ? { translateX: '200%' } : { translateX: '-100%' }}
            transition={{
              duration: 1.2,
              delay: delay + 0.15,
              ease: 'easeInOut',
            }}
          />
        )}
      </Component>
    );
  }

  // Fallback for custom children
  return (
    <Component
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      initial={{
        y: 18,
        opacity: 0,
        filter: 'blur(4px)',
      }}
      animate={
        isInView
          ? {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
            }
          : {
              y: 18,
              opacity: 0,
              filter: 'blur(4px)',
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Component>
  );
};
