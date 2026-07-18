import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('budget_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Failed to load user session', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('budget_user', JSON.stringify(data));
    setUser(data);
    showToast('Successfully logged in!', 'success');
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await api.post('/auth/signup', { name, email, password });
    showToast('Account created successfully! Please log in.', 'success');
    return data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('budget_user');
    setUser(null);
    showToast('Logged out successfully!', 'success');
  };

  const updateUserData = async (updatedUser) => {
    const currentUser = { ...user, ...updatedUser };
    await AsyncStorage.setItem('budget_user', JSON.stringify(currentUser));
    setUser(currentUser);
  };

  const deleteAccount = async () => {
    await api.delete('/auth/profile');
    await AsyncStorage.removeItem('budget_user');
    setUser(null);
    showToast('Account deleted successfully.', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUserData,
        deleteAccount,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
