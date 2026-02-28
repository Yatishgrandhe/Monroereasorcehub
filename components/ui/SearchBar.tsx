'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  loading?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, value, onChange, onClear, placeholder = 'Search...', loading = false, ...props }, ref) => {
    return (
      <div className={cn('relative w-full group', className)}>
        <motion.div
          className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10"
          animate={{ x: value ? 2 : 0 }}
        >
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary-400 transition-colors" />
        </motion.div>

        <input
          type="text"
          className="input pl-12 pr-12 bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 focus:border-primary-500/50 shadow-lg text-white placeholder-slate-400 min-h-[56px] rounded-2xl transition-all"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={ref}
          {...props}
        />

        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-2">
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-8 w-8 p-0 rounded-full hover:bg-white/10 text-slate-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {loading && (
            <div className="mr-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500/20 border-t-primary-500" />
            </div>
          )}
        </div>

        {/* Focus Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-premium rounded-[1.25rem] opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity pointer-events-none" />
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
