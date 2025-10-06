
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, buttonStyles, textStyles } from '@/styles/commonStyles';
import i18n from '@/utils/i18n';
import { useAuth, StudentUser } from '@/contexts/AuthContext';

export default function StudentProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const studentUser = user as StudentUser;
  
  const [formData, setFormData] = useState({
    fullName: studentUser?.fullName || '',
    familyName: studentUser?.familyName || '',
    email: studentUser?.email || '',
    departmentNumber: studentUser?.departmentNumber || '',
    photo: studentUser?.photo || '',
  });

  const handleImagePicker = async () => {
    if (!isEditing) return;
    
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

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      await updateUser(formData);
      setIsEditing(false);
      Alert.alert(i18n.t('success'), 'Profile updated successfully');
    } catch (error) {
      console.log('Error updating profile:', error);
      Alert.alert(i18n.t('error'), 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: studentUser?.fullName || '',
      familyName: studentUser?.familyName || '',
      email: studentUser?.email || '',
      departmentNumber: studentUser?.departmentNumber || '',
      photo: studentUser?.photo || '',
    });
    setIsEditing(false);
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
        <Text style={styles.headerTitle}>{i18n.t('profile')}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => isEditing ? handleCancel() : setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? i18n.t('cancel') : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={handleImagePicker}
            disabled={!isEditing}
          >
            {formData.photo ? (
              <Image source={{ uri: formData.photo }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <IconSymbol name="person.circle" size={80} color={colors.textSecondary} />
              </View>
            )}
            {isEditing && (
              <View style={styles.photoEditOverlay}>
                <IconSymbol name="camera" size={24} color={colors.card} />
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.profileName}>
            {formData.fullName} {formData.familyName}
          </Text>
          <Text style={styles.profileSection}>
            Section: {studentUser?.section}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('fullName')}</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              editable={isEditing}
              placeholder={i18n.t('fullName')}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('familyName')}</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.familyName}
              onChangeText={(text) => setFormData({ ...formData, familyName: text })}
              editable={isEditing}
              placeholder={i18n.t('familyName')}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('email')}</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={formData.email}
              editable={false}
              placeholder={i18n.t('email')}
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('departmentNumber')}</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.departmentNumber}
              onChangeText={(text) => setFormData({ ...formData, departmentNumber: text })}
              editable={isEditing}
              placeholder={i18n.t('departmentNumber')}
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Section</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={studentUser?.section}
              editable={false}
              placeholder="Section"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.helperText}>Section cannot be changed after registration</Text>
          </View>

          {isEditing && (
            <TouchableOpacity
              style={[buttonStyles.primary, isLoading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={textStyles.buttonPrimary}>
                {isLoading ? i18n.t('loading') : i18n.t('save')}
              </Text>
            </TouchableOpacity>
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
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoEditOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  profileSection: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
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
  inputDisabled: {
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
