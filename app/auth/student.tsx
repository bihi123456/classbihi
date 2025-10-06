
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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles, textStyles } from '@/styles/commonStyles';
import i18n from '@/utils/i18n';
import { useAuth } from '@/contexts/AuthContext';

const SECTIONS = ['LEFR', 'LESM', 'LESVT', 'LEAG', 'LEPS'];

export default function StudentAuthScreen() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    familyName: '',
    email: '',
    password: '',
    departmentNumber: '',
    section: '',
    photo: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = i18n.t('required');
    }

    if (!formData.familyName.trim()) {
      newErrors.familyName = i18n.t('required');
    }

    if (!formData.email.trim()) {
      newErrors.email = i18n.t('required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = i18n.t('invalidEmail');
    }

    if (!formData.password.trim()) {
      newErrors.password = i18n.t('required');
    } else if (formData.password.length < 6) {
      newErrors.password = i18n.t('passwordTooShort');
    }

    if (!isLogin) {
      if (!formData.departmentNumber.trim()) {
        newErrors.departmentNumber = i18n.t('required');
      }

      if (!formData.section) {
        newErrors.section = i18n.t('required');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password, 'student');
        if (success) {
          Alert.alert(i18n.t('success'), i18n.t('loginSuccess'));
          router.replace('/student');
        } else {
          Alert.alert(i18n.t('error'), i18n.t('loginFailed'));
        }
      } else {
        const success = await register(formData, 'student');
        if (success) {
          Alert.alert(i18n.t('success'), i18n.t('accountCreated'));
          router.replace('/student');
        } else {
          Alert.alert(i18n.t('error'), 'Registration failed. Email might already exist.');
        }
      }
    } catch (error) {
      console.log('Auth error:', error);
      Alert.alert(i18n.t('error'), 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData({ ...formData, photo: result.assets[0].uri });
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🧑‍🎓 {i18n.t('studentSpace')}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.toggleButtonText, isLogin && styles.toggleButtonTextActive]}>
                {i18n.t('login')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.toggleButtonText, !isLogin && styles.toggleButtonTextActive]}>
                {i18n.t('createAccount')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t('fullName')}</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.fullName && styles.inputError
                ]}
                value={formData.fullName}
                onChangeText={(text) => updateFormData('fullName', text)}
                placeholder={i18n.t('fullName')}
                placeholderTextColor={colors.textSecondary}
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t('familyName')}</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.familyName && styles.inputError
                ]}
                value={formData.familyName}
                onChangeText={(text) => updateFormData('familyName', text)}
                placeholder={i18n.t('familyName')}
                placeholderTextColor={colors.textSecondary}
              />
              {errors.familyName && <Text style={styles.errorText}>{errors.familyName}</Text>}
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{i18n.t('departmentNumber')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.departmentNumber && styles.inputError
                  ]}
                  value={formData.departmentNumber}
                  onChangeText={(text) => updateFormData('departmentNumber', text)}
                  placeholder={i18n.t('departmentNumber')}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
                {errors.departmentNumber && <Text style={styles.errorText}>{errors.departmentNumber}</Text>}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t('email')}</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.email && styles.inputError
                ]}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                placeholder={i18n.t('email')}
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{i18n.t('selectSection')}</Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    styles.picker,
                    errors.section && styles.inputError
                  ]}
                  onPress={() => setShowSectionPicker(!showSectionPicker)}
                >
                  <Text style={[
                    styles.pickerText,
                    !formData.section && styles.pickerPlaceholder
                  ]}>
                    {formData.section || i18n.t('selectSection')}
                  </Text>
                  <IconSymbol name="chevron.down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                {errors.section && <Text style={styles.errorText}>{errors.section}</Text>}
                
                {showSectionPicker && (
                  <View style={styles.pickerMenu}>
                    {SECTIONS.map((section) => (
                      <TouchableOpacity
                        key={section}
                        style={styles.pickerMenuItem}
                        onPress={() => {
                          updateFormData('section', section);
                          setShowSectionPicker(false);
                        }}
                      >
                        <Text style={styles.pickerMenuItemText}>{section}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t('password')}</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.password && styles.inputError
                ]}
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                placeholder={i18n.t('password')}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{i18n.t('uploadPhoto')}</Text>
                <TouchableOpacity
                  style={styles.photoUpload}
                  onPress={handleImagePicker}
                >
                  {formData.photo ? (
                    <Image source={{ uri: formData.photo }} style={styles.photoPreview} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <IconSymbol name="camera" size={32} color={colors.textSecondary} />
                      <Text style={styles.photoPlaceholderText}>{i18n.t('uploadPhoto')}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[buttonStyles.primary, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={textStyles.buttonPrimary}>
                {isLoading ? i18n.t('loading') : (isLogin ? i18n.t('login') : i18n.t('register'))}
              </Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  toggleButtonTextActive: {
    color: colors.card,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
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
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
  },
  pickerPlaceholder: {
    color: colors.textSecondary,
  },
  pickerMenu: {
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
  pickerMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerMenuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  photoUpload: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
