import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowDarkColor?: string;
  glowRadius?: number;
  isPopular?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(19, 111, 151, 0.25)',
  glowDarkColor = 'rgba(56, 189, 248, 0.35)',
  glowRadius = 350,
  isPopular = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePosition(null);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl transition-all duration-300 overflow-hidden ${className}`}
      {...props}
    >
      {/* Outer Glow Border Layer */}
      {isHovered && mousePosition && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(${glowRadius}px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--glow-card-color, ${glowColor}), transparent 60%)`,
          }}
        />
      )}

      {/* Popular Ambient Static Glow (if accent/popular card) */}
      {isPopular && (
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 w-52 h-52 rounded-full bg-gradient-to-br from-[#136f97]/25 to-[#38bdf8]/20 blur-3xl opacity-80 dark:opacity-60"
        />
      )}

      {/* Inner Radial Glow following mouse on background */}
      {isHovered && mousePosition && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-0 opacity-70 dark:opacity-40"
          style={{
            background: `radial-gradient(${glowRadius * 0.8}px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--glow-card-bg, ${glowColor}), transparent 70%)`,
          }}
        />
      )}

      {/* Card Content Container */}
      <div className="relative z-20 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
