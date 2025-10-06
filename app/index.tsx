
import React, { useState, useEffect } from 'react';
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
import { colors, commonStyles } from '@/styles/commonStyles';
import i18n, { loadLanguage, saveLanguage, getAvailableLanguages } from '@/utils/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    loadLanguage().then(() => {
      setCurrentLanguage(i18n.locale);
    });
  }, []);

  // Redirect if user is already logged in
  if (!isLoading && user) {
    if (user.role === 'student') {
      return <Redirect href="/student" />;
    } else {
      return <Redirect href="/professor" />;
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleLanguageChange = async (languageCode: string) => {
    await saveLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setShowLanguageMenu(false);
  };

  const handleRoleSelection = (role: 'student' | 'professor') => {
    router.push(`/auth/${role}`);
  };

  const availableLanguages = getAvailableLanguages();
  const currentLangName = availableLanguages.find(lang => lang.code === currentLanguage)?.nativeName || 'English';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguageMenu(!showLanguageMenu)}
        >
          <IconSymbol name="globe" size={20} color={colors.primary} />
          <Text style={styles.languageButtonText}>{currentLangName}</Text>
          <IconSymbol name="chevron.down" size={16} color={colors.primary} />
        </TouchableOpacity>
        
        {showLanguageMenu && (
          <View style={styles.languageMenu}>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageMenuItem,
                  currentLanguage === lang.code && styles.languageMenuItemActive
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={[
                  styles.languageMenuItemText,
                  currentLanguage === lang.code && styles.languageMenuItemTextActive
                ]}>
                  {lang.nativeName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>📚 EduConnect</Text>
        <Text style={styles.subtitle}>{i18n.t('languageChange')}</Text>
        
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelection('student')}
          >
            <View style={styles.roleIcon}>
              <Text style={styles.roleEmoji}>🧑‍🎓</Text>
            </View>
            <Text style={styles.roleTitle}>{i18n.t('studentSpace')}</Text>
            <Text style={styles.roleDescription}>
              Access your courses, exams, and attendance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelection('professor')}
          >
            <View style={styles.roleIcon}>
              <Text style={styles.roleEmoji}>🧑‍🏫</Text>
            </View>
            <Text style={styles.roleTitle}>{i18n.t('professorSpace')}</Text>
            <Text style={styles.roleDescription}>
              Manage classes, publish exams, and track attendance
            </Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-end',
    position: 'relative',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  languageButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  languageMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 150,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
    zIndex: 1000,
  },
  languageMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageMenuItemActive: {
    backgroundColor: colors.primary + '10',
  },
  languageMenuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  languageMenuItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 48,
    textAlign: 'center',
  },
  roleContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 24,
  },
  roleCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleEmoji: {
    fontSize: 40,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
