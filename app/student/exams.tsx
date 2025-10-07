
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import i18n from '@/utils/i18n';
import { useAuth, StudentUser } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exam {
  id: string;
  title: string;
  description: string;
  section: string;
  publishedAt: string;
  dueDate?: string;
  type: 'text' | 'file';
  content?: string;
  fileUrl?: string;
  isCompleted?: boolean;
}

export default function ExamsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const studentUser = user as StudentUser;

  const loadExams = useCallback(async () => {
    try {
      const examsData = await AsyncStorage.getItem('publishedExams');
      if (examsData) {
        const allExams = JSON.parse(examsData);
        // Filter exams for student's section
        const sectionExams = allExams.filter((exam: Exam) => 
          exam.section === studentUser?.section
        );
        setExams(sectionExams);
      }
    } catch (error) {
      console.log('Error loading exams:', error);
    } finally {
      setIsLoading(false);
    }
  }, [studentUser?.section]);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const handleExamPress = (exam: Exam) => {
    Alert.alert(
      exam.title,
      exam.description + '\n\nExam functionality will be implemented in the next version.',
      [{ text: 'OK' }]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('exams')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Exams for Section {studentUser?.section}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {exams.length} {exams.length === 1 ? 'exam' : 'exams'} available
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
          </View>
        ) : exams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol name="doc.text" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Exams Available</Text>
            <Text style={styles.emptyDescription}>
              Your professor hasn't published any exams yet. Check back later!
            </Text>
          </View>
        ) : (
          <View style={styles.examsList}>
            {exams.map((exam) => (
              <TouchableOpacity
                key={exam.id}
                style={styles.examCard}
                onPress={() => handleExamPress(exam)}
              >
                <View style={styles.examHeader}>
                  <View style={styles.examIcon}>
                    <IconSymbol 
                      name={exam.type === 'file' ? 'doc.fill' : 'doc.text'} 
                      size={24} 
                      color={colors.primary} 
                    />
                  </View>
                  <View style={styles.examInfo}>
                    <Text style={styles.examTitle}>{exam.title}</Text>
                    <Text style={styles.examDescription}>{exam.description}</Text>
                  </View>
                  <View style={styles.examStatus}>
                    {exam.isCompleted ? (
                      <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                    ) : (
                      <IconSymbol name="clock" size={24} color={colors.warning} />
                    )}
                  </View>
                </View>
                
                <View style={styles.examFooter}>
                  <View style={styles.examMeta}>
                    <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={styles.examDate}>
                      Published: {formatDate(exam.publishedAt)}
                    </Text>
                  </View>
                  
                  {exam.dueDate && (
                    <View style={styles.examMeta}>
                      <IconSymbol name="clock" size={16} color={colors.textSecondary} />
                      <Text style={styles.examDate}>
                        Due: {formatDate(exam.dueDate)}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.examActions}>
                  <Text style={styles.examActionText}>
                    {exam.isCompleted ? 'View Submission' : 'Take Exam'}
                  </Text>
                  <IconSymbol name="chevron.right" size={16} color={colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  examsList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  examCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  examIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  examInfo: {
    flex: 1,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  examDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  examStatus: {
    marginLeft: 12,
  },
  examFooter: {
    gap: 8,
    marginBottom: 16,
  },
  examMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  examDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  examActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  examActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
});
