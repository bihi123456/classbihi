
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import i18n from '@/utils/i18n';
import { useAuth, StudentUser } from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showSideMenu, setShowSideMenu] = useState(false);
  
  const studentUser = user as StudentUser;

  const menuItems = [
    {
      id: 'section',
      title: i18n.t('section'),
      icon: 'person.3',
      route: '/student/section',
      description: 'View student profiles in the same class only',
    },
    {
      id: 'messages',
      title: i18n.t('messages'),
      icon: 'message',
      route: '/student/messages',
      description: 'View previous messages + search for a student',
    },
    {
      id: 'exams',
      title: i18n.t('exams'),
      icon: 'doc.text',
      route: '/student/exams',
      description: 'View exams posted by the professor',
    },
    {
      id: 'attendance',
      title: i18n.t('presence'),
      icon: 'checkmark.circle',
      route: '/student/attendance',
      description: 'Record attendance during class',
    },
    {
      id: 'absences',
      title: i18n.t('absences'),
      icon: 'xmark.circle',
      route: '/student/absences',
      description: 'View the number of absences',
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleMenuItemPress = (route: string) => {
    setShowSideMenu(false);
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Side Menu Overlay */}
      {showSideMenu && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowSideMenu(false)}
        >
          <View style={styles.sideMenu}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSideMenu(false)}
            >
              <IconSymbol name="xmark" size={24} color={colors.text} />
            </TouchableOpacity>

            {/* User Profile Section */}
            <View style={styles.userSection}>
              {studentUser?.photo ? (
                <Image source={{ uri: studentUser.photo }} style={styles.userPhoto} />
              ) : (
                <View style={styles.userPhotoPlaceholder}>
                  <IconSymbol name="person.circle" size={60} color={colors.primary} />
                </View>
              )}
              <Text style={styles.userName}>
                {studentUser?.fullName} {studentUser?.familyName}
              </Text>
              <Text style={styles.userSection}>{studentUser?.section}</Text>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <View style={styles.menuItemIcon}>
                    <IconSymbol name={item.icon as any} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}

              {/* Profile and Settings */}
              <View style={styles.menuDivider} />
              
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('/student/profile')}
              >
                <View style={styles.menuItemIcon}>
                  <IconSymbol name="person" size={24} color={colors.primary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{i18n.t('profile')}</Text>
                  <Text style={styles.menuItemDescription}>View and edit your profile</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogout}
              >
                <View style={styles.menuItemIcon}>
                  <IconSymbol name="arrow.right.square" size={24} color={colors.error} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: colors.error }]}>Logout</Text>
                  <Text style={styles.menuItemDescription}>Sign out of your account</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}

      {/* Main Content */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowSideMenu(true)}
        >
          <IconSymbol name="line.horizontal.3" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🧑‍🎓 Student Dashboard</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome back, {studentUser?.fullName}!
          </Text>
          <Text style={styles.sectionText}>
            Section: {studentUser?.section}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            {menuItems.slice(0, 4).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.actionCard}
                onPress={() => handleMenuItemPress(item.route)}
              >
                <View style={styles.actionIcon}>
                  <IconSymbol name={item.icon as any} size={32} color={colors.primary} />
                </View>
                <Text style={styles.actionTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <View style={styles.activityCard}>
            <IconSymbol name="bell" size={24} color={colors.accent} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>No recent activity</Text>
              <Text style={styles.activityDescription}>
                Your recent exams, messages, and attendance will appear here
              </Text>
            </View>
          </View>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sideMenu: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: colors.card,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
    zIndex: 1001,
  },
  userSection: {
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 24,
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userSectionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  menuItemIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
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
  menuButton: {
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
  welcomeSection: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  recentActivity: {
    marginBottom: 32,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityContent: {
    flex: 1,
    marginLeft: 16,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
