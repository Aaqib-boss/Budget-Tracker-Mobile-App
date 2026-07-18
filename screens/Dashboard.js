import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  ActivityIndicator,
  FlatList,
  Platform,
  Image,
  Keyboard as RNKeyboard,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle, Line } from 'react-native-svg';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Coins, 
  TrendingDown, 
  TrendingUp, 
  Check, 
  Calendar,
  X,
  Tag,
  Keyboard,
  Calculator,
  ChevronDown,
  Clock,
  Pencil,
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
  Zap,
  Cat,
  Trash2
} from 'lucide-react-native';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
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

// Custom Account Type Logos helper
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

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const getCategoryEmoji = (name, defaultEmoji = '💰') => {
  if (!name) return defaultEmoji;
  const lower = name.toLowerCase();
  if (lower.includes('sports') || lower.includes('gym') || lower.includes('fitness') || lower.includes('health') || lower.includes('activity')) return '⚽';
  if (lower.includes('supermarket') || lower.includes('shopping') || lower.includes('grocery') || lower.includes('market') || lower.includes('shop')) return '🛒';
  if (lower.includes('food') || lower.includes('restaurant') || lower.includes('cafe') || lower.includes('eat') || lower.includes('drink')) return '🍔';
  if (lower.includes('orange')) return '🍊';
  if (lower.includes('fruit') || lower.includes('juice') || lower.includes('veg')) return '🍎';
  if (lower.includes('work') || lower.includes('salary') || lower.includes('job') || lower.includes('business') || lower.includes('income')) return '💼';
  if (lower.includes('clothing') || lower.includes('clothes') || lower.includes('shirt') || lower.includes('wear')) return '👕';
  if (lower.includes('rent') || lower.includes('home') || lower.includes('house')) return '🏠';
  if (lower.includes('entertainment') || lower.includes('movie') || lower.includes('leisure') || lower.includes('play')) return '🎬';
  if (lower.includes('transport') || lower.includes('car') || lower.includes('bus') || lower.includes('taxi') || lower.includes('vehicle')) return '🚗';
  if (lower.includes('travel') || lower.includes('plane') || lower.includes('trip')) return '✈️';
  if (lower.includes('education') || lower.includes('book') || lower.includes('school')) return '📚';
  if (lower.includes('gift') || lower.includes('present') || lower.includes('donat')) return '🎁';
  if (lower.includes('tree') || lower.includes('nature') || lower.includes('garden') || lower.includes('plant') || lower.includes('forest')) return '🌲';
  if (lower.includes('train') || lower.includes('rail') || lower.includes('subway') || lower.includes('metro')) return '🚆';
  if (lower.includes('ship') || lower.includes('boat') || lower.includes('cruise') || lower.includes('ferry')) return '🚢';
  if (lower.includes('medical') || lower.includes('doctor') || lower.includes('pharmacy') || lower.includes('hospital') || lower.includes('medicine') || lower.includes('pill')) return '🏥';
  if (lower.includes('beauty') || lower.includes('salon') || lower.includes('spa') || lower.includes('hair') || lower.includes('cosmetics')) return '💅';
  if (lower.includes('utility') || lower.includes('electric') || lower.includes('power') || lower.includes('energy') || lower.includes('gas') || lower.includes('water') || lower.includes('bill') || lower.includes('internet') || lower.includes('wifi')) return '⚡';
  if (lower.includes('receipt') || lower.includes('tax') || lower.includes('fee') || lower.includes('fine') || lower.includes('interest')) return '🧾';
  if (lower.includes('pet') || lower.includes('dog') || lower.includes('cat') || lower.includes('animal')) return '🐱';
  if (lower.includes('cash') || lower.includes('money') || lower.includes('coin') || lower.includes('wealth') || lower.includes('invest') || lower.includes('stock') || lower.includes('crypto') || lower.includes('bank') || lower.includes('savings')) return '💰';
  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('call')) return '📱';
  if (lower.includes('laptop') || lower.includes('computer') || lower.includes('pc')) return '💻';
  if (lower.includes('tablet') || lower.includes('table') || lower.includes('pad')) return '📱';
  if (lower.includes('bike') || lower.includes('bicycle') || lower.includes('motorcycle') || lower.includes('scooter')) return '🚲';
  return defaultEmoji;
};

const getAccountEmoji = (name) => {
  if (!name) return '💳';
  const lower = name.toLowerCase();
  if (lower.includes('cash')) return '💵';
  if (lower.includes('bank') || lower.includes('savings')) return '🏦';
  if (lower.includes('paypal') || lower.includes('online')) return '📱';
  return '💳';
};

