import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface GlassmorphismCtaProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const GlassmorphismCta: React.FC<GlassmorphismCtaProps> = ({
  onClick,
  children = 'Разобрать мой процесс',
  className = '',
  icon = <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.035, y: -2 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
      className={`group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-[0.98rem] text-white cursor-pointer select-none overflow-hidden transition-all duration-300 ${className}`}
      style={{
        // Meng To glassmorphism layered styling
        background: 'linear-gradient(180deg, rgba(21, 123, 164, 0.92) 0%, rgba(19, 111, 151, 0.98) 100%)',
        boxShadow: `
          0 1px 1px 0 rgba(255, 255, 255, 0.6) inset,
          0 2px 8px 0 rgba(255, 255, 255, 0.35) inset,
          0 -2px 6px 0 rgba(0, 0, 0, 0.25) inset,
          0 10px 30px -6px rgba(19, 111, 151, 0.5),
          0 20px 40px -12px rgba(19, 111, 151, 0.35)
        `,
        border: '1px solid rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Ambient glass glow aura behind */}
      <span
        aria-hidden="true"
        className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#38bdf8] via-[#147aa6] to-[#0284c7] opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-500 -z-10"
      />

      {/* Top glossy reflection bevel (Meng To signature glass lens) */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-3 right-3 h-[45%] rounded-full bg-gradient-to-b from-white/45 via-white/15 to-transparent pointer-events-none"
      />

      {/* Shimmer light streak passing across button on hover */}
      <span
        aria-hidden="true"
        className="absolute -inset-full top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] pointer-events-none -translate-x-[200%] group-hover:translate-x-[500%] transition-transform duration-1000 ease-out"
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] font-bold tracking-tight">
        {children}
        {icon && <span className="shrink-0">{icon}</span>}
      </span>
    </motion.button>
  );
};
