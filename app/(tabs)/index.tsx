import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Modal,
  Dimensions,
} from 'react-native';

import { TaskForm } from '@/components/TaskForm';
import { QuadrantCard } from '@/components/QuadrantCard';
import { useTaskContext } from '@/contexts/TaskContext';
import { Priority, Task, TaskFormData } from '@/types';
import { PRIORITY_ORDER } from '@/constants/EisenhowerMatrix';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const { height } = Dimensions.get('window');

export default function EisenhowerMatrixScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { getTasksByQuadrant, addTask, updateTask, loading } = useTaskContext();
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority>(Priority.URGENT_IMPORTANT);

  const handleAddTask = (priority: Priority) => {
    setSelectedPriority(priority);
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
        <Text style={[styles.title, { color: colors.text }]}>
          Eisenhower Matrix
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Organize tasks by urgency and importance
        </Text>
      </View>

      {/* Matrix Grid */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.matrixGrid}>
          {PRIORITY_ORDER.map((priority) => {
            const tasks = getTasksByQuadrant(priority);
            
            return (
              <View key={priority} style={styles.quadrantContainer}>
                <QuadrantCard
                  priority={priority}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  compact={false}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

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
    paddingBottom: 16,
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
  scrollView: {
    flex: 1,
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  quadrantContainer: {
    width: '50%',
    height: height * 0.35, // Each quadrant takes 35% of screen height
  },
});
