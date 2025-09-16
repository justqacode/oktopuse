import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className,
  ...props
}: AnimatedButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-accent/30 text-foreground hover:bg-accent/10',
    ghost: 'text-foreground hover:bg-muted',
  };

  const sizeStyles = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        'group relative overflow-hidden',
        className
      )}
      {...props}
    >
      <span className='relative z-10 flex items-center gap-2'>
        {icon && iconPosition === 'left' && (
          <span className='transition-transform duration-300 group-hover:-translate-x-0.5'>
            {icon}
          </span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className='transition-transform duration-300 group-hover:translate-x-0.5'>
            {icon}
          </span>
        )}
      </span>
      <span className='absolute inset-0 z-0 bg-white/10 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out'></span>
    </button>
  );
};

export default AnimatedButton;
