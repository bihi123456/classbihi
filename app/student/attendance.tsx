
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, buttonStyles, textStyles } from '@/styles/commonStyles';
import i18n from '@/utils/i18n';
import { useAuth, StudentUser } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AttendanceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  const [hasMarkedAttendance, setHasMarkedAttendance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const studentUser = user as StudentUser;

  const checkAttendanceStatus = useCallback(async () => {
    try {
      // Check if attendance is active for this section
      const attendanceData = await AsyncStorage.getItem('activeAttendance');
      if (attendanceData) {
        const attendance = JSON.parse(attendanceData);
        if (attendance.section === studentUser?.section) {
          setIsAttendanceActive(true);
          
          // Check if student has already marked attendance
          const markedStudents = attendance.markedStudents || [];
          setHasMarkedAttendance(markedStudents.includes(studentUser?.id));
        }
      }
    } catch (error) {
      console.log('Error checking attendance status:', error);
    }
  }, [studentUser?.section, studentUser?.id]);

  useEffect(() => {
    checkAttendanceStatus();
  }, [checkAttendanceStatus]);

  const markAttendance = async () => {
    if (!studentUser || hasMarkedAttendance) return;

    setIsLoading(true);
    
    try {
      const attendanceData = await AsyncStorage.getItem('activeAttendance');
      if (attendanceData) {
        const attendance = JSON.parse(attendanceData);
        
        if (attendance.section === studentUser.section) {
          // Add student to marked attendance list
          const markedStudents = attendance.markedStudents || [];
          markedStudents.push(studentUser.id);
          
          attendance.markedStudents = markedStudents;
          attendance.attendanceRecords = attendance.attendanceRecords || [];
          attendance.attendanceRecords.push({
            studentId: studentUser.id,
            studentName: `${studentUser.fullName} ${studentUser.familyName}`,
            timestamp: new Date().toISOString(),
            status: 'present',
          });
          
          await AsyncStorage.setItem('activeAttendance', JSON.stringify(attendance));
          setHasMarkedAttendance(true);
          
          Alert.alert(i18n.t('success'), i18n.t('attendanceRecorded'));
        }
      }
    } catch (error) {
      console.log('Error marking attendance:', error);
      Alert.alert(i18n.t('error'), 'Failed to mark attendance');
    } finally {
      setIsLoading(false);
    }
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
        <Text style={styles.headerTitle}>{i18n.t('presence')}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.attendanceCard}>
          <View style={styles.attendanceIcon}>
            <IconSymbol 
              name={isAttendanceActive ? "checkmark.circle.fill" : "clock"} 
              size={64} 
              color={isAttendanceActive ? colors.success : colors.textSecondary} 
            />
          </View>
          
          <Text style={styles.attendanceTitle}>
            {isAttendanceActive ? 'Attendance is Active' : 'No Active Attendance'}
          </Text>
          
          <Text style={styles.attendanceDescription}>
            {isAttendanceActive 
              ? `Mark your attendance for section ${studentUser?.section}`
              : 'Wait for your professor to activate attendance taking'
            }
          </Text>

          {isAttendanceActive && (
            <View style={styles.attendanceActions}>
              {hasMarkedAttendance ? (
                <View style={styles.attendanceStatus}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                  <Text style={styles.attendanceStatusText}>
                    You are marked as {i18n.t('present')}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[buttonStyles.primary, isLoading && styles.buttonDisabled]}
                  onPress={markAttendance}
                  disabled={isLoading}
                >
                  <Text style={textStyles.buttonPrimary}>
                    {isLoading ? i18n.t('loading') : `Mark ${i18n.t('present')}`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How Attendance Works</Text>
          <View style={styles.infoItem}>
            <IconSymbol name="1.circle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Your professor activates attendance during class
            </Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="2.circle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              You mark yourself as present using this screen
            </Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="3.circle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              If you don't mark attendance, you're automatically marked absent
            </Text>
          </View>
        </View>
      </View>
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
    paddingTop: 32,
  },
  attendanceCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  attendanceIcon: {
    marginBottom: 24,
  },
  attendanceTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  attendanceDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  attendanceActions: {
    width: '100%',
    alignItems: 'center',
  },
  attendanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  attendanceStatusText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.success,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
