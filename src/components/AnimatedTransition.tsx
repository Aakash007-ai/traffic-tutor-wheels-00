
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type AnimatedTransitionProps = {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  duration?: number;
  animation?: 
    | 'fade'
    | 'slide-up'
    | 'slide-down'
    | 'slide-right'
    | 'scale';
  delay?: number;
};

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  className,
  show = true,
  duration = 300,
  animation = 'fade',
  delay = 0,
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (show) {
      setShouldRender(true);
      timeout = setTimeout(() => {
        let animClass = '';
        switch (animation) {
          case 'fade':
            animClass = 'animate-fade-in';
            break;
          case 'slide-up':
            animClass = 'animate-slide-up';
            break;
          case 'slide-down':
            animClass = 'animate-slide-down';
            break;
          case 'slide-right':
            animClass = 'animate-slide-in-right';
            break;
          case 'scale':
            animClass = 'animate-scale-in';
            break;
          default:
            animClass = 'animate-fade-in';
        }
        setAnimationClass(animClass);
      }, 10); // Small delay to ensure DOM is ready
    } else {
      setAnimationClass('');
      timeout = setTimeout(() => {
        setShouldRender(false);
      }, duration);
    }

    return () => clearTimeout(timeout);
  }, [show, animation, duration]);

  const style = {
    animationDuration: `${duration}ms`,
    animationDelay: delay ? `${delay}ms` : undefined,
  };

  if (!shouldRender) return null;

  return (
    <div className={cn(animationClass, className)} style={style}>
      {children}
    </div>
  );
};

export default AnimatedTransition;
