/**
 * TaskFilters Component
 * 
 * Provides filter buttons and sort dropdown for task list.
 * FR7: Sort by deadline or priority
 * FR8: Filter by status and priority
 */

import { FilterType, SortType } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowDownAZ, ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  counts: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
  };
}

const filterOptions: { value: FilterType; label: string; countKey: keyof TaskFiltersProps['counts'] }[] = [
  { value: 'all', label: 'All', countKey: 'total' },
  { value: 'not-completed', label: 'To Do', countKey: 'pending' },
  { value: 'completed', label: 'Completed', countKey: 'completed' },
  { value: 'high-priority', label: 'High Priority', countKey: 'highPriority' },
];

const sortOptions: { value: SortType; label: string }[] = [
  { value: 'deadline', label: 'Deadline' },
  { value: 'priority', label: 'Priority' },
];

export function TaskFilters({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  counts,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Filter Buttons - FR8 */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
        <ListFilter className="h-4 w-4 text-muted-foreground ml-2 mr-1" />
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(option.value)}
            className={cn(
              "text-sm font-medium transition-all",
              filter === option.value && "shadow-sm"
            )}
          >
            {option.label}
            <span
              className={cn(
                "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                filter === option.value
                  ? "bg-primary/10 text-primary"
                  : "bg-muted-foreground/10 text-muted-foreground"
              )}
            >
              {counts[option.countKey]}
            </span>
          </Button>
        ))}
      </div>

      {/* Sort Dropdown - FR7 */}
      <div className="flex items-center gap-2">
        <ArrowDownAZ className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortType)}>
          <SelectTrigger className="w-[130px] h-9 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
