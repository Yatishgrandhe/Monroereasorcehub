'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
  group?: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type: 'single' | 'multiple';
  collapsible?: boolean;
}

interface FilterPanelProps {
  filters: FilterGroup[];
  selectedFilters: { [key: string]: string[] };
  onFilterChange: (filterId: string, values: string[]) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  className
}: FilterPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleFilterToggle = (filterId: string, value: string) => {
    const currentValues = selectedFilters[filterId] || [];
    const filterGroup = filters.find(f => f.id === filterId);

    if (!filterGroup) return;

    let newValues: string[];

    if (filterGroup.type === 'single') {
      newValues = currentValues.includes(value) ? [] : [value];
    } else {
      newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
    }

    onFilterChange(filterId, newValues);
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).reduce((total, values) => total + values.length, 0);
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  return (
    <Card className={cn('p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl sticky top-24', className)}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/10 rounded-lg">
            <Filter className="h-5 w-5 text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Filters</h3>
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Badge variant="primary" size="sm" className="bg-primary-500 text-white border-none">
                  {getActiveFilterCount()}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8 text-xs text-slate-400 hover:text-white hover:bg-white/10">
            Clear
          </Button>
        )}
      </div>

      {filters.some(f => f.options.length > 5) && (
        <div className="mb-8 group">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
            <input
              type="text"
              placeholder="Search filters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filters.map((filterGroup) => {
          const isExpanded = expandedGroups[filterGroup.id] ?? true;
          const selectedValues = selectedFilters[filterGroup.id] || [];
          const filteredOptions = searchQuery
            ? filterGroup.options.filter(option =>
              option.label.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : filterGroup.options;

          if (searchQuery && filteredOptions.length === 0) return null;

          return (
            <div key={filterGroup.id} className="border-b border-white/5 last:border-b-0 pb-2 mb-2">
              <button
                onClick={() => toggleGroup(filterGroup.id)}
                className="flex items-center justify-between w-full text-left py-2 group/btn"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-300 group-hover/btn:text-white transition-colors">
                    {filterGroup.label}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-500 group-hover/btn:text-white transition-colors" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500 group-hover/btn:text-white transition-colors" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1.5 pt-2 pb-4">
                      {(() => {
                        const groupedOptions = filteredOptions.reduce((acc, option) => {
                          const group = option.group || 'General';
                          if (!acc[group]) acc[group] = [];
                          acc[group].push(option);
                          return acc;
                        }, {} as { [key: string]: FilterOption[] });

                        const hasGroups = Object.keys(groupedOptions).length > 1;

                        return Object.entries(groupedOptions).map(([groupName, options]) => (
                          <div key={groupName} className="space-y-1.5">
                            {hasGroups && groupName !== 'General' && (
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1 mt-2">
                                {groupName}
                              </div>
                            )}
                            {options.map((option) => {
                              const isSelected = selectedValues.includes(option.value);
                              return (
                                <label
                                  key={option.id}
                                  className={cn(
                                    "flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl transition-all group/opt",
                                    isSelected ? "bg-primary-500/10 text-primary-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                  )}
                                >
                                  <div className="relative flex items-center">
                                    <input
                                      type={filterGroup.type === 'single' ? 'radio' : 'checkbox'}
                                      name={filterGroup.id}
                                      value={option.value}
                                      checked={isSelected}
                                      onChange={() => handleFilterToggle(filterGroup.id, option.value)}
                                      className="sr-only"
                                    />
                                    <div className={cn(
                                      "w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center",
                                      isSelected ? "bg-primary-500 border-primary-500" : "bg-transparent border-white/20 group-hover/opt:border-white/40",
                                      filterGroup.type === 'single' ? "rounded-full" : "rounded-md"
                                    )}>
                                      {isSelected && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="w-1.5 h-1.5 bg-white rounded-full"
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <span className="flex-1 text-sm font-medium">
                                    {option.label}
                                  </span>
                                  {option.count !== undefined && (
                                    <span className="text-[10px] opacity-60">
                                      {option.count}
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        ));
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
