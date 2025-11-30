import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { Task, TaskStatus } from '@/types';
import { useTaskContext } from '@/contexts/TaskContext';
import { QUADRANT_CONFIG } from '@/constants/EisenhowerMatrix';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/lib/locale';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  compact = false 
}) => {
  const { toggleTaskStatus, deleteTask } = useTaskContext();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t, i18n } = useTranslation();
  
  const quadrantConfig = QUADRANT_CONFIG[task.priority];

  const handleToggleComplete = () => {
    toggleTaskStatus(task.id);
  };

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleDelete = () => {
    Alert.alert(
      t('taskCard.deleteConfirmTitle'),
      t('taskCard.deleteConfirmMessage'),
      [
        { text: t('taskCard.cancel'), style: 'cancel' },
        { 
          text: t('taskCard.delete'), 
          style: 'destructive',
          onPress: () => deleteTask(task.id)
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(getDateLocale(i18n.language), {
      month: 'short',
      day: 'numeric',
    });
  };

  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isOverdue = task.dueDate && new Date() > task.dueDate && !isCompleted;

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.background,
        borderLeftColor: quadrantConfig.color,
        opacity: isCompleted ? 0.7 : 1,
      },
      compact && styles.compact
    ]}>
      {/* Header with checkbox and actions */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            { borderColor: quadrantConfig.color },
            isCompleted && { backgroundColor: quadrantConfig.color }
          ]}
          onPress={handleToggleComplete}
        >
          {isCompleted && (
            <FontAwesome name="check" size={12} color="white" />
          )}
        </TouchableOpacity>

        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.background }]}
              onPress={handleEdit}
            >
              <FontAwesome name="edit" size={16} color={colors.text} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={handleDelete}
          >
            <FontAwesome name="trash" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Task Content */}
      <View style={styles.content}>
        <Text 
          style={[
            styles.title,
            { color: colors.text },
            isCompleted && styles.completed
          ]}
          numberOfLines={compact ? 1 : 2}
        >
          {task.title}
        </Text>

        {task.description && !compact && (
          <Text
            style={[styles.description, { color: colors.text }]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        {/* Footer with due date and priority indicator */}
        <View style={styles.footer}>
          {task.dueDate && (
            <View style={[
              styles.dueDateContainer,
              isOverdue && styles.overdue
            ]}>
              <FontAwesome 
                name="clock-o" 
                size={12} 
                color={isOverdue ? '#FF6B6B' : colors.text} 
              />
              <Text style={[
                styles.dueDate,
                { color: isOverdue ? '#FF6B6B' : colors.text }
              ]}>
                {formatDate(task.dueDate)}
              </Text>
            </View>
          )}

          {!compact && (
            <View style={[
              styles.priorityBadge,
              { backgroundColor: quadrantConfig.color + '20' }
            ]}>
              <FontAwesome 
                name={quadrantConfig.icon as any} 
                size={10} 
                color={quadrantConfig.color} 
              />
              <Text style={[
                styles.priorityText,
                { color: quadrantConfig.color }
              ]}>
                {quadrantConfig.title}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  compact: {
    marginVertical: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    lineHeight: 22,
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  overdue: {
    // Additional overdue styling handled by color
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
}); 