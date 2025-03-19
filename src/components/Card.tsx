
import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
  glass?: boolean;
  delay?: number;
}

export const Card: React.FC<CardProps> = ({ 
  className, 
  children, 
  interactive = false,
  glass = false,
  delay = 0
}) => {
  return (
    <AnimatedTransition 
      animation="scale" 
      delay={delay} 
      className={cn(
        "rounded-2xl overflow-hidden p-6 subtle-shadow",
        glass && "glass-card",
        interactive && "interactive-card",
        className
      )}
    >
      {children}
    </AnimatedTransition>
  );
};

export default Card;
