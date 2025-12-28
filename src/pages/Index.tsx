/**
 * Task Manager - Main Page
 * 
 * This application implements the following design patterns:
 * 
 * 1. SINGLETON PATTERN (TaskManager class)
 *    - Single instance manages all task operations
 *    - See: src/lib/task-manager.ts
 * 
 * 2. FACTORY PATTERN (TaskFactory class)
 *    - Creates task objects with consistent structure
 *    - See: src/lib/task-factory.ts
 * 
 * 3. REPOSITORY PATTERN (TaskRepository class)
 *    - Abstracts localStorage data access
 *    - See: src/lib/task-repository.ts
 * 
 * 4. OBSERVER PATTERN (React State + Custom Hook)
 *    - Components subscribe to TaskManager changes
 *    - See: src/hooks/use-task-manager.ts
 */

import { Download, CheckSquare } from 'lucide-react';
import { useTaskManager } from '@/hooks/use-task-manager';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskStats } from '@/components/TaskStats';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const Index = () => {
  const {
    tasks,
    counts,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    exportTasks,
  } = useTaskManager();

  // Handle task creation with toast notification
  const handleCreateTask = (data: Parameters<typeof createTask>[0]) => {
    createTask(data);
    toast.success('Task created successfully!');
  };

  // Handle task update with toast notification
  const handleUpdateTask = (id: string, data: Parameters<typeof updateTask>[1]) => {
    updateTask(id, data);
    toast.success('Task updated successfully!');
  };

  // Handle task deletion with toast notification
  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success('Task deleted successfully!');
  };

  // Handle status toggle with toast notification
  const handleToggleStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    toggleTaskStatus(id);
    if (task) {
      toast.success(
        task.status === 'completed' 
          ? 'Task marked as incomplete' 
          : 'Task completed! 🎉'
      );
    }
  };

  // Handle export with toast notification
  const handleExport = () => {
    exportTasks();
    toast.success('Tasks exported successfully!');
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <CheckSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Task Manager</h1>
                  <p className="text-xs text-muted-foreground">Stay organized, get things done</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* FR11: Export Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="gap-2"
                  disabled={counts.total === 0}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                
                {/* FR1: Create Task Button */}
                <TaskForm onSubmit={handleCreateTask} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container max-w-5xl mx-auto px-4 py-6 space-y-6">
          {/* Stats Section */}
          <section>
            <TaskStats counts={counts} />
          </section>

          {/* Filters Section */}
          <section className="pt-2">
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              counts={counts}
            />
          </section>

          {/* Task List Section - FR4 */}
          <section className="pb-8">
            <TaskList
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/30">
          <div className="container max-w-5xl mx-auto px-4 py-4">
            <p className="text-xs text-center text-muted-foreground">
              Data is automatically saved to your browser's local storage
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
