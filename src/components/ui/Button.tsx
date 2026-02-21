import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  className,
  disabled,
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 focus:ring-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
    secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500 border border-slate-600',
    ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-slate-500'
  };
  
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm',
    md: 'px-3 py-2 text-sm sm:px-4 sm:py-2.5',
    lg: 'px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base'
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />}
      {children}
    </button>
  );
}
