/**
 * OBSERVER PATTERN
 * 
 * This custom hook implements the Observer Pattern in React.
 * It subscribes to the TaskManager singleton and triggers re-renders
 * whenever tasks are modified, ensuring the UI stays in sync with data.
 * 
 * Benefits:
 * - Decouples UI from data management logic
 * - Automatic synchronization between state and UI
 * - Clean integration with React's state management
 * - Single source of truth for task data
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TaskManager } from '@/lib/task-manager';
import { Task, TaskFormData, FilterType, SortType } from '@/types/task';

export function useTaskManager() {
  // Get the singleton instance
  const manager = useMemo(() => TaskManager.getInstance(), []);
  
  // Local state for filter and sort
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('deadline');
  
  // Trigger re-renders when tasks change
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Subscribe to TaskManager updates (Observer Pattern)
    const unsubscribe = manager.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, [manager]);

  // Memoized task operations
  const createTask = useCallback((data: TaskFormData) => {
    return manager.createTask(data);
  }, [manager]);

  const updateTask = useCallback((id: string, updates: Partial<TaskFormData>) => {
    return manager.updateTask(id, updates);
  }, [manager]);

  const deleteTask = useCallback((id: string) => {
    return manager.deleteTask(id);
  }, [manager]);

  const toggleTaskStatus = useCallback((id: string) => {
    return manager.toggleTaskStatus(id);
  }, [manager]);

  const exportTasks = useCallback(() => {
    manager.exportTasks();
  }, [manager]);

  // Get filtered and sorted tasks
  const tasks = useMemo(() => {
    const filtered = manager.getFilteredTasks(filter);
    return manager.getSortedTasks(filtered, sortBy);
  }, [manager, filter, sortBy, manager.getAllTasks()]);

  const counts = useMemo(() => {
    return manager.getTaskCounts();
  }, [manager, manager.getAllTasks()]);

  return {
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
  };
}
