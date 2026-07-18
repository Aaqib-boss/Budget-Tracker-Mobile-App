import React, { useState, useContext, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { getApiUrl, setApiUrl } from '../utils/api';
import api from '../utils/api';
import { Mail, Lock, User, Eye, EyeOff, Globe, X, Sun, Moon } from 'lucide-react-native';

export default function LoginSignup({ isDarkMode, onToggleTheme }) {
  const { login, signup, showToast } = useContext(AuthContext);
  
  // Views: 'login', 'signup', 'forgot', 'reset'
  const [view, setView] = useState('login');
  
  // Login Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup Inputs (Fully Decoupled to prevent leak/cross-population)
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  
  // Decoupled Forgot/Reset
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Configurable server API IP address (for Expo Go debugging)
  const [apiUrlInput, setApiUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);

  // Real-time error states
  const [emailError, setEmailError] = useState('');
  const [signupEmailError, setSignupEmailError] = useState('');
  const [recoveryEmailError, setRecoveryEmailError] = useState('');

  useEffect(() => {
    // Load current configured API URL on mount
    getApiUrl().then(url => setApiUrlInput(url));
  }, []);

  const toggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
    }
  };

  const handleSaveApiUrl = async () => {
    if (!apiUrlInput.trim()) return;
    await setApiUrl(apiUrlInput.trim());
    showToast('API Endpoint saved successfully!', 'success');
  };

  // Real-time Validation Helpers
  const validateLoginEmail = (val) => {
    if (!val) {
      setEmailError('Email is required');
      return false;
    }
    if (!val.includes('@')) {
      setEmailError("Email must contain '@' symbol");
      return false;
    }
    const parts = val.split('@');
    if (parts.length < 2 || !parts[1].includes('.')) {
      setEmailError("Email must have a domain (e.g. .com)");
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateSignupEmail = (val) => {
    if (!val) {
      setSignupEmailError('Email is required');
      return false;
    }
    if (!val.includes('@')) {
      setSignupEmailError("Email must contain '@' symbol");
      return false;
    }
    const parts = val.split('@');
    if (parts.length < 2 || !parts[1].includes('.')) {
      setSignupEmailError("Email must have a domain (e.g. .com)");
      return false;
    }
    setSignupEmailError('');
    return true;
  };

  const validateRecoveryEmail = (val) => {
    if (!val) {
      setRecoveryEmailError('Email is required');
      return false;
    }
    if (!val.includes('@')) {
      setRecoveryEmailError("Email must contain '@' symbol");
      return false;
    }
    const parts = val.split('@');
    if (parts.length < 2 || !parts[1].includes('.')) {
      setRecoveryEmailError("Email must have a domain (e.g. .com)");
      return false;
    }
    setRecoveryEmailError('');
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateRecoveryEmail(recoveryEmail)) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('/auth/forgot-password', { email: recoveryEmail });
      showToast(`Verification code sent successfully!`, 'success');
      // Show code to help user verify quickly in testing environments
      if (data && data.code) {
        showToast(`Verification code: ${data.code}`, 'info');
      }
      setView('reset');
    } catch (err) {
      showToast(err.message || 'Failed to send reset code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword || !confirmPassword) {
      showToast('Please fill in all verification details', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: recoveryEmail,
        code: resetCode,
        password: newPassword
      });
      showToast('Password reset successful! Please log in.', 'success');
      changeViewMode('login');
    } catch (err) {
      showToast(err.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    if (view === 'login') {
      if (!validateLoginEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      if (!password) {
        showToast('Please enter your password', 'error');
        return;
      }
      setLoading(true);
      try {
        await login(email, password);
      } catch (err) {
        const errorMsg = err.message === 'Invalid credentials' ? 'Invalid email or password' : (err.message || 'Login failed');
        showToast(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    } else if (view === 'signup') {
      if (!signupName) {
        showToast('Please enter your name', 'error');
        return;
      }
      if (!validateSignupEmail(signupEmail)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      if (!signupPassword) {
        showToast('Please enter your password', 'error');
        return;
      }
      setLoading(true);
      try {
        await signup(signupName, signupEmail, signupPassword);
        
        // Reset signup inputs
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
        
        // Ensure login email/password remain clean (NO pre-filling per user request)
        setEmail('');
        setPassword('');
        
        // Navigate back to login view
        setView('login');
      } catch (err) {
        showToast(err.message || 'Signup failed', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset inputs when toggling views manually to avoid bleedover
  const changeViewMode = (newMode) => {
    setEmail('');
    setPassword('');
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setRecoveryEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setEmailError('');
    setSignupEmailError('');
    setRecoveryEmailError('');
    setView(newMode);
  };

  // Theme palettes helper
  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    cardBg: isDarkMode ? '#161726' : '#ffffff',
    cardBorder: isDarkMode ? '#1e293b' : '#e2e8f0',
    text: isDarkMode ? '#ffffff' : '#0f172a',
    subText: isDarkMode ? '#64748b' : '#64748b',
    inputBg: isDarkMode ? '#0b0f19' : '#f1f5f9',
    inputBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    inputText: isDarkMode ? '#ffffff' : '#0f172a',
    placeholder: isDarkMode ? '#475569' : '#94a3b8',
    switchLink: isDarkMode ? '#94a3b8' : '#64748b'
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.bg }]}
    >
      {/* Top Header theme toggle centered */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
          {isDarkMode ? <Sun size={22} color="#64748b" /> : <Moon size={22} color="#64748b" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* App Branding (Long press money emoji to toggle debug server IP configs) */}
        <TouchableOpacity 
          activeOpacity={1}
          onLongPress={() => setShowApiConfig(true)}
          delayLongPress={1500}
          style={styles.brandContainer}
        >
          <Text style={styles.brandEmoji}>💰</Text>
          <Text style={[styles.brandTitle, { color: theme.text }]}>Smart Budget</Text>
          <Text style={[styles.brandSub, { color: theme.subText }]}>Budget & Savings Tracker</Text>
        </TouchableOpacity>

        {/* View title card */}
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {view === 'login' ? 'Login' : view === 'signup' ? 'Create Account' : view === 'forgot' ? 'Reset Password' : 'Verify Code'}
          </Text>

          {/* Form Fields */}
          {view === 'signup' && (
            <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              <User size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, { color: theme.inputText }]}
                placeholder="Full Name"
                placeholderTextColor={theme.placeholder}
                value={signupName}
                onChangeText={setSignupName}
                autoCapitalize="words"
              />
            </View>
          )}

          {(view === 'login' || view === 'signup') && (
            <>
              {view === 'login' ? (
                <>
                  <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: emailError ? '#ef4444' : theme.inputBorder }]}>
                    <Mail size={18} color="#64748b" style={styles.inputIcon} />
                    <TextInput 
                      style={[styles.input, { color: theme.inputText }]}
                      placeholder="Email Address"
                      placeholderTextColor={theme.placeholder}
                      value={email}
                      onChangeText={(val) => {
                        setEmail(val);
                        validateLoginEmail(val);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {emailError ? <Text style={styles.inlineErrorText}>{emailError}</Text> : null}
                </>
              ) : (
                <>
                  <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: signupEmailError ? '#ef4444' : theme.inputBorder }]}>
                    <Mail size={18} color="#64748b" style={styles.inputIcon} />
                    <TextInput 
                      style={[styles.input, { color: theme.inputText }]}
                      placeholder="Email Address"
                      placeholderTextColor={theme.placeholder}
                      value={signupEmail}
                      onChangeText={(val) => {
                        setSignupEmail(val);
                        validateSignupEmail(val);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {signupEmailError ? <Text style={styles.inlineErrorText}>{signupEmailError}</Text> : null}
                </>
              )}

              {view === 'login' ? (
                <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                  <Lock size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput 
                    style={[styles.input, { color: theme.inputText }]}
                    placeholder="Password"
                    placeholderTextColor={theme.placeholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                  <Lock size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput 
                    style={[styles.input, { color: theme.inputText }]}
                    placeholder="Password"
                    placeholderTextColor={theme.placeholder}
                    value={signupPassword}
                    onChangeText={setSignupPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {view === 'forgot' && (
            <>
              <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: recoveryEmailError ? '#ef4444' : theme.inputBorder }]}>
                <Mail size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput 
                  style={[styles.input, { color: theme.inputText }]}
                  placeholder="Enter registered email"
                  placeholderTextColor={theme.placeholder}
                  value={recoveryEmail}
                  onChangeText={(val) => {
                    setRecoveryEmail(val);
                    validateRecoveryEmail(val);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {recoveryEmailError ? <Text style={styles.inlineErrorText}>{recoveryEmailError}</Text> : null}
            </>
          )}

          {view === 'reset' && (
            <>
              <Text style={[styles.infoText, { color: theme.subText }]}>
                Enter the 6-digit verification code sent to your email and your new password.
              </Text>
              
              <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                <Globe size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput 
                  style={[styles.input, { color: theme.inputText }]}
                  placeholder="6-Digit Reset Code"
                  placeholderTextColor={theme.placeholder}
                  value={resetCode}
                  onChangeText={setResetCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                <Lock size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput 
                  style={[styles.input, { color: theme.inputText }]}
                  placeholder="New Password"
                  placeholderTextColor={theme.placeholder}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                  {showNewPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                </TouchableOpacity>
              </View>

              <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                <Lock size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput 
                  style={[styles.input, { color: theme.inputText }]}
                  placeholder="Confirm New Password"
                  placeholderTextColor={theme.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
              </View>
            </>
          )}

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={() => {
              if (view === 'login' || view === 'signup') {
                handleAuth();
              } else if (view === 'forgot') {
                handleForgotPassword();
              } else if (view === 'reset') {
                handleResetPassword();
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#0f172a" />
            ) : (
              <Text style={styles.submitBtnText}>
                {view === 'login' ? 'Sign In' : view === 'signup' ? 'Sign Up' : view === 'forgot' ? 'Send Reset Code' : 'Reset Password'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Switch links */}
          <View style={styles.switchContainer}>
            {view === 'login' ? (
              <>
                <TouchableOpacity onPress={() => changeViewMode('signup')}>
                  <Text style={[styles.switchLink, { color: theme.switchLink }]}>Don't have an account? <Text style={styles.highlightText}>Sign Up</Text></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.forgotBtn} onPress={() => changeViewMode('forgot')}>
                  <Text style={[styles.forgotText, { color: theme.subText }]}>Forgot password?</Text>
                </TouchableOpacity>
              </>
            ) : view === 'signup' ? (
              <TouchableOpacity onPress={() => changeViewMode('login')}>
                <Text style={[styles.switchLink, { color: theme.switchLink }]}>Already have an account? <Text style={styles.highlightText}>Sign In</Text></Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => changeViewMode('login')}>
                <Text style={[styles.switchLink, { color: theme.switchLink }]}>Back to <Text style={styles.highlightText}>Sign In</Text></Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Modal Debug configuration */}
        <Modal
          visible={showApiConfig}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowApiConfig(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.apiConfigCard}>
              <View style={styles.drawerHeader}>
                <Text style={styles.apiTitle}>Expo Debug Settings</Text>
                <TouchableOpacity onPress={() => setShowApiConfig(false)}>
                  <X size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              <Text style={styles.apiDesc}>
                Inside Expo Go, local MERN servers must be connected via local network IP. Check your computer's terminal for your IP.
              </Text>
              <View style={styles.inputWrapper}>
                <Globe size={16} color="#64748b" style={styles.inputIcon} />
                <TextInput 
                  style={[styles.apiInput, { color: '#ffffff' }]}
                  placeholder="e.g. http://192.168.1.100:5000/api"
                  placeholderTextColor="#475569"
                  value={apiUrlInput}
                  onChangeText={setApiUrlInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <TouchableOpacity style={styles.saveApiBtn} onPress={() => { handleSaveApiUrl(); setShowApiConfig(false); }}>
                <Text style={styles.saveApiText}>Apply Server Endpoint</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 80,
    paddingBottom: 48,
  },
  topHeader: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  themeBtn: {
    padding: 8,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 8,
  },
  submitBtn: {
    backgroundColor: '#10b981',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  switchContainer: {
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  switchLink: {
    fontSize: 13,
  },
  highlightText: {
    color: '#10b981',
    fontWeight: '700',
  },
  forgotBtn: {
    marginTop: 4,
  },
  forgotText: {
    fontSize: 12,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  inlineErrorText: {
    color: '#ef4444',
    fontSize: 11,
    marginTop: -10,
    marginBottom: 14,
    marginLeft: 4,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 24,
  },
  apiConfigCard: {
    backgroundColor: '#0b0f19',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 14,
  },
  apiTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  apiDesc: {
    color: '#475569',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 14,
    marginTop: 10,
  },
  apiInput: {
    flex: 1,
    fontSize: 13,
  },
  saveApiBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveApiText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
});
