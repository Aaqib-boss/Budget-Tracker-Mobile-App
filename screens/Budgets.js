import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, X, PieChart } from 'lucide-react-native';

export default function Budgets() {
  const { showToast } = useContext(AuthContext);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Limit States
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBudgetsData = async () => {
    setLoading(true);
    try {
      const budgetData = await api.get('/budgets');
      setBudgets(budgetData);

      const catData = await api.get('/categories');
      setCategories(catData);
      if (catData.length > 0) setCategory(catData[0].name);
    } catch (err) {
      console.error(err);
      showToast('Failed to load budgets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetsData();
  }, []);

  const handleCreateBudget = async () => {
    if (!limit || isNaN(limit) || parseFloat(limit) <= 0) {
      showToast('Please enter a valid limit', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.post('/budgets', {
        category,
        limit: parseFloat(limit)
      });
      showToast('Budget limit saved successfully!', 'success');
      setLimit('');
      setShowModal(false);
      fetchBudgetsData();
    } catch (err) {
      showToast(err.message || 'Failed to create budget', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      showToast('Budget limit deleted', 'success');
      fetchBudgetsData();
    } catch (err) {
      showToast('Failed to delete budget', 'error');
    }
  };

  const renderBudgetItem = ({ item }) => {
    const percent = Math.min((item.spent / item.limit) * 100, 100);
    const isOver = item.spent > item.limit;
    const remaining = item.limit - item.spent;

    return (
      <View style={styles.budgetCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <TouchableOpacity onPress={() => handleDeleteBudget(item._id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar container */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[
              styles.progressBarFill, 
              { width: `${percent}%` },
              isOver ? styles.bgRed : styles.bgEmerald
            ]} />
          </View>
          <Text style={styles.progressPercent}>{percent.toFixed(0)}% Used</Text>
        </View>

        {/* Spent vs Limit details */}
        <View style={styles.detailsRow}>
          <View>
            <Text style={styles.detailsLabel}>Spent</Text>
            <Text style={styles.detailsValue}>RS.{item.spent.toFixed(2)}</Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.detailsLabel}>Limit Target</Text>
            <Text style={styles.detailsValue}>RS.{item.limit.toFixed(2)}</Text>
          </View>
        </View>

        {/* Remaining info label */}
        <View style={[styles.remainingCard, isOver ? styles.remRed : styles.remEmerald]}>
          <Text style={[styles.remainingText, isOver ? styles.textRed : styles.textEmerald]}>
            {isOver ? 'Over budget by ' : 'Remaining safe zone: '}
            RS.{Math.abs(remaining).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Monthly Budgets</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Plus size={16} color="#0f172a" />
          <Text style={styles.addBtnText}>Set Limit</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={item => item._id}
          renderItem={renderBudgetItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <PieChart size={36} color="#475569" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>No monthly category limits set yet</Text>
            </View>
          }
        />
      )}

      {/* Set Limit Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Budget Limit</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat._id}
                    style={[
                      styles.categoryItem, 
                      category === cat.name && { borderColor: cat.color, backgroundColor: `${cat.color}15` }
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                    <Text style={[styles.categoryText, category === cat.name && { color: '#ffffff', fontWeight: '750' }]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Monthly Limit (RS.)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="5000"
                placeholderTextColor="#475569"
                value={limit}
                onChangeText={setLimit}
              />

              <TouchableOpacity 
                style={styles.submitBtn}
                onPress={handleCreateBudget}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#0f172a" />
                ) : (
                  <Text style={styles.submitBtnText}>Create Target</Text>
                )}
              </TouchableOpacity>
            </View>
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
  pageTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
    gap: 4,
  },
  addBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 40,
    gap: 16,
  },
  budgetCard: {
    backgroundColor: '#161726',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardCategory: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '600',
  },
  progressContainer: {
    gap: 6,
    marginBottom: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#0b0f19',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  bgEmerald: {
    backgroundColor: '#10b981',
  },
  bgRed: {
    backgroundColor: '#ef4444',
  },
  progressPercent: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    alignSelf: 'flex-end',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  alignRight: {
    alignItems: 'end',
  },
  detailsLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailsValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  remainingCard: {
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  remEmerald: {
    backgroundColor: '#10b98110',
  },
  remRed: {
    backgroundColor: '#ef444410',
  },
  remainingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textEmerald: {
    color: '#10b981',
  },
  textRed: {
    color: '#ef4444',
  },
  emptyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0b0f19',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  form: {
    gap: 16,
  },
  inputLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161726',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  colorDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  categoryText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#161726',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: '#10b981',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  submitBtnText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
});
