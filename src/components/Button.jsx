import React from 'react';
import { motion } from 'framer-motion';
import { useDesignScale } from '../hooks/useDesignScale';

export default function Button({ children, onClick, type = 'button', className = '', ...props }) {
  const { d } = useDesignScale();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        padding: `${d(12)}px ${d(24)}px`,
        fontSize: `${d(16)}px`,
        borderRadius: `${d(8)}px`,
      }}
      className={`bg-blue-600 text-white font-semibold flex items-center justify-center transition-colors hover:bg-blue-700 shadow-md ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
