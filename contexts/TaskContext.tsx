import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { Task, TaskFormData, TaskContextType, Priority, TaskStatus } from '@/types';
import { STORAGE_KEYS } from '@/constants/EisenhowerMatrix';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from AsyncStorage on app start
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }));
        setTasks(parsedTasks);
      }
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(newTasks));
      setTasks(newTasks);
      setError(null);
    } catch (err) {
      setError('Failed to save tasks');
      console.error('Error saving tasks:', err);
    }
  };

  const addTask = async (taskData: TaskFormData) => {
    try {
      const newTask: Task = {
        id: uuid.v4() as string,
        title: taskData.title.trim(),
        description: taskData.description?.trim(),
        priority: taskData.priority,
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: taskData.dueDate,
      };

      const updatedTasks = [...tasks, newTask];
      await saveTasks(updatedTasks);
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id
          ? {
              ...task,
              ...updates,
              updatedAt: new Date(),
              completedAt: updates.status === TaskStatus.COMPLETED 
                ? new Date() 
                : task.completedAt
            }
          : task
      );
      await saveTasks(updatedTasks);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      await saveTasks(updatedTasks);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const toggleTaskStatus = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const newStatus = task.status === TaskStatus.COMPLETED 
        ? TaskStatus.PENDING 
        : TaskStatus.COMPLETED;

      await updateTask(id, { status: newStatus });
    } catch (err) {
      setError('Failed to toggle task status');
      console.error('Error toggling task status:', err);
    }
  };

  const getTasksByQuadrant = (priority: Priority): Task[] => {
    return tasks.filter(task => task.priority === priority);
  };

  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTasksByQuadrant,
    loading,
    error
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}; 