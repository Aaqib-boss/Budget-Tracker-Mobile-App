import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, X, Target, Gift } from 'lucide-react-native';

export default function Goals({ isDarkMode }) {
  const { showToast } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Goal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState('Savings');
  const [creating, setCreating] = useState(false);

  // Contribution States
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contribution, setContribution] = useState('');
  const [contributing, setContributing] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const data = await api.get('/goals');
      setGoals(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load savings goals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async () => {
    if (!title) {
      showToast('Please enter a goal title', 'error');
      return;
    }
    if (!target || isNaN(target) || parseFloat(target) <= 0) {
      showToast('Please enter a valid target target', 'error');
      return;
    }
    setCreating(true);
    try {
      await api.post('/goals', {
        title,
        target: parseFloat(target),
        category
      });
      showToast('Savings goal saved!', 'success');
      setTitle('');
      setTarget('');
      setShowCreateModal(false);
      fetchGoals();
    } catch (err) {
      showToast(err.message || 'Failed to create goal', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleContribute = async () => {
    if (!contribution || isNaN(contribution) || parseFloat(contribution) <= 0) {
      showToast('Please enter a valid contribution amount', 'error');
      return;
    }
    setContributing(true);
    try {
      await api.put(`/goals/${selectedGoal._id}/add-money`, {
        amount: parseFloat(contribution)
      });
      showToast('Contribution logged successfully!', 'success');
      setContribution('');
      setShowContributeModal(false);
      setSelectedGoal(null);
      fetchGoals();
    } catch (err) {
      showToast(err.message || 'Failed to add funds', 'error');
    } finally {
      setContributing(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      showToast('Savings goal deleted', 'success');
      fetchGoals();
    } catch (err) {
      showToast('Failed to delete goal', 'error');
    }
  };

  const renderGoalItem = ({ item }) => {
    const percent = Math.min((item.current / item.target) * 100, 100);
    const isCompleted = item.current >= item.target;

    return (
      <View style={styles.goalCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.cardTitleText}>{item.title}</Text>
            <Text style={styles.cardCategoryText}>{item.category}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDeleteGoal(item._id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar container */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[
              styles.progressBarFill, 
              { width: `${percent}%` },
              isCompleted ? styles.bgGold : styles.bgEmerald
            ]} />
          </View>
          <Text style={styles.progressPercent}>{percent.toFixed(0)}% Saved</Text>
        </View>

        {/* Progress stats */}
        <View style={styles.detailsRow}>
          <View>
            <Text style={styles.detailsLabel}>Saved Balance</Text>
            <Text style={styles.detailsValue}>RS.{item.current.toFixed(2)}</Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.detailsLabel}>Savings Target</Text>
            <Text style={styles.detailsValue}>RS.{item.target.toFixed(2)}</Text>
          </View>
        </View>

        {/* Contribute Button */}
        {!isCompleted && (
          <TouchableOpacity 
            style={styles.contributeBtn}
            onPress={() => {
              setSelectedGoal(item);
              setShowContributeModal(true);
            }}
          >
            <Plus size={14} color="#0f172a" />
            <Text style={styles.contributeText}>Add Funds</Text>
          </TouchableOpacity>
        )}

        {isCompleted && (
          <View style={styles.completedBanner}>
            <Gift size={14} color="#f59e0b" />
            <Text style={styles.completedBannerText}>Savings Goal Completed!</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Savings Goals</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreateModal(true)}>
          <Plus size={16} color="#0f172a" />
          <Text style={styles.addBtnText}>New Goal</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={item => item._id}
          renderItem={renderGoalItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Target size={36} color="#475569" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>No active savings goals defined yet</Text>
            </View>
          }
        />
      )}

      {/* Create Goal Modal */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Savings Goal</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.inputLabel}>Goal Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. New iPhone 17"
                placeholderTextColor="#475569"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Target Goal (RS.)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="120000"
                placeholderTextColor="#475569"
                value={target}
                onChangeText={setTarget}
              />

              <Text style={styles.inputLabel}>Goal Category</Text>
              <View style={styles.categoryRow}>
                {['Savings', 'Gadgets', 'Travel', 'Vehicle'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryBtn, category === cat && styles.categoryBtnActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.categoryBtnText, category === cat && styles.categoryBtnTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.submitBtn}
                onPress={handleCreateGoal}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="#0f172a" />
                ) : (
                  <Text style={styles.submitBtnText}>Create Goal</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Contribution Modal */}
      <Modal
        visible={showContributeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowContributeModal(false);
          setSelectedGoal(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Savings Funds</Text>
              <TouchableOpacity onPress={() => {
                setShowContributeModal(false);
                setSelectedGoal(null);
              }}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.goalContributionHeader}>
                Contributing to: <Text style={styles.highlightText}>{selectedGoal?.title}</Text>
              </Text>

              <Text style={styles.inputLabel}>Amount to Contribute (RS.)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="5000"
                placeholderTextColor="#475569"
                value={contribution}
                onChangeText={setContribution}
              />

              <TouchableOpacity 
                style={styles.submitBtn}
                onPress={handleContribute}
                disabled={contributing}
              >
                {contributing ? (
                  <ActivityIndicator size="small" color="#0f172a" />
                ) : (
                  <Text style={styles.submitBtnText}>Save Contribution</Text>
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
  goalCard: {
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
  headerLeft: {
    gap: 2,
  },
  cardTitleText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  cardCategoryText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
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
  bgGold: {
    backgroundColor: '#f59e0b',
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
    marginBottom: 16,
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
  contributeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 12,
    height: 38,
    gap: 6,
  },
  contributeText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b15',
    borderColor: '#f59e0b30',
    borderWidth: 1,
    borderRadius: 12,
    height: 38,
    gap: 6,
  },
  completedBannerText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '700',
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
  input: {
    backgroundColor: '#161726',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  categoryBtn: {
    flex: 1,
    backgroundColor: '#161726',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 10,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBtnActive: {
    borderColor: '#10b981',
    backgroundColor: '#10b98110',
  },
  categoryBtnText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  categoryBtnTextActive: {
    color: '#10b981',
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
  goalContributionHeader: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 10,
  },
  highlightText: {
    color: '#10b981',
    fontWeight: '755',
  },
});
