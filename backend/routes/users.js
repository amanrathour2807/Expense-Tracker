import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user.getProfile()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { name, currency, monthlyBudget } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        currency, 
        monthlyBudget,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Get user categories
router.get('/:id/categories', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      categories: user.categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Add new category
router.post('/:id/categories', async (req, res) => {
  try {
    const { name, budget, color } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if category already exists
    const existingCategory = user.categories.find(
      cat => cat.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    user.categories.push({
      name,
      budget: budget || 0,
      color: color || `#${Math.floor(Math.random()*16777215).toString(16)}`
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      categories: user.categories
    });
  } catch (error) {
    console.error('Add category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding category',
      error: error.message
    });
  }
});

// Update category
router.put('/:id/categories/:categoryId', async (req, res) => {
  try {
    const { name, budget, color } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const category = user.categories.id(req.params.categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name) category.name = name;
    if (budget !== undefined) category.budget = budget;
    if (color) category.color = color;

    await user.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      categories: user.categories
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

// Delete category
router.delete('/:id/categories/:categoryId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const category = user.categories.id(req.params.categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    category.deleteOne();
    await user.save();

    res.json({
      success: true,
      message: 'Category deleted successfully',
      categories: user.categories
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
});

// Get user settings
router.get('/:id/settings', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      settings: {
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        categories: user.categories
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
});

// Update user settings
router.put('/:id/settings', async (req, res) => {
  try {
    const { currency, monthlyBudget } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        currency, 
        monthlyBudget,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        categories: user.categories
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
});

// Delete user account
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user account',
      error: error.message
    });
  }
});

export default router;