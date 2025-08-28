export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  tags: string[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
