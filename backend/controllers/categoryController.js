const Category = require('../models/Category');

// @desc    Get all categories for logged in user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  const { name, icon, color, type } = req.body;

  try {
    if (!name || !icon || !color) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const category = await Category.create({
      userId: req.user.id,
      name,
      icon,
      color,
      type: type || 'expense',
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  const { name, icon, color } = req.body;

  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check user ownership
    if (category.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon, color },
      { new: true, runValidators: true }
    );

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check user ownership
    if (category.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: 'Category removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
