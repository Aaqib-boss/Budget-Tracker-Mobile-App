import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Image,
  Alert,
  Keyboard as RNKeyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Line } from 'react-native-svg';
import { 
  X, 
  Plus, 
  ChevronDown, 
  Calendar as CalendarIcon, 
  Calculator, 
  ChevronRight, 
  Keyboard, 
  Clock, 
  Pencil, 
  ChevronLeft,
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
  Cat,
  ArrowLeft,
  ArrowLeftRight,
  Edit3
} from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import balanceIllustration from '../balance_illustration.png';
import api from '../utils/api';

// Custom Account Type Logos matching 3rd screenshot
const AccountTypeLogo = ({ type }) => {
  switch (type) {
    case 'Master Card':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 22, height: 14, marginRight: 10 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#ea1d22', position: 'absolute', left: 0 }} />
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#f9a01b', opacity: 0.8, position: 'absolute', left: 7 }} />
        </View>
      );
    case 'Visa':
      return (
        <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 4, borderRadius: 2, marginRight: 10, height: 14, justifyContent: 'center' }}>
          <Text style={{ color: '#1a1f71', fontSize: 8, fontWeight: '900', fontStyle: 'italic' }}>VISA</Text>
        </View>
      );
    case 'Blue Card':
      return <View style={{ width: 20, height: 13, borderRadius: 2, backgroundColor: '#2563eb', marginRight: 10 }} />;
    case 'Black Card':
      return <View style={{ width: 20, height: 13, borderRadius: 2, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#ffffff44', marginRight: 10 }} />;
    case 'Green Card':
      return <View style={{ width: 20, height: 13, borderRadius: 2, backgroundColor: '#16a34a', marginRight: 10 }} />;
    case 'White Card':
      return <View style={{ width: 20, height: 13, borderRadius: 2, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', marginRight: 10 }} />;
    case 'Red Card':
      return <View style={{ width: 20, height: 13, borderRadius: 2, backgroundColor: '#dc2626', marginRight: 10 }} />;
    case 'Wallet':
      return <View style={{ width: 20, height: 14, borderRadius: 2, backgroundColor: '#ea580c', marginRight: 10 }} />;
    case 'Cryptocurrency':
      return (
        <View style={{ width: 15, height: 15, borderRadius: 7.5, backgroundColor: '#d97706', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <Text style={{ color: '#ffffff', fontSize: 8, fontWeight: '900' }}>B</Text>
        </View>
      );
    case 'Cash':
      return (
        <View style={{ width: 20, height: 12, borderRadius: 2, backgroundColor: '#15803d', borderWidth: 1, borderColor: '#166534', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, borderWidth: 0.5, borderColor: '#ffffff88' }} />
        </View>
      );
    case 'Saving':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>💰</Text>;
    case 'Gold':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>🪙</Text>;
    case 'Safe':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>📁</Text>;
    case 'Safe ':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>🔒</Text>;
    case 'Bank':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>🏦</Text>;
    case 'Bank ':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>🏛️</Text>;
    case 'Piggy bank':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>🐷</Text>;
    case 'Investment':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>📈</Text>;
    case 'StartUp':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>🚀</Text>;
    case 'Locked':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>🔒</Text>;
    case 'None':
      return <Text style={{ fontSize: 14, marginRight: 10 }}>➖</Text>;
    default:
      return null;
  }
};

const COLORS = [
  '#f3f4f6', '#fca5a5', '#f87171', '#ef4444',
  '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
  '#f472b6', '#ec4899', '#db2777', '#be185d',
  '#9d174d', '#831843', '#c084fc', '#a855f7',
  '#8b5cf6', '#7c3aed', '#6d28d9', '#4c1d95',
  '#f97316', '#ea580c', '#c2410c', '#9a3412',
  '#facc15', '#eab308', '#ca8a04', '#a16207',
  '#bef264', '#a3e635', '#84cc16', '#65a30d',
  '#22c55e', '#16a34a', '#15803d', '#14532d',
  '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1',
  '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af',
  '#64748b', '#475569', '#334155', '#1e293b',
  '#a1a1aa', '#71717a', '#52525b', '#27272a',
  '#78350f', '#451a03', '#f8fafc', '#090d16'
];

// Helper component for Category Icons
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

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const parseDateString = (str) => {
  if (!str || str === 'None') return new Date();
  const parts = str.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const year = parseInt(parts[2], 10);
    const monthIdx = MONTH_NAMES.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase().slice(0, 3)));
    if (monthIdx !== -1 && !isNaN(day) && !isNaN(year)) {
      return new Date(year, monthIdx, day);
    }
  }
  
  const slashParts = str.split('/');
  if (slashParts.length === 3) {
    const day = parseInt(slashParts[0], 10);
    const month = parseInt(slashParts[1], 10) - 1;
    const year = parseInt(slashParts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
};

const formatDateToPreset = (date) => {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateToHeader = (date) => {
  return `${date.getDate()} ${SHORT_MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateToInput = (date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const getCalendarDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const startIdx = (firstDay + 6) % 7;
  
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevTotalDays = new Date(year, month, 0).getDate();
  
  const cells = [];
  
  for (let i = startIdx - 1; i >= 0; i--) {
    cells.push({
      day: prevTotalDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevTotalDays - i)
    });
  }
  
  for (let i = 1; i <= totalDays; i++) {
    cells.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }
  
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }
  
  return cells;
};

const ACCOUNT_TYPES = [
  'Master Card',
  'Visa',
  'Blue Card',
  'Black Card',
  'Green Card',
  'White Card',
  'Red Card',
  'Wallet',
  'Cryptocurrency',
  'Cash',
  'Saving',
  'Gold',
  'Safe',
  'Safe ',
  'Bank',
  'Bank ',
  'Piggy bank',
  'Investment',
  'StartUp',
  'Locked',
  'None'
];

export default function Balance({ isDarkMode, onNavigate, currentTab }) {
  const { user } = useContext(AuthContext);
  const getStorageKey = () => user && user.email ? `user_accounts_${user.email}` : 'user_accounts';
  const getAvatarStorageKey = () => user && user.email ? `user_avatar_uri_${user.email}` : 'user_avatar_uri';
  const [avatarUri, setAvatarUri] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  // Main form modal visibility
  const [showAddModal, setShowAddModal] = useState(false);
  // Nested Account Type picker list visibility (3rd screenshot)
  const [showTypePicker, setShowTypePicker] = useState(false);
  // Nested Color Picker grid modal visibility
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState('#451a03');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false);

  // Form Fields
  const [accountName, setAccountName] = useState('');
  const [activeTab, setActiveTab] = useState('BALANCE'); // 'CREDIT' or 'BALANCE'
  const [amount, setAmount] = useState('');
  const [creditLimit, setCreditLimit] = useState('0');
  const [paymentDate, setPaymentDate] = useState('None');
  const [remindOpt, setRemindOpt] = useState('Don\'t remind');
  const [iconOpt, setIconOpt] = useState('Choose an icon');
  const [accountType, setAccountType] = useState('None');
  const [categoryOpt, setCategoryOpt] = useState('');
  const [categories, setCategories] = useState([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [colorHex, setColorHex] = useState('#451a03'); // Brown preview bar (screenshot matching)
  const [notes, setNotes] = useState('');

  // Transfer states
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferSource, setTransferSource] = useState('None');
  const [transferDest, setTransferDest] = useState('None');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDatePreset, setTransferDatePreset] = useState('Today');
  const [transferTime, setTransferTime] = useState('12:00 pm');
  const [transferNotes, setTransferNotes] = useState('');
  const [showTransferAccountPicker, setShowTransferAccountPicker] = useState(false);
  const [showTransferDateDropdown, setShowTransferDateDropdown] = useState(false);
  const [accountPickerMode, setAccountPickerMode] = useState('source'); // 'source' | 'dest'
  
  // Custom Material Date Picker states
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showClockPicker, setShowClockPicker] = useState(false);
  const [clockHour, setClockHour] = useState(12);
  const [clockMinute, setClockMinute] = useState(0);
  const [clockAmPm, setClockAmPm] = useState('PM');
  const [clockMode, setClockMode] = useState('analog');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDatePickerDate, setSelectedDatePickerDate] = useState(new Date());
  const [datePickerMode, setDatePickerMode] = useState('calendar'); // 'calendar' | 'text'
  const [dateTextInput, setDateTextInput] = useState('');

  // Calculator states & refs
  const [showCustomCalc, setShowCustomCalc] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'amount' | 'creditLimit'
  const [amountKeyboardMode, setAmountKeyboardMode] = useState('calc'); // 'calc' | 'system'
  const [creditLimitKeyboardMode, setCreditLimitKeyboardMode] = useState('calc'); // 'calc' | 'system'
  const amountRef = useRef(null);
  const creditLimitRef = useRef(null);

  const handleOpenAccountDetails = (acc) => {
    setSelectedAccount(acc);
    setShowAccountDetailsModal(true);
  };

  const handleEditAccount = () => {
    setIsEditingAccount(true);
    setEditingAccountId(selectedAccount.id);
    setAccountName(selectedAccount.name);
    setAmount(selectedAccount.balance.toString());
    setAccountType(selectedAccount.type);
    setCategoryOpt(selectedAccount.category || 'None');
    setNotes(selectedAccount.notes || '');
    setActiveTab(selectedAccount.mode || 'BALANCE');
    
    setShowAccountDetailsModal(false);
    setShowAddModal(true);
  };

  const handleRemoveAccount = () => {
    Alert.alert(
      'Remove Account',
      `Are you sure you want to delete account "${selectedAccount.name}"? This will delete the account local record.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updated = accounts.filter(acc => acc.id !== selectedAccount.id);
            setAccounts(updated);
            try {
              await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updated));
            } catch (err) {
              console.error(err);
            }
            setShowAccountDetailsModal(false);
            setSelectedAccount(null);
          }
        }
      ]
    );
  };

  const handleOpenAddAccount = () => {
    setAccountName('');
    setAmount('');
    setCategoryOpt('');
    setNotes('');
    setAccountType('None');
    setPaymentDate('None');
    setActiveTab('BALANCE');
    setShowAddModal(true);
  };

  const getSelectedCategoryColor = () => {
    const found = categories.find(cat => cat.name === categoryOpt);
    return found ? found.color : '#3b82f6';
  };

  const getTransferAccountType = (accName) => {
    const found = accounts.find(acc => acc.name === accName);
    return found ? found.type : 'None';
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setShowTypePicker(false);
    setShowColorPicker(false);
    setShowPaymentDatePicker(false);
    setShowCategoryPicker(false);
    setShowCustomCalc(false);
    setActiveField(null);
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
    setShowTransferAccountPicker(false);
    setShowTransferDateDropdown(false);
    setShowDatePickerModal(false);
    setShowCustomCalc(false);
    setActiveField(null);
    setShowClockPicker(false);
  };

  const handleOpenClockPicker = () => {
    try {
      const match = transferTime.match(/^(\d+):(\d+)\s*(am|pm)$/i);
      if (match) {
        setClockHour(parseInt(match[1], 10));
        setClockMinute(parseInt(match[2], 10));
        setClockAmPm(match[3].toUpperCase());
      }
    } catch (e) {
      console.log(e);
    }
    setClockMode('analog');
    setShowClockPicker(true);
  };

  const handleSaveClockTime = () => {
    setTransferTime(`${clockHour}:${String(clockMinute).padStart(2, '0')} ${clockAmPm.toLowerCase()}`);
    setShowClockPicker(false);
  };

  const handleKeyPress = (val) => {
    let currentVal = activeField === 'amount' ? amount : (activeField === 'transferAmount' ? transferAmount : creditLimit);
    
    if (val === 'C') {
      currentVal = '';
    } else if (val === 'backspace') {
      currentVal = currentVal.slice(0, -1);
    } else if (val === 'submit') {
      try {
        let sanitized = currentVal.replace(/×/g, '*').replace(/÷/g, '/');
        if (sanitized) {
          const evalResult = new Function(`return (${sanitized})`)();
          if (evalResult !== undefined && !isNaN(evalResult)) {
            currentVal = String(Number(evalResult).toFixed(2));
          }
        }
      } catch (e) {
        console.log('Error evaluating expression', e);
      }
      setShowCustomCalc(false);
      setActiveField(null);
    } else {
      currentVal = currentVal + val;
    }
    
    if (activeField === 'amount') {
      setAmount(currentVal);
    } else if (activeField === 'transferAmount') {
      setTransferAmount(currentVal);
    } else {
      setCreditLimit(currentVal);
    }
  };

  // Load user data on mount
  useEffect(() => {
    AsyncStorage.getItem(getAvatarStorageKey()).then(val => {
      setAvatarUri(val);
    });
    loadAccounts();
    loadCategories();
  }, []);

  // Reload categories & accounts on focus
  useEffect(() => {
    if (currentTab === 'Balance') {
      loadAccounts();
      loadCategories();
      AsyncStorage.getItem(getAvatarStorageKey()).then(val => {
        setAvatarUri(val);
      });
    }
  }, [currentTab]);

  const formatDateString = (d) => {
    const day = d.getDate();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  useEffect(() => {
    if (showTransferModal) {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTransferTime(`${hours}:${minutes} ${ampm}`);
      setTransferDatePreset(formatDateString(now));
      setTransferSource('None');
      setTransferDest('None');
      setTransferAmount('');
      setTransferNotes('');
    }
  }, [showTransferModal]);

  const handleOpenDatePicker = () => {
    const parsed = parseDateString(transferDatePreset);
    setSelectedDatePickerDate(parsed);
    setCalendarDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    setDateTextInput(formatDateToInput(parsed));
    setDatePickerMode('calendar');
    setShowDatePickerModal(true);
  };

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const handleToggleInputMode = () => {
    if (datePickerMode === 'calendar') {
      setDateTextInput(formatDateToInput(selectedDatePickerDate));
      setDatePickerMode('text');
    } else {
      const parsed = parseDateString(dateTextInput);
      if (parsed) {
        setSelectedDatePickerDate(parsed);
        setCalendarDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
      setDatePickerMode('calendar');
    }
  };

  const handleSaveDatePicker = () => {
    let finalDate = selectedDatePickerDate;
    if (datePickerMode === 'text') {
      const parsed = parseDateString(dateTextInput);
      if (parsed) {
        finalDate = parsed;
      }
    }
    setTransferDatePreset(formatDateToPreset(finalDate));
    setShowDatePickerModal(false);
  };

  const handleSaveTransfer = async () => {
    if (transferSource === 'None' || transferDest === 'None') {
      Alert.alert('Error', 'Please select both source and destination accounts');
      return;
    }
    if (transferSource === transferDest) {
      Alert.alert('Error', 'Source and destination accounts must be different');
      return;
    }
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Error', 'Please enter a valid transfer amount');
      return;
    }

    // Find source and destination accounts
    const updatedAccounts = accounts.map(acc => {
      if (acc.name === transferSource) {
        return { ...acc, balance: acc.balance - amt };
      }
      if (acc.name === transferDest) {
        return { ...acc, balance: acc.balance + amt };
      }
      return acc;
    });

    setAccounts(updatedAccounts);
    try {
      await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updatedAccounts));
      // Save transfer transactions silently to the database
      await api.post('/transactions', {
        amount: amt,
        type: 'expense',
        category: 'Transfer',
        note: `Transfer to ${transferDest}: ${transferNotes}`,
        date: new Date(),
        account: transferSource
      });
      await api.post('/transactions', {
        amount: amt,
        type: 'income',
        category: 'Transfer',
        note: `Transfer from ${transferSource}: ${transferNotes}`,
        date: new Date(),
        account: transferDest
      });
      await loadTransactions();
      closeTransferModal();
      Alert.alert('Success', 'Transfer completed successfully');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to complete transfer');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await api.get('/transactions');
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAccounts = async () => {
    try {
      const stored = await AsyncStorage.getItem(getStorageKey());
      if (stored) {
        setAccounts(JSON.parse(stored));
      } else {
        setAccounts([]);
      }
      await loadTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleSaveAccount = async () => {
    if (!accountName.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in Name and Amount fields');
      return;
    }
    if (!categoryOpt) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    let updated;
    if (isEditingAccount) {
      updated = accounts.map(acc => {
        if (acc.id === editingAccountId) {
          return {
            ...acc,
            name: accountName,
            type: accountType,
            balance: parseFloat(amount) || 0,
            mode: activeTab,
            category: categoryOpt,
            notes: notes
          };
        }
        return acc;
      });
    } else {
      const newAcc = {
        id: Date.now().toString(),
        name: accountName,
        type: accountType,
        balance: parseFloat(amount) || 0,
        mode: activeTab,
        category: categoryOpt,
        notes: notes
      };
      updated = [...accounts, newAcc];
    }

    setAccounts(updated);
    try {
      await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    // Reset and close
    setAccountName('');
    setAmount('');
    setCategoryOpt('');
    setNotes('');
    setAccountType('None');
    setPaymentDate('None');
    setActiveTab('BALANCE');
    setIsEditingAccount(false);
    setEditingAccountId(null);
    closeAddModal();
  };

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    text: isDarkMode ? '#ffffff' : '#0f172a',
    subText: isDarkMode ? '#94a3b8' : '#475569',
    cardBg: isDarkMode ? '#161726' : '#ffffff',
    cardBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    headerBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    addButtonBg: isDarkMode ? '#1e293b' : '#e2e8f0',
    modalOverlayBg: 'rgba(0, 0, 0, 0.6)',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Row */}
      <View style={[styles.header, { borderBottomColor: theme.headerBorder }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => onNavigate('Profile')} style={styles.avatarBtn}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{user?.name?.slice(0, 2).toUpperCase() || 'US'}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Balance</Text>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity 
            style={[styles.addAccountBtn, { backgroundColor: theme.addButtonBg, borderColor: theme.cardBorder }]}
            onPress={() => setShowTransferModal(true)}
          >
            <Text style={{ fontSize: 13, color: theme.text }}>🏦 Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.addAccountBtn, { backgroundColor: theme.addButtonBg, borderColor: theme.cardBorder }]}
            onPress={handleOpenAddAccount}
          >
            <Plus size={14} color={theme.text} />
            <Text style={[styles.addAccountText, { color: theme.text }]}>Add Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, accounts.length > 0 && { justifyContent: 'flex-start' }]}>
        {loadingAccounts ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 250 }}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : accounts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image 
              source={balanceIllustration} 
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={[styles.emptyLabel, { color: theme.subText }]}>No saved Accounts</Text>
            <TouchableOpacity onPress={handleOpenAddAccount}>
              <Text style={styles.createLink}>Tap to create</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.accountsList}>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>Accounts</Text>
            {accounts.map(acc => (
              <TouchableOpacity 
                key={acc.id} 
                style={[styles.accountCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                onPress={() => handleOpenAccountDetails(acc)}
              >
                <View style={styles.accLeft}>
                  <View style={styles.iconWrapper}>
                    <AccountTypeLogo type={acc.type} />
                  </View>
                  <View>
                    <Text style={[styles.accName, { color: theme.text }]}>{acc.name}</Text>
                    <Text style={[styles.accType, { color: theme.subText }]}>{acc.type}</Text>
                  </View>
                </View>
                <Text style={[styles.accBalance, { color: theme.text }]}>RS.{acc.balance.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Account Details Modal */}
      {selectedAccount && (
        <Modal
          visible={showAccountDetailsModal}
          animationType="slide"
          onRequestClose={() => setShowAccountDetailsModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: isDarkMode ? '#13141f' : '#f8fafc', paddingTop: Platform.OS === 'ios' ? 50 : 35 }}>
            {/* Header */}
            <View style={[styles.detailsHeader, { borderBottomColor: theme.cardBorder, borderBottomWidth: 1 }]}>
              <TouchableOpacity onPress={() => setShowAccountDetailsModal(false)} style={styles.backButton}>
                <ArrowLeft size={24} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.detailsHeaderTitle, { color: theme.text }]}>
                {selectedAccount.name}
              </Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {/* Account summary card */}
              <View style={[styles.accountSummaryCard, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <AccountTypeLogo type={selectedAccount.type} />
                    <Text style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 14 }}>
                      Account balance
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleEditAccount} style={{ padding: 8 }}>
                    <Edit3 size={18} color="#3b82f6" />
                  </TouchableOpacity>
                </View>
                <Text style={{ color: '#22c55e', fontSize: 28, fontWeight: '800', marginTop: 12 }}>
                  RS.{selectedAccount.balance.toFixed(2)}
                </Text>
              </View>

              {/* Transactions List */}
              <Text style={[styles.sectionHeading, { color: theme.text, marginTop: 24, marginBottom: 12 }]}>
                Transactions
              </Text>
              
              {(() => {
                const filtered = transactions.filter(t => t.account === selectedAccount.name);
                if (filtered.length === 0) {
                  return (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: '#64748b' }}>No transactions recorded for this account</Text>
                    </View>
                  );
                }
                return filtered.map(t => {
                  const isIncome = t.type === 'income';
                  const isTransfer = t.category === 'Transfer';
                  
                  let iconColor = '#3b82f6';
                  if (isTransfer) {
                    iconColor = '#8b5cf6';
                  } else {
                    const foundCat = categories.find(c => c.name === t.category);
                    if (foundCat) iconColor = foundCat.color;
                  }
                  
                  return (
                    <View 
                      key={t._id} 
                      style={[
                        styles.pickerItemRow, 
                        { 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          paddingVertical: 14,
                          borderBottomWidth: 1,
                          borderBottomColor: theme.cardBorder
                        }
                      ]}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: `${iconColor}20`, alignItems: 'center', justifyContent: 'center' }}>
                          {isTransfer ? (
                            <ArrowLeftRight size={18} color={iconColor} />
                          ) : (
                            <CategoryIcon name={t.category} color={iconColor} size={18} />
                          )}
                        </View>
                        <View>
                          <Text style={{ color: theme.text, fontWeight: '600', fontSize: 14 }}>
                            {isTransfer ? (t.note || 'Transfer') : (t.note ? JSON.parse(t.note).name || t.category : t.category)}
                          </Text>
                          <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                            {formatDateString(new Date(t.date))}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: isIncome ? '#22c55e' : (isDarkMode ? '#ffffff' : '#0f172a'), fontWeight: '700', fontSize: 14 }}>
                        {isIncome ? '+' : '-'}RS.{t.amount.toFixed(2)}
                      </Text>
                    </View>
                  );
                });
              })()}
            </ScrollView>

            {/* Bottom buttons container */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 45, paddingTop: 10, gap: 12 }}>
              <TouchableOpacity 
                style={{
                  backgroundColor: '#3b82f6',
                  borderRadius: 16,
                  height: 52,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#3b82f6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }} 
                onPress={() => setShowAccountDetailsModal(false)}
              >
                <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 16 }}>OK</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ paddingVertical: 12, alignItems: 'center' }} 
                onPress={handleRemoveAccount}
              >
                <Text style={{ color: '#ef4444', fontWeight: '800', fontSize: 15 }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Main Full-Screen Form Modal (1st & 2nd screenshots) */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={closeAddModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: isDarkMode ? '#13141f' : '#f8fafc' }}
        >
          <View style={[styles.formScreenContainer, { backgroundColor: isDarkMode ? '#13141f' : '#f8fafc', flex: 1 }]}>
          {/* Form Header */}
          <View style={styles.formHeader}>
            <TouchableOpacity onPress={closeAddModal} style={styles.backButton}>
              <Text style={[styles.backArrowText, { color: theme.text }]}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.formHeaderTitle, { color: theme.text }]}>Add new account</Text>
          </View>

          <ScrollView contentContainerStyle={styles.formScrollContent}>
            {/* Account Name input field */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabelSmall}>Name</Text>
              <TextInput
                style={[styles.underlineInput, { color: theme.text, borderBottomColor: isDarkMode ? '#cbd5e1' : '#1e293b' }]}
                placeholder=""
                placeholderTextColor="#64748b"
                value={accountName}
                onChangeText={setAccountName}
              />
            </View>

            {/* Credit / Balance Segment Tabs */}
            <View style={[styles.segmentContainer, { backgroundColor: isDarkMode ? '#1a1b26' : '#cbd5e1' }]}>
              <TouchableOpacity 
                style={[styles.segmentTab, activeTab === 'CREDIT' && styles.segmentTabActiveCredit]} 
                onPress={() => setActiveTab('CREDIT')}
              >
                <Text style={[styles.segmentTabText, { color: activeTab === 'CREDIT' ? '#ffffff' : '#94a3b8' }]}>CREDIT</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.segmentTab, activeTab === 'BALANCE' && styles.segmentTabActiveBalance]} 
                onPress={() => setActiveTab('BALANCE')}
              >
                <Text style={[styles.segmentTabText, { color: '#ffffff' }]}>BALANCE</Text>
              </TouchableOpacity>
            </View>

            {/* Amount Field */}
            <View style={styles.rowFieldContainer}>
              <View style={[styles.amountInputBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}>
                <TextInput
                  ref={amountRef}
                  style={[styles.amountInput, { color: theme.text }]}
                  placeholder="Amount"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  showSoftInputOnFocus={amountKeyboardMode === 'system'}
                  onTouchStart={() => {
                    if (amountKeyboardMode === 'calc') {
                      RNKeyboard.dismiss();
                      setActiveField('amount');
                      setShowCustomCalc(true);
                    }
                  }}
                  onFocus={() => {
                    if (amountKeyboardMode === 'calc') {
                      RNKeyboard.dismiss();
                      setActiveField('amount');
                      setShowCustomCalc(true);
                    }
                  }}
                  value={amount}
                  onChangeText={setAmount}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (amountKeyboardMode === 'calc') {
                      setAmountKeyboardMode('system');
                      setShowCustomCalc(false);
                      setTimeout(() => {
                        amountRef.current?.focus();
                      }, 50);
                    } else {
                      setAmountKeyboardMode('calc');
                      RNKeyboard.dismiss();
                      setActiveField('amount');
                      setShowCustomCalc(true);
                    }
                  }}
                >
                  {amountKeyboardMode === 'calc' ? (
                    <Keyboard size={18} color="#64748b" />
                  ) : (
                    <Calculator size={18} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Payment date field */}
            <View style={styles.blockField}>
              <Text style={styles.blockLabel}>Payment date</Text>
              <TouchableOpacity 
                style={[styles.blockInputBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                onPress={() => setShowPaymentDatePicker(true)}
              >
                <Text style={{ color: theme.text, fontSize: 13 }}>{paymentDate}</Text>
                <CalendarIcon size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Account type selector */}
            <View style={styles.blockField}>
              <Text style={styles.blockLabel}>Account type</Text>
              <TouchableOpacity 
                style={[styles.blockInputBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                onPress={() => setShowTypePicker(true)}
              >
                <View style={styles.accTypeDisplayRow}>
                  <AccountTypeLogo type={accountType} />
                  <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>{accountType}</Text>
                </View>
                <ChevronRight size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Category */}
            <View style={styles.blockField}>
              <Text style={styles.blockLabel}>Category</Text>
              <TouchableOpacity 
                style={[styles.blockInputBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                onPress={() => setShowCategoryPicker(true)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {categoryOpt ? (
                    <CategoryIcon name={categoryOpt} color={getSelectedCategoryColor()} size={18} />
                  ) : null}
                  <Text style={{ color: categoryOpt ? theme.text : '#64748b', fontSize: 13 }}>
                    {categoryOpt || 'Select category'}
                  </Text>
                </View>
                <ChevronDown size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Notes Input Field */}
            <View style={styles.blockField}>
              <Text style={styles.blockLabel}>Notes</Text>
              <TextInput
                style={[styles.notesInput, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', color: theme.text, borderColor: theme.cardBorder }]}
                placeholder="Enter notes here..."
                placeholderTextColor="#64748b"
                multiline={true}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.blueAddBtn} onPress={handleSaveAccount}>
              <Text style={styles.blueAddBtnText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={closeAddModal}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      <Modal
          visible={showCategoryPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCategoryPicker(false)}
        >
          <View style={styles.pickerOverlay}>
            <View style={[styles.pickerCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
              <Text style={[styles.pickerTitle, { color: theme.text }]}>Category</Text>

              <ScrollView contentContainerStyle={styles.pickerScrollList}>
                {(() => {
                  const seen = new Set();
                  const uniqueCats = [];
                  categories.forEach(cat => {
                    const nameLower = cat.name.trim().toLowerCase();
                    if (!seen.has(nameLower)) {
                      seen.add(nameLower);
                      uniqueCats.push(cat);
                    }
                  });
                  return uniqueCats;
                })().length > 0 ? (
                  (() => {
                    const seen = new Set();
                    const uniqueCats = [];
                    categories.forEach(cat => {
                      const nameLower = cat.name.trim().toLowerCase();
                      if (!seen.has(nameLower)) {
                        seen.add(nameLower);
                        uniqueCats.push(cat);
                      }
                    });
                    return uniqueCats;
                  })().map(cat => {
                    const isSelected = categoryOpt === cat.name;
                    return (
                      <TouchableOpacity
                        key={cat._id || cat.name}
                        style={[styles.pickerItemRow, { flexDirection: 'row', alignItems: 'center', gap: 12 }, isSelected && { backgroundColor: isDarkMode ? '#3b3d4f' : '#f1f5f9' }]}
                        onPress={() => {
                          setCategoryOpt(cat.name);
                          setShowCategoryPicker(false);
                        }}
                      >
                        <CategoryIcon name={cat.name} color={cat.color || '#3b82f6'} size={18} />
                        <Text style={[styles.pickerItemText, { color: theme.text }]}>{cat.name}</Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#64748b' }}>No custom categories found.</Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.pickerFooter}>
                <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                  <Text style={styles.pickerCancelBtnText}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
<Modal
         visible={showTypePicker}
         transparent={true}
         animationType="fade"
         onRequestClose={() => setShowTypePicker(false)}
       >
         <View style={styles.pickerOverlay}>
           <View style={[styles.pickerCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
             <Text style={[styles.pickerTitle, { color: theme.text }]}>Account type</Text>

             <ScrollView contentContainerStyle={styles.pickerScrollList}>
               {ACCOUNT_TYPES.map(type => {
                 const isSelected = accountType === type;
                 return (
                   <TouchableOpacity
                     key={type}
                     style={[styles.pickerItemRow, isSelected && { backgroundColor: isDarkMode ? '#3b3d4f' : '#f1f5f9' }]}
                     onPress={() => {
                       setAccountType(type);
                       setShowTypePicker(false);
                     }}
                   >
                     <AccountTypeLogo type={type} />
                     <Text style={[styles.pickerItemText, { color: theme.text }]}>{type}</Text>
                   </TouchableOpacity>
                 );
               })}
             </ScrollView>

             <View style={styles.pickerFooter}>
               <TouchableOpacity onPress={() => setShowTypePicker(false)}>
                 <Text style={styles.pickerCancelBtnText}>CANCEL</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
<Modal
         visible={showIconPicker}
         transparent={true}
         animationType="fade"
         onRequestClose={() => setShowIconPicker(false)}
       >
         <View style={styles.pickerOverlay}>
           <View style={[styles.iconPickerCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
             <TouchableOpacity 
               style={styles.iconPickerItemRow} 
               onPress={() => {
                 setIconOpt('Set image');
                 setShowIconPicker(false);
               }}
             >
               <Text style={[styles.iconPickerItemText, { color: theme.text }]}>Set image</Text>
             </TouchableOpacity>

             <TouchableOpacity 
               style={styles.iconPickerItemRow} 
               onPress={() => {
                 setIconOpt('Add icon');
                 setShowIconPicker(false);
               }}
             >
               <Text style={[styles.iconPickerItemText, { color: theme.text }]}>Add icon</Text>
             </TouchableOpacity>

             <TouchableOpacity 
               style={styles.iconPickerItemRow} 
               onPress={() => {
                 setIconOpt('Choose an icon');
                 setShowIconPicker(false);
               }}
             >
               <Text style={[styles.iconPickerItemText, { color: '#ef4444' }]}>Reset</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>
<Modal
         visible={showColorPicker}
         transparent={true}
         animationType="fade"
         onRequestClose={() => setShowColorPicker(false)}
       >
         <View style={styles.pickerOverlay}>
           <View style={[styles.pickerCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
             <Text style={[styles.pickerTitle, { color: theme.text }]}>Color</Text>

             <ScrollView contentContainerStyle={styles.colorGridScroll} showsVerticalScrollIndicator={true}>
               <View style={styles.colorGrid}>
                 {COLORS.map(color => {
                   const isSelected = tempColor === color;
                   const hex = color.replace('#', '');
                   const r = parseInt(hex.substr(0, 2), 16);
                   const g = parseInt(hex.substr(2, 2), 16);
                   const b = parseInt(hex.substr(4, 2), 16);
                   const isLight = (r * 299 + g * 587 + b * 114) / 1000 > 180;
                   
                   return (
                     <TouchableOpacity
                       key={color}
                       style={[styles.colorCircle, { backgroundColor: color }]}
                       onPress={() => setTempColor(color)}
                     >
                       {isSelected && (
                         <Text style={[styles.checkMarkText, { color: isLight ? '#000000' : '#ffffff' }]}>✓</Text>
                       )}
                     </TouchableOpacity>
                   );
                 })}
               </View>
             </ScrollView>

             <View style={styles.colorPickerFooter}>
               <TouchableOpacity onPress={() => setTempColor('#451a03')}>
                 <Text style={styles.resetBtnText}>RESET</Text>
               </TouchableOpacity>
               
               <View style={styles.footerRightButtons}>
                 <TouchableOpacity onPress={() => setShowColorPicker(false)} style={{ marginRight: 20 }}>
                   <Text style={styles.cancelBtnLabel}>CANCEL</Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={() => {
                   setColorHex(tempColor);
                   setShowColorPicker(false);
                 }}>
                   <Text style={styles.okBtnLabel}>OK</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
         </View>
        </Modal>
<Modal
          visible={showPaymentDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPaymentDatePicker(false)}
        >
          <View style={styles.pickerOverlay}>
            <View style={[styles.dayPickerCard, { backgroundColor: '#1e222d' }]}>
              <View style={styles.dayPickerHeader}>
                <Text style={styles.dayPickerTitle}>Payment date</Text>
                <TouchableOpacity onPress={() => setShowPaymentDatePicker(false)} style={styles.dayPickerCloseBtn}>
                  <X size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              {/* Grid of days 1 to 31 */}
              <View style={styles.dayGridContainer}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const isSelected = paymentDate === String(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayGridCell, isSelected && styles.dayGridCellSelected]}
                      onPress={() => {
                        setPaymentDate(String(day));
                        setShowPaymentDatePicker(false);
                      }}
                    >
                      <Text style={[styles.dayCellText, isSelected && styles.dayCellTextSelected]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Footer */}
              <View style={styles.dayPickerFooter}>
                <TouchableOpacity 
                  onPress={() => {
                    setPaymentDate('None');
                    setShowPaymentDatePicker(false);
                  }}
                >
                  <Text style={styles.dayDeleteBtnText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowPaymentDatePicker(false)}>
                  <Text style={styles.dayCancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Custom Calculator Modal for Add Account */}
        <Modal
          visible={showCustomCalc && (activeField === 'amount' || activeField === 'creditLimit')}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowCustomCalc(false);
            setActiveField(null);
          }}
        >
          {showCustomCalc && (
            <View style={[styles.calcOverlayContainer, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderTopColor: theme.cardBorder, borderTopWidth: 1 }]}>
              <TouchableOpacity 
                style={styles.calcHeader}
                activeOpacity={0.8}
                onPress={() => {
                  setShowCustomCalc(false);
                  setActiveField(null);
                  amountRef.current?.blur();
                  creditLimitRef.current?.blur();
                }}
              >
                <View style={styles.calcHeaderBar} />
                <Text style={[styles.calcHeaderTitle, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>
                  {activeField === 'amount' ? 'Amount' : 'Credit limit'}
                </Text>
                <Text style={[styles.calcHeaderValue, { color: theme.text }]}>
                  RS.{(activeField === 'amount' ? amount : creditLimit) || '0.00'}
                </Text>
              </TouchableOpacity>
              
                            <View style={styles.calcKeypadGrid}>
                {/* Col 1 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('1')}><Text style={[styles.calcKeyText, { color: theme.text }]}>1</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('4')}><Text style={[styles.calcKeyText, { color: theme.text }]}>4</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('7')}><Text style={[styles.calcKeyText, { color: theme.text }]}>7</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('.')}><Text style={[styles.calcKeyText, { color: theme.text }]}>.</Text></TouchableOpacity>
                </View>
                
                {/* Col 2 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('2')}><Text style={[styles.calcKeyText, { color: theme.text }]}>2</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('5')}><Text style={[styles.calcKeyText, { color: theme.text }]}>5</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('8')}><Text style={[styles.calcKeyText, { color: theme.text }]}>8</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('0')}><Text style={[styles.calcKeyText, { color: theme.text }]}>0</Text></TouchableOpacity>
                </View>
                
                {/* Col 3 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('3')}><Text style={[styles.calcKeyText, { color: theme.text }]}>3</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('6')}><Text style={[styles.calcKeyText, { color: theme.text }]}>6</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('9')}><Text style={[styles.calcKeyText, { color: theme.text }]}>9</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('backspace')}><Text style={[styles.calcKeyText, { color: theme.text }]}>⌫</Text></TouchableOpacity>
                </View>
                
                {/* Col 4 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('÷')}><Text style={[styles.calcKeyText, { color: theme.text }]}>÷</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('×')}><Text style={[styles.calcKeyText, { color: theme.text }]}>×</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('-')}><Text style={[styles.calcKeyText, { color: theme.text }]}>-</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('+')}><Text style={[styles.calcKeyText, { color: theme.text }]}>+</Text></TouchableOpacity>
                </View>
                
                {/* Col 5 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('C')}><Text style={[styles.calcKeyText, { color: theme.text }]}>C</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('%')}><Text style={[styles.calcKeyText, { color: theme.text }]}>%</Text></TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.calcKey, styles.calcKeySubmit]} 
                    onPress={() => handleKeyPress('submit')}
                  >
                    <Text style={[styles.calcKeyText, { color: '#ffffff' }]}>✓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Modal>
    
          </KeyboardAvoidingView>
    </Modal>

       {/* Choose an Icon Selection Popup Modal Overlay */}
       

        {/* Category Selection Popup Modal Overlay */}
        

       {/* Account Type Selection Popup Modal Overlay (3rd screenshot) */}
       

       {/* Color Picker Modal (scrollable grid of 4 circles per row) */}
       

        {/* Payment Date monthly grid picker modal */}
        

        {/* Custom Calculator Keypad Overlay */}
        

      {/* Transfer Modal Dialog */}
      <Modal
        visible={showTransferModal}
        animationType="slide"
        onRequestClose={closeTransferModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: isDarkMode ? '#13141f' : '#f8fafc' }}
        >
          <View style={[styles.planModalContainer, { backgroundColor: isDarkMode ? '#13141f' : '#f8fafc' }]}>
            {/* Header */}
            <View style={styles.planHeader}>
              <TouchableOpacity onPress={closeTransferModal}>
                <Text style={[styles.planBackArrow, { color: theme.text }]}>←</Text>
              </TouchableOpacity>
              <Text style={[styles.planTitle, { color: theme.text }]}>Transfer</Text>
            </View>

            <ScrollView contentContainerStyle={styles.planScrollContent} keyboardShouldPersistTaps="handled">
              {/* Source Account Select Box */}
              <View style={styles.planFieldBlock}>
                <Text style={styles.planFieldLabel}>Account</Text>
                <TouchableOpacity 
                  style={[styles.planSelectBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setAccountPickerMode('source');
                    setShowTransferAccountPicker(true);
                  }}
                >
                  <View style={styles.planSelectLeft}>
                    {transferSource !== 'None' ? (
                      <AccountTypeLogo type={getTransferAccountType(transferSource)} />
                    ) : null}
                    <Text style={[styles.planSelectText, { color: transferSource !== 'None' ? theme.text : '#64748b' }]}>
                      {transferSource}
                    </Text>
                  </View>
                  <ChevronDown size={16} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Source Amount Box */}
              <View style={styles.planFieldBlock}>
                <View style={styles.planAmountRow}>
                  <View style={[styles.planAmountBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}>
                    <TextInput
                      style={[styles.planAmountInput, { color: theme.text }]}
                      placeholder="Amount"
                      placeholderTextColor="#64748b"
                      keyboardType="numeric"
                      value={transferAmount}
                      onChangeText={setTransferAmount}
                      showSoftInputOnFocus={activeField !== 'transferAmount'}
                      onFocus={() => {
                        if (showCustomCalc) {
                          RNKeyboard.dismiss();
                        }
                      }}
                    />
                    <TouchableOpacity onPress={() => {
                      setActiveField('transferAmount');
                      setShowCustomCalc(true);
                      RNKeyboard.dismiss();
                    }}>
                      <Keyboard size={16} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Transfer to section divider */}
              <View style={{ alignItems: 'center', marginVertical: 12 }}>
                <Text style={{ color: theme.subText, fontSize: 13, fontWeight: '700' }}>Transfer to ▼</Text>
              </View>

              {/* Destination Account Select Box */}
              <View style={styles.planFieldBlock}>
                <Text style={styles.planFieldLabel}>Account</Text>
                <TouchableOpacity 
                  style={[styles.planSelectBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setAccountPickerMode('dest');
                    setShowTransferAccountPicker(true);
                  }}
                >
                  <View style={styles.planSelectLeft}>
                    {transferDest !== 'None' ? (
                      <AccountTypeLogo type={getTransferAccountType(transferDest)} />
                    ) : null}
                    <Text style={[styles.planSelectText, { color: transferDest !== 'None' ? theme.text : '#64748b' }]}>
                      {transferDest}
                    </Text>
                  </View>
                  <ChevronDown size={16} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Destination Amount Box */}
              <View style={styles.planFieldBlock}>
                <View style={styles.planAmountRow}>
                  <View style={[styles.planAmountBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}>
                    <TextInput
                      style={[styles.planAmountInput, { color: theme.text }]}
                      placeholder="Amount"
                      placeholderTextColor="#64748b"
                      keyboardType="numeric"
                      value={transferAmount}
                      onChangeText={setTransferAmount}
                      showSoftInputOnFocus={activeField !== 'transferAmount'}
                      onFocus={() => {
                        if (showCustomCalc) {
                          RNKeyboard.dismiss();
                        }
                      }}
                    />
                    <TouchableOpacity onPress={() => {
                      setActiveField('transferAmount');
                      setShowCustomCalc(true);
                      RNKeyboard.dismiss();
                    }}>
                      <Keyboard size={16} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Date row */}
              <View style={styles.planFieldBlock}>
                <Text style={styles.planFieldLabel}>Date</Text>
                <TouchableOpacity 
                  style={[styles.planSelectBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                  onPress={handleOpenDatePicker}
                >
                  <Text style={[styles.planSelectText, { color: theme.text }]}>{transferDatePreset}</Text>
                  <CalendarIcon size={16} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Time row */}
              <View style={styles.planFieldBlock}>
                <Text style={styles.planFieldLabel}>Time</Text>
                <TouchableOpacity 
                  style={[styles.planSelectBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                  onPress={handleOpenClockPicker}
                >
                  <Text style={[styles.planSelectText, { color: theme.text }]}>{transferTime}</Text>
                  <Clock size={16} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Notes Input Field */}
              <View style={styles.planFieldBlock}>
                <Text style={styles.planFieldLabel}>Notes</Text>
                <TextInput
                  style={[styles.planNotesInput, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', color: theme.text, borderColor: theme.cardBorder }]}
                  placeholder="Enter notes here..."
                  placeholderTextColor="#64748b"
                  multiline={true}
                  value={transferNotes}
                  onChangeText={setTransferNotes}
                />
              </View>

              {/* Action Buttons */}
              <TouchableOpacity style={styles.planCreateBtn} onPress={handleSaveTransfer}>
                <Text style={styles.planCreateBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.planCancelBtn} onPress={closeTransferModal}>
                <Text style={styles.planCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
      <Modal
        visible={showTransferAccountPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTransferAccountPicker(false)}
      >
        <TouchableOpacity 
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowTransferAccountPicker(false)}
        >
          <View style={[styles.pickerCard, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff' }]}>
            <Text style={[styles.pickerTitle, { color: theme.text, textAlign: 'center' }]}>Select Account</Text>
            <ScrollView style={{ maxHeight: 250 }}>
              <TouchableOpacity
                style={[styles.pickerItemRow, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
                onPress={() => {
                  if (accountPickerMode === 'source') {
                    setTransferSource('None');
                  } else {
                    setTransferDest('None');
                  }
                  setShowTransferAccountPicker(false);
                }}
              >
                <AccountTypeLogo type="None" />
                <Text style={[styles.pickerItemText, { color: theme.text }]}>None</Text>
              </TouchableOpacity>
              {accounts.map(acc => (
                <TouchableOpacity
                  key={acc._id || acc.id || acc.name}
                  style={[styles.pickerItemRow, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
                  onPress={() => {
                    if (accountPickerMode === 'source') {
                      setTransferSource(acc.name);
                    } else {
                      setTransferDest(acc.name);
                    }
                    setShowTransferAccountPicker(false);
                  }}
                >
                  <AccountTypeLogo type={acc.type} />
                  <Text style={[styles.pickerItemText, { color: theme.text }]}>{acc.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
<Modal
        visible={showTransferDateDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTransferDateDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowTransferDateDropdown(false)}
        >
          <View style={[styles.presetDropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
            {['Yesterday', 'Today', 'Tomorrow'].map(preset => (
              <TouchableOpacity
                key={preset}
                style={styles.presetDropdownItem}
                onPress={() => {
                  const d = new Date();
                  if (preset === 'Yesterday') {
                    d.setDate(d.getDate() - 1);
                  } else if (preset === 'Tomorrow') {
                    d.setDate(d.getDate() + 1);
                  }
                  setTransferDatePreset(formatDateString(d));
                  setShowTransferDateDropdown(false);
                }}
              >
                <Text style={[styles.presetDropdownText, { color: theme.text }]}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
<Modal
        visible={showDatePickerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePickerModal(false)}
      >
        <TouchableOpacity 
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePickerModal(false)}
        >
          <View style={[styles.datePickerCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
            {/* Header */}
            <View style={styles.datePickerHeader}>
              <View>
                <Text style={styles.datePickerLabel}>Select date</Text>
                <Text style={[styles.datePickerValue, { color: theme.text }]}>
                  {formatDateToHeader(selectedDatePickerDate)}
                </Text>
              </View>
              <TouchableOpacity onPress={handleToggleInputMode} style={{ padding: 4 }}>
                {datePickerMode === 'calendar' ? (
                  <Pencil size={20} color={theme.text} />
                ) : (
                  <CalendarIcon size={20} color={theme.text} />
                )}
              </TouchableOpacity>
            </View>

            {datePickerMode === 'calendar' ? (
              <>
                {/* Navigation */}
                <View style={styles.datePickerNav}>
                  <Text style={[styles.datePickerMonthText, { color: theme.text }]}>
                    {MONTH_NAMES[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity onPress={handlePrevMonth}>
                      <ChevronLeft size={20} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNextMonth}>
                      <ChevronRight size={20} color={theme.text} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Weekday headers */}
                <View style={styles.datePickerWeekdays}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <Text key={idx} style={styles.datePickerWeekdayText}>{day}</Text>
                  ))}
                </View>

                {/* Calendar Grid */}
                <View style={styles.datePickerGrid}>
                  {getCalendarDays(calendarDate).map((cell, idx) => {
                    const isSelected = selectedDatePickerDate.toDateString() === cell.date.toDateString();
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.datePickerCell,
                          isSelected && styles.datePickerCellSelected
                        ]}
                        onPress={() => setSelectedDatePickerDate(cell.date)}
                        disabled={!cell.isCurrentMonth}
                      >
                        <Text style={[
                          styles.datePickerCellText,
                          { color: isSelected ? '#ffffff' : theme.text },
                          !cell.isCurrentMonth && styles.datePickerCellTextDimmed
                        ]}>
                          {cell.day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              /* Text Input Mode */
              <View style={styles.datePickerTextInputBlock}>
                <TextInput
                  style={[styles.datePickerTextInput, { 
                    backgroundColor: isDarkMode ? '#1e202e' : '#f8fafc',
                    color: theme.text,
                    borderColor: theme.cardBorder
                  }]}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#64748b"
                  value={dateTextInput}
                  onChangeText={setDateTextInput}
                  keyboardType="numeric"
                  autoFocus={true}
                />
              </View>
            )}

            {/* Footer buttons */}
            <View style={styles.datePickerFooter}>
              <TouchableOpacity onPress={() => setShowDatePickerModal(false)}>
                <Text style={styles.datePickerFooterBtn}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveDatePicker}>
                <Text style={styles.datePickerFooterBtn}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

        {/* Custom Calculator Modal for Transfer Form */}
        <Modal
          visible={showCustomCalc && activeField === 'transferAmount'}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowCustomCalc(false);
            setActiveField(null);
          }}
        >
          {showCustomCalc && (
            <View style={[styles.calcOverlayContainer, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderTopColor: theme.cardBorder, borderTopWidth: 1 }]}>
              <TouchableOpacity 
                style={styles.calcHeader}
                activeOpacity={0.8}
                onPress={() => {
                  setShowCustomCalc(false);
                  setActiveField(null);
                }}
              >
                <View style={styles.calcHeaderBar} />
                <Text style={[styles.calcHeaderTitle, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>
                  Transfer Amount
                </Text>
                <Text style={[styles.calcHeaderValue, { color: theme.text }]}>
                  RS.{transferAmount || '0.00'}
                </Text>
              </TouchableOpacity>
              
                            <View style={styles.calcKeypadGrid}>
                {/* Col 1 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('1')}><Text style={[styles.calcKeyText, { color: theme.text }]}>1</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('4')}><Text style={[styles.calcKeyText, { color: theme.text }]}>4</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('7')}><Text style={[styles.calcKeyText, { color: theme.text }]}>7</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('.')}><Text style={[styles.calcKeyText, { color: theme.text }]}>.</Text></TouchableOpacity>
                </View>
                
                {/* Col 2 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('2')}><Text style={[styles.calcKeyText, { color: theme.text }]}>2</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('5')}><Text style={[styles.calcKeyText, { color: theme.text }]}>5</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('8')}><Text style={[styles.calcKeyText, { color: theme.text }]}>8</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('0')}><Text style={[styles.calcKeyText, { color: theme.text }]}>0</Text></TouchableOpacity>
                </View>
                
                {/* Col 3 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('3')}><Text style={[styles.calcKeyText, { color: theme.text }]}>3</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('6')}><Text style={[styles.calcKeyText, { color: theme.text }]}>6</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('9')}><Text style={[styles.calcKeyText, { color: theme.text }]}>9</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleKeyPress('backspace')}><Text style={[styles.calcKeyText, { color: theme.text }]}>⌫</Text></TouchableOpacity>
                </View>
                
                {/* Col 4 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('÷')}><Text style={[styles.calcKeyText, { color: theme.text }]}>÷</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('×')}><Text style={[styles.calcKeyText, { color: theme.text }]}>×</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('-')}><Text style={[styles.calcKeyText, { color: theme.text }]}>-</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('+')}><Text style={[styles.calcKeyText, { color: theme.text }]}>+</Text></TouchableOpacity>
                </View>
                
                {/* Col 5 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('C')}><Text style={[styles.calcKeyText, { color: theme.text }]}>C</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#3b3d4f' : '#cbd5e1' }]} onPress={() => handleKeyPress('%')}><Text style={[styles.calcKeyText, { color: theme.text }]}>%</Text></TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.calcKey, styles.calcKeySubmit]} 
                    onPress={() => handleKeyPress('submit')}
                  >
                    <Text style={[styles.calcKeyText, { color: '#ffffff' }]}>✓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Modal>
    
            
        {/* 12-Hour Material Clock Picker Modal Dialog */}
        <Modal
          visible={showClockPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowClockPicker(false)}
        >
          <View style={styles.clockPickerOverlay}>
            <View style={[styles.clockPickerCard, { backgroundColor: '#1e222d' }]}>
              <Text style={styles.clockPickerTitle}>SELECT TRANSACTION TIME</Text>
              
              <View style={styles.clockDisplayRowContainer}>
                <View style={styles.clockDisplayRow}>
                  {clockMode === 'keyboard' ? (
                    <View style={styles.clockInputContainer}>
                      <View style={[styles.clockTimeBlock, styles.clockTimeBlockActive, styles.clockTimeBlockInput]}>
                        <TextInput
                          style={[styles.clockTimeBlockText, { width: 50, textAlign: 'center', color: '#3b82f6' }]}
                          keyboardType="numeric"
                          maxLength={2}
                          value={String(clockHour)}
                          onChangeText={(text) => {
                            const val = parseInt(text, 10);
                            if (!isNaN(val) && val >= 1 && val <= 12) {
                              setClockHour(val);
                            } else if (text === '') {
                              setClockHour('');
                            }
                          }}
                          selectTextOnFocus={true}
                        />
                      </View>
                      <Text style={styles.clockInputLabel}>Hour</Text>
                    </View>
                  ) : (
                    <View style={[styles.clockTimeBlock, styles.clockTimeBlockActive]}>
                      <Text style={styles.clockTimeBlockText}>{clockHour}</Text>
                    </View>
                  )}
                  
                  <Text style={styles.clockTimeSeparator}>:</Text>
                  
                  {clockMode === 'keyboard' ? (
                    <View style={styles.clockInputContainer}>
                      <View style={[styles.clockTimeBlock, styles.clockTimeBlockInput]}>
                        <TextInput
                          style={[styles.clockTimeBlockText, { width: 50, textAlign: 'center', color: '#3b82f6' }]}
                          keyboardType="numeric"
                          maxLength={2}
                          value={String(clockMinute).padStart(2, '0')}
                          onChangeText={(text) => {
                            const val = parseInt(text, 10);
                            if (!isNaN(val) && val >= 0 && val <= 59) {
                              setClockMinute(val);
                            } else if (text === '') {
                              setClockMinute('');
                            }
                          }}
                          selectTextOnFocus={true}
                        />
                      </View>
                      <Text style={styles.clockInputLabel}>Minute</Text>
                    </View>
                  ) : (
                    <View style={styles.clockTimeBlock}>
                      <Text style={styles.clockTimeBlockText}>{String(clockMinute).padStart(2, '0')}</Text>
                    </View>
                  )}
                  
                  <View style={styles.clockAmPmColumn}>
                    <TouchableOpacity 
                      style={[styles.clockAmPmBtn, clockAmPm === 'AM' && styles.clockAmPmBtnActive]}
                      onPress={() => setClockAmPm('AM')}
                    >
                      <Text style={[styles.clockAmPmText, clockAmPm === 'AM' && styles.clockAmPmTextActive]}>AM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.clockAmPmBtn, clockAmPm === 'PM' && styles.clockAmPmBtnActive]}
                      onPress={() => setClockAmPm('PM')}
                    >
                      <Text style={[styles.clockAmPmText, clockAmPm === 'PM' && styles.clockAmPmTextActive]}>PM</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {clockMode === 'analog' && (
                <View style={styles.clockFaceCircle}>
                  <Svg height="220" width="220">
                    <Circle cx="110" cy="110" r="4" fill="#3b82f6" />
                    {(() => {
                      const angle = (clockHour * 30 - 90) * Math.PI / 180;
                      const R = 75;
                      const targetX = 110 + R * Math.cos(angle);
                      const targetY = 110 + R * Math.sin(angle);
                      return (
                        <>
                          <Line x1="110" y1="110" x2={targetX} y2={targetY} stroke="#3b82f6" strokeWidth="2.5" />
                          <Circle cx={targetX} cy={targetY} r="18" fill="#3b82f6" />
                        </>
                      );
                    })()}
                  </Svg>

                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => {
                    const angle = (num * 30 - 90) * Math.PI / 180;
                    const R = 75;
                    const x = 110 + R * Math.cos(angle);
                    const y = 110 + R * Math.sin(angle);
                    const isSelected = clockHour === num;
                    return (
                      <TouchableOpacity
                        key={num}
                        style={[styles.clockHourTouchZone, { left: x - 18, top: y - 18 }]}
                        onPress={() => setClockHour(num)}
                      >
                        <Text style={[styles.clockHourNumText, isSelected && styles.clockHourNumTextSelected]}>
                          {num}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <View style={styles.clockPickerFooter}>
                <TouchableOpacity 
                  style={styles.clockPickerKeyboardBtn}
                  onPress={() => setClockMode(clockMode === 'analog' ? 'keyboard' : 'analog')}
                >
                  {clockMode === 'analog' ? (
                    <Keyboard size={18} color="#94a3b8" />
                  ) : (
                    <Clock size={18} color="#94a3b8" />
                  )}
                </TouchableOpacity>
                <View style={styles.clockPickerFooterRight}>
                  <TouchableOpacity onPress={() => setShowClockPicker(false)} style={{ marginRight: 20 }}>
                    <Text style={styles.clockCancelBtnLabel}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveClockTime}>
                    <Text style={styles.clockOkBtnLabel}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
          </KeyboardAvoidingView>
      </Modal>

      {/* Transfer Account Selection Modal */}
      

      {/* Transfer Date Presets Selection Dropdown Modal */}
      

      {/* Custom Material Date Picker Modal */}
      
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transferBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addAccountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  illustration: {
    width: 260,
    height: 200,
    marginBottom: 20,
  },
  emptyLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  createLink: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '800',
  },
  accountsList: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  accLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#a855f710',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accName: {
    fontSize: 14,
    fontWeight: '700',
  },
  accType: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  accBalance: {
    fontSize: 14,
    fontWeight: '800',
  },
  
  // Full screen Add Form Modal styles
  formScreenContainer: {
    flex: 1,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  backArrowText: {
    fontSize: 24,
    fontWeight: '300',
  },
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  formScrollContent: {
    padding: 20,
    gap: 18,
  },
  inputSection: {
    paddingBottom: 4,
  },
  inputLabelSmall: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  underlineInput: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 6,
    borderBottomWidth: 1.5,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    marginTop: 10,
    height: 48,
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  segmentTabActiveCredit: {
    backgroundColor: '#3b82f6',
  },
  segmentTabActiveBalance: {
    backgroundColor: '#22c55e', // selected balance green tab
  },
  segmentTabText: {
    fontSize: 13,
    fontWeight: '800',
  },
  rowFieldContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  amountInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  currencyBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  blockField: {
    gap: 6,
  },
  blockLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  blockInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  blockInputText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  accTypeDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreviewBar: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    marginVertical: 4,
  },
  notesInput: {
    borderRadius: 22,
    borderWidth: 1,
    height: 80,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  blueAddBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 22,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  blueAddBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },

  // Account Type selection picker modal overlay styles
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    maxHeight: '75%',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  pickerScrollList: {
    gap: 4,
  },
  pickerItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  pickerItemText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pickerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#475569',
  },
  pickerCancelBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  colorGridScroll: {
    paddingVertical: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  colorCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMarkText: {
    fontSize: 20,
    fontWeight: '900',
  },
  colorPickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#475569',
  },
  resetBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '800',
  },
  footerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelBtnLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '800',
  },
  okBtnLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '800',
  },
  calcOverlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    elevation: 10,
    zIndex: 999,
  },
  calcHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  calcHeaderBar: {
    width: 40,
    height: 4,
    backgroundColor: '#64748b',
    borderRadius: 2,
    marginBottom: 8,
  },
  calcHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  calcHeaderValue: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  calcKeypadGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calcCol: {
    flex: 1,
    gap: 8,
    alignItems: 'center',
  },
  calcKey: {
    width: '90%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcKeyText: {
    fontSize: 16,
    fontWeight: '800',
  },
  calcKeySubmit: {
    height: 108,
    backgroundColor: '#3b82f6',
  },
  iconPickerCard: {
    width: 260,
    borderRadius: 16,
    padding: 12,
    elevation: 8,
    alignSelf: 'center',
  },
  iconPickerItemRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  iconPickerItemText: {
    fontSize: 14,
    fontWeight: '700',
  },
  // Day Picker styles
  dayPickerCard: {
    width: 280,
    borderRadius: 24,
    padding: 24,
    elevation: 10,
  },
  dayPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayPickerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  dayPickerCloseBtn: {
    padding: 4,
  },
  dayGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayGridCell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dayGridCellSelected: {
    backgroundColor: '#3b82f6',
  },
  dayCellText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  dayCellTextSelected: {
    color: '#ffffff',
    fontWeight: '900',
  },
  dayPickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#475569',
  },
  dayDeleteBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '800',
  },
  dayCancelBtnText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '800',
  },
  planModalContainer: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    gap: 16,
  },
  planBackBtn: {
    padding: 4,
  },
  planBackArrow: {
    fontSize: 24,
    fontWeight: '300',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  planScrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  planFieldBlock: {
    gap: 6,
  },
  planFieldLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  planSelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  planSelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planCategoryIcon: {
    fontSize: 18,
  },
  planSelectText: {
    fontSize: 13,
    fontWeight: '700',
  },
  planAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planAmountBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  planAmountInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  planDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planDateValBox: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  planDateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  planDatePresetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    height: 48,
    gap: 4,
    paddingHorizontal: 8,
  },
  planDatePresetText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  planNotesInput: {
    borderRadius: 22,
    borderWidth: 1,
    height: 80,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  planCreateBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 22,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  planCreateBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  planCancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  planCancelBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '800',
  },
  datePickerCard: {
    width: 328,
    borderRadius: 28,
    padding: 24,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    alignSelf: 'center',
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePickerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  datePickerValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  datePickerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePickerMonthText: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  datePickerWeekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  datePickerWeekdayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
  },
  datePickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  datePickerCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerCellSelected: {
    backgroundColor: '#3b82f6',
  },
  datePickerCellText: {
    fontSize: 12,
    fontWeight: '700',
  },
  datePickerCellTextDimmed: {
    color: '#475569',
  },
  datePickerTextInputBlock: {
    paddingVertical: 24,
    marginBottom: 16,
  },
  datePickerTextInput: {
    borderRadius: 8,
    borderWidth: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  datePickerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
  },
  datePickerFooterBtn: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3b82f6',
  },

  clockPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockPickerCard: {
    width: 280,
    borderRadius: 24,
    padding: 24,
    elevation: 10,
  },
  clockPickerTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  clockDisplayRowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  clockDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockInputLabel: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  clockTimeBlockInput: {
    padding: 0,
  },
  clockTimeBlock: {
    backgroundColor: '#1b1c26',
    width: 64,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockTimeBlockActive: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  clockTimeBlockText: {
    color: '#3b82f6',
    fontSize: 28,
    fontWeight: '700',
  },
  clockTimeSeparator: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  clockAmPmColumn: {
    marginLeft: 12,
    backgroundColor: '#1b1c26',
    borderRadius: 12,
    overflow: 'hidden',
  },
  clockAmPmBtn: {
    width: 44,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockAmPmBtnActive: {
    backgroundColor: '#3b82f625',
  },
  clockAmPmText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
  },
  clockAmPmTextActive: {
    color: '#3b82f6',
  },
  clockFaceCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#171923',
    alignSelf: 'center',
    position: 'relative',
  },
  clockHourTouchZone: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  clockHourNumText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '800',
  },
  clockHourNumTextSelected: {
    color: '#ffffff',
    fontWeight: '900',
  },
  clockPickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  clockPickerKeyboardBtn: {
    padding: 4,
  },
  clockPickerFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockCancelBtnLabel: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '800',
  },
  clockOkBtnLabel: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '800',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  detailsHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  accountSummaryCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
});
