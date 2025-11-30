import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
// DateTimePicker will be added later
import { FontAwesome } from '@expo/vector-icons';

import { Task, TaskFormData, Priority } from '@/types';
import { QUADRANT_CONFIG } from '@/constants/EisenhowerMatrix';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/lib/locale';

interface TaskFormProps {
  task?: Task | null;
  initialPriority?: Priority;
  onSubmit: (taskData: TaskFormData) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  initialPriority = Priority.URGENT_IMPORTANT,
  onSubmit,
  onCancel,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t, i18n } = useTranslation();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || initialPriority);
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isEditing = !!task;
  const isValid = title.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const taskData: TaskFormData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
    };

    onSubmit(taskData);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const clearDueDate = () => {
    setDueDate(undefined);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(getDateLocale(i18n.language), {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isEditing ? t('taskForm.editTitle') : t('taskForm.newTitle')}
          </Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <FontAwesome name="times" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>{t('taskForm.fields.title')}</Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                backgroundColor: colors.background,
                borderColor: colors.text + '20',
                color: colors.text,
              }
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder={t('taskForm.fields.titlePlaceholder')}
            placeholderTextColor={colors.text + '60'}
            multiline
            maxLength={200}
          />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>{t('taskForm.fields.description')}</Text>
          <TextInput
            style={[
              styles.textInput,
              styles.textArea,
              { 
                backgroundColor: colors.background,
                borderColor: colors.text + '20',
                color: colors.text,
              }
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('taskForm.fields.descriptionPlaceholder')}
            placeholderTextColor={colors.text + '60'}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
        </View>

        {/* Priority Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>{t('taskForm.fields.priority')}</Text>
          <View style={styles.priorityGrid}>
            {Object.values(Priority).map((priorityOption) => {
              const config = QUADRANT_CONFIG[priorityOption];
              const isSelected = priority === priorityOption;
              
              return (
                <TouchableOpacity
                  key={priorityOption}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor: isSelected 
                        ? config.color + '20' 
                        : colors.background,
                      borderColor: isSelected 
                        ? config.color 
                        : colors.text + '20',
                    }
                  ]}
                  onPress={() => setPriority(priorityOption)}
                >
                  <FontAwesome 
                    name={config.icon as any} 
                    size={16} 
                    color={config.color} 
                    style={styles.priorityIcon}
                  />
                  <Text style={[
                    styles.priorityTitle,
                    { color: isSelected ? config.color : colors.text }
                  ]}>
                    {t(`quadrants.${priorityOption}.title`)}
                  </Text>
                  <Text style={[
                    styles.priorityDescription,
                    { color: isSelected ? config.color : colors.text }
                  ]}>
                    {t(`quadrants.${priorityOption}.description`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>{t('taskForm.fields.dueDate')}</Text>
          
          {dueDate ? (
            <View style={styles.dueDateContainer}>
              <View style={[
                styles.dueDateDisplay,
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.text + '20',
                }
              ]}>
                <FontAwesome name="calendar" size={16} color={colors.text} />
                <Text style={[styles.dueDateText, { color: colors.text }]}>
                  {formatDate(dueDate)}
                </Text>
                <TouchableOpacity onPress={clearDueDate}>
                  <FontAwesome name="times" size={14} color={colors.text} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.changeDateButton, { borderColor: colors.text + '20' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.changeDateText, { color: colors.text }]}>
                  {t('taskForm.changeDate')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.addDateButton,
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.text + '20',
                }
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <FontAwesome name="calendar-plus-o" size={16} color={colors.text} />
              <Text style={[styles.addDateText, { color: colors.text }]}>
                {t('taskForm.addDueDate')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.text + '20' }]}
            onPress={onCancel}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              {t('taskForm.cancel')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { 
                backgroundColor: isValid ? QUADRANT_CONFIG[priority].color : colors.text + '20',
                opacity: isValid ? 1 : 0.5,
              }
            ]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text style={styles.submitButtonText}>
              {isEditing ? t('taskForm.update') : t('taskForm.create')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker - TODO: Add DateTimePicker */}
      {showDatePicker && (
        <Text style={[styles.datePickerPlaceholder, { color: colors.text }]}>
          {t('taskForm.datePickerPlaceholder')}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 50,
  },
  textArea: {
    minHeight: 100,
    maxHeight: 150,
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  priorityIcon: {
    marginBottom: 8,
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  priorityDescription: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.8,
  },
  dueDateContainer: {
    gap: 12,
  },
  dueDateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  dueDateText: {
    flex: 1,
    fontSize: 16,
  },
  changeDateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  changeDateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    borderStyle: 'dashed',
  },
  addDateText: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  datePickerPlaceholder: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
}); 