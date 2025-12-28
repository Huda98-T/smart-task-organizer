/**
 * FACTORY PATTERN
 * 
 * The Factory Pattern provides an interface for creating objects without
 * specifying their exact classes. Here, TaskFactory creates Task objects
 * with consistent structure and auto-generated metadata.
 * 
 * Benefits:
 * - Encapsulates object creation logic
 * - Ensures all tasks have required fields
 * - Easy to modify task creation in one place
 * - Promotes consistency across the application
 */

import { Task, TaskFormData } from '@/types/task';

export class TaskFactory {
  /**
   * Creates a new Task object with auto-generated ID and timestamps
   * @param data - The form data for the task
   * @returns A complete Task object ready for storage
   */
  static createTask(data: TaskFormData): Task {
    const now = new Date().toISOString();
    
    return {
      id: this.generateId(),
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline ? data.deadline.toISOString() : '',
      priority: data.priority,
      status: 'todo', // FR5: Default status is "ToDo"
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Updates an existing task with new data
   * @param existingTask - The task to update
   * @param updates - Partial updates to apply
   * @returns Updated Task object
   */
  static updateTask(existingTask: Task, updates: Partial<TaskFormData>): Task {
    return {
      ...existingTask,
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: updates.description.trim() }),
      ...(updates.deadline !== undefined && { deadline: updates.deadline ? updates.deadline.toISOString() : '' }),
      ...(updates.priority !== undefined && { priority: updates.priority }),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generates a unique ID for tasks
   * Uses timestamp + random string for uniqueness
   */
  private static generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
