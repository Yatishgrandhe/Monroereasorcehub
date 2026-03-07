'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function Reveal({ children, width = 'fit-content', delay = 0.15, className, direction = 'up' }: RevealProps) {

  const hiddenVariations = {
    up: { opacity: 0, y: 30 },
    down: { opacity: 0, y: -30 },
    left: { opacity: 0, x: 30 },
    right: { opacity: 0, x: -30 },
    none: { opacity: 0 }
  };

  return (
    <div className={className} style={{ position: 'relative', width, overflow: 'visible' }}>
      <motion.div
        className={className?.includes('h-full') ? 'h-full' : undefined}
        style={className?.includes('h-full') ? { height: '100%' } : undefined}
        variants={{
          hidden: hiddenVariations[direction],
          visible: { opacity: 1, y: 0, x: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px', amount: 0.1 }}
        transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
