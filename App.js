import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginSignup from './screens/LoginSignup';
import Dashboard from './screens/Dashboard';
import Transactions from './screens/Transactions';
import Budgets from './screens/Budgets';
import Goals from './screens/Goals';
import CalendarView from './screens/CalendarView';
import Profile from './screens/Profile';
// import Analytics from './screens/Analytics';
import Balance from './screens/Balance';
import { 
  LayoutGrid, 
  Receipt, 
  PieChart, 
  Target, 
  Calendar, 
  User,
  Wallet
} from 'lucide-react-native';

function MainAppContent() {
  const { user, loading, toast } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState('Dashboard'); // 'Dashboard', 'Transactions', 'Budgets', 'Goals', 'Calendar', 'Profile'
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load theme setting on mount
  React.useEffect(() => {
    AsyncStorage.getItem('budget_theme').then(val => {
      if (val === 'light') setIsDarkMode(false);
    });
  }, []);

  // Reset navigation to Calendar/Dashboard on auth changes
  React.useEffect(() => {
    setCurrentTab('Dashboard');
  }, [user]);

  const toggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    await AsyncStorage.setItem('budget_theme', next ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading Budget Tracker...</Text>
      </View>
    );
  }

  // View Router
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Active Screen */}
      <View style={styles.screenContainer}>
        {!user ? (
          <LoginSignup isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
        ) : (
          <>
            <View style={{ flex: 1, display: currentTab === 'Dashboard' ? 'flex' : 'none' }}>
              <Dashboard isDarkMode={isDarkMode} currentTab={currentTab} onNavigate={setCurrentTab} />
            </View>
            <View style={{ flex: 1, display: currentTab === 'Transactions' ? 'flex' : 'none' }}>
              <Transactions isDarkMode={isDarkMode} />
            </View>
            <View style={{ flex: 1, display: currentTab === 'Budgets' ? 'flex' : 'none' }}>
              <Budgets isDarkMode={isDarkMode} />
            </View>
            <View style={{ flex: 1, display: currentTab === 'Goals' ? 'flex' : 'none' }}>
              <Goals isDarkMode={isDarkMode} />
            </View>
            <View style={{ flex: 1, display: currentTab === 'Calendar' ? 'flex' : 'none' }}>
              <CalendarView isDarkMode={isDarkMode} />
            </View>
            <View style={{ flex: 1, display: currentTab === 'Profile' ? 'flex' : 'none' }}>
              <Profile isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onNavigate={setCurrentTab} />
            </View>
            {/* <View style={{ flex: 1, display: currentTab === 'Analytics' ? 'flex' : 'none' }}>
              <Analytics isDarkMode={isDarkMode} onBack={() => setCurrentTab('Dashboard')} />
            </View> */}
            <View style={{ flex: 1, display: currentTab === 'Balance' ? 'flex' : 'none' }}>
              <Balance isDarkMode={isDarkMode} onNavigate={setCurrentTab} currentTab={currentTab} />
            </View>
          </>
        )}
      </View>

      {/* Global Toast Alert */}
      {toast && (
        <View style={[styles.toast, toast.type === 'success' ? styles.toastSuccess : toast.type === 'error' ? styles.toastError : styles.toastInfo]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

      {/* Bottom Tab Bar */}
      {user && (
        <View style={[styles.tabBar, { backgroundColor: isDarkMode ? '#161726' : '#ffffff', borderTopColor: isDarkMode ? '#1e293b' : '#cbd5e1' }]}>

          <TouchableOpacity 
            style={[styles.tabItem, currentTab === 'Dashboard' && styles.tabItemActivePill]} 
            onPress={() => setCurrentTab('Dashboard')}
          >
            <Calendar size={22} color={currentTab === 'Dashboard' ? '#38bdf8' : '#64748b'} />
            {currentTab === 'Dashboard' && (
              <Text style={styles.activePillLabel}>Calendar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, currentTab === 'Balance' && styles.tabItemActivePill]} 
            onPress={() => setCurrentTab('Balance')}
          >
            <Wallet size={22} color={currentTab === 'Balance' ? '#38bdf8' : '#64748b'} />
            {currentTab === 'Balance' && (
              <Text style={styles.activePillLabel}>Balance</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 70 : 80,
    backgroundColor: '#0b0f19',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 12 : 15,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tabItemActivePill: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  activePillLabel: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '700',
  },
  toast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastSuccess: {
    backgroundColor: '#064e3b',
    borderColor: '#059669',
    borderWidth: 1,
  },
  toastError: {
    backgroundColor: '#4c0519',
    borderColor: '#e11d48',
    borderWidth: 1,
  },
  toastInfo: {
    backgroundColor: '#1e1b4b',
    borderColor: '#4f46e5',
    borderWidth: 1,
  },
  toastText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
