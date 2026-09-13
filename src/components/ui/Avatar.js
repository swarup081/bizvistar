// src/components/ui/Avatar.js
import { cn } from '@/lib/utils';

export const Avatar = ({ src, alt, fallback, size = 'md', className }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  return (
    <div className={cn("relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200", sizes[size], className)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-gray-500">{fallback || alt?.charAt(0)}</span>
      )}
    </div>
  );
};