import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  student: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  writer: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  image: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
  social: 'from-red-500/20 to-pink-500/20 border-red-500/30',
};

const iconColors: Record<string, string> = {
  student: 'from-emerald-500 to-teal-500',
  writer: 'from-purple-500 to-pink-500',
  image: 'from-orange-500 to-red-500',
  social: 'from-red-500 to-pink-500',
};

export function ToolCard({ title, description, icon: Icon, category, onClick }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 sm:p-4 md:p-5 bg-gradient-to-br rounded-xl border text-left transition-all duration-300 active:scale-[0.98] hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10 group',
        categoryColors[category] || 'from-blue-500/20 to-indigo-500/20 border-blue-500/30'
      )}
    >
      <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
        <div className={cn(
          'w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
          iconColors[category] || 'from-blue-500 to-indigo-500'
        )}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm sm:text-base group-hover:text-blue-300 transition-colors truncate">
            {title}
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
