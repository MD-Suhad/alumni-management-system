import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      trim: true
    },
    degreeType: {
      type: String,
      enum: ['B.Sc.', 'M.Sc.', 'Ph.D.', 'M.Engg.', 'BBA', 'MBA', 'Diploma'],
      default: 'B.Sc.'
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    }
  },
  { timestamps: true }
);

export const Program = mongoose.model('Program', programSchema);
