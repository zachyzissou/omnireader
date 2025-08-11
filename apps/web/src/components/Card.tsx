import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div
    className={`bg-white/30 dark:bg-black/30 backdrop-blur-xs rounded-glass p-4 shadow-lg ${className}`}
    role="region"
    aria-label="content card"
  >
    {children}
  </div>
);

export default Card;
