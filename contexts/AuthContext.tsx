
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'student' | 'professor';

export interface StudentUser {
  id: string;
  role: 'student';
  fullName: string;
  familyName: string;
  email: string;
  departmentNumber: string;
  section: string;
  photo?: string;
}

export interface ProfessorUser {
  id: string;
  role: 'professor';
  fullName: string;
  email: string;
  professorNumber: string;
  subject: string;
  photo?: string;
}

export type User = StudentUser | ProfessorUser;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (userData: any, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.log('Error saving user:', error);
    }
  };

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get stored users
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Find user with matching email, password, and role
      const foundUser = users.find((u: User) => 
        u.email === email && u.role === role
      );
      
      if (foundUser) {
        // In a real app, you would verify the password hash
        // For demo purposes, we'll assume the password is correct
        await saveUser(foundUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, role: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Generate a unique ID
      const id = Date.now().toString();
      
      // Create user object based on role
      const newUser: User = role === 'student' 
        ? {
            id,
            role: 'student',
            fullName: userData.fullName,
            familyName: userData.familyName,
            email: userData.email,
            departmentNumber: userData.departmentNumber,
            section: userData.section,
            photo: userData.photo,
          }
        : {
            id,
            role: 'professor',
            fullName: userData.fullName,
            email: userData.email,
            professorNumber: userData.professorNumber,
            subject: userData.subject,
            photo: userData.photo,
          };
      
      // Get existing users
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Check if user already exists
      const existingUser = users.find((u: User) => u.email === userData.email);
      if (existingUser) {
        return false; // User already exists
      }
      
      // Add new user
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      // Save as current user
      await saveUser(newUser);
      
      return true;
    } catch (error) {
      console.log('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData };
      await saveUser(updatedUser);
      
      // Update in users list
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.log('Update user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
