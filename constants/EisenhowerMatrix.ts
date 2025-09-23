import { Priority, QuadrantConfig } from '@/types';

export const QUADRANT_CONFIG: QuadrantConfig = {
  [Priority.URGENT_IMPORTANT]: {
    title: 'Do First',
    description: 'Urgent & Important',
    color: '#FF6B6B', // Red
    icon: 'fire'
  },
  [Priority.NOT_URGENT_IMPORTANT]: {
    title: 'Schedule',
    description: 'Important, Not Urgent',
    color: '#4ECDC4', // Teal
    icon: 'calendar'
  },
  [Priority.URGENT_NOT_IMPORTANT]: {
    title: 'Delegate',
    description: 'Urgent, Not Important',
    color: '#FFE66D', // Yellow
    icon: 'share'
  },
  [Priority.NOT_URGENT_NOT_IMPORTANT]: {
    title: 'Eliminate',
    description: 'Not Urgent & Not Important',
    color: '#95A5A6', // Gray
    icon: 'trash'
  }
};

export const MATRIX_COLORS = {
  urgent_important: '#FF6B6B',
  not_urgent_important: '#4ECDC4',
  urgent_not_important: '#FFE66D', 
  not_urgent_not_important: '#95A5A6',
  
  // Light variants for backgrounds
  urgent_important_light: '#FFE5E5',
  not_urgent_important_light: '#E5F8F7',
  urgent_not_important_light: '#FFF9E5',
  not_urgent_not_important_light: '#F0F1F2',
};

export const PRIORITY_ORDER = [
  Priority.URGENT_IMPORTANT,
  Priority.NOT_URGENT_IMPORTANT,
  Priority.URGENT_NOT_IMPORTANT,
  Priority.NOT_URGENT_NOT_IMPORTANT
];

export const STORAGE_KEYS = {
  TASKS: '@eisenhower_tasks',
  USER_PREFERENCES: '@eisenhower_preferences'
}; 