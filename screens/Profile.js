import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Alert,
  Image,
  Switch,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { 
  X, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  Tag, 
  Trash2, 
  LogOut,
  Check,
  Sun,
  Moon,
  Plus,
  ShoppingCart,
  Shirt,
  Home,
  Umbrella,
  Car,
  Gift,
  Plane,
  GraduationCap,
  Apple,
  Briefcase,
  Folder,
  Activity,
  Trees,
  Phone,
  Laptop,
  Tablet,
  Bike,
  Train,
  Ship,
  Receipt,
  Heart,
  Sparkles,
  Coins,
  Zap,
  Cat
} from 'lucide-react-native';

// Helper component for Category Icons matching 2nd screenshot
const CategoryIcon = ({ name, color, size = 18 }) => {
  const iconProps = { size, color };
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('supermarket') || lowerName.includes('shopping') || lowerName.includes('grocery') || lowerName.includes('market')) {
    return <ShoppingCart {...iconProps} />;
  }
  if (lowerName.includes('clothing') || lowerName.includes('clothes') || lowerName.includes('shirt') || lowerName.includes('wear')) {
    return <Shirt {...iconProps} />;
  }
  if (lowerName.includes('house') || lowerName.includes('home') || lowerName.includes('rent')) {
    return <Home {...iconProps} />;
  }
  if (lowerName.includes('entertainment') || lowerName.includes('leisure') || lowerName.includes('movie') || lowerName.includes('umbrella') || lowerName.includes('play')) {
    return <Umbrella {...iconProps} />;
  }
  if (lowerName.includes('transport') || lowerName.includes('car') || lowerName.includes('bus') || lowerName.includes('taxi') || lowerName.includes('vehicle') || lowerName.includes('automobile')) {
    return <Car {...iconProps} />;
  }
  if (lowerName.includes('gift') || lowerName.includes('present') || lowerName.includes('donat')) {
    return <Gift {...iconProps} />;
  }
  if (lowerName.includes('travel') || lowerName.includes('flight') || lowerName.includes('plane') || lowerName.includes('trip')) {
    return <Plane {...iconProps} />;
  }
  if (lowerName.includes('education') || lowerName.includes('school') || lowerName.includes('class') || lowerName.includes('book')) {
    return <GraduationCap {...iconProps} />;
  }
  if (lowerName.includes('food') || lowerName.includes('restaurant') || lowerName.includes('eat') || lowerName.includes('drink') || lowerName.includes('cafe') || lowerName.includes('apple') || lowerName.includes('orange') || lowerName.includes('fruit') || lowerName.includes('juice') || lowerName.includes('veg')) {
    return <Apple {...iconProps} />;
  }
  if (lowerName.includes('work') || lowerName.includes('salary') || lowerName.includes('job') || lowerName.includes('business') || lowerName.includes('briefcase')) {
    return <Briefcase {...iconProps} />;
  }
  if (lowerName.includes('sports') || lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('health') || lowerName.includes('activity') || lowerName.includes('run') || lowerName.includes('play')) {
    return <Activity {...iconProps} />;
  }
  if (lowerName.includes('tree') || lowerName.includes('nature') || lowerName.includes('garden') || lowerName.includes('plant') || lowerName.includes('forest')) {
    return <Trees {...iconProps} />;
  }
  if (lowerName.includes('tree') || lowerName.includes('nature') || lowerName.includes('garden') || lowerName.includes('plant') || lowerName.includes('forest')) {
    return <Trees {...iconProps} />;
  }
  if (lowerName.includes('train') || lowerName.includes('rail') || lowerName.includes('subway') || lowerName.includes('metro')) {
    return <Train {...iconProps} />;
  }
  if (lowerName.includes('ship') || lowerName.includes('boat') || lowerName.includes('cruise') || lowerName.includes('ferry')) {
    return <Ship {...iconProps} />;
  }
  if (lowerName.includes('medical') || lowerName.includes('doctor') || lowerName.includes('pharmacy') || lowerName.includes('hospital') || lowerName.includes('medicine') || lowerName.includes('pill') || lowerName.includes('clinic') || lowerName.includes('dentist')) {
    return <Heart {...iconProps} />;
  }
  if (lowerName.includes('beauty') || lowerName.includes('salon') || lowerName.includes('spa') || lowerName.includes('hair') || lowerName.includes('cosmetics') || lowerName.includes('makeup') || lowerName.includes('barber')) {
    return <Sparkles {...iconProps} />;
  }
  if (lowerName.includes('utility') || lowerName.includes('electric') || lowerName.includes('power') || lowerName.includes('energy') || lowerName.includes('gas') || lowerName.includes('water') || lowerName.includes('bill') || lowerName.includes('internet') || lowerName.includes('wifi')) {
    return <Zap {...iconProps} />;
  }
  if (lowerName.includes('receipt') || lowerName.includes('tax') || lowerName.includes('fee') || lowerName.includes('fine') || lowerName.includes('interest') || lowerName.includes('invoice') || lowerName.includes('charge')) {
    return <Receipt {...iconProps} />;
  }
  if (lowerName.includes('pet') || lowerName.includes('dog') || lowerName.includes('cat') || lowerName.includes('animal') || lowerName.includes('vet')) {
    return <Cat {...iconProps} />;
  }
  if (lowerName.includes('cash') || lowerName.includes('money') || lowerName.includes('coin') || lowerName.includes('wealth') || lowerName.includes('invest') || lowerName.includes('stock') || lowerName.includes('crypto') || lowerName.includes('bank') || lowerName.includes('savings') || lowerName.includes('revenue')) {
    return <Coins {...iconProps} />;
  }
  if (lowerName.includes('bike') || lowerName.includes('bicycle') || lowerName.includes('motorcycle') || lowerName.includes('scooter')) {
    return <Bike {...iconProps} />;
  }
  if (lowerName.includes('phone') || lowerName.includes('mobile') || lowerName.includes('call')) {
    return <Phone {...iconProps} />;
  }
  if (lowerName.includes('laptop') || lowerName.includes('computer') || lowerName.includes('pc')) {
    return <Laptop {...iconProps} />;
  }
  if (lowerName.includes('tablet') || lowerName.includes('table') || lowerName.includes('pad')) {
    return <Tablet {...iconProps} />;
  }
  return <Folder {...iconProps} />;
};

