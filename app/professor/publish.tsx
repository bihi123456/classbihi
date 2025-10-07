
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, buttonStyles, textStyles } from '@/styles/commonStyles';
import i18n from '@/utils/i18n';
import { useAuth, ProfessorUser } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PublishExamScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const professorUser = user as ProfessorUser;
  
  const [examType, setExamType] = useState<'text' | 'file'>('text');
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    content: '',
    dueDate: '',
    section: 'LEFR', // Default section
  });
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.log('File picker error:', error);
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const handlePublish = async () => {
    if (!examData.title.trim()) {
      Alert.alert('Error', 'Please enter exam title');
      return;
    }

    if (examType === 'text' && !examData.content.trim()) {
      Alert.alert('Error', 'Please enter exam content');
      return;
    }

    if (examType === 'file' && !selectedFile) {
      Alert.alert('Error', 'Please select a file');
      return;
    }

    setIsLoading(true);

    try {
      // Get existing exams
      const examsData = await AsyncStorage.getItem('exams');
      const exams = examsData ? JSON.parse(examsData) : [];

      // Create new exam
      const newExam = {
        id: Date.now().toString(),
        title: examData.title,
        description: examData.description,
        section: examData.section,
        publishedAt: new Date().toISOString(),
        dueDate: examData.dueDate || null,
        type: examType,
        content: examType === 'text' ? examData.content : null,
        fileUrl: examType === 'file' ? selectedFile.uri : null,
        fileName: examType === 'file' ? selectedFile.name : null,
        professorId: professorUser.id,
        professorName: professorUser.fullName,
        subject: professorUser.subject,
      };

      // Add to exams list
      exams.push(newExam);
      await AsyncStorage.setItem('exams', JSON.stringify(exams));

      Alert.alert('Success', i18n.t('examPublished'), [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log('Publish exam error:', error);
      Alert.alert('Error', 'Failed to publish exam');
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
        <Text style={styles.headerTitle}>{i18n.t('publish')} Exam</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Exam Title *</Text>
            <TextInput
              style={styles.input}
              value={examData.title}
              onChangeText={(text) => setExamData({ ...examData, title: text })}
              placeholder="Enter exam title"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={examData.description}
              onChangeText={(text) => setExamData({ ...examData, description: text })}
              placeholder="Enter exam description (optional)"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date (Optional)</Text>
            <TextInput
              style={styles.input}
              value={examData.dueDate}
              onChangeText={(text) => setExamData({ ...examData, dueDate: text })}
              placeholder="YYYY-MM-DD HH:MM"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.typeSelector}>
            <Text style={styles.label}>Exam Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  examType === 'text' && styles.typeButtonActive
                ]}
                onPress={() => setExamType('text')}
              >
                <IconSymbol 
                  name="doc.text" 
                  size={24} 
                  color={examType === 'text' ? colors.card : colors.primary} 
                />
                <Text style={[
                  styles.typeButtonText,
                  examType === 'text' && styles.typeButtonTextActive
                ]}>
                  {i18n.t('writeExam')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  examType === 'file' && styles.typeButtonActive
                ]}
                onPress={() => setExamType('file')}
              >
                <IconSymbol 
                  name="doc" 
                  size={24} 
                  color={examType === 'file' ? colors.card : colors.primary} 
                />
                <Text style={[
                  styles.typeButtonText,
                  examType === 'file' && styles.typeButtonTextActive
                ]}>
                  {i18n.t('uploadFile')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {examType === 'text' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Exam Content *</Text>
              <TextInput
                style={[styles.input, styles.contentArea]}
                value={examData.content}
                onChangeText={(text) => setExamData({ ...examData, content: text })}
                placeholder="Write your exam questions here..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={10}
              />
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Upload File *</Text>
              <TouchableOpacity
                style={styles.fileUpload}
                onPress={handleFileUpload}
              >
                <IconSymbol name="doc.badge.plus" size={32} color={colors.primary} />
                <Text style={styles.fileUploadText}>
                  {selectedFile ? selectedFile.name : 'Select PDF or Image'}
                </Text>
                <Text style={styles.fileUploadSubtext}>
                  Tap to browse files
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[buttonStyles.primary, isLoading && styles.buttonDisabled]}
            onPress={handlePublish}
            disabled={isLoading}
          >
            <Text style={textStyles.buttonPrimary}>
              {isLoading ? 'Publishing...' : 'Publish Exam'}
            </Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  form: {
    paddingVertical: 24,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  contentArea: {
    height: 200,
    textAlignVertical: 'top',
  },
  typeSelector: {
    gap: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: colors.card,
  },
  fileUpload: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  fileUploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  fileUploadSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
