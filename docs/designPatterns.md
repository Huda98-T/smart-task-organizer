# Design Patterns Implementation

This document outlines the design patterns implemented in the Task Management Application. These patterns were chosen to ensure scalability, maintainability, and clear separation of concerns.

## 1. Singleton Pattern

**Implementation:** `src/lib/task-manager.ts` (`TaskManager` class)

The Singleton pattern ensures that a class has only one instance and provides a global point of access to it.

-   **Why it was chosen:**
    -   We need a single source of truth for the application state (tasks list).
    -   It prevents race conditions and data inconsistencies that could arise from multiple state managers.
    -   It simplifies access to the task management logic from any component.

-   **Key Code:**
    ```typescript
    export class TaskManager {
      private static instance: TaskManager | null = null;
      // ...
      static getInstance(): TaskManager {
        if (!TaskManager.instance) {
          TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
      }
    }
    ```

## 2. Factory Pattern

**Implementation:** `src/lib/task-factory.ts` (`TaskFactory` class)

The Factory pattern defines an interface for creating objects but lets subclasses or helper methods decide which class to instantiate (or how to construct it).

-   **Why it was chosen:**
    -   To encapsulate the logic of creating complex `Task` objects.
    -   To ensure consistency in task creation (e.g., generating unique IDs, setting default status to 'todo', adding timestamps).
    -   To separate the creation logic from the business logic in `TaskManager`.

-   **Key Code:**
    ```typescript
    export class TaskFactory {
      static createTask(data: TaskFormData): Task {
        return {
          id: this.generateId(),
          // ... defaults and mapping
          status: 'todo',
          createdAt: new Date().toISOString(),
          // ...
        };
      }
    }
    ```

## 3. Repository Pattern

**Implementation:** `src/lib/task-repository.ts` (`TaskRepository` class)

The Repository pattern mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.

-   **Why it was chosen:**
    -   To abstract the data persistence mechanism (`localStorage`) from the business logic.
    -   To allow for easy swapping of the storage backend (e.g., to a REST API or database) without changing the core application logic.
    -   To centralize data access code, making it easier to test and maintain.

-   **Key Code:**
    ```typescript
    export class TaskRepository {
      static getAll(): Task[] { /* ... read from localStorage ... */ }
      static saveAll(tasks: Task[]): void { /* ... write to localStorage ... */ }
    }
    ```

## 4. Observer Pattern

**Implementation:** `src/hooks/use-task-manager.ts` (`useTaskManager` hook) and `src/lib/task-manager.ts`

The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

-   **Why it was chosen:**
    -   To decouple the state management (`TaskManager`) from the UI (`React components`).
    -   To ensure the UI automatically reflects changes in the data without manual polling or prop drilling.
    -   To provide a reactive experience for the user.

-   **Key Code:**
    -   **Subject (`TaskManager`):**
        ```typescript
        subscribe(listener: () => void): () => void {
          this.listeners.add(listener);
          return () => this.listeners.delete(listener);
        }
        private notify(): void {
          this.listeners.forEach(listener => listener());
        }
        ```
    -   **Observer (`useTaskManager`):**
        ```typescript
        useEffect(() => {
          const unsubscribe = manager.subscribe(() => {
            // Update local state when manager notifies of changes
            setAllTasks(manager.getAllTasks());
          });
          return unsubscribe;
        }, [manager]);
        ```
