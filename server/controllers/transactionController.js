import Transaction from '../models/transaction.js';
import { categories } from '../models/transaction.js';
import { z } from 'zod';

/* ---------- validation ---------- */
const txSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  date: z.preprocess((d) => new Date(d), z.date()),
  description: z.string().trim().max(100).optional()
});

const validate = (body) => {
  const res = txSchema.safeParse(body);
  if (!res.success) throw res.error;
  return res.data;
};

/* ---------- helpers ---------- */
const ok = (res, message, data = null, code = 200) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, err, code = 400) =>
  res.status(code).json({
    success: false,
    message: err.message || "Something went wrong",
    data: null
  });

/* ---------- CRUD ---------- */
export const getAll = async (_, res) => {
  try {
    const list = await Transaction.find().sort({ date: -1 });
    ok(res, `Fetched ${list.length} transaction(s) ✅`, list);
  } catch (err) {
    fail(res, err, 500);
  }
};

export const createOne = async (req, res) => {
  try {
    const { amount, date, description, category } = req.body;

    if (!categories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const tx = await Transaction.create({
      amount, date, description, category
    });

    res.status(201).json({ message: 'Transaction created', data: tx });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateOne = async (req, res) => {
  try {
    const { amount, date, description, category } = req.body;

    if (!categories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const tx = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, date, description, category },
      { new: true }
    );

    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    res.json({ message: 'Transaction updated', data: tx });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const gone = await Transaction.findByIdAndDelete(req.params.id);
    gone ? ok(res, 'Transaction deleted 🗑️', gone)
         : fail(res, 'Transaction not found', 404);
  } catch (err) {
    fail(res, err);
  }
};

/* ---------- Monthly Summary ---------- */
export const monthlySummary = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const rows = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const summary = Array.from({ length: 12 }, (_, i) => {
      const row = rows.find(r => r._id === i + 1);
      return { month: i + 1, total: row?.total || 0 };
    });

    ok(res, `Monthly summary for year ${year} `, summary);
  } catch (err) {
    fail(res, err, 500);
  }
};

// GET /summary/category
export const categorySummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1
        }
      }
    ]);

    res.json({ message: 'Category summary', data: summary });
  } catch (err) {
    res.status(500).json({ message: 'Error getting category summary', error: err.message });
  }
};

// GET /summary/dashboard
export const dashboardSummary = async (req, res) => {
  try {
    const total = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const recent = await Transaction.find().sort({ date: -1 }).limit(5);

    const categoryBreakdown = await Transaction.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1
        }
      }
    ]);

    res.json({
      message: 'Dashboard summary',
      data: {
        total: total[0]?.total || 0,
        recent,
        categoryBreakdown
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error', error: err.message });
  }
};

export const getCategories = (_, res) => {
  // 200 OK, always returns the fixed list
  res.json({ data: categories });
};

// GET /recent
export const getRecent = async (req, res) => {
  try {
    const recent = await Transaction
      .find()
      .sort({ date: -1 })   // latest at top
      .limit(5);

    res.json(recent);       // 200 OK, plain array
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error fetching recent transactions', error: err.message });
  }
};
