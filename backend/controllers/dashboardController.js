const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Calculate All-Time totals (Income vs Expense)
    const allTimeTotals = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    allTimeTotals.forEach(item => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpense = item.total;
    });
    const totalBalance = totalIncome - totalExpense;

    // 2. Calculate Current Month totals
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const monthTotals = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let thisMonthIncome = 0;
    let thisMonthExpense = 0;
    monthTotals.forEach(item => {
      if (item._id === 'income') thisMonthIncome = item.total;
      if (item._id === 'expense') thisMonthExpense = item.total;
    });

    // 3. Category-wise breakdown of expenses for current month
    const categoryTotals = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      }
    ]);

    // Fetch user categories to match colors and icons
    const userCategories = await Category.find({ userId });
    const categoryMap = {};
    userCategories.forEach(cat => {
      categoryMap[cat.name] = { color: cat.color, icon: cat.icon };
    });

    const categoryBreakdown = categoryTotals.map(item => {
      const info = categoryMap[item._id] || { color: '#6B7280', icon: 'HelpCircle' };
      return {
        category: item._id,
        amount: item.amount,
        color: info.color,
        icon: info.icon
      };
    });

    // 4. Last 6 months trend (Income vs Expense)
    const monthlyTrend = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth();

      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 0, 23, 59, 59, 999);

      const trendTotals = await Transaction.aggregate([
        {
          $match: {
            userId,
            date: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' }
          }
        }
      ]);

      let inc = 0;
      let exp = 0;
      trendTotals.forEach(item => {
        if (item._id === 'income') inc = item.total;
        if (item._id === 'expense') exp = item.total;
      });

      monthlyTrend.push({
        monthName: `${monthNames[m]} ${y.toString().slice(-2)}`,
        year: y,
        month: m + 1,
        income: inc,
        expense: exp
      });
    }

    res.json({
      totalBalance,
      totalIncome,
      totalExpense,
      thisMonthIncome,
      thisMonthExpense,
      categoryBreakdown,
      monthlyTrend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardSummary,
};
