import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { Task, Priority } from '@/types';
import { TaskCard } from './TaskCard';
import { QUADRANT_CONFIG } from '@/constants/EisenhowerMatrix';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface QuadrantCardProps {
  priority: Priority;
  tasks: Task[];
  onAddTask: (priority: Priority) => void;
  onEditTask?: (task: Task) => void;
  compact?: boolean;
}

export const QuadrantCard: React.FC<QuadrantCardProps> = ({
  priority,
  tasks,
  onAddTask,
  onEditTask,
  compact = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const config = QUADRANT_CONFIG[priority];

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.background },
      compact && styles.compact
    ]}>
      {/* Header */}
      <View style={[
        styles.header,
        { backgroundColor: config.color + '10' }
      ]}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <FontAwesome 
              name={config.icon as any} 
              size={18} 
              color={config.color} 
              style={styles.icon}
            />
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                {config.title}
              </Text>
              <Text style={[styles.subtitle, { color: colors.text }]}>
                {config.description}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: config.color }]}
            onPress={() => onAddTask(priority)}
          >
            <FontAwesome name="plus" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* Progress indicator */}
        {totalTasks > 0 && (
          <View style={styles.progressContainer}>
            <View style={[
              styles.progressBar,
              { backgroundColor: config.color + '20' }
            ]}>
              <View
                style={[
                  styles.progressFill,
                  { 
                    backgroundColor: config.color,
                    width: `${completionRate}%`
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.text }]}>
              {completedTasks}/{totalTasks} completed
            </Text>
          </View>
        )}
      </View>

      {/* Tasks List */}
      <ScrollView 
        style={styles.tasksList}
        showsVerticalScrollIndicator={false}
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome 
              name="inbox" 
              size={32} 
              color={colors.text + '40'} 
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No tasks yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text }]}>
              Tap + to add a task
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              compact={compact}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  compact: {
    margin: 4,
  },
  header: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.8,
    fontWeight: '500',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    opacity: 0.8,
  },
  tasksList: {
    flex: 1,
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.6,
  },
  emptySubtext: {
    fontSize: 12,
    opacity: 0.5,
  },
}); 