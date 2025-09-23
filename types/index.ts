export enum Priority {
  URGENT_IMPORTANT = 'urgent_important',     // Do First
  NOT_URGENT_IMPORTANT = 'not_urgent_important', // Schedule  
  URGENT_NOT_IMPORTANT = 'urgent_not_important', // Delegate
  NOT_URGENT_NOT_IMPORTANT = 'not_urgent_not_important' // Eliminate
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
}

export interface Quadrant {
  id: Priority;
  title: string;
  description: string;
  color: string;
  icon: string;
  tasks: Task[];
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate?: Date;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: TaskFormData) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  getTasksByQuadrant: (priority: Priority) => Task[];
  loading: boolean;
  error: string | null;
}

export interface QuadrantConfig {
  [Priority.URGENT_IMPORTANT]: {
    title: string;
    description: string;
    color: string;
    icon: string;
  };
  [Priority.NOT_URGENT_IMPORTANT]: {
    title: string;
    description: string;
    color: string;
    icon: string;
  };
  [Priority.URGENT_NOT_IMPORTANT]: {
    title: string;
    description: string;
    color: string;
    icon: string;
  };
  [Priority.NOT_URGENT_NOT_IMPORTANT]: {
    title: string;
    description: string;
    color: string;
    icon: string;
  };
} 