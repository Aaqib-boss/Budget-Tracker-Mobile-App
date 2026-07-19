const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Helper to get spent amount for a category in a specific month and year
const getSpentAmount = async (userId, category, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const result = await Transaction.aggregate([
    {
      $match: {
        userId: userId,
        category: category,
        type: 'expense',
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// @desc    Get all budgets for user with progress calculation
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const query = { userId: req.user.id };
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const budgets = await Budget.find(query);

    // Calculate progress for each budget
    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await getSpentAmount(
          req.user._id,
          budget.category,
          budget.month,
          budget.year
        );
        return {
          ...budget.toObject(),
          spent,
          remaining: Math.max(0, budget.monthlyLimit - spent),
          isOverBudget: spent > budget.monthlyLimit,
        };
      })
    );

    res.json(budgetsWithProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or update a budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
  const { category, monthlyLimit, month, year } = req.body;

  try {
    if (!category || !monthlyLimit || !month || !year) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if budget already exists for this category/month/year
    let budget = await Budget.findOne({
      userId: req.user.id,
      category,
      month,
      year
    });

    if (budget) {
      // If it exists, update it instead of creating duplicate
      budget.monthlyLimit = monthlyLimit;
      await budget.save();
    } else {
      // Create new budget
      budget = await Budget.create({
        userId: req.user.id,
        category,
        monthlyLimit,
        month,
        year
      });
    }

    // Calculate progress for returning
    const spent = await getSpentAmount(req.user._id, category, month, year);

    res.status(201).json({
      ...budget.toObject(),
      spent,
      remaining: Math.max(0, budget.monthlyLimit - spent),
      isOverBudget: spent > budget.monthlyLimit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
  const { monthlyLimit, category, month, year } = req.body;

  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Check user ownership
    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedData = {};
    if (monthlyLimit !== undefined) updatedData.monthlyLimit = monthlyLimit;
    if (category !== undefined) updatedData.category = category;
    if (month !== undefined) updatedData.month = month;
    if (year !== undefined) updatedData.year = year;

    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    const spent = await getSpentAmount(req.user._id, budget.category, budget.month, budget.year);

    res.json({
      ...budget.toObject(),
      spent,
      remaining: Math.max(0, budget.monthlyLimit - spent),
      isOverBudget: spent > budget.monthlyLimit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Check user ownership
    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: 'Budget removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};
