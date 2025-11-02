import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock data (in production, use a database)
let invoices = [
  { id: 'INV-001', clientName: 'Cagayan Valley Hotel', amount: 12500, status: 'Paid', dueDate: '2024-06-30', issuedDate: '2024-06-15' },
  { id: 'INV-002', clientName: 'Tuguegarao Grand Restaurant', amount: 8200, status: 'Pending', dueDate: '2024-07-15', issuedDate: '2024-07-01' },
  { id: 'INV-003', clientName: 'Isabela Local Market Coop', amount: 15300, status: 'Pending', dueDate: '2024-07-20', issuedDate: '2024-07-05' },
  { id: 'INV-004', clientName: 'Local Bake Shop', amount: 4500, status: 'Overdue', dueDate: '2024-06-25', issuedDate: '2024-06-10' },
];

let expenses = [
  { id: 'EXP-001', date: '2024-07-01', category: 'Feeds', description: '50 bags of grower pellets', amount: 87500 },
  { id: 'EXP-002', date: '2024-07-03', category: 'Vitamins', description: 'Immunity boosters pack', amount: 3000 },
  { id: 'EXP-003', date: '2024-06-28', category: 'Utilities', description: 'Electricity bill for June', amount: 4200 },
  { id: 'EXP-004', date: '2024-06-25', category: 'Equipment', description: 'New automatic drinkers (5 units)', amount: 1250 },
];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
    );
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// @route   GET /api/business/invoices
// @desc    Get all invoices
// @access  Private
router.get('/invoices', verifyToken, async (req, res) => {
  try {
    res.json(invoices);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching invoices'
    });
  }
});

// @route   GET /api/business/expenses
// @desc    Get all expenses
// @access  Private
router.get('/expenses', verifyToken, async (req, res) => {
  try {
    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching expenses'
    });
  }
});

// @route   POST /api/business/expenses
// @desc    Add a new expense
// @access  Private
router.post('/expenses', verifyToken, async (req, res) => {
  try {
    const { category, description, amount } = req.body;

    if (!category || !description || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, description, and amount'
      });
    }

    const newExpense = {
      id: `EXP-00${expenses.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      category,
      description,
      amount: parseFloat(amount)
    };

    expenses.unshift(newExpense);

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error adding expense'
    });
  }
});

// @route   GET /api/business/profitability
// @desc    Get profitability data
// @access  Private
router.get('/profitability', verifyToken, async (req, res) => {
  try {
    // Calculate totals from invoices and expenses
    const totalRevenue = invoices
      .filter(inv => inv.status === 'Paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Mock monthly data
    const revenueVsExpenses = [
      { month: 'Jan', revenue: 75000, expenses: 50000 },
      { month: 'Feb', revenue: 82000, expenses: 55000 },
      { month: 'Mar', revenue: 95000, expenses: 60000 },
      { month: 'Apr', revenue: 88000, expenses: 58000 },
      { month: 'May', revenue: 105000, expenses: 62000 },
      { month: 'Jun', revenue: 112000, expenses: 68000 },
    ];

    res.json({
      totalRevenue,
      totalExpenses,
      netProfit,
      revenueVsExpenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profitability data'
    });
  }
});

export default router;

