import React from 'react';
import { motion } from 'framer-motion';
import { ICONS } from '../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth, className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide";
  
  let variantStyle = "";
  if (variant === 'primary') {
    variantStyle = `bg-[#B91C1C] text-white hover:bg-[#991B1B] shadow-sm hover:shadow-md`;
  } else if (variant === 'outline') {
    variantStyle = `border border-gray-300 text-[#1F2937] hover:bg-gray-50 bg-white`;
  } else {
    variantStyle = `text-[#1F2937] hover:bg-gray-100`;
  }

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variantStyle} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;