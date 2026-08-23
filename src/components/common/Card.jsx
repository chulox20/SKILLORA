import React from 'react';
import { motion } from 'framer-motion';

export function Card({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  onClick,
  ...props
}) {
  return (
    <motion.div
      onClick={onClick}
      className={`
        bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-5
        ${hoverEffect ? 'hover:border-slate-700 hover:shadow-xl hover:shadow-brand-950/20 transition-all duration-300' : ''}
        ${glow ? 'shadow-glow border-brand-500/40' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hoverEffect && onClick ? { y: -3 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
