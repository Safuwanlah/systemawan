'use client';

import { motion } from 'framer-motion';
import React from 'react';

const itemVariants: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'tween', ease: 'easeOut', duration: 0.3 } 
  }
};

export default function StaggerItem({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
