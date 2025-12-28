/**
 * SINGLETON PATTERN
 * 
 * The Singleton Pattern ensures only one instance of TaskManager exists
 * throughout the application. This centralizes all task operations and
 * provides a single source of truth for task management.
 * 
 * Benefits:
 * - Single point of access for all task operations
 * - Prevents multiple instances from causing data conflicts
 * - Easy to manage application-wide state
 * - Coordinates between Factory and Repository patterns
 */

import { Task, TaskFormData, FilterType, SortType, Priority } from '@/types/task';
import { TaskFactory } from './task-factory';
import { TaskRepository } from './task-repository';

// Priority weight for sorting (higher number = higher priority)
const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export class TaskManager {
  private static instance: TaskManager | null = null;
  private tasks: Task[] = [];
  private listeners: Set<() => void> = new Set();

  /**
   * Private constructor prevents direct instantiation
   * Use TaskManager.getInstance() instead
   */
  private constructor() {
    // FR10: Load tasks from localStorage on initialization
    this.tasks = TaskRepository.getAll();
  }

  /**
   * Gets the singleton instance of TaskManager
   * Creates a new instance if one doesn't exist
   */
  static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

  /**
   * OBSERVER PATTERN INTEGRATION
   * Subscribes a listener to be notified of task changes
   * Used by React components to trigger re-renders
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notifies all subscribed listeners of changes
   * This triggers React state updates
   */
  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Persists current tasks and notifies listeners
   * Called after any modification
   */
  private persist(): void {
    // FR9: Auto-save to localStorage whenever changes occur
    TaskRepository.saveAll(this.tasks);
    this.notify();
  }

  /**
   * Gets all tasks
   */
  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  /**
   * FR1: Creates a new task
   */
  createTask(data: TaskFormData): Task {
    const task = TaskFactory.createTask(data);
    this.tasks.push(task);
    this.persist();
    return task;
  }

  /**
   * FR2: Updates an existing task
   */
  updateTask(id: string, updates: Partial<TaskFormData>): Task | null {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updatedTask = TaskFactory.updateTask(this.tasks[index], updates);
    this.tasks[index] = updatedTask;
    this.persist();
    return updatedTask;
  }

  /**
   * FR3: Deletes a task
   */
  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    this.persist();
    return true;
  }

  /**
   * FR6: Toggles task completion status
   */
  toggleTaskStatus(id: string): Task | null {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.tasks[index] = {
      ...this.tasks[index],
      status: this.tasks[index].status === 'completed' ? 'todo' : 'completed',
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.tasks[index];
  }

  /**
   * FR8: Filters tasks based on criteria
   */
  getFilteredTasks(filter: FilterType): Task[] {
    switch (filter) {
      case 'completed':
        return this.tasks.filter(t => t.status === 'completed');
      case 'not-completed':
        return this.tasks.filter(t => t.status === 'todo');
      case 'high-priority':
        return this.tasks.filter(t => t.priority === 'high');
      default:
        return [...this.tasks];
    }
  }

  /**
   * FR7: Sorts tasks by deadline or priority
   */
  getSortedTasks(tasks: Task[], sortBy: SortType): Task[] {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'deadline') {
        // Tasks without deadlines go to the end
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else {
        // Sort by priority (high to low)
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }
    });
  }

  /**
   * Gets task counts for UI display
   */
  getTaskCounts(): { total: number; completed: number; pending: number; highPriority: number } {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.status === 'completed').length,
      pending: this.tasks.filter(t => t.status === 'todo').length,
      highPriority: this.tasks.filter(t => t.priority === 'high').length,
    };
  }

  /**
   * FR11: Exports tasks to file
   */
  exportTasks(): void {
    TaskRepository.exportToFile();
  }
}
