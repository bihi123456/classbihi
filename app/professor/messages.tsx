
import React, { useState, useEffect } from 'react';
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
import { IconSymbol } from '@/components/IconSymbol';
import { colors, buttonStyles, textStyles } from '@/styles/commonStyles';
import i18n from '@/utils/i18n';
import { useAuth, ProfessorUser } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'professor';
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  section: string;
}

interface Student {
  id: string;
  fullName: string;
  familyName: string;
  section: string;
}

export default function ProfessorMessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const professorUser = user as ProfessorUser;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSection, setSelectedSection] = useState('LEFR');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);

  const SECTIONS = ['LEFR', 'LESM', 'LESVT', 'LEAG', 'LEPS'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load messages
      const messagesData = await AsyncStorage.getItem('messages');
      const allMessages = messagesData ? JSON.parse(messagesData) : [];
      
      // Filter messages for this professor
      const professorMessages = allMessages.filter((msg: Message) => 
        msg.senderId === professorUser.id || msg.recipientId === professorUser.id
      );
      setMessages(professorMessages);

      // Load students
      const usersData = await AsyncStorage.getItem('users');
      const allUsers = usersData ? JSON.parse(usersData) : [];
      const studentUsers = allUsers.filter((user: any) => user.role === 'student');
      setStudents(studentUsers);
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const getStudentsInSection = () => {
    return students.filter(student => student.section === selectedSection);
  };

  const getConversationWithStudent = (studentId: string) => {
    return messages.filter(msg => 
      (msg.senderId === professorUser.id && msg.recipientId === studentId) ||
      (msg.senderId === studentId && msg.recipientId === professorUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedStudent) {
      Alert.alert('Error', 'Please select a student and enter a message');
      return;
    }

    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: professorUser.id,
        senderName: professorUser.fullName,
        senderRole: 'professor',
        recipientId: selectedStudent.id,
        recipientName: `${selectedStudent.fullName} ${selectedStudent.familyName}`,
        content: messageText,
        timestamp: new Date().toISOString(),
        section: selectedStudent.section,
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      // Save to storage
      const messagesData = await AsyncStorage.getItem('messages');
      const allMessages = messagesData ? JSON.parse(messagesData) : [];
      allMessages.push(newMessage);
      await AsyncStorage.setItem('messages', JSON.stringify(allMessages));

      setMessageText('');
      Alert.alert('Success', 'Message sent successfully');
    } catch (error) {
      console.log('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
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
        <Text style={styles.headerTitle}>{i18n.t('messages')}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Section Selector */}
      <View style={styles.sectionSelector}>
        <Text style={styles.sectionLabel}>Section:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SECTIONS.map((section) => (
            <TouchableOpacity
              key={section}
              style={[
                styles.sectionChip,
                selectedSection === section && styles.sectionChipActive
              ]}
              onPress={() => setSelectedSection(section)}
            >
              <Text style={[
                styles.sectionChipText,
                selectedSection === section && styles.sectionChipTextActive
              ]}>
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {/* Student Selection */}
        <View style={styles.studentSelector}>
          <TouchableOpacity
            style={styles.studentPicker}
            onPress={() => setShowStudentList(!showStudentList)}
          >
            <Text style={styles.studentPickerText}>
              {selectedStudent 
                ? `${selectedStudent.fullName} ${selectedStudent.familyName}`
                : 'Select a student'
              }
            </Text>
            <IconSymbol name="chevron.down" size={16} color={colors.primary} />
          </TouchableOpacity>

          {showStudentList && (
            <View style={styles.studentList}>
              {getStudentsInSection().map((student) => (
                <TouchableOpacity
                  key={student.id}
                  style={styles.studentItem}
                  onPress={() => {
                    setSelectedStudent(student);
                    setShowStudentList(false);
                  }}
                >
                  <Text style={styles.studentItemText}>
                    {student.fullName} {student.familyName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Messages */}
        {selectedStudent && (
          <View style={styles.messagesContainer}>
            <Text style={styles.conversationTitle}>
              Conversation with {selectedStudent.fullName}
            </Text>
            
            <ScrollView style={styles.messagesList} showsVerticalScrollIndicator={false}>
              {getConversationWithStudent(selectedStudent.id).map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageItem,
                    message.senderId === professorUser.id 
                      ? styles.sentMessage 
                      : styles.receivedMessage
                  ]}
                >
                  <Text style={styles.messageContent}>{message.content}</Text>
                  <Text style={styles.messageTime}>
                    {formatDate(message.timestamp)} {formatTime(message.timestamp)}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Message Input */}
            <View style={styles.messageInput}>
              <TextInput
                style={styles.textInput}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type your message..."
                placeholderTextColor={colors.textSecondary}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
              >
                <IconSymbol name="paperplane.fill" size={20} color={colors.card} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!selectedStudent && (
          <View style={styles.emptyState}>
            <IconSymbol name="message" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>Select a Student</Text>
            <Text style={styles.emptyStateDescription}>
              Choose a student from the {selectedSection} section to start messaging
            </Text>
          </View>
        )}
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
  sectionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginRight: 12,
  },
  sectionChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sectionChipText: {
    fontSize: 14,
    color: colors.text,
  },
  sectionChipTextActive: {
    color: colors.card,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  studentSelector: {
    paddingVertical: 16,
    position: 'relative',
  },
  studentPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  studentPickerText: {
    fontSize: 16,
    color: colors.text,
  },
  studentList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  studentItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  studentItemText: {
    fontSize: 16,
    color: colors.text,
  },
  messagesContainer: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  messagesList: {
    flex: 1,
    marginBottom: 16,
  },
  messageItem: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageContent: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
