import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base',
          className
        )}
        {...props}
      />
    </div>
  );
}
