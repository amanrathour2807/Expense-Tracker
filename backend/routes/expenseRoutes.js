// import express from 'express';
// import Expense from '../models/Expense.js';

// const router = express.Router();

// // Get all expenses for a user
// router.get('/user/:userId', async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const expenses = await Expense.find({ userId: req.params.userId })
//       .sort({ date: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Expense.countDocuments({ userId: req.params.userId });

//     res.json({
//       success: true,
//       expenses,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     console.error('Get expenses error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching expenses',
//       error: error.message
//     });
//   }
// });

// // Add new expense/income
// router.post('/', async (req, res) => {
//   try {
//     const { userId, description, amount, category, type, date, notes } = req.body;

//     if (!userId || !description || !amount || !category || !type) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide all required fields'
//       });
//     }

//     const expense = await Expense.create({
//       userId,
//       description,
//       amount,
//       category,
//       type,
//       date: date || new Date(),
//       notes
//     });

//     res.status(201).json({
//       success: true,
//       message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
//       expense
//     });
//   } catch (error) {
//     console.error('Add expense error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error adding expense',
//       error: error.message
//     });
//   }
// });

// // Update expense
// router.put('/:id', async (req, res) => {
//   try {
//     const expense = await Expense.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!expense) {
//       return res.status(404).json({
//         success: false,
//         message: 'Expense not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Expense updated successfully',
//       expense
//     });
//   } catch (error) {
//     console.error('Update expense error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating expense',
//       error: error.message
//     });
//   }
// });

// // Delete expense
// router.delete('/:id', async (req, res) => {
//   try {
//     const expense = await Expense.findByIdAndDelete(req.params.id);

//     if (!expense) {
//       return res.status(404).json({
//         success: false,
//         message: 'Expense not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Expense deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete expense error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting expense',
//       error: error.message
//     });
//   }
// });

// // Get user dashboard stats
// router.get('/user/:userId/stats', async (req, res) => {
//   try {
//     const [balance, monthlySummary, categoryExpenses] = await Promise.all([
//       Expense.getUserBalance(req.params.userId),
//       Expense.getMonthlySummary(req.params.userId),
//       Expense.getCategoryWiseExpenses(req.params.userId)
//     ]);

//     res.json({
//       success: true,
//       stats: {
//         ...balance,
//         ...monthlySummary,
//         categoryExpenses
//       }
//     });
//   } catch (error) {
//     console.error('Get stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching stats',
//       error: error.message
//     });
//   }
// });

// // Get recent transactions
// router.get('/user/:userId/recent', async (req, res) => {
//   try {
//     const expenses = await Expense.find({ userId: req.params.userId })
//       .sort({ date: -1 })
//       .limit(5);

//     res.json({
//       success: true,
//       expenses
//     });
//   } catch (error) {
//     console.error('Get recent expenses error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching recent expenses',
//       error: error.message
//     });
//   }
// });





// export default router;



import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Get all expenses for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const expenses = await Expense.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments({ userId: req.params.userId });

    res.json({
      success: true,
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    });
  }
});

// Get single expense by ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      expense
    });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense',
      error: error.message
    });
  }
});

// Add new expense/income
router.post('/', async (req, res) => {
  try {
    const { userId, description, amount, category, type, date, notes } = req.body;

    if (!userId || !description || !amount || !category || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const expense = await Expense.create({
      userId,
      description,
      amount,
      category,
      type,
      date: date || new Date(),
      notes
    });

    res.status(201).json({
      success: true,
      message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
      expense
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding expense',
      error: error.message
    });
  }
});

// Update expense (ENHANCED VERSION)
router.put('/:id', async (req, res) => {
  try {
    const { description, amount, category, type, date, notes } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        category,
        type,
        date,
        notes,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      expense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating transaction',
      error: error.message
    });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction',
      error: error.message
    });
  }
});

// Get user dashboard stats
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const [balance, monthlySummary, categoryExpenses] = await Promise.all([
      Expense.getUserBalance(req.params.userId),
      Expense.getMonthlySummary(req.params.userId),
      Expense.getCategoryWiseExpenses(req.params.userId)
    ]);

    res.json({
      success: true,
      stats: {
        ...balance,
        ...monthlySummary,
        categoryExpenses
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

// Get recent transactions
router.get('/user/:userId/recent', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      success: true,
      expenses
    });
  } catch (error) {
    console.error('Get recent expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent expenses',
      error: error.message
    });
  }
});

export default router;
