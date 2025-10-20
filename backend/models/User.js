import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
  },
  monthlyBudget: {
    type: Number,
    default: 0
  },
  categories: [{
    name: {
      type: String,
      required: true
    },
    budget: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#3B82F6'
    }
  }]
}, {
  timestamps: true
});

// Make sure this is at the END of the file:
const User = mongoose.model('User', userSchema);
export default User;