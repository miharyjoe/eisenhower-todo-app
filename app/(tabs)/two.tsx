import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  SectionList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { useTaskContext } from '@/contexts/TaskContext';
import { Priority, Task, TaskFormData, TaskStatus } from '@/types';
import { QUADRANT_CONFIG } from '@/constants/EisenhowerMatrix';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface TaskSection {
  title: string;
  data: Task[];
  priority?: Priority;
}

type FilterType = 'all' | 'pending' | 'completed' | Priority;

export default function TaskListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { tasks, addTask, updateTask, loading } = useTaskContext();
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority>(Priority.URGENT_IMPORTANT);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setSelectedPriority(task.priority);
    setShowTaskForm(true);
  };

  const handleSubmitTask = async (taskData: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          dueDate: taskData.dueDate,
        });
      } else {
        await addTask(taskData);
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => task.status !== TaskStatus.COMPLETED);
      case 'completed':
        return tasks.filter(task => task.status === TaskStatus.COMPLETED);
      case 'all':
        return tasks;
      default:
        // Filter by priority
        return tasks.filter(task => task.priority === filter);
    }
  };

  const getSections = (): TaskSection[] => {
    const filteredTasks = getFilteredTasks();
    
    if (filter === 'all') {
      // Group by priority
      const sections: TaskSection[] = [];
      
      Object.values(Priority).forEach(priority => {
        const priorityTasks = filteredTasks.filter(task => task.priority === priority);
        if (priorityTasks.length > 0) {
          sections.push({
            title: QUADRANT_CONFIG[priority].title,
            data: priorityTasks.sort((a, b) => {
              // Sort by completion status first, then by creation date
              if (a.status !== b.status) {
                return a.status === TaskStatus.COMPLETED ? 1 : -1;
              }
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }),
            priority
          });
        }
      });
      
      return sections;
    } else {
      // Single section for filtered results
      return [{
        title: filter === 'pending' ? 'Pending Tasks' : 
               filter === 'completed' ? 'Completed Tasks' : 
               QUADRANT_CONFIG[filter as Priority].title,
        data: filteredTasks.sort((a, b) => {
          if (a.status !== b.status) {
            return a.status === TaskStatus.COMPLETED ? 1 : -1;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
      }];
    }
  };

  const filters: { key: FilterType; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'list' },
    { key: 'pending', label: 'Pending', icon: 'clock-o' },
    { key: 'completed', label: 'Completed', icon: 'check-circle' },
    { key: Priority.URGENT_IMPORTANT, label: 'Do First', icon: 'fire' },
    { key: Priority.NOT_URGENT_IMPORTANT, label: 'Schedule', icon: 'calendar' },
    { key: Priority.URGENT_NOT_IMPORTANT, label: 'Delegate', icon: 'share' },
    { key: Priority.NOT_URGENT_NOT_IMPORTANT, label: 'Eliminate', icon: 'trash' },
  ];

  const renderSectionHeader = ({ section }: { section: TaskSection }) => {
    const config = section.priority ? QUADRANT_CONFIG[section.priority] : null;
    
    return (
      <View style={[
        styles.sectionHeader,
        { backgroundColor: colors.background },
        config && { borderLeftColor: config.color }
      ]}>
        {config && (
          <FontAwesome 
            name={config.icon as any} 
            size={16} 
            color={config.color}
            style={styles.sectionIcon}
          />
        )}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {section.title} ({section.data.length})
        </Text>
      </View>
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onEdit={handleEditTask}
      compact={true}
    />
  );

  const sections = getSections();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading your tasks...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Task List
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              {totalTasks} tasks • {completedTasks} completed
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.tint }]}
            onPress={handleAddTask}
          >
            <FontAwesome name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map((filterOption) => {
            const isSelected = filter === filterOption.key;
            const config = Object.values(Priority).includes(filterOption.key as Priority) 
              ? QUADRANT_CONFIG[filterOption.key as Priority] 
              : null;
            
            return (
              <TouchableOpacity
                key={filterOption.key}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: isSelected 
                      ? (config?.color || colors.tint) + '20'
                      : 'transparent',
                    borderColor: isSelected 
                      ? (config?.color || colors.tint)
                      : colors.text + '20',
                  }
                ]}
                onPress={() => setFilter(filterOption.key)}
              >
                <FontAwesome 
                  name={filterOption.icon as any} 
                  size={14} 
                  color={isSelected ? (config?.color || colors.tint) : colors.text}
                  style={styles.filterIcon}
                />
                <Text style={[
                  styles.filterText,
                  { 
                    color: isSelected ? (config?.color || colors.tint) : colors.text,
                    fontWeight: isSelected ? '600' : '400'
                  }
                ]}>
                  {filterOption.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Task List */}
      {sections.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome 
            name="inbox" 
            size={48} 
            color={colors.text + '40'} 
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.text }]}>
            Tap the + button to create your first task
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          renderSectionHeader={renderSectionHeader}
          style={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Task Form Modal */}
      <Modal
        visible={showTaskForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <TaskForm
          task={editingTask}
          initialPriority={selectedPriority}
          onSubmit={handleSubmitTask}
          onCancel={handleCancelForm}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    fontWeight: '500',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  filterContainer: {
    marginBottom: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
  },
  taskList: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderLeftWidth: 4,
    marginTop: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 24,
  },
});
