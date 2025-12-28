/**
 * TaskItem Component
 * 
 * Displays a single task with actions for completing, editing, and deleting.
 * Uses color-coded priority badges and strikethrough for completed tasks.
 */

import { useState } from 'react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { Check, Trash2, Pencil, Calendar, AlertCircle } from 'lucide-react';
import { Task, TaskFormData, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskForm } from './TaskForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onUpdate: (id: string, data: Partial<TaskFormData>) => void;
  onDelete: (id: string) => void;
}

// Priority badge styling based on design system
const priorityStyles: Record<Priority, string> = {
  high: 'priority-high border',
  medium: 'priority-medium border',
  low: 'priority-low border',
};

const priorityLabels: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function TaskItem({ task, onToggleStatus, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = task.status === 'completed';
  
  // Format deadline with helpful context
  const formatDeadline = () => {
    if (!task.deadline) return null;
    
    const date = new Date(task.deadline);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  const isOverdue = task.deadline && isPast(new Date(task.deadline)) && !isCompleted;
  const deadline = formatDeadline();

  const handleUpdate = (data: TaskFormData) => {
    onUpdate(task.id, data);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl border bg-card transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        isCompleted && "opacity-70"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Completion Checkbox */}
        <button
          onClick={() => onToggleStatus(task.id)}
          className={cn(
            "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
            isCompleted
              ? "bg-status-completed border-status-completed"
              : "border-muted-foreground/40 hover:border-primary hover:bg-primary/5"
          )}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted && <Check className="h-3 w-3 text-primary-foreground" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Title */}
              <h3
                className={cn(
                  "font-semibold text-foreground leading-tight",
                  isCompleted && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>

              {/* Description */}
              {task.description && (
                <p
                  className={cn(
                    "mt-1 text-sm text-muted-foreground line-clamp-2",
                    isCompleted && "line-through"
                  )}
                >
                  {task.description}
                </p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {/* Priority Badge */}
                <Badge
                  variant="outline"
                  className={cn("text-xs font-medium", priorityStyles[task.priority])}
                >
                  {priorityLabels[task.priority]}
                </Badge>

                {/* Deadline */}
                {deadline && (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      isOverdue ? "text-destructive" : "text-muted-foreground"
                    )}
                  >
                    {isOverdue ? (
                      <AlertCircle className="h-3 w-3" />
                    ) : (
                      <Calendar className="h-3 w-3" />
                    )}
                    {deadline}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Edit Button with Form */}
              <TaskForm
                task={task}
                onSubmit={handleUpdate}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />

              {/* Delete Button with Confirmation - FR3 */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{task.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(task.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
