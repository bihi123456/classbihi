
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import i18n from '@/utils/i18n';
import { useAuth, StudentUser } from '@/contexts/AuthContext';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const studentUser = user as StudentUser;

  // Mock data for demonstration
  const messages = [
    {
      id: '1',
      sender: 'Prof. Johnson',
      subject: 'Assignment Reminder',
      preview: 'Don\'t forget to submit your assignment by Friday...',
      timestamp: '2 hours ago',
      isRead: false,
    },
    {
      id: '2',
      sender: 'Sarah Wilson',
      subject: 'Study Group',
      preview: 'Hey! Are you joining the study group tomorrow?',
      timestamp: '1 day ago',
      isRead: true,
    },
    {
      id: '3',
      sender: 'Prof. Johnson',
      subject: 'Exam Schedule',
      preview: 'The midterm exam has been rescheduled to next week...',
      timestamp: '3 days ago',
      isRead: true,
    },
  ];

  const filteredMessages = messages.filter(message =>
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <TouchableOpacity style={styles.composeButton}>
          <IconSymbol name="square.and.pencil" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Messages for Section {studentUser?.section}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'}
          </Text>
        </View>

        {filteredMessages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol name="message" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No messages found' : 'No messages yet'}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Your messages from professors and classmates will appear here'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.messagesList}>
            {filteredMessages.map((message) => (
              <TouchableOpacity
                key={message.id}
                style={[
                  styles.messageCard,
                  !message.isRead && styles.messageCardUnread
                ]}
              >
                <View style={styles.messageHeader}>
                  <View style={styles.messageAvatar}>
                    <IconSymbol 
                      name="person.circle.fill" 
                      size={40} 
                      color={colors.primary} 
                    />
                  </View>
                  <View style={styles.messageInfo}>
                    <View style={styles.messageTopRow}>
                      <Text style={[
                        styles.messageSender,
                        !message.isRead && styles.messageSenderUnread
                      ]}>
                        {message.sender}
                      </Text>
                      <Text style={styles.messageTimestamp}>
                        {message.timestamp}
                      </Text>
                    </View>
                    <Text style={[
                      styles.messageSubject,
                      !message.isRead && styles.messageSubjectUnread
                    ]}>
                      {message.subject}
                    </Text>
                    <Text style={styles.messagePreview}>
                      {message.preview}
                    </Text>
                  </View>
                  {!message.isRead && (
                    <View style={styles.unreadIndicator} />
                  )}
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
  composeButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
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
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
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
  messagesList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  messageCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageCardUnread: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  messageAvatar: {
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  messageTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  messageSenderUnread: {
    fontWeight: '600',
  },
  messageTimestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageSubject: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  messageSubjectUnread: {
    fontWeight: '600',
  },
  messagePreview: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
