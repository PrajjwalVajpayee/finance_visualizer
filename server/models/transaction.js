import mongoose from 'mongoose';

const categories = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Education',
  'Groceries',
  'Other'
];

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: categories
  }
}, {
  timestamps: true
});


const Transaction = mongoose.model('Transaction', transactionSchema);


export default Transaction;
export  {categories}
