
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import i18n from '@/utils/i18n';
import { useAuth, StudentUser } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent';
  subject?: string;
}

export default function AbsencesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const studentUser = user as StudentUser;

  useEffect(() => {
    loadAttendanceRecords();
  }, []);

  const loadAttendanceRecords = async () => {
    try {
      // For demo purposes, we'll create some mock data
      // In a real app, this would come from the backend
      const mockRecords: AttendanceRecord[] = [
        {
          id: '1',
          date: '2024-01-15',
          status: 'present',
          subject: 'Mathematics',
        },
        {
          id: '2',
          date: '2024-01-16',
          status: 'absent',
          subject: 'Physics',
        },
        {
          id: '3',
          date: '2024-01-17',
          status: 'present',
          subject: 'Chemistry',
        },
        {
          id: '4',
          date: '2024-01-18',
          status: 'absent',
          subject: 'Mathematics',
        },
        {
          id: '5',
          date: '2024-01-19',
          status: 'present',
          subject: 'Physics',
        },
      ];
      
      setAttendanceRecords(mockRecords);
    } catch (error) {
      console.log('Error loading attendance records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAttendanceStats = () => {
    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
    const absentCount = attendanceRecords.filter(record => record.status === 'absent').length;
    const attendanceRate = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
    
    return {
      totalClasses,
      presentCount,
      absentCount,
      attendanceRate: Math.round(attendanceRate),
    };
  };

  const stats = getAttendanceStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('absences')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Attendance Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <IconSymbol name="calendar" size={32} color={colors.primary} />
              <Text style={styles.statNumber}>{stats.totalClasses}</Text>
              <Text style={styles.statLabel}>Total Classes</Text>
            </View>
            
            <View style={styles.statCard}>
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
              <Text style={styles.statNumber}>{stats.presentCount}</Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>
            
            <View style={styles.statCard}>
              <IconSymbol name="xmark.circle.fill" size={32} color={colors.error} />
              <Text style={styles.statNumber}>{stats.absentCount}</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
            
            <View style={styles.statCard}>
              <IconSymbol name="percent" size={32} color={colors.accent} />
              <Text style={styles.statNumber}>{stats.attendanceRate}%</Text>
              <Text style={styles.statLabel}>Attendance Rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>Attendance Records</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
            </View>
          ) : attendanceRecords.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="calendar.badge.exclamationmark" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Records Yet</Text>
              <Text style={styles.emptyDescription}>
                Your attendance records will appear here once classes begin
              </Text>
            </View>
          ) : (
            <View style={styles.recordsList}>
              {attendanceRecords.map((record) => (
                <View key={record.id} style={styles.recordCard}>
                  <View style={styles.recordDate}>
                    <Text style={styles.recordDateText}>
                      {formatDate(record.date)}
                    </Text>
                    {record.subject && (
                      <Text style={styles.recordSubject}>
                        {record.subject}
                      </Text>
                    )}
                  </View>
                  
                  <View style={[
                    styles.recordStatus,
                    record.status === 'present' ? styles.recordStatusPresent : styles.recordStatusAbsent
                  ]}>
                    <IconSymbol 
                      name={record.status === 'present' ? 'checkmark.circle.fill' : 'xmark.circle.fill'} 
                      size={20} 
                      color={record.status === 'present' ? colors.success : colors.error} 
                    />
                    <Text style={[
                      styles.recordStatusText,
                      record.status === 'present' ? styles.recordStatusTextPresent : styles.recordStatusTextAbsent
                    ]}>
                      {record.status === 'present' ? i18n.t('present') : i18n.t('absent')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
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
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recordsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  recordsList: {
    gap: 12,
  },
  recordCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  recordDate: {
    flex: 1,
  },
  recordDateText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  recordSubject: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recordStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  recordStatusPresent: {
    backgroundColor: colors.success + '15',
  },
  recordStatusAbsent: {
    backgroundColor: colors.error + '15',
  },
  recordStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recordStatusTextPresent: {
    color: colors.success,
  },
  recordStatusTextAbsent: {
    color: colors.error,
  },
});
