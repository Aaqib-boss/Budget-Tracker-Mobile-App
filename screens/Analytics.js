import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Line, Text as SvgText, Circle, Rect } from 'react-native-svg';
import { ChevronLeft } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const { width } = Dimensions.get('window');

export default function Analytics({ isDarkMode, onBack }) {
  const { showToast } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('1M'); // '1M', '2M', '3M', '6M', '9M', '1Y', '2Y', '5Y'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCrosshair, setShowCrosshair] = useState(false);
  
  const periods = ['1M', '2M', '3M', '6M', '9M', '1Y', '2Y', '5Y'];

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.get('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load transaction statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Theme palettes helper
  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    text: isDarkMode ? '#ffffff' : '#0f172a',
    subText: isDarkMode ? '#94a3b8' : '#475569',
    cardBg: isDarkMode ? '#161726' : '#ffffff',
    cardBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    headerBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    chipActive: '#a855f7', // Purple highlight matching screenshot
    chipInactive: isDarkMode ? '#161726' : '#e2e8f0',
  };

  // Calculations
  const totalBalance = transactions.reduce((acc, curr) => {
    const amt = Number(curr.amount) || 0;
    return curr.type === 'income' ? acc + amt : acc - amt;
  }, 0);

  // Period balance (filtered by selected status / period date range)
  const filteredTxs = transactions;

  const periodBalance = filteredTxs.reduce((acc, curr) => {
    const amt = Number(curr.amount) || 0;
    return curr.type === 'income' ? acc + amt : acc - amt;
  }, 0);

  // Chart data: Group by last 5 months
  const getChartPoints = () => {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const now = new Date();
    const dataPoints = [];

    // Generate last 5 months relative to now
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mLabel = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
      
      // Filter transactions for this specific month
      const mTxs = filteredTxs.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === d.getMonth() && txDate.getFullYear() === d.getFullYear();
      });

      const mBalance = mTxs.reduce((acc, curr) => {
        const amt = Number(curr.amount) || 0;
        return curr.type === 'income' ? acc + amt : acc - amt;
      }, 0);

      dataPoints.push({ label: mLabel, val: mBalance });
    }

    return dataPoints;
  };

  const chartData = getChartPoints();

  // SVG Chart Dimensions
  const chartHeight = 180;
  const chartWidth = width - 40;
  const paddingRight = 45; // Space for right Y axis labels
  const paddingBottom = 30; // Space for X axis labels (increased to prevent clipping)
  const drawWidth = chartWidth - paddingRight;
  const drawHeight = chartHeight - paddingBottom;

  // Find max absolute value to scale chart correctly
  const maxVal = Math.max(...chartData.map(d => Math.abs(d.val)), 100);

  // Helper to map values to coordinates
  const getCoordinates = (index, value) => {
    const x = (index / (chartData.length - 1)) * (drawWidth - 10) + 5;
    // Map -maxVal..maxVal to drawHeight..0
    const y = drawHeight / 2 - (value / maxVal) * (drawHeight / 2 - 10);
    return { x, y };
  };

  // Generate Spline Path
  const points = chartData.map((d, index) => getCoordinates(index, d.val));
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Draw bezier curves
      const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY2 = points[i].y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
  }

  // Generate months scroll list from year 2000 to 2060
  const getMonthsScrollList = () => {
    const monthNamesShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    const list = [];
    const startYear = 2000;
    const endYear = 2060;
    
    for (let yr = startYear; yr <= endYear; yr++) {
      for (let m = 0; m < 12; m++) {
        list.push({
          month: m,
          year: yr,
          label: `${monthNamesShort[m]} ${String(yr).slice(-2)}`
        });
      }
    }
    return list;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Brand Header */}
      <View style={[styles.header, { borderBottomColor: theme.headerBorder }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Cards row */}
        <View style={styles.cardsRow}>
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={styles.cardTitle}>Balance</Text>
            <Text style={[styles.cardValue, { color: theme.text }]}>RS.{totalBalance.toFixed(2)}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={styles.cardTitle}>Period balance</Text>
            <Text style={[styles.cardValue, { color: theme.text }]}>RS.{periodBalance.toFixed(2)}</Text>
          </View>
        </View>

        {/* Full-width period chips without scrolling */}
        <View style={styles.periodRow}>
          {periods.map(p => {
            const isActive = selectedPeriod === p;
            return (
              <TouchableOpacity
                key={p}
                style={[
                  styles.periodChip,
                  { backgroundColor: isActive ? theme.chipActive : theme.chipInactive }
                ]}
                onPress={() => setSelectedPeriod(p)}
              >
                <Text style={[styles.periodText, isActive && styles.periodTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SVG Grid Line Chart */}
        <View style={styles.chartWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color="#a855f7" style={{ height: chartHeight }} />
          ) : (
            <TouchableOpacity onPress={() => setShowCrosshair(!showCrosshair)} activeOpacity={1}>
              <Svg height={chartHeight} width={chartWidth}>
                {/* Center Vertical divider line (turned purple on crosshair click) */}
                <Line
                  x1={drawWidth / 2}
                  y1="10"
                  x2={drawWidth / 2}
                  y2={drawHeight - 10}
                  stroke={showCrosshair ? '#a855f7' : (isDarkMode ? '#1e293b' : '#cbd5e1')}
                  strokeWidth={showCrosshair ? 1.5 : 1}
                />

                {/* Thin Left vertical line to close grid box */}
                <Line
                  x1="0"
                  y1="10"
                  x2="0"
                  y2={drawHeight - 10}
                  stroke={isDarkMode ? '#1e293b' : '#cbd5e1'}
                  strokeWidth="1"
                />

                {/* Bold Right boundary line (marked correct) */}
                <Line
                  x1={drawWidth}
                  y1="10"
                  x2={drawWidth}
                  y2={drawHeight - 10}
                  stroke={isDarkMode ? '#334155' : '#475569'}
                  strokeWidth="2.5"
                />

                {/* Bold Bottom boundary line (marked correct) */}
                <Line
                  x1="0"
                  y1={drawHeight - 10}
                  x2={drawWidth}
                  y2={drawHeight - 10}
                  stroke={isDarkMode ? '#334155' : '#475569'}
                  strokeWidth="2.5"
                />

                {/* Horizontal grid lines */}
                {[1.2, 0.9, 0.6, 0.3, 0.0, -0.3, -0.6, -0.9, -1.2].map((factor, idx) => {
                  const yVal = drawHeight / 2 - (factor * (drawHeight / 2 - 10)) / 1.2;
                  const labelStr = factor.toFixed(1).replace('.', ',');
                  
                  // Bottom boundary is already drawn bold. Top and others are thin.
                  const isBottomBoundary = factor === -1.2;
                  // Center horizontal line turns purple on crosshair click
                  const isCenterLine = factor === 0.0;
                  
                  return (
                    <React.Fragment key={idx}>
                      {!isBottomBoundary && (
                        <Line
                          x1="0"
                          y1={yVal}
                          x2={drawWidth}
                          y2={yVal}
                          stroke={isCenterLine && showCrosshair ? '#a855f7' : (isDarkMode ? '#1e293b' : '#cbd5e1')}
                          strokeWidth={isCenterLine && showCrosshair ? 1.5 : 1}
                        />
                      )}
                      {/* Right side Y axis labels */}
                      <SvgText
                        x={drawWidth + 6}
                        y={yVal + 3}
                        fill="#64748b"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {labelStr}
                      </SvgText>
                    </React.Fragment>
                  );
                })}

                {/* Diagonal -1.0 label matching screenshot, placed correctly outside/below bottom boundary */}
                <SvgText
                  x={drawWidth * 0.22}
                  y={drawHeight - 10 + 14}
                  fill={isDarkMode ? '#f8fafc' : '#0f172a'}
                  fontSize="10"
                  fontWeight="900"
                  textAnchor="middle"
                  transform={`rotate(-35, ${drawWidth * 0.22}, ${drawHeight - 10 + 14})`}
                >
                  -1.0
                </SvgText>
              </Svg>
            </TouchableOpacity>
          )}
        </View>

        {/* Horizontally Scrollable Month Timeline Labels (Yellow circled area) */}
        <View style={styles.monthScrollWrapper}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={getMonthsScrollList()}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={12}
            maxToRenderPerBatch={24}
            windowSize={5}
            getItemLayout={(data, index) => ({
              length: 80,
              offset: 80 * index,
              index
            })}
            initialScrollIndex={(() => {
              const idx = getMonthsScrollList().findIndex(c => c.month === selectedMonth && c.year === selectedYear);
              return idx >= 0 ? idx : 0;
            })()}
            renderItem={({ item }) => {
              const isActive = selectedMonth === item.month && selectedYear === item.year;
              return (
                <TouchableOpacity
                  style={[
                    styles.monthScrollChip,
                    isActive && [styles.monthScrollChipActive, { backgroundColor: isDarkMode ? '#1e293b' : '#cbd5e1' }]
                  ]}
                  onPress={() => {
                    setSelectedMonth(item.month);
                    setSelectedYear(item.year);
                  }}
                >
                  <Text style={[styles.monthScrollText, isActive && [styles.monthScrollTextActive, { color: theme.text }]]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
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
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 28,
  },
  periodChip: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
  },
  periodTextActive: {
    color: '#ffffff',
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  monthScrollWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  monthScrollContent: {
    gap: 12,
    paddingHorizontal: 4,
  },
  monthScrollChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  monthScrollChipActive: {
    borderRadius: 14,
  },
  monthScrollText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  monthScrollTextActive: {
    fontWeight: '900',
  },
});
