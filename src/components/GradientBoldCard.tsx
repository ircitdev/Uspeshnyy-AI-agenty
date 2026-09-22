import React from 'react';
import { motion } from 'motion/react';

export interface GradientBoldCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  gradient?: string;
  glowGradient?: string;
  accentColor?: string;
  isHoverable?: boolean;
  id?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * GradientBoldCard Component
 * Based on 21st.dev/@ruixen.ui/components/gradient-bold-card
 * Features a high-contrast multi-stop gradient border, ambient outer glow blur,
 * crisp backdrop container, top specular highlight, and interactive elevation.
 */
export const GradientBoldCard: React.FC<GradientBoldCardProps> = ({
  children,
  className = '',
  innerClassName = '',
  gradient = 'from-[#136f97] via-[#0284c7] to-[#38bdf8]',
  glowGradient = 'from-[#136f97]/40 via-[#0ea5e9]/40 to-[#38bdf8]/40',
  accentColor = '#136f97',
  isHoverable = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={isHoverable ? { y: -5 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group relative rounded-3xl p-[1.5px] transition-all duration-300 ${className}`}
      {...props}
    >
      {/* 1. Outer Ambient Glow (Blurred Gradient Backdrop) */}
      <div
        aria-hidden="true"
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${glowGradient} blur-xl opacity-25 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none -z-10`}
      />

      {/* 2. Bold Gradient Border Container */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* 3. Inner Card Surface with Glassmorphism & Contrast */}
      <div
        className={`relative h-full w-full rounded-[22.5px] bg-white/95 dark:bg-[#0a1b2d]/95 backdrop-blur-xl transition-colors duration-300 flex flex-col justify-between overflow-hidden ${innerClassName}`}
      >
        {/* Top Edge Specular Shimmer Line */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-[#38bdf8]/50 to-transparent pointer-events-none z-10"
        />

        {/* Subtle Ambient Radial Glow in Top Right Corner */}
        <div
          aria-hidden="true"
          className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${gradient} blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}
        />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
