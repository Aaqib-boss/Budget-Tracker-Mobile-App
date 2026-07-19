const Goal = require('../models/Goal');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ deadline: 1 });
    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a savings goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  const { title, targetAmount, savedAmount, deadline } = req.body;

  try {
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ message: 'Please enter title, target amount, and deadline' });
    }

    const goal = await Goal.create({
      userId: req.user.id,
      title,
      targetAmount,
      savedAmount: savedAmount || 0,
      deadline: new Date(deadline),
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a savings goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  const { title, targetAmount, savedAmount, deadline } = req.body;

  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check user ownership
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedData = {};
    if (title !== undefined) updatedData.title = title;
    if (targetAmount !== undefined) updatedData.targetAmount = targetAmount;
    if (savedAmount !== undefined) updatedData.savedAmount = savedAmount;
    if (deadline !== undefined) updatedData.deadline = new Date(deadline);

    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a savings goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check user ownership
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: 'Goal removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add money to savings goal
// @route   PUT /api/goals/:id/add-money
// @access  Private
const addMoney = async (req, res) => {
  const { amount } = req.body;

  try {
    if (amount === undefined || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid amount to add' });
    }

    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check user ownership
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    goal.savedAmount += parseFloat(amount);
    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addMoney,
};