export default function Dashboard({ isDarkMode, currentTab, onNavigate }) {
  const { user, showToast } = useContext(AuthContext);
  const getStorageKey = () => user && user.email ? `user_accounts_${user.email}` : 'user_accounts';
  const getAvatarStorageKey = () => user && user.email ? `user_avatar_uri_${user.email}` : 'user_avatar_uri';
  
  // Date selection states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sliderOffset, setSliderOffset] = useState(0); // Offset for month rotating
  
  // Settings Dropdown States
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [calendarMode, setCalendarMode] = useState('regular'); // 'regular', 'custom'
  const [balanceMode, setBalanceMode] = useState('monthly'); // 'monthly', 'accumulated'
  
  // Data States
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [expandedWeek, setExpandedWeek] = useState(null); // Toggled week
  
  // Transaction Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('expense'); // 'income', 'expense'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState([]);
  const [savingTransaction, setSavingTransaction] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  
  // Edit/Pay Drawer States
  const [editAmount, setEditAmount] = useState('');
  const [editAccount, setEditAccount] = useState('None');
  const [editDate, setEditDate] = useState(new Date());
  const [editDatePreset, setEditDatePreset] = useState('Today');
  const [showPayDrawer, setShowPayDrawer] = useState(false);
  const [showEditAccountPicker, setShowEditAccountPicker] = useState(false);
  const [showEditCalc, setShowEditCalc] = useState(false);
  const [showEditDateDropdown, setShowEditDateDropdown] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [showSpeedDial, setShowSpeedDial] = useState(false);

  // Plan an outcome states
  const [showPlanModal, setShowPlanModal] = useState(false);
  const updateAccountBalance = async (accountName, amountDelta) => {
    if (!accountName || accountName === 'None') return;
    try {
      const stored = await AsyncStorage.getItem(getStorageKey());
      if (stored) {
        const accountsList = JSON.parse(stored);
        const updated = accountsList.map(acc => {
          if (acc.name === accountName) {
            return {
              ...acc,
              balance: acc.balance + amountDelta
            };
          }
          return acc;
        });
        setAccounts(updated);
        await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error updating account balance:', err);
    }
  };
  const [expandedMonths, setExpandedMonths] = useState({});
  const [showTxAccountPicker, setShowTxAccountPicker] = useState(false);
  const [transactionAccount, setTransactionAccount] = useState('None');
  const [selectedTxDetails, setSelectedTxDetails] = useState(null);
  const [showTxDetailsModal, setShowTxDetailsModal] = useState(false);

  const getCategoryColor = (catName) => {
    const found = categories.find(cat => cat.name === catName);
    return found ? found.color : '#3b82f6';
  };

  const getGroupedMonthTransactions = () => {
    const monthTx = getMonthTransactions();
    const groups = {};
    monthTx.forEach(tx => {
      const d = new Date(tx.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`;
      if (!groups[dateStr]) {
        groups[dateStr] = {
          dateStr,
          transactions: [],
          netAmount: 0
        };
      }
      groups[dateStr].transactions.push(tx);
      if (parseTxNote(tx.note).status !== 'unpaid') {
        if (tx.type === 'income') {
          groups[dateStr].netAmount += tx.amount;
        } else {
          groups[dateStr].netAmount -= tx.amount;
        }
      }
    });
    return Object.values(groups).sort((a, b) => new Date(b.dateStr) - new Date(a.dateStr));
  };

  const formatGroupDateHeader = (dateStr) => {
    const d = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${shortMonths[d.getMonth()]} ${d.getDate()} ${days[d.getDay()]}`;
  };

  const getMonthTransactions = () => {
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);
    const monthTx = transactions.filter(t => {
      const d = new Date(t.date);
      // Filter out transfer records - only show regular income and expenses
      return d >= startOfMonth && d <= endOfMonth && t.category !== 'Transfer';
    });
    monthTx.sort((a, b) => new Date(b.date) - new Date(a.date));
    return monthTx;
  };

  const formatTxDetailsDate = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    const day = d.getDate();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month} ${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const getTxHeaderDateStr = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${shortMonths[d.getMonth()]} ${days[d.getDay()]}`;
  };

  const parseTxNote = (noteStr) => {
    try {
      if (noteStr && (noteStr.startsWith('{') || noteStr.startsWith('['))) {
        const parsed = JSON.parse(noteStr);
        return {
          name: parsed.name || '',
          notes: parsed.notes || '',
          status: parsed.status || 'paid'
        };
      }
    } catch (e) {}
    return {
      name: noteStr || '',
      notes: '',
      status: 'paid'
    };
  };

  const handlePressDeleteIcon = () => {
    Alert.alert('Warning', 'Please cancel the payment first before deleting items');
  };

  const cycleEditDatePreset = () => {
    let nextPreset = 'Today';
    if (editDatePreset === 'Today') nextPreset = 'Yesterday';
    else if (editDatePreset === 'Yesterday') nextPreset = 'Tomorrow';
    else nextPreset = 'Today';
    
    setEditDatePreset(nextPreset);
    let newD = new Date();
    if (nextPreset === 'Yesterday') newD.setDate(newD.getDate() - 1);
    else if (nextPreset === 'Tomorrow') newD.setDate(newD.getDate() + 1);
    setEditDate(newD);
  };

  const handleEditKeyPress = (val) => {
    let currentVal = editAmount;
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
        console.log('Error evaluating edit expression', e);
      }
      setShowEditCalc(false);
    } else {
      currentVal = currentVal + val;
    }
    setEditAmount(currentVal);
  };

  const handleOpenEditDatePicker = () => {
    const d = editDate;
    setSelectedDatePickerDate(d);
    setCalendarDate(new Date(d.getFullYear(), d.getMonth(), 1));
    setDatePickerMode('calendar');
    setDateTextInput(formatDateToPreset(d));
    setShowDatePickerModal(true);
  };

  const handlePayDrawerSubmit = async () => {
    if (!editAmount || isNaN(editAmount) || parseFloat(editAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (editAccount === 'None') {
      Alert.alert('Error', 'Account must need to select');
      return;
    }
    try {
      const parsedNote = parseTxNote(selectedTxDetails.note);
      const updatedNote = JSON.stringify({
        ...parsedNote,
        status: 'paid'
      });
      
      const updatedTx = await api.put(`/transactions/${selectedTxDetails._id}`, {
        ...selectedTxDetails,
        amount: parseFloat(editAmount),
        account: editAccount,
        date: editDate,
        note: updatedNote
      });

      // Update account balance
      const balanceDelta = selectedTxDetails.type === 'income' ? parseFloat(editAmount) : -parseFloat(editAmount);
      await updateAccountBalance(editAccount, balanceDelta);

      showToast('Payment completed successfully!', 'success');
      setShowPayDrawer(false);
      setShowTxDetailsModal(false);
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to complete payment', 'error');
    }
  };

  const handleTogglePaymentStatus = async (tx) => {
    try {
      const parsedNote = parseTxNote(tx.note);
      const currentStatus = parsedNote.status;
      const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
      
      const updatedNote = JSON.stringify({
        ...parsedNote,
        status: newStatus
      });
      
      const updatedTx = await api.put(`/transactions/${tx._id}`, {
        ...tx,
        note: updatedNote
      });

      // Update account balance (revert if canceled, apply if completed)
      let balanceDelta = 0;
      if (newStatus === 'unpaid') {
        balanceDelta = tx.type === 'income' ? -tx.amount : tx.amount;
      } else {
        balanceDelta = tx.type === 'income' ? tx.amount : -tx.amount;
      }
      await updateAccountBalance(tx.account, balanceDelta);

      showToast(`Payment ${newStatus === 'paid' ? 'completed' : 'cancelled'} successfully!`, 'success');
      setSelectedTxDetails(updatedTx);
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to toggle payment status', 'error');
    }
  };



  const getTransactionHistoricalBalance = (tx) => {
    if (!tx || !tx.account) return 0;
    
    const currentBalance = accounts.find(a => a.name === tx.account)?.balance || 0;
    if (parseTxNote(tx.note).status === 'unpaid') {
      return currentBalance;
    }
    
    const txDate = new Date(tx.date);
    let historicalBalance = currentBalance;
    
    const newerTxs = transactions.filter(t => {
      if (t._id === tx._id || t.account !== tx.account) return false;
      if (parseTxNote(t.note).status === 'unpaid') return false;
      return new Date(t.date) > txDate;
    });
    
    newerTxs.forEach(t => {
      const amt = t.amount;
      if (t.type === 'income') {
        historicalBalance -= amt;
      } else {
        historicalBalance += amt;
      }
    });
    
    return historicalBalance;
  };

  const handleOpenTransactionDetails = (tx) => {
    setSelectedTxDetails(tx);
    setEditAmount(tx.amount.toString());
    setEditAccount(tx.account || 'None');
    const d = new Date(tx.date);
    setEditDate(d);
    setEditDatePreset(getPresetForDate(d));
    setShowPayDrawer(false);
    setShowTxDetailsModal(true);
  };

  const handleDeleteTx = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this transaction entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/transactions/${id}`);
              // Revert/Synchronize account balance on delete
              if (selectedTxDetails && selectedTxDetails.account) {
                const delDelta = selectedTxDetails.type === 'income' ? -selectedTxDetails.amount : selectedTxDetails.amount;
                await updateAccountBalance(selectedTxDetails.account, delDelta);
              }
              showToast('Transaction deleted successfully', 'success');
              setShowTxDetailsModal(false);
              fetchDashboardData();
            } catch (err) {
              showToast(err.message || 'Failed to delete entry', 'error');
            }
          }
        }
      ]
    );
  };
  const [planType, setPlanType] = useState('expense'); // 'expense' | 'income'
  const [planCategory, setPlanCategory] = useState('');
  const [showPlanCategoryPicker, setShowPlanCategoryPicker] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [planAccount, setPlanAccount] = useState('None');
  const [showPlanAccountPicker, setShowPlanAccountPicker] = useState(false);
  const [planAmount, setPlanAmount] = useState('');
  const [planKeyboardMode, setPlanKeyboardMode] = useState('calc'); // 'calc' | 'system'
  const [showPlanCalc, setShowPlanCalc] = useState(false);
  const [planCurrency, setPlanCurrency] = useState('RS.');
  const [showPlanCurrencyPicker, setShowPlanCurrencyPicker] = useState(false);
  const [planPaid, setPlanPaid] = useState(true);
  const [planDatePreset, setPlanDatePreset] = useState('Today');
  const [planDate, setPlanDate] = useState('Today');
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [selectedDatePickerDate, setSelectedDatePickerDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [datePickerMode, setDatePickerMode] = useState('calendar');
  const [dateTextInput, setDateTextInput] = useState('');
  const [showPlanDateDropdown, setShowPlanDateDropdown] = useState(false);
  const [planTime, setPlanTime] = useState('');
  const [isTimeManual, setIsTimeManual] = useState(false);
  const [planName, setPlanName] = useState('');
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [planNotes, setPlanNotes] = useState('');
  const [planRepeat, setPlanRepeat] = useState('Does not repeat');
  const [showPlanRepeatPicker, setShowPlanRepeatPicker] = useState(false);
  const [planRemind, setPlanRemind] = useState('Don\'t remind');
  const [showPlanRemindPicker, setShowPlanRemindPicker] = useState(false);
  const [planGoal, setPlanGoal] = useState('None');
  const [showPlanGoalPicker, setShowPlanGoalPicker] = useState(false);
  const [planColor, setPlanColor] = useState('#22c55e');
  const [planIconColor, setPlanIconColor] = useState('#ef4444');
  
  // Interactive Clock Picker state
  const [showClockPicker, setShowClockPicker] = useState(false);
  const [clockHour, setClockHour] = useState(10);
  const [clockMinute, setClockMinute] = useState(43);
  const [clockAmPm, setClockAmPm] = useState('PM');
  const [clockMode, setClockMode] = useState('analog'); // 'analog' | 'keyboard'

  const planAmountRef = useRef(null);

  // Real-time clock effect
  useEffect(() => {
    if (!isTimeManual && showPlanModal) {
      const updateTime = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        setPlanTime(`${hours}:${minutes} ${ampm}`);
        
        setClockHour(hours);
        setClockMinute(parseInt(minutes));
        setClockAmPm(now.getHours() >= 12 ? 'PM' : 'AM');
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimeManual, showPlanModal]);

    const getSelectedCategoryColor = () => {
    const found = categories.find(cat => cat.name === planCategory);
    return found ? found.color : '#3b82f6';
  };

  const getSelectedAccountType = () => {
    const found = accounts.find(acc => acc.name === planAccount);
    return found ? found.type : 'None';
  };

  const closePlanModal = () => {
    setShowPlanModal(false);
    setShowMoreFields(false);
    setPlanNotes('');
  };

  const handlePlanKeyPress = (val) => {
    let currentVal = planAmount;
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
        console.log('Error evaluating plan expression', e);
      }
      setShowPlanCalc(false);
      planAmountRef.current?.blur();
    } else {
      currentVal = currentVal + val;
    }
    setPlanAmount(currentVal);
  };

    const getPresetForDate = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return 'Custom';
  };

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

  const handleOpenDatePicker = () => {
    const parsed = parseDateString(formatPlanDate());
    setSelectedDatePickerDate(parsed);
    setCalendarDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    setDatePickerMode('calendar');
    setShowDatePickerModal(true);
  };

  const handleToggleInputMode = () => {
    if (datePickerMode === 'calendar') {
      setDateTextInput(formatDateToInput(selectedDatePickerDate));
      setDatePickerMode('input');
    } else {
      const parsed = parseDateString(dateTextInput);
      setSelectedDatePickerDate(parsed);
      setCalendarDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      setDatePickerMode('calendar');
    }
  };

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const handleSaveDatePicker = () => {
    let parsed;
    if (datePickerMode === 'input') {
      parsed = parseDateString(dateTextInput);
    } else {
      parsed = selectedDatePickerDate;
    }
    const preset = getPresetForDate(parsed);
    if (showPayDrawer) {
      setEditDatePreset(preset);
      setEditDate(parsed);
    } else {
      setPlanDatePreset(preset);
      setPlanDate(formatDateToPreset(parsed));
    }
    setShowDatePickerModal(false);
  };

  const formatPlanDate = () => {
    if (planDate && planDate !== 'Yesterday' && planDate !== 'Today' && planDate !== 'Tomorrow') {
      return planDate;
    }
    let d = new Date();
    if (planDate === 'Yesterday') {
      d.setDate(d.getDate() - 1);
    } else if (planDate === 'Tomorrow') {
      d.setDate(d.getDate() + 1);
    }
    const days = d.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const year = d.getFullYear();
    return `${days} ${months[d.getMonth()]} ${year}`;
  };

  const handleSavePlanOutcome = async () => {
    if (!planAmount || isNaN(planAmount) || parseFloat(planAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!planCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (planAccount === 'None') {
      Alert.alert('Error', 'Account must need to select');
      return;
    }
    setSavingTransaction(true);
    try {
      let finalDate = new Date();
      if (planDate === 'Yesterday') {
        finalDate.setDate(finalDate.getDate() - 1);
      } else if (planDate === 'Tomorrow') {
        finalDate.setDate(finalDate.getDate() + 1);
      } else if (planDate && planDate !== 'Today') {
        finalDate = parseDateString(planDate);
      }
      
      await api.post('/transactions', {
        amount: parseFloat(planAmount),
        type: planType,
        category: planCategory,
        note: JSON.stringify({ name: planName || planCategory, notes: planNotes || '' }),
        date: finalDate,
        account: planAccount !== 'None' ? planAccount : undefined
      });
      // Synchronize account balance
      const planDelta = planType === 'income' ? parseFloat(planAmount) : -parseFloat(planAmount);
      await updateAccountBalance(planAccount, planDelta);

      showToast(`${planType === 'income' ? 'Income' : 'Expense'} planned successfully!`, 'success');
      setPlanAmount('');
      setPlanName('');
      setPlanNotes('');
      setPlanAccount('None');
      closePlanModal();
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to save outcome', 'error');
    } finally {
      setSavingTransaction(false);
    }
  };

  // Load avatar and accounts whenever tab changes to Dashboard focus
  useEffect(() => {
    if (currentTab === 'Dashboard') {
      fetchDashboardData();
    }
    AsyncStorage.getItem(getAvatarStorageKey()).then(val => {
      setAvatarUri(val);
    });
    AsyncStorage.getItem(getStorageKey()).then(stored => {
      if (stored) {
        setAccounts(JSON.parse(stored));
      } else {
        setAccounts([]);
      }
    }).catch(err => console.error('Error loading accounts on focus', err));
  }, [currentTab]);

  // Month labels
  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  // Helper to format currency
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num).toFixed(2);
    return `${sign}RS.${parseFloat(abs).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  // Generate all months from year 2000 to 2060
  const getMonthChips = () => {
    const chips = [];
    const startYear = 2000;
    const endYear = 2060;
    
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        chips.push({
          month,
          year,
          label: `${monthNames[month]} ${String(year).slice(-2)}`
        });
      }
    }
    return chips;
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const txData = await api.get('/transactions');
      setTransactions(txData);
      
      const catData = await api.get('/categories');
      setCategories(catData);
      if (catData.length > 0) setCategory(catData[0].name);
    } catch (err) {
      console.error(err);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Recalculate metrics
  useEffect(() => {
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);

    let inc = 0;
    let exp = 0;
    let balanceVal = 0;

    if (balanceMode === 'monthly') {
      // Calculate strictly for the selected month only
      const monthlyTxs = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= startOfMonth && date <= endOfMonth;
      });

      monthlyTxs.forEach(t => {
        if (t.category !== 'Transfer' && parseTxNote(t.note).status !== 'unpaid') {
          if (t.type === 'income') inc += t.amount;
          else exp += t.amount;
        }
      });
      balanceVal = inc - exp;
    } else {
      // Accumulated mode
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const startOfYear = new Date(selectedYear, 0, 1, 0, 0, 0);
      let upperBound = endOfMonth;

      if (selectedYear === currentYear && selectedMonth === currentMonth) {
        upperBound = now;
      }

      const accTxs = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= startOfYear && date <= upperBound;
      });

      accTxs.forEach(t => {
        if (t.category !== 'Transfer' && parseTxNote(t.note).status !== 'unpaid') {
          if (t.type === 'income') inc += t.amount;
          else exp += t.amount;
        }
      });
      balanceVal = inc - exp;
    }

    setSummary({
      income: inc,
      expenses: exp,
      balance: balanceVal
    });
  }, [selectedMonth, selectedYear, transactions, balanceMode]);

  // Group current month transactions by weeks (from screenshot)
  const getWeeklySegments = () => {
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);
    const daysInMonth = endOfMonth.getDate();
    
    const monthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= startOfMonth && d <= endOfMonth;
    });

    monthTx.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Custom week divisions matching screenshot: 01-06, 06-13, 13-20, 20-27, 27-End
    const weeks = [
      { id: 'w1', label: '01 - 06', start: 1, end: 6, data: [] },
      { id: 'w2', label: '06 - 13', start: 6, end: 13, data: [] },
      { id: 'w3', label: '13 - 20', start: 13, end: 20, data: [] },
      { id: 'w4', label: '20 - 27', start: 20, end: 27, data: [] },
      { id: 'w5', label: `27 - ${daysInMonth}`, start: 27, end: daysInMonth + 1, data: [] },
    ];

    monthTx.forEach(t => {
      const day = new Date(t.date).getDate();
      for (let w of weeks) {
        if (day >= w.start && day < w.end) {
          w.data.push(t);
          break;
        }
      }
    });

    return weeks;
  };

  const handleAddTransaction = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    if (transactionAccount === 'None') {
      Alert.alert('Error', 'Account must need to select');
      return;
    }
    setSavingTransaction(true);
    try {
      await api.post('/transactions', {
        amount: parseFloat(amount),
        type: modalType,
        category,
        note: JSON.stringify({ name: category, notes: note || '' }),
        account: transactionAccount !== 'None' ? transactionAccount : undefined,
        date: new Date()
      });
      // Synchronize account balance
      const txDelta = modalType === 'income' ? parseFloat(amount) : -parseFloat(amount);
      await updateAccountBalance(transactionAccount, txDelta);

      showToast('Transaction added successfully!', 'success');
      setAmount('');
      setNote('');
      setTransactionAccount('None');
      setShowModal(false);
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setSavingTransaction(false);
    }
  };

  // Sunset SVG Card Background component
  const SunsetBanner = ({ monthLabel }) => {
    return (
      <View style={styles.bannerCard}>
        <Svg height="140" width="100%" style={styles.bannerSvg}>
          <Defs>
            <LinearGradient id="sunsetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#f43f5e" />
              <Stop offset="55%" stopColor="#f97316" />
              <Stop offset="100%" stopColor="#581c87" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#sunsetGrad)" />
          {/* Mountains */}
          <Path d="M-20 140 Q 60 70, 180 110 T 400 140 Z" fill="rgba(88, 28, 135, 0.4)" />
          <Path d="M100 140 Q 220 80, 320 100 T 440 140 Z" fill="rgba(88, 28, 135, 0.6)" />
          {/* Sun */}
          <Circle cx="50%" cy="75" r="22" fill="#fef08a" opacity="0.8" />
        </Svg>
        <View style={styles.bannerTextOverlay}>
          <View style={styles.monthBadge}>
            <Text style={styles.monthBadgeText}>{monthLabel}</Text>
          </View>
        </View>
      </View>
    );
  };

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    text: isDarkMode ? '#ffffff' : '#0f172a',
    subText: isDarkMode ? '#94a3b8' : '#475569',
    cardBg: isDarkMode ? '#161726' : '#ffffff',
    cardBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    headerBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Brand Header matching screenshot */}
      <View style={[styles.header, { borderBottomColor: theme.headerBorder }]}>
        {/* Left: Avatar only */}
        <TouchableOpacity style={styles.profileBadge} onPress={() => onNavigate('Profile')}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarMini} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.slice(0, 2).toUpperCase() || 'US'}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Center: Selected Month Dropdown button */}
        <TouchableOpacity 
          style={[styles.balanceDropdownBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]} 
          onPress={() => setShowSettingsDropdown(true)}
        >
          <Text style={[styles.dropdownBtnText, { color: theme.text }]}>
            {monthNames[selectedMonth]} Balance
          </Text>
          <Text style={[styles.dropdownBtnArrow, { color: theme.text }]}>▾</Text>
        </TouchableOpacity>

        {/* Right Header Icons */}
        <View style={styles.headerRight} />
      </View>

      {/* Main content scroll container */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main balance display */}
        <View style={styles.balanceContainer}>
          <Text style={[styles.balanceSub, { color: theme.subText }]}>Net Balance</Text>
          <Text style={[styles.balanceVal, { color: theme.text }]}>
            {formatCurrency(summary.balance)}
          </Text>
        </View>

        {/* Center Income & Expenses Cards */}
        <View style={styles.metricsContainer}>
          {/* Income Box */}
          <View style={[styles.metricCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.metricIconBg, styles.bgEmerald]}>
              <TrendingUp size={16} color="#10b981" />
            </View>
            <View>
              <Text style={[styles.metricLabel, { color: theme.subText }]}>Income</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>RS.{summary.income.toFixed(2)}</Text>
            </View>
          </View>

          {/* Expenses Box */}
          <View style={[styles.metricCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.metricIconBg, styles.bgRed]}>
              <TrendingDown size={16} color="#ef4444" />
            </View>
            <View>
              <Text style={[styles.metricLabel, { color: theme.subText }]}>Expenses</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>RS.{summary.expenses.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Horizontally Scrollable Month Chips (Arrows removed) */}
        <View style={styles.monthSliderContainer}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={getMonthChips()}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={12}
            maxToRenderPerBatch={24}
            windowSize={5}
            getItemLayout={(data, index) => ({
              length: 112, // Chip width + gap space (80 width + 32 padding margin offsets)
              offset: 112 * index,
              index
            })}
            initialScrollIndex={(() => {
              const idx = getMonthChips().findIndex(c => c.month === selectedMonth && c.year === selectedYear);
              return idx >= 0 ? idx : 0;
            })()}
            renderItem={({ item }) => {
              const isActive = selectedMonth === item.month && selectedYear === item.year;
              return (
                <TouchableOpacity 
                  style={[
                    styles.monthChip, 
                    { 
                      backgroundColor: isActive 
                        ? (isDarkMode ? '#1e293b' : '#cbd5e1') 
                        : theme.cardBg, 
                      borderColor: isActive 
                        ? (isDarkMode ? '#475569' : '#94a3b8') 
                        : theme.cardBorder 
                    }
                  ]}
                  onPress={() => {
                    setSelectedMonth(item.month);
                    setSelectedYear(item.year);
                  }}
                >
                  <Text style={[styles.monthChipText, { color: isActive ? theme.text : theme.subText }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Sunset Banner & Collapsible Week divisions list */}
        <View style={styles.ledgerContainer}>
          <SunsetBanner monthLabel={`${monthNames[selectedMonth]} ${selectedYear}`} />

          <View style={[styles.weekSection, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <TouchableOpacity 
              style={[styles.weekHeaderRow, !!expandedMonths[`${selectedYear}-${selectedMonth}`] && styles.weekHeaderRowActive]}
              onPress={() => {
                const key = `${selectedYear}-${selectedMonth}`;
                setExpandedMonths(prev => ({
                  ...prev,
                  [key]: !prev[key]
                }));
              }}
            >
              <Text style={[styles.weekLabelText, { color: theme.text }]}>
                Transactions
              </Text>
              <Text style={styles.arrowText}>{!!expandedMonths[`${selectedYear}-${selectedMonth}`] ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {!!expandedMonths[`${selectedYear}-${selectedMonth}`] && (
              <View style={[styles.weekTransactionsList, { borderTopColor: theme.cardBorder, gap: 14 }]}>
                {getGroupedMonthTransactions().length === 0 ? (
                   <Text style={styles.noTxText}>No transactions this month</Text>
                ) : (
                  getGroupedMonthTransactions().map(group => (
                    <View key={group.dateStr} style={{ marginBottom: 4 }}>
                      {/* Daily Group Header */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 4, marginBottom: 8 }}>
                        <Text style={{ color: theme.subText, fontSize: 12, fontWeight: '700' }}>
                          {formatGroupDateHeader(group.dateStr)}
                        </Text>
                        <Text style={{ color: theme.subText, fontSize: 12, fontWeight: '700' }}>
                          {group.netAmount >= 0 ? '+' : '-'}RS.{Math.abs(group.netAmount).toFixed(2)}
                        </Text>
                      </View>

                      {/* Group transactions list */}
                      <View style={{ gap: 10 }}>
                        {group.transactions.map(tx => (
                          <TouchableOpacity 
                            key={tx._id || tx.id} 
                            style={[styles.txCard, { backgroundColor: theme.bg, borderColor: theme.cardBorder }]}
                            onPress={() => handleOpenTransactionDetails(tx)}
                          >
                            <View style={styles.txLeft}>
                              <View style={[styles.txIconBg, { backgroundColor: getCategoryColor(tx.category) }]}>
                                <CategoryIcon name={tx.category} color="#ffffff" size={16} />
                              </View>
                              <View>
                                <Text style={[styles.txCategory, { color: theme.text }]}>
                                  {parseTxNote(tx.note).name || tx.category}
                                </Text>
                                <Text style={[styles.txNote, { color: theme.subText }]} numberOfLines={1}>
                                  {parseTxNote(tx.note).notes}
                                </Text>
                              </View>
                            </View>
                            <View style={[styles.txRight, { alignItems: 'flex-end' }]}>
                              <Text style={[
                                styles.txAmount, 
                                tx.type === 'income' ? styles.textEmerald : styles.textRed,
                                parseTxNote(tx.note).status === 'unpaid' && { textDecorationLine: 'line-through', opacity: 0.5 }
                              ]}>
                                {tx.type === 'income' ? '+' : '-'}RS.{tx.amount.toFixed(2)}
                              </Text>
                              {parseTxNote(tx.note).status === 'unpaid' && (
                                <Text style={{ fontSize: 10, color: '#ef4444', fontWeight: '700', marginTop: 2 }}>
                                  Cancelled
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowSpeedDial(true)}>
        <Plus size={24} color="#0f172a" />
      </TouchableOpacity>

      {/* Speed Dial Floating Menu Modal */}
      <Modal
        visible={showSpeedDial}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSpeedDial(false)}
      >
        <TouchableOpacity 
          style={styles.speedDialOverlay} 
          activeOpacity={1} 
          onPress={() => setShowSpeedDial(false)}
        >
          <View style={styles.speedDialContainer}>
            {/* Expense Option */}
            <TouchableOpacity 
              style={[styles.speedDialRow, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}
              onPress={() => {
                setShowSpeedDial(false);
                setPlanType('expense');
                setPlanCategory('');
                setPlanAmount('');
                setPlanName('');
                setPlanNotes('');
                setPlanAccount('None');
                setPlanDatePreset('Today');
                setIsTimeManual(false);
                setShowMoreFields(false);
                setShowPlanModal(true);
              }}
            >
              <View style={[styles.speedDialIconBg, { backgroundColor: '#fee2e2' }]}>
                <TrendingDown size={14} color="#ef4444" />
              </View>
              <Text style={[styles.speedDialText, { color: theme.text }]}>Expense</Text>
            </TouchableOpacity>

            {/* Income Option */}
            <TouchableOpacity 
              style={[styles.speedDialRow, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}
              onPress={() => {
                setShowSpeedDial(false);
                setPlanType('income');
                setPlanCategory('');
                setPlanAmount('');
                setPlanName('');
                setPlanNotes('');
                setPlanAccount('None');
                setPlanDatePreset('Today');
                setIsTimeManual(false);
                setShowMoreFields(false);
                setShowPlanModal(true);
              }}
            >
              <View style={[styles.speedDialIconBg, { backgroundColor: '#d1fae5' }]}>
                <TrendingUp size={14} color="#10b981" />
              </View>
              <Text style={[styles.speedDialText, { color: theme.text }]}>Income</Text>
            </TouchableOpacity>

            {/* Close Button FAB */}
            <TouchableOpacity 
              style={styles.speedDialCloseFab}
              onPress={() => setShowSpeedDial(false)}
            >
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Transaction Account selection picker modal */}
      <Modal
        visible={showTxAccountPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTxAccountPicker(false)}
      >
        <TouchableOpacity 
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowTxAccountPicker(false)}
        >
          <View style={[styles.dropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
            <TouchableOpacity
              style={[styles.presetDropdownItem, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
              onPress={() => {
                setTransactionAccount('None');
                setShowTxAccountPicker(false);
              }}
            >
              <AccountTypeLogo type="None" />
              <Text style={[styles.presetDropdownText, { color: theme.text }]}>None</Text>
            </TouchableOpacity>
            {accounts.map(acc => (
              <TouchableOpacity
                key={acc.id}
                style={[styles.presetDropdownItem, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
                onPress={() => {
                  setTransactionAccount(acc.name);
                  setShowTxAccountPicker(false);
                }}
              >
                <AccountTypeLogo type={acc.type} />
                <Text style={[styles.presetDropdownText, { color: theme.text }]}>{acc.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Transaction Details Modal (3rd screenshot style) */}
      <Modal
        visible={showTxDetailsModal}
        animationType="slide"
        onRequestClose={() => setShowTxDetailsModal(false)}
      >
        {selectedTxDetails && (
          <View style={{ flex: 1, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
            <View style={[styles.detailsModalContainer, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
              <View style={styles.detailsHeader}>
              <TouchableOpacity onPress={() => setShowTxDetailsModal(false)}>
                <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
              </TouchableOpacity>
              <Text style={[styles.detailsHeaderTitle, { color: theme.text }]}>
                {getTxHeaderDateStr(selectedTxDetails.date)}
              </Text>
              {parseTxNote(selectedTxDetails.note).status === 'paid' ? (
                <TouchableOpacity onPress={handlePressDeleteIcon}>
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => {}}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView 
              style={styles.detailsBody}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {/* Category tag chip */}
              <View style={styles.detailsCategoryBadge}>
                <CategoryIcon name={selectedTxDetails.category} color={getCategoryColor(selectedTxDetails.category)} size={14} />
                <Text style={[styles.detailsCategoryText, { color: '#ffffff' }]}>{selectedTxDetails.category}</Text>
              </View>

              {/* Notes title */}
              <Text style={[styles.detailsTitle, { color: theme.text, marginBottom: 8 }]}>
                {parseTxNote(selectedTxDetails.note).name || selectedTxDetails.category}
              </Text>
              {parseTxNote(selectedTxDetails.note).notes ? (
                <Text style={{ fontSize: 16, color: '#94a3b8', marginTop: -4, marginBottom: 20 }}>
                  {parseTxNote(selectedTxDetails.note).notes}
                </Text>
              ) : null}

              {/* Total amount card */}
              <View style={[styles.detailsTotalCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderColor: theme.cardBorder }]}>
                <View style={styles.detailsTotalLeft}>
                  {parseTxNote(selectedTxDetails.note).status === 'paid' ? (
                    <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={10} color="#ffffff" />
                    </View>
                  ) : null}
                  <Text style={styles.detailsTotalLabel}>Total</Text>
                </View>
                <Text style={[styles.detailsTotalAmount, { color: selectedTxDetails.type === 'income' ? '#10b981' : '#ef4444' }]}>
                  {selectedTxDetails.type === 'income' ? '+' : '-'}RS.{selectedTxDetails.amount.toFixed(2)}
                </Text>
              </View>

              {/* Details list card */}
              <View style={[styles.detailsInfoCard, { backgroundColor: isDarkMode ? '#161726' : '#ffffff', borderColor: theme.cardBorder }]}>
                <View style={styles.detailsInfoRow}>
                  <Text style={styles.detailsInfoLabel}>Date</Text>
                  <Text style={[styles.detailsInfoValue, { color: theme.text }]}>
                    {formatTxDetailsDate(selectedTxDetails.date)}
                  </Text>
                </View>
                {parseTxNote(selectedTxDetails.note).status === 'paid' ? (
                  <>
                    <View style={styles.detailsInfoRow}>
                      <Text style={styles.detailsInfoLabel}>Sum at original currency rate</Text>
                      <Text style={[styles.detailsInfoValue, { color: theme.text }]}>
                        {selectedTxDetails.type === 'income' ? '+' : '-'}RS.{selectedTxDetails.amount.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.detailsInfoRow}>
                      <Text style={styles.detailsInfoLabel}>Balance</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <AccountTypeLogo type={accounts.find(a => a.name === selectedTxDetails.account)?.type || 'None'} />
                        <Text style={[styles.detailsInfoValue, { color: theme.text }]}>
                          {selectedTxDetails.account || 'None'}
                        </Text>
                      </View>
                      <Text style={[styles.detailsInfoValue, { color: theme.text }]}>
                        RS.{getTransactionHistoricalBalance(selectedTxDetails).toFixed(2)}
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>

              {/* Unpaid trash can button */}
              {parseTxNote(selectedTxDetails.note).status === 'unpaid' ? (
                <TouchableOpacity 
                  style={{ alignSelf: 'flex-start', marginTop: 12, marginBottom: 20 }}
                  onPress={() => handleDeleteTx(selectedTxDetails._id)}
                >
                  <Trash2 size={24} color="#ef4444" />
                </TouchableOpacity>
              ) : null}

              {/* Cancel Payment / PAY button at bottom */}
              {parseTxNote(selectedTxDetails.note).status === 'paid' ? (
                <TouchableOpacity 
                  style={[styles.detailsCancelPaymentBtn, { backgroundColor: isDarkMode ? '#111827' : '#ffffff' }]} 
                  onPress={() => handleTogglePaymentStatus(selectedTxDetails)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.detailsCancelPaymentText}>CANCEL PAYMENT</Text>
                    <AccountTypeLogo type={accounts.find(a => a.name === selectedTxDetails.account)?.type || 'None'} />
                    <Text style={[styles.detailsCancelPaymentText, { textTransform: 'none' }]}>
                      {selectedTxDetails.account || 'None'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={[styles.detailsCancelPaymentBtn, { backgroundColor: '#111827', borderColor: '#ef4444', borderWidth: 1.5, paddingHorizontal: 0, overflow: 'hidden' }]}>
                  <TouchableOpacity 
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                    onPress={() => handleTogglePaymentStatus(selectedTxDetails)}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '800', letterSpacing: 1 }}>PAY</Text>
                    <AccountTypeLogo type={accounts.find(a => a.name === selectedTxDetails.account)?.type || 'None'} />
                    <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700' }}>{selectedTxDetails.account || 'None'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{ position: 'absolute', right: 0, width: 48, height: '100%', alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#ef444444' }}
                    onPress={() => setShowPayDrawer(true)}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 12 }}>▲</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Close text link at bottom */}
              <TouchableOpacity onPress={() => setShowTxDetailsModal(false)}>
                <Text style={styles.detailsCloseBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
            </View>



      {showPayDrawer && (
        <View style={[styles.drawerOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }]}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={() => setShowPayDrawer(false)}
          />
          <View style={[styles.payDrawerCard, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff' }]}>
            {/* Drawer Header */}
            <Text style={[styles.payDrawerTitle, { color: theme.text }]}>
              {parseTxNote(selectedTxDetails.note).name || selectedTxDetails.category}
            </Text>

            {/* Amount Field (Omit Currency) */}
            <Text style={styles.payDrawerLabel}>Amount</Text>
            <View style={styles.payDrawerInputRow}>
              <TextInput
                style={[styles.payDrawerInput, { color: theme.text, borderColor: theme.cardBorder }]}
                value={editAmount}
                onChangeText={setEditAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity 
                style={[styles.payDrawerCalcBtn, { borderColor: theme.cardBorder }]}
                onPress={() => setShowEditCalc(true)}
              >
                <Calculator size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Account Field */}
            <Text style={styles.payDrawerLabel}>Account</Text>
            <TouchableOpacity 
              style={[styles.payDrawerSelect, { borderColor: theme.cardBorder }]}
              onPress={() => setShowEditAccountPicker(true)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <AccountTypeLogo type={accounts.find(a => a.name === editAccount)?.type || 'None'} />
                <Text style={{ color: theme.text }}>{editAccount}</Text>
              </View>
              <ChevronDown size={16} color="#64748b" />
            </TouchableOpacity>

            {/* Date Field */}
            <Text style={styles.payDrawerLabel}>Date</Text>
            <View style={styles.payDrawerDateRow}>
              <TouchableOpacity 
                style={[styles.payDrawerDateBtn, { borderColor: theme.cardBorder }]}
                onPress={() => {
                  setSelectedDatePickerDate(editDate);
                  setCalendarDate(new Date(editDate.getFullYear(), editDate.getMonth(), 1));
                  setShowEditDatePicker(true);
                }}
              >
                <Text style={{ color: theme.text }}>{formatDateToPreset(editDate)}</Text>
                <Calendar size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.payDrawerPresetBtn, { backgroundColor: '#3b82f6' }]}
                onPress={() => setShowEditDateDropdown(true)}
              >
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>{editDatePreset}</Text>
                <ChevronDown size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Submit PAY button */}
            <TouchableOpacity 
              style={styles.payDrawerSubmitBtn}
              onPress={handlePayDrawerSubmit}
            >
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 14 }}>PAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showEditCalc && (
        <View style={[styles.calcOverlayContainer, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderTopColor: theme.cardBorder, borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2000 }]}>
          <TouchableOpacity 
            style={styles.calcHeader}
            activeOpacity={0.8}
            onPress={() => {
              setShowEditCalc(false);
            }}
          >
            <View style={styles.calcHeaderBar} />
            <Text style={[styles.calcHeaderTitle, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>Amount</Text>
            <Text style={[styles.calcHeaderValue, { color: theme.text }]}>
              RS.{editAmount || '0.00'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.calcKeypadGrid}>
            {/* Col 1 */}
            <View style={styles.calcCol}>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('1')}><Text style={[styles.calcKeyText, { color: theme.text }]}>1</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('4')}><Text style={[styles.calcKeyText, { color: theme.text }]}>4</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('7')}><Text style={[styles.calcKeyText, { color: theme.text }]}>7</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('.')}><Text style={[styles.calcKeyText, { color: theme.text }]}>.</Text></TouchableOpacity>
            </View>
            
            {/* Col 2 */}
            <View style={styles.calcCol}>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('2')}><Text style={[styles.calcKeyText, { color: theme.text }]}>2</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('5')}><Text style={[styles.calcKeyText, { color: theme.text }]}>5</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('8')}><Text style={[styles.calcKeyText, { color: theme.text }]}>8</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('0')}><Text style={[styles.calcKeyText, { color: theme.text }]}>0</Text></TouchableOpacity>
            </View>
            
            {/* Col 3 */}
            <View style={styles.calcCol}>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('3')}><Text style={[styles.calcKeyText, { color: theme.text }]}>3</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('6')}><Text style={[styles.calcKeyText, { color: theme.text }]}>6</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('9')}><Text style={[styles.calcKeyText, { color: theme.text }]}>9</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('backspace')}><Text style={[styles.calcKeyText, { color: theme.text }]}>⌫</Text></TouchableOpacity>
            </View>
            
            {/* Col 4 */}
            <View style={styles.calcCol}>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('/')}><Text style={[styles.calcKeyText, { color: theme.text }]}>÷</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('*')}><Text style={[styles.calcKeyText, { color: theme.text }]}>×</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('-')}><Text style={[styles.calcKeyText, { color: theme.text }]}>-</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('+')}><Text style={[styles.calcKeyText, { color: theme.text }]}>+</Text></TouchableOpacity>
            </View>
            
            {/* Col 5 */}
            <View style={styles.calcCol}>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('C')}><Text style={[styles.calcKeyText, { color: theme.text }]}>C</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handleEditKeyPress('%')}><Text style={[styles.calcKeyText, { color: theme.text }]}>%</Text></TouchableOpacity>
              <TouchableOpacity 
                style={[styles.calcKey, styles.calcKeySubmit]} 
                onPress={() => handleEditKeyPress('submit')}
              >
                <Text style={[styles.calcKeyText, { color: '#ffffff' }]}>✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Date presets selection dropdown overlay */}
      {showEditDateDropdown && (
        <TouchableOpacity 
          style={[styles.pickerOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 4000 }]}
          activeOpacity={1}
          onPress={() => setShowEditDateDropdown(false)}
        >
          <View style={[styles.presetDropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff', position: 'absolute', top: 'auto', bottom: 120, right: 24 }]}>
            {['Yesterday', 'Today', 'Tomorrow'].map(preset => (
              <TouchableOpacity
                key={preset}
                style={styles.presetDropdownItem}
                onPress={() => {
                  setEditDatePreset(preset);
                  let newD = new Date();
                  if (preset === 'Yesterday') newD.setDate(newD.getDate() - 1);
                  else if (preset === 'Tomorrow') newD.setDate(newD.getDate() + 1);
                  setEditDate(newD);
                  setShowEditDateDropdown(false);
                }}
              >
                <Text style={[styles.presetDropdownText, { color: theme.text }]}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}

      {/* Calendar Date Picker overlay */}
      {showEditDatePicker && (
        <TouchableOpacity 
          style={[styles.pickerOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5000 }]}
          activeOpacity={1}
          onPress={() => setShowEditDatePicker(false)}
        >
          <View style={[styles.datePickerCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff', position: 'absolute', bottom: 40, left: 20, right: 20 }]}>
            <View style={styles.datePickerHeader}>
              <View>
                <Text style={styles.datePickerLabel}>Select date</Text>
                <Text style={[styles.datePickerValue, { color: theme.text }]}>
                  {formatDateToHeader(selectedDatePickerDate)}
                </Text>
              </View>
            </View>

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

            <View style={styles.datePickerWeekdays}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <Text key={idx} style={styles.datePickerWeekdayText}>{day}</Text>
              ))}
            </View>

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

            <View style={styles.datePickerFooter}>
              <TouchableOpacity onPress={() => setShowEditDatePicker(false)}>
                <Text style={styles.datePickerFooterBtn}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                const preset = getPresetForDate(selectedDatePickerDate);
                setEditDatePreset(preset);
                setEditDate(selectedDatePickerDate);
                setShowEditDatePicker(false);
              }}>
                <Text style={styles.datePickerFooterBtn}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}

            {/* Edit Account selection picker overlay */}
            {showEditAccountPicker && (
              <TouchableOpacity 
                style={[styles.pickerOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000 }]}
                activeOpacity={1}
                onPress={() => setShowEditAccountPicker(false)}
              >
                <View style={[styles.dropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff', position: 'absolute', bottom: 140, left: 24, right: 24 }]}>
                  <TouchableOpacity
                    style={[styles.presetDropdownItem, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
                    onPress={() => {
                      setEditAccount('None');
                      setShowEditAccountPicker(false);
                    }}
                  >
                    <AccountTypeLogo type="None" />
                    <Text style={[styles.presetDropdownText, { color: theme.text }]}>None</Text>
                  </TouchableOpacity>
                  {accounts.map(acc => (
                    <TouchableOpacity
                      key={acc.id}
                      style={[styles.presetDropdownItem, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
                      onPress={() => {
                        setEditAccount(acc.name);
                        setShowEditAccountPicker(false);
                      }}
                    >
                      <AccountTypeLogo type={acc.type} />
                      <Text style={[styles.presetDropdownText, { color: theme.text }]}>{acc.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            )}


          </View>
        )}
      </Modal>



      {/* Settings Modal Drawer */}
      <Modal
        visible={showSettingsDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSettingsDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSettingsDropdown(false)}
        >
          <View style={[styles.dropdownDrawer, { backgroundColor: isDarkMode ? '#111827' : '#ffffff' }]}>
            <View style={[styles.drawerHeader, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[styles.drawerTitle, { color: theme.text }]}>Balance mode</Text>
              <TouchableOpacity onPress={() => setShowSettingsDropdown(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerSection}>
              <TouchableOpacity 
                style={styles.radioOptionRow}
                onPress={() => {
                  setBalanceMode('monthly');
                  setShowSettingsDropdown(false);
                }}
              >
                <View style={[styles.radioCircle, balanceMode === 'monthly' && styles.radioCircleActive]}>
                  {balanceMode === 'monthly' && <View style={styles.radioInnerDot} />}
                </View>
                <Text style={[styles.radioLabel, { color: theme.text }]}>Monthly balance</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.radioOptionRow}
                onPress={() => {
                  setBalanceMode('accumulated');
                  setShowSettingsDropdown(false);
                }}
              >
                <View style={[styles.radioCircle, balanceMode === 'accumulated' && styles.radioCircleActive]}>
                  {balanceMode === 'accumulated' && <View style={styles.radioInnerDot} />}
                </View>
                <Text style={[styles.radioLabel, { color: theme.text }]}>Accumulated balance</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Plan an outcome Modal (2nd & 3rd screenshots) */}
      <Modal
        visible={showPlanModal}
        animationType="slide"
        onRequestClose={closePlanModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: isDarkMode ? '#13141f' : '#f8fafc' }}
        >
          <View style={[styles.planModalContainer, { backgroundColor: isDarkMode ? '#13141f' : '#f8fafc' }]}>
            {/* Header */}
            <View style={styles.planHeader}>
              <TouchableOpacity onPress={closePlanModal} style={styles.planBackBtn}>
                <Text style={[styles.planBackArrow, { color: theme.text }]}>←</Text>
              </TouchableOpacity>
              <Text style={[styles.planTitle, { color: theme.text }]}>{planType === 'income' ? 'Plan an income' : 'Plan an outcome'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.planScrollContent} keyboardShouldPersistTaps="handled">
              {/* Category Select Box */}
              <View style={styles.planFieldBlock}>
                <Text style={styles.planFieldLabel}>Category</Text>
                <TouchableOpacity 
                  style={[styles.planSelectBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                  onPress={() => setShowPlanCategoryPicker(true)}
                >
                  <View style={styles.planSelectLeft}>
                    {planCategory ? (
                      <CategoryIcon name={planCategory} color={getSelectedCategoryColor()} size={18} />
                    ) : null}
                    <Text style={[styles.planSelectText, { color: planCategory ? theme.text : '#64748b' }]}>
                      {planCategory || 'Select category'}
                    </Text>
                  </View>
                  <ChevronDown size={16} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Amount row (Amount, currency picker, Paid switch) */}
              <View style={styles.planFieldBlock}>
                <View style={styles.planAmountRow}>
                  {/* Amount input */}
                  <View style={[styles.planAmountBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{ flex: 1 }}
                      onPress={() => {
                        if (planKeyboardMode === 'calc') {
                          setShowPlanCalc(true);
                        }
                      }}
                    >
                      <TextInput
                        ref={planAmountRef}
                        style={[styles.planAmountInput, { color: theme.text }]}
                        placeholder="Amount"
                        placeholderTextColor="#64748b"
                        keyboardType="numeric"
                        editable={planKeyboardMode === 'system'}
                        pointerEvents={planKeyboardMode === 'calc' ? 'none' : 'auto'}
                        value={planAmount}
                        onChangeText={setPlanAmount}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (planKeyboardMode === 'calc') {
                          setPlanKeyboardMode('system');
                          setShowPlanCalc(false);
                          setTimeout(() => {
                            planAmountRef.current?.focus();
                          }, 50);
                        } else {
                          setPlanKeyboardMode('calc');
                          RNKeyboard.dismiss();
                          setShowPlanCalc(true);
                        }
                      }}
                    >
                      {planKeyboardMode === 'calc' ? (
                        <Keyboard size={18} color="#64748b" />
                      ) : (
                        <Calculator size={18} color="#64748b" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Account Select Box */}
              <View style={styles.planFieldBlock}>
                <Text style={styles.planFieldLabel}>Account</Text>
                <TouchableOpacity 
                  style={[styles.planSelectBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                  onPress={() => setShowPlanAccountPicker(true)}
                >
                  <View style={styles.planSelectLeft}>
                    {planAccount !== 'None' ? (
                      <AccountTypeLogo type={getSelectedAccountType()} />
                    ) : null}
                    <Text style={[styles.planSelectText, { color: theme.text }]}>{planAccount}</Text>
                  </View>
                  <ChevronDown size={16} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Date row (Calendar value & Preset button) */}
              <View style={styles.planFieldBlock}>
                <Text style={styles.planFieldLabel}>Date</Text>
                <View style={styles.planDateRow}>
                  <TouchableOpacity 
                    style={[styles.planDateValBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                    onPress={handleOpenDatePicker}
                  >
                    <Text style={[styles.planDateText, { color: theme.text }]}>{formatPlanDate()}</Text>
                    <Calendar size={16} color="#64748b" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.planDatePresetBtn}
                    onPress={() => setShowPlanDateDropdown(true)}
                  >
                    <Text style={styles.planDatePresetText}>{planDatePreset}</Text>
                    <Text style={styles.planDatePresetArrow}>{showPlanDateDropdown ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Time row */}
              <View style={styles.planFieldBlock}>
                <Text style={styles.planFieldLabel}>Time</Text>
                <TouchableOpacity 
                  style={[styles.planTimeBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setClockMode('analog');
                    setShowClockPicker(true);
                  }}
                >
                  <Text style={[styles.planTimeText, { color: theme.text }]}>{planTime}</Text>
                  <Clock size={16} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Name field */}
              <View style={styles.planFieldBlock}>
                <TextInput
                  style={[styles.planNameInput, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', color: theme.text, borderColor: theme.cardBorder }]}
                  placeholder="Name"
                  placeholderTextColor="#64748b"
                  value={planName}
                  onChangeText={setPlanName}
                />
              </View>

              {/* MORE Expandable Trigger */}
              <TouchableOpacity 
                style={styles.planMoreToggleBtn}
                onPress={() => setShowMoreFields(!showMoreFields)}
              >
                <Text style={styles.planMoreToggleText}>MORE {showMoreFields ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {/* MORE Expanded extra features (3rd screenshot) */}
              {showMoreFields && (
                <View style={styles.planMoreFieldsContainer}>
                  {/* Notes */}
                  <View style={styles.planFieldBlock}>
                    <Text style={styles.planFieldLabel}>Notes</Text>
                    <TextInput
                      style={[styles.planNotesInput, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', color: theme.text, borderColor: theme.cardBorder }]}
                      placeholder="Notes"
                      placeholderTextColor="#64748b"
                      multiline={true}
                      value={planNotes}
                      onChangeText={setPlanNotes}
                    />
                  </View>
                </View>
              )}

              {/* Bottom Actions */}
              <TouchableOpacity style={styles.planCreateBtn} onPress={handleSavePlanOutcome}>
                <Text style={styles.planCreateBtnText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.planCancelBtn} onPress={closePlanModal}>
                <Text style={styles.planCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        
        {/* Custom Date Picker Modal Dialog */}
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
                    <Calendar size={20} color={theme.text} />
                  )}
                </TouchableOpacity>
              </View>

              {datePickerMode === 'calendar' ? (
                <>
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

                  <View style={styles.datePickerWeekdays}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                      <Text key={idx} style={styles.datePickerWeekdayText}>{day}</Text>
                    ))}
                  </View>

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
          </KeyboardAvoidingView>

        {/* Date presets selection dropdown overlay (4th screenshot) */}
        <Modal
          visible={showPlanDateDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPlanDateDropdown(false)}
        >
          <TouchableOpacity 
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowPlanDateDropdown(false)}
          >
            <View style={[styles.presetDropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
              {['Yesterday', 'Today', 'Tomorrow'].map(preset => (
                <TouchableOpacity
                  key={preset}
                  style={styles.presetDropdownItem}
                  onPress={() => {
                    if (showPayDrawer) {
                      setEditDatePreset(preset);
                      let newD = new Date();
                      if (preset === 'Yesterday') newD.setDate(newD.getDate() - 1);
                      else if (preset === 'Tomorrow') newD.setDate(newD.getDate() + 1);
                      setEditDate(newD);
                    } else {
                      setPlanDatePreset(preset);
                      setPlanDate(preset);
                    }
                    setShowPlanDateDropdown(false);
                  }}
                >
                  <Text style={[styles.presetDropdownText, { color: theme.text }]}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Category selection picker modal */}
        <Modal
          visible={showPlanCategoryPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPlanCategoryPicker(false)}
        >
          <TouchableOpacity 
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowPlanCategoryPicker(false)}
          >
            <View style={[styles.dropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
              {(() => {
                const filtered = categories.filter(cat => cat.type === planType);
                const seen = new Set();
                const uniqueCats = [];
                filtered.forEach(cat => {
                  const nameLower = cat.name.trim().toLowerCase();
                  if (!seen.has(nameLower)) {
                    seen.add(nameLower);
                    uniqueCats.push(cat);
                  }
                });
                return uniqueCats;
              })().length > 0 ? (
                (() => {
                  const filtered = categories.filter(cat => cat.type === planType);
                  const seen = new Set();
                  const uniqueCats = [];
                  filtered.forEach(cat => {
                    const nameLower = cat.name.trim().toLowerCase();
                    if (!seen.has(nameLower)) {
                      seen.add(nameLower);
                      uniqueCats.push(cat);
                    }
                  });
                  return uniqueCats;
                })().map(cat => (
                  <TouchableOpacity
                    key={cat._id || cat.name}
                    style={[styles.presetDropdownItem, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
                    onPress={() => {
                      setPlanCategory(cat.name);
                      setShowPlanCategoryPicker(false);
                    }}
                  >
                    <CategoryIcon name={cat.name} color={cat.color || '#3b82f6'} size={18} />
                    <Text style={[styles.presetDropdownText, { color: theme.text }]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ padding: 15, alignItems: 'center' }}>
                  <Text style={{ color: '#64748b', fontSize: 13 }}>No {planType} categories found</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Currency selection picker modal */}
        <Modal
          visible={showPlanCurrencyPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPlanCurrencyPicker(false)}
        >
          <TouchableOpacity 
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowPlanCurrencyPicker(false)}
          >
            <View style={[styles.dropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
              {['RS.', 'GBP', 'USD', 'EUR'].map(curr => (
                <TouchableOpacity
                  key={curr}
                  style={styles.presetDropdownItem}
                  onPress={() => {
                    setPlanCurrency(curr);
                    setShowPlanCurrencyPicker(false);
                  }}
                >
                  <Text style={[styles.presetDropdownText, { color: theme.text }]}>{curr}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Repeat selection picker modal */}
        <Modal
          visible={showPlanRepeatPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPlanRepeatPicker(false)}
        >
          <TouchableOpacity 
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowPlanRepeatPicker(false)}
          >
            <View style={[styles.dropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
              {['Does not repeat', 'Daily', 'Weekly', 'Monthly', 'Yearly'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={styles.presetDropdownItem}
                  onPress={() => {
                    setPlanRepeat(opt);
                    setShowPlanRepeatPicker(false);
                  }}
                >
                  <Text style={[styles.presetDropdownText, { color: theme.text }]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Remind selection picker modal */}
        <Modal
          visible={showPlanRemindPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPlanRemindPicker(false)}
        >
          <TouchableOpacity 
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowPlanRemindPicker(false)}
          >
            <View style={[styles.dropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
              {['Don\'t remind', 'At time of event', '5 minutes before', '15 minutes before', '1 hour before', '1 day before'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={styles.presetDropdownItem}
                  onPress={() => {
                    setPlanRemind(opt);
                    setShowPlanRemindPicker(false);
                  }}
                >
                  <Text style={[styles.presetDropdownText, { color: theme.text }]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Goal or debt selection picker modal */}
        <Modal
          visible={showPlanGoalPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPlanGoalPicker(false)}
        >
          <TouchableOpacity 
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowPlanGoalPicker(false)}
          >
            <View style={[styles.dropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
              {['None', 'Car Loan', 'House Saving', 'Holiday Fund'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={styles.presetDropdownItem}
                  onPress={() => {
                    setPlanGoal(opt);
                    setShowPlanGoalPicker(false);
                  }}
                >
                  <Text style={[styles.presetDropdownText, { color: theme.text }]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Account selection picker modal */}
        <Modal
          visible={showPlanAccountPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPlanAccountPicker(false)}
        >
          <TouchableOpacity 
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowPlanAccountPicker(false)}
          >
            <View style={[styles.dropdownCard, { backgroundColor: isDarkMode ? '#2c2e3d' : '#ffffff' }]}>
              <TouchableOpacity
                style={[styles.presetDropdownItem, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
                onPress={() => {
                  setPlanAccount('None');
                  setShowPlanAccountPicker(false);
                }}
              >
                <AccountTypeLogo type="None" />
                <Text style={[styles.presetDropdownText, { color: theme.text }]}>None</Text>
              </TouchableOpacity>
              {accounts.map(acc => (
                <TouchableOpacity
                  key={acc.id}
                  style={[styles.presetDropdownItem, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
                  onPress={() => {
                    setPlanAccount(acc.name);
                    setShowPlanAccountPicker(false);
                  }}
                >
                  <AccountTypeLogo type={acc.type} />
                  <Text style={[styles.presetDropdownText, { color: theme.text }]}>{acc.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* 12-Hour Material Clock Picker Modal Dialog (5th screenshot) */}
        <Modal
          visible={showClockPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowClockPicker(false)}
        >
          <View style={styles.clockPickerOverlay}>
            <View style={[styles.clockPickerCard, { backgroundColor: '#1e222d' }]}>
              <Text style={styles.clockPickerTitle}>SELECT TRANSACTION TIME</Text>
              
              {/* Hour & Minute display block */}
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
                  
                  {/* AM / PM Toggle switch buttons */}
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

              {/* Circular Clock Face */}
              {clockMode === 'analog' && (
                <View style={styles.clockFaceCircle}>
                  <Svg height="220" width="220">
                    {/* Center Dot */}
                    <Circle cx="110" cy="110" r="4" fill="#3b82f6" />
                    
                    {/* Clock hand line pointing to selected hour number */}
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

                  {/* Touchable Hour Numbers overlays */}
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

              {/* Action buttons footer */}
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
                  <TouchableOpacity onPress={() => {
                    setPlanTime(`${clockHour}:${String(clockMinute).padStart(2, '0')} ${clockAmPm.toLowerCase()}`);
                    setIsTimeManual(true);
                    setShowClockPicker(false);
                  }}>
                    <Text style={styles.clockOkBtnLabel}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
                 {/* Custom Calculator Keypad Overlay for Plan modal */}
        <Modal
          visible={showPlanCalc}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowPlanCalc(false);
            planAmountRef.current?.blur();
          }}
        >
          {showPlanCalc && (
            <View style={[styles.calcOverlayContainer, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderTopColor: theme.cardBorder, borderTopWidth: 1 }]}>
              <TouchableOpacity 
                style={styles.calcHeader}
                activeOpacity={0.8}
                onPress={() => {
                  setShowPlanCalc(false);
                  planAmountRef.current?.blur();
                }}
              >
                <View style={styles.calcHeaderBar} />
                <Text style={[styles.calcHeaderTitle, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>Amount</Text>
                <Text style={[styles.calcHeaderValue, { color: theme.text }]}>
                  {planCurrency}{planAmount || '0.00'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.calcKeypadGrid}>
                {/* Col 1 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('1')}><Text style={[styles.calcKeyText, { color: theme.text }]}>1</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('4')}><Text style={[styles.calcKeyText, { color: theme.text }]}>4</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('7')}><Text style={[styles.calcKeyText, { color: theme.text }]}>7</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('.')}><Text style={[styles.calcKeyText, { color: theme.text }]}>.</Text></TouchableOpacity>
                </View>
                
                {/* Col 2 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('2')}><Text style={[styles.calcKeyText, { color: theme.text }]}>2</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('5')}><Text style={[styles.calcKeyText, { color: theme.text }]}>5</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('8')}><Text style={[styles.calcKeyText, { color: theme.text }]}>8</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('0')}><Text style={[styles.calcKeyText, { color: theme.text }]}>0</Text></TouchableOpacity>
                </View>
                
                {/* Col 3 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('3')}><Text style={[styles.calcKeyText, { color: theme.text }]}>3</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('6')}><Text style={[styles.calcKeyText, { color: theme.text }]}>6</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('9')}><Text style={[styles.calcKeyText, { color: theme.text }]}>9</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('backspace')}><Text style={[styles.calcKeyText, { color: theme.text }]}>⌫</Text></TouchableOpacity>
                </View>
                
                {/* Col 4 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('/')}><Text style={[styles.calcKeyText, { color: theme.text }]}>÷</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('*')}><Text style={[styles.calcKeyText, { color: theme.text }]}>×</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('-')}><Text style={[styles.calcKeyText, { color: theme.text }]}>-</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('+')}><Text style={[styles.calcKeyText, { color: theme.text }]}>+</Text></TouchableOpacity>
                </View>
                
                {/* Col 5 */}
                <View style={styles.calcCol}>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('C')}><Text style={[styles.calcKeyText, { color: theme.text }]}>C</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.calcKey, { backgroundColor: isDarkMode ? '#2c2e3d' : '#f1f5f9' }]} onPress={() => handlePlanKeyPress('%')}><Text style={[styles.calcKeyText, { color: theme.text }]}>%</Text></TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.calcKey, styles.calcKeySubmit]} 
                    onPress={() => handlePlanKeyPress('submit')}
                  >
                    <Text style={[styles.calcKeyText, { color: '#ffffff' }]}>✓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Modal>
      </Modal>
 
      {/* Transaction Modal */}

      {/* Transaction Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.transactionModal}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Add Transaction</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.toggleRow}>
              <TouchableOpacity 
                style={[styles.toggleBtn, modalType === 'expense' && styles.toggleBtnActiveExpense]}
                onPress={() => setModalType('expense')}
              >
                <Text style={[styles.toggleBtnText, modalType === 'expense' && styles.toggleBtnTextActive]}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, modalType === 'income' && styles.toggleBtnActiveIncome]}
                onPress={() => setModalType('income')}
              >
                <Text style={[styles.toggleBtnText, modalType === 'income' && styles.toggleBtnTextActive]}>Income</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Amount (£)</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#475569"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat._id}
                    style={[
                      styles.categoryGridItem, 
                      category === cat.name && { borderColor: cat.color, backgroundColor: `${cat.color}15` }
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <View style={[styles.miniColorDot, { backgroundColor: cat.color }]} />
                    <Text style={[styles.categoryGridText, category === cat.name && { color: '#ffffff', fontWeight: '700' }]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Account</Text>
              <TouchableOpacity 
                style={[styles.planSelectBox, { backgroundColor: isDarkMode ? '#1e202e' : '#ffffff', borderColor: theme.cardBorder, marginBottom: 16 }]}
                onPress={() => setShowTxAccountPicker(true)}
              >
                <View style={styles.planSelectLeft}>
                  {transactionAccount !== 'None' ? (
                    <AccountTypeLogo type={accounts.find(a => a.name === transactionAccount)?.type || 'None'} />
                  ) : null}
                  <Text style={[styles.planSelectText, { color: theme.text }]}>{transactionAccount}</Text>
                </View>
                <ChevronDown size={16} color="#64748b" />
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Add extra description note"
                placeholderTextColor="#475569"
                value={note}
                onChangeText={setNote}
              />

              <TouchableOpacity 
                style={styles.saveTxBtn} 
                onPress={handleAddTransaction}
                disabled={savingTransaction}
              >
                {savingTransaction ? (
                  <ActivityIndicator size="small" color="#0f172a" />
                ) : (
                  <Text style={styles.saveTxText}>Save Entry</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: '#fef08a', // Matching screenshot light background avatar
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarMini: {
    height: 38,
    width: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 14,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b20',
    borderColor: '#f59e0b40',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  coinsText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '700',
  },
  goProBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    gap: 2,
  },
  goProIcon: {
    fontSize: 9,
  },
  goProText: {
    color: '#0f172a',
    fontSize: 9,
    fontWeight: '800',
  },
  balanceDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161726',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
  },
  dropdownBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  dropdownBtnArrow: {
    color: '#64748b',
    fontSize: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    padding: 6,
  },
  headerIconText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  balanceContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  balanceSub: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceVal: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  textRed: {
    color: '#ef4444',
  },
  textEmerald: {
    color: '#10b981',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#161726',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIconBg: {
    height: 36,
    width: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgEmerald: {
    backgroundColor: '#10b98120',
  },
  bgRed: {
    backgroundColor: '#ef444420',
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  monthSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  scrollChipsRow: {
    paddingHorizontal: 4,
    gap: 12,
    flexDirection: 'row',
  },
  monthChip: {
    width: 80,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#161726',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginRight: 12,
  },
  monthChipActive: {
    backgroundColor: '#1e293b',
    borderColor: '#475569',
  },
  monthChipText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  monthChipTextActive: {
    color: '#ffffff',
  },
  ledgerContainer: {
    gap: 16,
  },
  bannerCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    height: 120,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  bannerSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerTextOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthBadge: {
    backgroundColor: '#0b0f19cc',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  monthBadgeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  weekSection: {
    backgroundColor: '#161726',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
    marginBottom: 10,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  weekHeaderRowActive: {
    backgroundColor: '#1e293b33',
  },
  weekLabelText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  arrowText: {
    color: '#64748b',
    fontSize: 11,
  },
  weekTransactionsList: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    gap: 10,
    backgroundColor: '#0b0f1944',
  },
  noTxText: {
    color: '#475569',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 14,
    fontStyle: 'italic',
  },
  txCard: {
    backgroundColor: '#161726',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  txIconBg: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txCategory: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  txNote: {
    color: '#475569',
    fontSize: 10,
    marginTop: 1,
  },
  txRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  txAmount: {
    fontSize: 12,
    fontWeight: '800',
  },
  checkmarkBg: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#10b98120',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#38bdf8', // Blue color FAB matching bottom navigation highlight
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.84,
    elevation: 5,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  dropdownDrawer: {
    backgroundColor: '#0b0f19',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 24,
    gap: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  drawerTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  drawerSection: {
    gap: 8,
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: '#161726',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionBtnActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#38bdf810',
  },
  optionBtnText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  optionBtnTextActive: {
    color: '#38bdf8',
  },
  transactionModal: {
    backgroundColor: '#0b0f19',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 24,
    maxHeight: '80%',
  },
  toggleRow: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: '#161726',
    padding: 4,
    marginVertical: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActiveExpense: {
    backgroundColor: '#ef444420',
  },
  toggleBtnActiveIncome: {
    backgroundColor: '#10b98120',
  },
  toggleBtnText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  detailsModalContainer: {
    flex: 1,
    padding: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 16,
  },
  detailsHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailsBody: {
    flex: 1,
    marginTop: 20,
  },
  detailsCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 16,
  },
  detailsCategoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailsTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },
  detailsTotalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  detailsTotalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailsTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  detailsTotalAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  detailsInfoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 16,
    marginBottom: 24,
  },
  detailsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsInfoLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  detailsInfoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailsCancelPaymentBtn: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  detailsCancelPaymentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
  },
  detailsCloseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3b82f6',
    textAlign: 'center',
    paddingVertical: 10,
  },
  toggleBtnTextActive: {
    color: '#ffffff',
  },
  modalForm: {
    gap: 16,
  },
  inputLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#161726',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryGridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161726',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  miniColorDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  categoryGridText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
  saveTxBtn: {
    backgroundColor: '#38bdf8',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  saveTxText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  speedDialOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  speedDialContainer: {
    position: 'absolute',
    right: 24,
    bottom: Platform.OS === 'ios' ? 106 : 94,
    alignItems: 'flex-end',
  },
  speedDialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#334155',
    width: 120,
  },
  speedDialIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedDialText: {
    fontSize: 13,
    fontWeight: '700',
  },
  speedDialCloseFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.84,
    elevation: 5,
  },
  radioOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#a855f7',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a855f7',
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Plan Modal styles
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
  planCurrencyBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 14,
  },
  planCurrencyText: {
    fontSize: 13,
    fontWeight: '700',
  },
  planPaidBox: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  payDrawerCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    paddingBottom: 40,
  },
  payDrawerTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
  },
  payDrawerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    marginTop: 16,
  },
  payDrawerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payDrawerInput: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  payDrawerCalcBtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payDrawerSelect: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  payDrawerDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payDrawerDateBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  payDrawerPresetBtn: {
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  payDrawerSubmitBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111827',
    borderColor: '#ef4444',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  planPaidLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  planSwitchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  planSwitchTrackActive: {
    backgroundColor: '#a855f725',
  },
  planSwitchTrackInactive: {
    backgroundColor: '#cbd5e120',
  },
  planSwitchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  planSwitchKnobActive: {
    backgroundColor: '#a855f7',
    alignSelf: 'flex-end',
  },
  planSwitchKnobInactive: {
    backgroundColor: '#94a3b8',
    alignSelf: 'flex-start',
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
  planDatePresetArrow: {
    color: '#ffffff',
    fontSize: 10,
  },
  planTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  planTimeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  planNameInput: {
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '700',
  },
  planMoreToggleBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  planMoreToggleText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planMoreFieldsContainer: {
    gap: 16,
    marginTop: 8,
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
  planColorBar: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    marginVertical: 4,
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
  presetDropdownCard: {
    width: 140,
    borderRadius: 16,
    padding: 8,
    elevation: 8,
    alignSelf: 'center',
    position: 'absolute',
    right: 20,
    top: 315,
  },
  presetDropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  presetDropdownText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dropdownCard: {
    width: 220,
    borderRadius: 16,
    padding: 8,
    elevation: 8,
    alignSelf: 'center',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 12-Hour Clock Picker styles
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
  // Calculator keypad styles
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
});
