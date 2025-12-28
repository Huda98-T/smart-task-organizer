/**
 * TaskList Component
 * 
 * FR4: Displays all tasks in a list view
 * Renders TaskItem components with proper empty state
 */

import { Task, TaskFormData } from '@/types/task';
import { TaskItem } from './TaskItem';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onUpdate: (id: string, data: Partial<TaskFormData>) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggleStatus, onUpdate, onDelete }: TaskListProps) {
  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No tasks found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Create a new task to get started, or try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TaskItem
            task={task}
            onToggleStatus={onToggleStatus}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
