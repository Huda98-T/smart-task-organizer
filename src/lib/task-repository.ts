/**
 * REPOSITORY PATTERN
 * 
 * The Repository Pattern abstracts the data layer, providing a clean API
 * for data operations. It separates the business logic from data access,
 * making the code more maintainable and testable.
 * 
 * Benefits:
 * - Centralizes data access logic
 * - Makes it easy to switch storage mechanisms (e.g., from localStorage to API)
 * - Provides consistent data access interface
 * - Enables caching and optimization
 */

import { Task } from '@/types/task';

const STORAGE_KEY = 'task_manager_tasks';

export class TaskRepository {
  /**
   * FR10: Loads all tasks from localStorage on app start
   * @returns Array of Task objects, empty array if none exist
   */
  static getAll(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const tasks = JSON.parse(data) as Task[];
      // Validate that we have an array
      return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  }

  /**
   * FR9: Saves all tasks to localStorage
   * @param tasks - Array of tasks to persist
   */
  static saveAll(tasks: Task[]): void {
    try {
      // Store as readable JSON format as per requirements
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks, null, 2));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  /**
   * Retrieves a single task by ID
   * @param id - The task ID to find
   * @returns The task if found, undefined otherwise
   */
  static getById(id: string): Task | undefined {
    const tasks = this.getAll();
    return tasks.find(task => task.id === id);
  }

  /**
   * Adds a new task to storage
   * @param task - The task to add
   */
  static add(task: Task): void {
    const tasks = this.getAll();
    tasks.push(task);
    this.saveAll(tasks);
  }

  /**
   * Updates an existing task in storage
   * @param updatedTask - The task with updated values
   */
  static update(updatedTask: Task): void {
    const tasks = this.getAll();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveAll(tasks);
    }
  }

  /**
   * Removes a task from storage
   * @param id - The ID of the task to remove
   */
  static delete(id: string): void {
    const tasks = this.getAll();
    const filtered = tasks.filter(t => t.id !== id);
    this.saveAll(filtered);
  }

  /**
   * FR11: Exports all tasks to a downloadable text file
   * Formats tasks in a human-readable format
   */
  static exportToFile(): void {
    const tasks = this.getAll();
    
    const content = tasks.map(task => {
      const deadline = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline';
      return `
═══════════════════════════════════════
Title: ${task.title}
Description: ${task.description || 'No description'}
Priority: ${task.priority.toUpperCase()}
Status: ${task.status === 'completed' ? '✓ Completed' : '○ To Do'}
Deadline: ${deadline}
Created: ${new Date(task.createdAt).toLocaleString()}
═══════════════════════════════════════`;
    }).join('\n');

    const header = `
╔═══════════════════════════════════════╗
║         TASK MANAGER EXPORT           ║
║     ${new Date().toLocaleDateString()}                        ║
╚═══════════════════════════════════════╝

Total Tasks: ${tasks.length}
Completed: ${tasks.filter(t => t.status === 'completed').length}
Pending: ${tasks.filter(t => t.status === 'todo').length}
`;

    const blob = new Blob([header + content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_export_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
