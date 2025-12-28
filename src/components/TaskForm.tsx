/**
 * TaskForm Component
 * 
 * Handles creation and editing of tasks.
 * Uses controlled form state with validation.
 */

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { Task, TaskFormData, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  trigger?: React.ReactNode;
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function TaskForm({ task, onSubmit, onCancel, trigger }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>('medium');

  // Initialize form with task data when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDeadline(task.deadline ? new Date(task.deadline) : undefined);
      setPriority(task.priority);
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline(undefined);
    setPriority('medium');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      deadline,
      priority,
    });

    resetForm();
    setOpen(false);
  };

  const handleCancel = () => {
    resetForm();
    setOpen(false);
    onCancel?.();
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Task Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="h-11"
          required
        />
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          className="min-h-[100px] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Deadline Picker */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-11 justify-start text-left font-normal",
                  !deadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? format(deadline, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Priority Select */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger className="h-11 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        option.value === 'high' && "bg-priority-high",
                        option.value === 'medium' && "bg-priority-medium",
                        option.value === 'low' && "bg-priority-low"
                      )}
                    />
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );

  // If we have a custom trigger, use the dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
