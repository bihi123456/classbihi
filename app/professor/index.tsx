
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
import { useAuth, ProfessorUser } from '@/contexts/AuthContext';

const SECTIONS = ['LEFR', 'LESM', 'LESVT', 'LEAG', 'LEPS'];

export default function ProfessorDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0]);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  
  const professorUser = user as ProfessorUser;

  const menuItems = [
    {
      id: 'publish',
      title: i18n.t('publish'),
      icon: 'plus.circle',
      route: '/professor/publish',
      description: 'Publish an exam for students',
    },
    {
      id: 'responses',
      title: i18n.t('responses'),
      icon: 'doc.text.viewfinder',
      route: '/professor/responses',
      description: 'View student answers and correct them',
    },
    {
      id: 'messages',
      title: i18n.t('messages'),
      icon: 'message',
      route: '/professor/messages',
      description: 'Communicate with students',
    },
    {
      id: 'absences',
      title: i18n.t('absences'),
      icon: 'person.badge.minus',
      route: '/professor/absences',
      description: 'Activate/deactivate attendance list',
    },
    {
      id: 'lists',
      title: i18n.t('lists'),
      icon: 'list.bullet',
      route: '/professor/lists',
      description: 'Insert or edit student lists',
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
              {professorUser?.photo ? (
                <Image source={{ uri: professorUser.photo }} style={styles.userPhoto} />
              ) : (
                <View style={styles.userPhotoPlaceholder}>
                  <IconSymbol name="person.circle" size={60} color={colors.primary} />
                </View>
              )}
              <Text style={styles.userName}>{professorUser?.fullName}</Text>
              <Text style={styles.userSubject}>{professorUser?.subject}</Text>
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
                onPress={() => handleMenuItemPress('/professor/profile')}
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
        <Text style={styles.headerTitle}>🧑‍🏫 Professor Dashboard</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Section Selection */}
      <View style={styles.sectionSelector}>
        <Text style={styles.sectionLabel}>Active Section:</Text>
        <TouchableOpacity
          style={styles.sectionPicker}
          onPress={() => setShowSectionPicker(!showSectionPicker)}
        >
          <Text style={styles.sectionPickerText}>{selectedSection}</Text>
          <IconSymbol name="chevron.down" size={16} color={colors.primary} />
        </TouchableOpacity>
        
        {showSectionPicker && (
          <View style={styles.sectionMenu}>
            {SECTIONS.map((section) => (
              <TouchableOpacity
                key={section}
                style={[
                  styles.sectionMenuItem,
                  selectedSection === section && styles.sectionMenuItemActive
                ]}
                onPress={() => {
                  setSelectedSection(section);
                  setShowSectionPicker(false);
                }}
              >
                <Text style={[
                  styles.sectionMenuItemText,
                  selectedSection === section && styles.sectionMenuItemTextActive
                ]}>
                  {section}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome back, Prof. {professorUser?.fullName}!
          </Text>
          <Text style={styles.subjectText}>
            Subject: {professorUser?.subject}
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
          <Text style={styles.sectionTitle}>Section Overview: {selectedSection}</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Published Exams</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Pending Responses</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Messages</Text>
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
  userSubject: {
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
  sectionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  sectionPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  sectionPickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionMenu: {
    position: 'absolute',
    top: '100%',
    right: 20,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
    zIndex: 1000,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  sectionMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionMenuItemActive: {
    backgroundColor: colors.primary + '10',
  },
  sectionMenuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  sectionMenuItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
  subjectText: {
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
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
