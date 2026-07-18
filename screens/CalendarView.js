import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react-native';

export default function CalendarView() {
  const { showToast } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Day details states
  const [selectedDayTx, setSelectedDayTx] = useState([]);
  const [selectedDayLabel, setSelectedDayLabel] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.get('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load calendar logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayIndex = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calculate total expense for a specific date
  const getDayExpenseSum = (dayNum) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
    const dayStart = new Date(checkDate.setHours(0,0,0,0));
    const dayEnd = new Date(checkDate.setHours(23,59,59,999));

    const dayTxList = transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d >= dayStart && d <= dayEnd;
    });

    let sum = 0;
    dayTxList.forEach(t => sum += t.amount);
    return { sum, txs: dayTxList };
  };

  const handleDayPress = (dayNum) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
    const dayStart = new Date(checkDate.setHours(0,0,0,0));
    const dayEnd = new Date(checkDate.setHours(23,59,59,999));

    const dayTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= dayStart && d <= dayEnd;
    });

    if (dayTx.length === 0) {
      showToast('No transaction entries on this day', 'info');
      return;
    }

    setSelectedDayTx(dayTx);
    setSelectedDayLabel(checkDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }));
    setShowDetailModal(true);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayIndex(year, month);

    const cells = [];
    
    // Add empty cell offsets for week alignment
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.calendarCellEmpty} />);
    }

    // Add days cells
    for (let day = 1; day <= totalDays; day++) {
      const { sum } = getDayExpenseSum(day);
      
      cells.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={styles.calendarCell}
          onPress={() => handleDayPress(day)}
        >
          <Text style={styles.cellDayNum}>{day}</Text>
          {sum > 0 ? (
            <Text style={styles.cellExpenseText} numberOfLines={1}>
              -{sum.toFixed(0)}
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    }

    return cells;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <View style={styles.container}>
      {/* Month controller header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.controlBtn} onPress={handlePrevMonth}>
          <ChevronLeft size={20} color="#94a3b8" />
        </TouchableOpacity>

        <Text style={styles.monthLabel}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>

        <TouchableOpacity style={styles.controlBtn} onPress={handleNextMonth}>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Weekdays segment */}
      <View style={styles.weekdaysRow}>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <Text key={day} style={styles.weekdayLabel}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid Container */}
      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.gridScroll}>
          <View style={styles.gridContainer}>
            {renderCalendar()}
          </View>
        </ScrollView>
      )}

      {/* Daily Transactions Details Modal */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowDetailModal(false);
          setSelectedDayTx([]);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModal}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTitleContainer}>
                <Calendar size={16} color="#10b981" />
                <Text style={styles.modalTitle}>{selectedDayLabel}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                setShowDetailModal(false);
                setSelectedDayTx([]);
              }}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalList}>
              {selectedDayTx.map(tx => {
                const isIncome = tx.type === 'income';
                return (
                  <View key={tx._id} style={styles.modalListItem}>
                    <View>
                      <Text style={styles.listItemCategory}>{tx.category}</Text>
                      {tx.note ? <Text style={styles.listItemNote}>{tx.note}</Text> : null}
                    </View>
                    <Text style={[styles.listItemAmount, isIncome ? styles.textEmerald : styles.textRed]}>
                      {isIncome ? '+' : '-'}RS.{tx.amount.toFixed(2)}
                    </Text>
                  </View>
                );
              })}
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 20,
  },
  controlBtn: {
    height: 40,
    width: 40,
    backgroundColor: '#161726',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 8,
  },
  weekdayLabel: {
    flex: 1,
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridScroll: {
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#161726',
  },
  calendarCell: {
    width: '14.28%',
    aspectRatio: 1,
    borderColor: '#1e293b',
    borderWidth: 0.5,
    padding: 6,
    justifyContent: 'space-between',
    backgroundColor: '#161726',
  },
  calendarCellEmpty: {
    width: '14.28%',
    aspectRatio: 1,
    borderColor: '#1e293b',
    borderWidth: 0.5,
    backgroundColor: '#0f172a',
  },
  cellDayNum: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  cellExpenseText: {
    color: '#ef4444',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: '#ef444415',
    borderRadius: 4,
    paddingVertical: 1,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 24,
  },
  detailModal: {
    backgroundColor: '#0b0f19',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  modalList: {
    gap: 12,
  },
  modalListItem: {
    backgroundColor: '#161726',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemCategory: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  listItemNote: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  listItemAmount: {
    fontSize: 13,
    fontWeight: '800',
  },
  textEmerald: {
    color: '#10b981',
  },
  textRed: {
    color: '#ef4444',
  },
});
