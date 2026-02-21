import { cn } from '@/utils/cn';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ label, className, ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-all duration-200 text-sm sm:text-base min-h-[100px] sm:min-h-[120px] md:min-h-[150px]',
          className
        )}
        {...props}
      />
    </div>
  );
}
