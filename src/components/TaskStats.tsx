/**
 * TaskStats Component
 * 
 * Displays task statistics in a visual card format
 */

import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskStatsProps {
  counts: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
  };
}

export function TaskStats({ counts }: TaskStatsProps) {
  const completionRate = counts.total > 0 
    ? Math.round((counts.completed / counts.total) * 100) 
    : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: counts.total,
      icon: ListTodo,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Completed',
      value: counts.completed,
      icon: CheckCircle2,
      color: 'text-status-completed',
      bg: 'bg-status-completed/10',
    },
    {
      label: 'Pending',
      value: counts.pending,
      icon: Clock,
      color: 'text-muted-foreground',
      bg: 'bg-muted',
    },
    {
      label: 'High Priority',
      value: counts.highPriority,
      icon: AlertTriangle,
      color: 'text-priority-high',
      bg: 'bg-priority-high-bg',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "p-4 rounded-xl border bg-card animate-fade-in",
            "hover:shadow-md transition-shadow"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Progress bar for completion rate */}
      <div className="col-span-2 lg:col-span-4 p-4 rounded-xl border bg-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Completion Rate</span>
          <span className="text-sm font-bold text-primary">{completionRate}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-status-completed rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
