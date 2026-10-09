import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Department code is required (e.g. CSE, EEE)'],
      unique: true,
      uppercase: true,
      trim: true
    },
    faculty: {
      type: String,
      trim: true,
      default: 'Engineering & Technology'
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export const Department = mongoose.model('Department', departmentSchema);
