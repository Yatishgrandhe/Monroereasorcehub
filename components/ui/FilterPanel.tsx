'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
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
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-secondary-600" />
          <h3 className="text-lg font-semibold text-secondary-900">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="primary" className="ml-2">
              {getActiveFilterCount()}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search within filters */}
      {filters.some(f => f.options.length > 5) && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <Input
              type="text"
              placeholder="Search filters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filters.map((filterGroup) => {
          const isExpanded = expandedGroups[filterGroup.id] ?? true;
          const selectedValues = selectedFilters[filterGroup.id] || [];
          
          // Filter options based on search query
          const filteredOptions = searchQuery 
            ? filterGroup.options.filter(option => 
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : filterGroup.options;
          
          return (
            <div key={filterGroup.id} className="border-b border-secondary-200 last:border-b-0 pb-4 last:pb-0">
              <button
                onClick={() => toggleGroup(filterGroup.id)}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-secondary-900">{filterGroup.label}</span>
                  {selectedValues.length > 0 && (
                    <Badge variant="secondary" size="sm">
                      {selectedValues.length}
                    </Badge>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-secondary-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-secondary-500" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-3">
                  {(() => {
                    // Group options by their group property if they have one
                    const groupedOptions = filteredOptions.reduce((acc, option) => {
                      const group = option.group || 'General';
                      if (!acc[group]) acc[group] = [];
                      acc[group].push(option);
                      return acc;
                    }, {} as { [key: string]: FilterOption[] });

                    const hasGroups = Object.keys(groupedOptions).length > 1;

                    if (!hasGroups) {
                      // No groups, render options normally
                      return filteredOptions.map((option) => {
                        const isSelected = selectedValues.includes(option.value);
                        
                        return (
                          <label
                            key={option.id}
                            className="flex items-center gap-3 cursor-pointer hover:bg-secondary-50 p-2 rounded-lg -m-2"
                          >
                            <input
                              type={filterGroup.type === 'single' ? 'radio' : 'checkbox'}
                              name={filterGroup.id}
                              value={option.value}
                              checked={isSelected}
                              onChange={() => handleFilterToggle(filterGroup.id, option.value)}
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                            />
                            <span className="flex-1 text-sm text-secondary-700">
                              {option.label}
                            </span>
                            {option.count !== undefined && (
                              <span className="text-xs text-secondary-500">
                                ({option.count})
                              </span>
                            )}
                          </label>
                        );
                      });
                    }

                    // Render grouped options
                    return Object.entries(groupedOptions).map(([groupName, options]) => (
                      <div key={groupName} className="space-y-2">
                        {groupName !== 'General' && (
                          <div className="text-xs font-medium text-secondary-500 uppercase tracking-wide px-2">
                            {groupName}
                          </div>
                        )}
                        {options.map((option) => {
                          const isSelected = selectedValues.includes(option.value);
                          
                          return (
                            <label
                              key={option.id}
                              className="flex items-center gap-3 cursor-pointer hover:bg-secondary-50 p-2 rounded-lg -m-2 ml-2"
                            >
                              <input
                                type={filterGroup.type === 'single' ? 'radio' : 'checkbox'}
                                name={filterGroup.id}
                                value={option.value}
                                checked={isSelected}
                                onChange={() => handleFilterToggle(filterGroup.id, option.value)}
                                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                              />
                              <span className="flex-1 text-sm text-secondary-700">
                                {option.label}
                              </span>
                              {option.count !== undefined && (
                                <span className="text-xs text-secondary-500">
                                  ({option.count})
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
