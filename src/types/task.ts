/**
 * Task type definitions
 * Using TypeScript interfaces for type safety
 */

export type Priority = 'high' | 'medium' | 'low';
export type Status = 'todo' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  deadline: Date | undefined;
  priority: Priority;
}

export type FilterType = 'all' | 'completed' | 'not-completed' | 'high-priority';
export type SortType = 'deadline' | 'priority';
