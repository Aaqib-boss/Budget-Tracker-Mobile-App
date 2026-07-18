import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, Trash2, Calendar, Tag } from 'lucide-react-native';

export default function Transactions() {
  const { user, showToast } = useContext(AuthContext);
  const getStorageKey = () => user && user.email ? `user_accounts_${user.email}` : 'user_accounts';
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'

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
        await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error updating account balance in Transactions:', err);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.get('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load ledger', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
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
              const txToDelete = transactions.find(t => t._id === id);
              await api.delete(`/transactions/${id}`);
              if (txToDelete && txToDelete.account) {
                const delDelta = txToDelete.type === 'income' ? -txToDelete.amount : txToDelete.amount;
                await updateAccountBalance(txToDelete.account, delDelta);
              }
              showToast('Transaction deleted successfully', 'success');
              fetchTransactions();
            } catch (err) {
              showToast(err.message || 'Failed to delete entry', 'error');
            }
          }
        }
      ]
    );
  };

  // Filtered transactions
  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      const matchesSearch = (t.category || '').toLowerCase().includes(search.toLowerCase()) || 
                            (t.note || '').toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' ? true : t.type === filterType;
      return matchesSearch && matchesType;
    });
  };

  const renderTxItem = ({ item }) => {
    const isIncome = item.type === 'income';
    const dateStr = new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <View style={styles.txCard}>
        <View style={styles.txLeft}>
          <View style={styles.iconBg}>
            <Tag size={16} color="#94a3b8" />
          </View>
          <View style={styles.txInfo}>
            <Text style={styles.categoryText}>{item.category}</Text>
            {item.note ? <Text style={styles.noteText} numberOfLines={1}>{item.note}</Text> : null}
            <View style={styles.dateRow}>
              <Calendar size={10} color="#475569" />
              <Text style={styles.dateText}>{dateStr}</Text>
            </View>
          </View>
        </View>

        <View style={styles.txRight}>
          <Text style={[styles.amountText, isIncome ? styles.incomeColor : styles.expenseColor]}>
            {isIncome ? '+' : '-'}RS.{item.amount.toFixed(2)}
          </Text>
          <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Transaction Ledger</Text>

      {/* Search and Filters */}
      <View style={styles.filterCard}>
        <View style={styles.searchWrapper}>
          <Search size={16} color="#64748b" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search category or description note"
            placeholderTextColor="#475569"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.tabRow}>
          {['all', 'income', 'expense'].map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.filterTab, filterType === type && styles.filterTabActive]}
              onPress={() => setFilterType(type)}
            >
              <Text style={[styles.tabText, filterType === type && styles.tabTextActive]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList 
          data={getFilteredTransactions()}
          keyExtractor={item => item._id}
          renderItem={renderTxItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>No transaction records matched</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 20,
  },
  filterCard: {
    backgroundColor: '#161726',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0b0f19',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    height: 44,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 13,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    backgroundColor: '#0b0f19',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    borderColor: '#10b981',
    backgroundColor: '#10b98110',
  },
  tabText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#10b981',
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 40,
    gap: 12,
  },
  txCard: {
    backgroundColor: '#161726',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBg: {
    height: 38,
    width: 38,
    borderRadius: 10,
    backgroundColor: '#0b0f19',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  noteText: {
    color: '#475569',
    fontSize: 11,
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dateText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '500',
  },
  txRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountText: {
    fontSize: 13,
    fontWeight: '800',
  },
  incomeColor: {
    color: '#10b981',
  },
  expenseColor: {
    color: '#ef4444',
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: '#ef444410',
    borderRadius: 8,
  },
  emptyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '500',
  },
});
