import mongoose from 'mongoose';
import { JOB_STATUS } from '../../config/roles.js';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    location: {
      city: { type: String, required: true },
      country: { type: String, default: 'Bangladesh' },
      isRemote: { type: Boolean, default: false }
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time'
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Director', 'Executive'],
      default: 'Mid Level'
    },
    salaryRange: {
      type: String,
      default: 'Negotiable'
    },
    description: {
      type: String,
      required: true
    },
    requirements: [{ type: String }],
    applicationUrl: {
      type: String,
      required: true
    },
    applicationEmail: {
      type: String
    },
    deadline: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