const getDefaultColor = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('supermarket') || lowerName.includes('shopping')) return '#ef4444';
  if (lowerName.includes('clothing')) return '#3b82f6';
  if (lowerName.includes('house') || lowerName.includes('home')) return '#94a3b8';
  if (lowerName.includes('entertainment') || lowerName.includes('umbrella')) return '#ec4899';
  if (lowerName.includes('transport') || lowerName.includes('car')) return '#0ea5e9';
  if (lowerName.includes('gift')) return '#f97316';
  if (lowerName.includes('travel') || lowerName.includes('plane')) return '#38bdf8';
  if (lowerName.includes('education')) return '#10b981';
  if (lowerName.includes('food') || lowerName.includes('apple')) return '#ef4444';
  if (lowerName.includes('work') || lowerName.includes('salary')) return '#8b5cf6';
  if (lowerName.includes('sports') || lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('health')) return '#10b981';
  
  const defaults = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9'];
  return defaults[name.length % defaults.length];
};

export default function Profile({ isDarkMode, onToggleTheme, onNavigate }) {
  const { user, logout, deleteAccount, showToast } = useContext(AuthContext);
  const getAvatarStorageKey = () => user && user.email ? `user_avatar_uri_${user.email}` : 'user_avatar_uri';
  
  // Views: 'main', 'categories'
  const [subView, setSubView] = useState('main');
  const [avatarUri, setAvatarUri] = useState(null);

  // Categories Manager States
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#ef4444');
  const [catError, setCatError] = useState('');
  const [savingCat, setSavingCat] = useState(false);
  const [activeCatTab, setActiveCatTab] = useState('expense'); // 'expense' or 'income'
  const [showCreateCatModal, setShowCreateCatModal] = useState(false);

  const presetColors = [
    '#ef4444', '#3b82f6', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'
  ];

  const fetchCategories = async (silent = false) => {
    if (!silent) setLoadingCats(true);
    try {
      const data = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoadingCats(false);
    }
  };

  useEffect(() => {
    // Load local avatar image uri on mount
    AsyncStorage.getItem(getAvatarStorageKey()).then(val => {
      if (val) setAvatarUri(val);
    });
    // Pre-load categories silently
    fetchCategories(true);
  }, []);

  useEffect(() => {
    if (subView === 'categories') {
      fetchCategories(true);
    }
  }, [subView]);

  // Image Picker Logic
  const handleUploadAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need photo library permissions to upload a profile picture.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      await AsyncStorage.setItem(getAvatarStorageKey(), uri);
      showToast('Profile picture uploaded successfully!', 'success');
    }
  };

  const handleDeleteAvatar = async () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to delete your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            setAvatarUri(null);
            await AsyncStorage.removeItem(getAvatarStorageKey());
            showToast('Profile picture removed successfully.', 'info');
          }
        }
      ]
    );
  };

  const handleCreateCategory = async () => {
    if (!catName.trim()) {
      setCatError('Category name cannot be empty');
      return;
    }
    const nameToCheck = catName.trim().toLowerCase();
    const isDuplicate = categories.some(cat => 
      cat.type === activeCatTab && cat.name.trim().toLowerCase() === nameToCheck
    );
    if (isDuplicate) {
      setCatError('Category already exists');
      return;
    }
    setSavingCat(true);
    setCatError('');
    try {
      const finalColor = getDefaultColor(catName.trim());
      await api.post('/categories', {
        name: catName.trim(),
        color: finalColor,
        icon: 'tag',
        type: activeCatTab
      });
      // showToast('Category created successfully!', 'success');
      setCatName('');
      setShowCreateCatModal(false);
      fetchCategories();
    } catch (err) {
      setCatError(err.message || 'Failed to save category');
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      // showToast('Category deleted successfully', 'success');
      fetchCategories();
    } catch (err) {
      showToast('Failed to delete category', 'error');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'WARNING: Delete Account',
      'Are you sure you want to permanently delete your account? This action CANNOT be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (err) {
              showToast('Account deletion failed', 'error');
            }
          }
        }
      ]
    );
  };

  // Theme palettes helper
  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    headerBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    cardBg: isDarkMode ? '#161726' : '#ffffff',
    cardBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    text: isDarkMode ? '#ffffff' : '#0f172a',
    subText: isDarkMode ? '#64748b' : '#64748b',
    btnBg: isDarkMode ? '#161726' : '#f1f5f9',
    btnText: isDarkMode ? '#ffffff' : '#0f172a',
    cardTitle: isDarkMode ? '#ffffff' : '#0f172a',
  };

  if (subView === 'categories') {
    // Filter categories locally:
    const filteredCats = categories.filter(cat => {
      // If the category has a type field matching activeCatTab, show it
      if (cat.type) {
        return cat.type === activeCatTab;
      }
      // If it doesn't have type, default it to 'expense'
      return activeCatTab === 'expense';
    });

    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        {/* Header back bar */}
        <View style={[styles.header, { borderBottomColor: theme.headerBorder }]}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => setSubView('main')}>
            <ChevronLeft size={20} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={[styles.monthLabel, { color: theme.text }]}>Categories</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Expenses / Income Segmented Tab Bar */}
        <View style={[styles.catTabBar, { backgroundColor: isDarkMode ? '#1e202e' : '#cbd5e120' }]}>
          <TouchableOpacity 
            style={[styles.catTab, activeCatTab === 'expense' && styles.catTabActiveExpense]}
            onPress={() => setActiveCatTab('expense')}
          >
            <Text style={[styles.catTabText, { color: activeCatTab === 'expense' ? '#ffffff' : '#94a3b8' }]}>EXPENSES</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.catTab, activeCatTab === 'income' && styles.catTabActiveIncome]}
            onPress={() => setActiveCatTab('income')}
          >
            <Text style={[styles.catTabText, { color: activeCatTab === 'income' ? '#ffffff' : '#94a3b8' }]}>INCOME</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loadingCats ? (
            <ActivityIndicator size="large" color="#10b981" />
          ) : (
            <View style={styles.categoriesList}>
              {filteredCats.map(cat => (
                <View key={cat._id} style={[styles.catListItem, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                  <View style={styles.catListLeft}>
                    <CategoryIcon name={cat.name} color={cat.color || '#3b82f6'} size={18} />
                    <Text style={[styles.catListText, { color: theme.text }]}>{cat.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteCategory(cat._id)}>
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button '+' */}
        <TouchableOpacity 
          style={styles.floatingAddBtn}
          onPress={() => {
            setCatName('');
            setCatError('');
            setShowCreateCatModal(true);
          }}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>

        {/* Add Category Modal dialog (3rd screenshot) */}
        <Modal
          visible={showCreateCatModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCreateCatModal(false)}
        >
          <View style={styles.catModalOverlay}>
            <View style={[styles.catModalCard, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder, borderWidth: 1 }]}>
              {/* Header: Edit category */}
              <View style={styles.catModalHeader}>
                <TouchableOpacity onPress={() => setShowCreateCatModal(false)}>
                  <ChevronLeft size={20} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.catModalTitle, { color: theme.text }]}>Edit category</Text>
                <View style={{ width: 20 }} />
              </View>

              {/* Form Input: Name */}
              <View style={styles.catFormBlock}>
                <Text style={styles.catFormLabel}>Name</Text>
                <TextInput
                  style={[styles.catNameInput, { color: theme.text, borderBottomColor: isDarkMode ? '#cbd5e1' : '#1e293b' }]}
                  placeholder=""
                  placeholderTextColor="#64748b"
                  value={catName}
                  onChangeText={setCatName}
                  autoFocus={true}
                />
                {catError ? <Text style={styles.catErrorText}>{catError}</Text> : null}
              </View>

              {/* Action buttons */}
              <TouchableOpacity 
                style={styles.catModalAddBtn} 
                onPress={handleCreateCategory}
                disabled={savingCat}
              >
                {savingCat ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.catModalAddBtnText}>Add</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.catModalCancelBtn} 
                onPress={() => setShowCreateCatModal(false)}
              >
                <Text style={styles.catModalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // DEFAULT MAIN PROFILE SETTINGS VIEW (Only Categories remaining per request)
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Row */}
      <View style={[styles.header, { borderBottomColor: theme.headerBorder }]}>
        <TouchableOpacity style={styles.controlBtn} onPress={() => onNavigate('Dashboard')}>
          <X size={20} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={[styles.monthLabel, { color: theme.text }]}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Info */}
        <View style={styles.profileInfoContainer}>
          <TouchableOpacity onPress={handleUploadAvatar} style={styles.avatarContainer}>
            <View style={styles.avatarLarge}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarEmoji}>😎</Text>
              )}
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>+</Text>
            </View>
          </TouchableOpacity>
          
          {/* Upload / Delete Actions */}
          <View style={styles.avatarActionsRow}>
            <TouchableOpacity onPress={handleUploadAvatar} style={[styles.avatarActionBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <Text style={styles.avatarActionText}>Upload Photo</Text>
            </TouchableOpacity>
            {avatarUri && (
              <TouchableOpacity onPress={handleDeleteAvatar} style={[styles.avatarActionBtn, styles.avatarDeleteBtn]}>
                <Text style={[styles.avatarActionText, styles.avatarDeleteText]}>Delete Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.profileName, { color: theme.text }]}>{user?.name || 'Rizna Hilmi'}</Text>
          <Text style={[styles.profileEmail, { color: theme.subText }]}>{user?.email || 'hilmirizna@gmail.com'}</Text>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuList, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          {/* Categories */}
          <TouchableOpacity style={styles.menuItem} onPress={() => setSubView('categories')}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBg}>
                <Tag size={16} color="#94a3b8" />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>Categories</Text>
            </View>
            <ChevronRight size={18} color="#64748b" />
          </TouchableOpacity>

          {/* Theme Switcher Toggle (Switch ON/OFF) */}
          <TouchableOpacity style={styles.menuItem} onPress={onToggleTheme} activeOpacity={0.8}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBg}>
                {isDarkMode ? <Sun size={16} color="#94a3b8" /> : <Moon size={16} color="#64748b" />}
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#cbd5e1', true: '#10b981' }}
              thumbColor={isDarkMode ? '#0f172a' : '#ffffff'}
              ios_backgroundColor="#cbd5e1"
              onValueChange={onToggleTheme}
              value={isDarkMode}
              pointerEvents="none"
            />
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, styles.bgRed]}>
                <Trash2 size={16} color="#ef4444" />
              </View>
              <Text style={[styles.menuText, styles.textRed]}>Delete Account</Text>
            </View>
            <ChevronRight size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Log Out at the bottom */}
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]} onPress={logout}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIconBg, styles.bgRed]}>
              <LogOut size={16} color="#ef4444" />
            </View>
            <Text style={[styles.menuText, styles.textRed]}>Log out</Text>
          </View>
          <ChevronRight size={18} color="#64748b" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  controlBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#161726',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarLarge: {
    height: 90,
    width: 90,
    borderRadius: 45,
    backgroundColor: '#fef08a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1e293b',
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarEmoji: {
    fontSize: 44,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  editBadgeText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
    marginTop: -2,
  },
  avatarActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    marginBottom: 16,
  },
  avatarActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  avatarDeleteBtn: {
    backgroundColor: '#ef444415',
    borderColor: '#ef444440',
  },
  avatarActionText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  avatarDeleteText: {
    color: '#ef4444',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  menuList: {
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 8,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  logoutItem: {
    borderRadius: 24,
    borderWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuIconBg: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  bgRed: {
    backgroundColor: '#ef444410',
    borderColor: '#ef444420',
  },
  textRed: {
    color: '#ef4444',
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  colorOption: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionActive: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  submitBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '705',
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 12,
  },
  categoriesList: {
    gap: 10,
  },
  catListItem: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catColorDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  catListText: {
    fontSize: 13,
    fontWeight: '600',
  },
  // Redesigned Categories styles
  catTabBar: {
    height: 48,
    borderRadius: 24,
    padding: 4,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  catTab: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTabActiveExpense: {
    backgroundColor: '#ef4444',
  },
  catTabActiveIncome: {
    backgroundColor: '#8b5cf6',
  },
  catTabText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  // Modal overlay styles
  catModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catModalCard: {
    width: '90%',
    borderRadius: 24,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.84,
  },
  catModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  catModalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  catFormBlock: {
    marginBottom: 24,
  },
  catFormLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  catNameInput: {
    height: 40,
    borderBottomWidth: 1,
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
  },
  catErrorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  catModalAddBtn: {
    backgroundColor: '#3b82f6',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  catModalAddBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  catModalCancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  catModalCancelBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '800',
  },
});
