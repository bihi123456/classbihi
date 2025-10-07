
import React, { useState, useEffect } from 'react';
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
import { useAuth, ProfessorUser } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExamResponse {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: any[];
  score?: number;
  isGraded: boolean;
}

interface Exam {
  id: string;
  title: string;
  section: string;
  publishedAt: string;
  professorId: string;
}

export default function ResponsesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const professorUser = user as ProfessorUser;
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [responses, setResponses] = useState<ExamResponse[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load exams published by this professor
      const examsData = await AsyncStorage.getItem('exams');
      const allExams = examsData ? JSON.parse(examsData) : [];
      const professorExams = allExams.filter((exam: Exam) => exam.professorId === professorUser.id);
      setExams(professorExams);

      // Load responses
      const responsesData = await AsyncStorage.getItem('examResponses');
      const allResponses = responsesData ? JSON.parse(responsesData) : [];
      setResponses(allResponses);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getResponsesForExam = (examId: string) => {
    return responses.filter(response => response.examId === examId);
  };

  const handleGradeResponse = (responseId: string) => {
    Alert.alert(
      'Grade Response',
      'Grading functionality will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('responses')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {exams.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="doc.text.viewfinder" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>No Exams Published</Text>
            <Text style={styles.emptyStateDescription}>
              Publish an exam first to view student responses
            </Text>
          </View>
        ) : (
          <View style={styles.examsList}>
            <Text style={styles.sectionTitle}>Published Exams</Text>
            
            {exams.map((exam) => {
              const examResponses = getResponsesForExam(exam.id);
              const gradedResponses = examResponses.filter(r => r.isGraded);
              
              return (
                <TouchableOpacity
                  key={exam.id}
                  style={styles.examCard}
                  onPress={() => setSelectedExam(selectedExam === exam.id ? null : exam.id)}
                >
                  <View style={styles.examHeader}>
                    <View style={styles.examInfo}>
                      <Text style={styles.examTitle}>{exam.title}</Text>
                      <Text style={styles.examMeta}>
                        Section: {exam.section} • Published: {formatDate(exam.publishedAt)}
                      </Text>
                    </View>
                    <View style={styles.examStats}>
                      <Text style={styles.statText}>
                        {examResponses.length} responses
                      </Text>
                      <Text style={styles.statText}>
                        {gradedResponses.length} graded
                      </Text>
                    </View>
                  </View>

                  {selectedExam === exam.id && (
                    <View style={styles.responsesList}>
                      {examResponses.length === 0 ? (
                        <Text style={styles.noResponsesText}>
                          No responses yet
                        </Text>
                      ) : (
                        examResponses.map((response) => (
                          <View key={response.id} style={styles.responseCard}>
                            <View style={styles.responseHeader}>
                              <View style={styles.responseInfo}>
                                <Text style={styles.studentName}>
                                  {response.studentName}
                                </Text>
                                <Text style={styles.submissionDate}>
                                  Submitted: {formatDate(response.submittedAt)}
                                </Text>
                              </View>
                              <View style={styles.responseActions}>
                                {response.isGraded ? (
                                  <View style={styles.gradeDisplay}>
                                    <Text style={styles.gradeText}>
                                      {response.score || 0}/100
                                    </Text>
                                  </View>
                                ) : (
                                  <TouchableOpacity
                                    style={styles.gradeButton}
                                    onPress={() => handleGradeResponse(response.id)}
                                  >
                                    <Text style={styles.gradeButtonText}>Grade</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </View>
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  examsList: {
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  examCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  examInfo: {
    flex: 1,
    marginRight: 16,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  examMeta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  examStats: {
    alignItems: 'flex-end',
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  responsesList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  noResponsesText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  responseCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  responseInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  submissionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  responseActions: {
    marginLeft: 12,
  },
  gradeDisplay: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  gradeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  gradeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
});
