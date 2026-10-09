import mongoose from 'mongoose';
import { MEMBERSHIP_TYPES } from '../../config/roles.js';

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    membershipNumber: {
      type: String,
      unique: true,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(MEMBERSHIP_TYPES),
      default: MEMBERSHIP_TYPES.GENERAL
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    currency: {
      type: String,
      default: 'BDT'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      trim: true
    },
    paymentMethod: {
      type: String,
      enum: ['bKash', 'Nagad', 'Rocket', 'Bank_Transfer', 'Manual_Cash', 'Card'],
      default: 'bKash'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Membership = mongoose.model('Membership', membershipSchema);
