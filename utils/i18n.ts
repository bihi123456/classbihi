
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  en: {
    // Main Interface
    languageChange: 'Language',
    studentSpace: 'Student Space',
    professorSpace: 'Professor Space',
    
    // Authentication
    login: 'Log In',
    createAccount: 'Create Account',
    register: 'Register',
    fullName: 'Full Name',
    familyName: 'Family Name',
    password: 'Password',
    email: 'Email',
    departmentNumber: 'Department Number',
    professorNumber: 'Professor Number',
    selectSection: 'Select Section',
    selectSubject: 'Select Subject',
    uploadPhoto: 'Upload Photo',
    
    // Student Interface
    section: 'Section',
    among: 'Among',
    messages: 'Messages',
    exams: 'Exams',
    presence: 'Presence',
    absences: 'Absences',
    profile: 'Profile',
    editProfile: 'Edit Profile',
    editData: 'Edit Data',
    language: 'Language',
    present: 'Present',
    absent: 'Absent',
    
    // Professor Interface
    publish: 'Publish',
    responses: 'Responses',
    lists: 'Lists',
    activateList: 'Activate List',
    deactivateList: 'Deactivate List',
    insertList: 'Insert List',
    writeExam: 'Write Exam',
    uploadFile: 'Upload File',
    
    // Sections
    sections: {
      LEFR: 'LEFR',
      LESM: 'LESM',
      LESVT: 'LESVT',
      LEAG: 'LEAG',
      LEPS: 'LEPS',
    },
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    
    // Validation
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordTooShort: 'Password must be at least 6 characters',
    
    // Messages
    accountCreated: 'Account created successfully',
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed. Please check your credentials.',
    attendanceRecorded: 'Attendance recorded successfully',
    examPublished: 'Exam published successfully',
  },
  
  fr: {
    // Interface principale
    languageChange: 'Langue',
    studentSpace: 'Espace Étudiant',
    professorSpace: 'Espace Professeur',
    
    // Authentification
    login: 'Se connecter',
    createAccount: 'Créer un compte',
    register: 'S\'inscrire',
    fullName: 'Nom complet',
    familyName: 'Nom de famille',
    password: 'Mot de passe',
    email: 'Email',
    departmentNumber: 'Numéro de département',
    professorNumber: 'Numéro de professeur',
    selectSection: 'Sélectionner une section',
    selectSubject: 'Sélectionner une matière',
    uploadPhoto: 'Télécharger une photo',
    
    // Interface étudiant
    section: 'Section',
    among: 'Parmi',
    messages: 'Messages',
    exams: 'Examens',
    presence: 'Présence',
    absences: 'Absences',
    profile: 'Profil',
    editProfile: 'Modifier le profil',
    editData: 'Modifier les données',
    language: 'Langue',
    present: 'Présent(e)',
    absent: 'Absent(e)',
    
    // Interface professeur
    publish: 'Publier',
    responses: 'Réponses',
    lists: 'Listes',
    activateList: 'Activer la liste',
    deactivateList: 'Désactiver la liste',
    insertList: 'Insérer la liste',
    writeExam: 'Rédiger un examen',
    uploadFile: 'Télécharger un fichier',
    
    // Sections
    sections: {
      LEFR: 'LEFR',
      LESM: 'LESM',
      LESVT: 'LESVT',
      LEAG: 'LEAG',
      LEPS: 'LEPS',
    },
    
    // Commun
    save: 'Enregistrer',
    cancel: 'Annuler',
    submit: 'Soumettre',
    back: 'Retour',
    next: 'Suivant',
    done: 'Terminé',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    
    // Validation
    required: 'Ce champ est requis',
    invalidEmail: 'Veuillez entrer une adresse email valide',
    passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
    
    // Messages
    accountCreated: 'Compte créé avec succès',
    loginSuccess: 'Connexion réussie',
    loginFailed: 'Échec de la connexion. Veuillez vérifier vos identifiants.',
    attendanceRecorded: 'Présence enregistrée avec succès',
    examPublished: 'Examen publié avec succès',
  },
  
  ar: {
    // الواجهة الرئيسية
    languageChange: 'اللغة',
    studentSpace: 'مساحة الطالب',
    professorSpace: 'مساحة الأستاذ',
    
    // المصادقة
    login: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب',
    register: 'التسجيل',
    fullName: 'الاسم الكامل',
    familyName: 'اسم العائلة',
    password: 'كلمة المرور',
    email: 'البريد الإلكتروني',
    departmentNumber: 'رقم القسم',
    professorNumber: 'رقم الأستاذ',
    selectSection: 'اختر القسم',
    selectSubject: 'اختر المادة',
    uploadPhoto: 'رفع صورة',
    
    // واجهة الطالب
    section: 'القسم',
    among: 'بين',
    messages: 'الرسائل',
    exams: 'الامتحانات',
    presence: 'الحضور',
    absences: 'الغيابات',
    profile: 'الملف الشخصي',
    editProfile: 'تعديل الملف الشخصي',
    editData: 'تعديل البيانات',
    language: 'اللغة',
    present: 'حاضر',
    absent: 'غائب',
    
    // واجهة الأستاذ
    publish: 'نشر',
    responses: 'الردود',
    lists: 'القوائم',
    activateList: 'تفعيل القائمة',
    deactivateList: 'إلغاء تفعيل القائمة',
    insertList: 'إدراج القائمة',
    writeExam: 'كتابة امتحان',
    uploadFile: 'رفع ملف',
    
    // الأقسام
    sections: {
      LEFR: 'LEFR',
      LESM: 'LESM',
      LESVT: 'LESVT',
      LEAG: 'LEAG',
      LEPS: 'LEPS',
    },
    
    // عام
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    back: 'رجوع',
    next: 'التالي',
    done: 'تم',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    warning: 'تحذير',
    
    // التحقق
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    passwordTooShort: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    
    // الرسائل
    accountCreated: 'تم إنشاء الحساب بنجاح',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    loginFailed: 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.',
    attendanceRecorded: 'تم تسجيل الحضور بنجاح',
    examPublished: 'تم نشر الامتحان بنجاح',
  },
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fallback to another language with the key present
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Load saved language preference
export const loadLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('language');
    if (savedLanguage) {
      i18n.locale = savedLanguage;
    }
  } catch (error) {
    console.log('Error loading language preference:', error);
  }
};

// Save language preference
export const saveLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem('language', language);
    i18n.locale = language;
  } catch (error) {
    console.log('Error saving language preference:', error);
  }
};

// Get available languages
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

export default i18n;
