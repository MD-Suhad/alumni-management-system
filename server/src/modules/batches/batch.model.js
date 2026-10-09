import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true // e.g. "Batch 12", "2018-2019"
    },
    admissionYear: {
      type: Number,
      required: true
    },
    passingYear: {
      type: Number,
      required: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    }
  },
  { timestamps: true }
);

export const Batch = mongoose.model('Batch', batchSchema);
