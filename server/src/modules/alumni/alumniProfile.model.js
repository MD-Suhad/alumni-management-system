import mongoose from 'mongoose';

const alumniProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    studentId: {
      type: String,
      required: [true, 'Student ID / Roll Number is required'],
      trim: true,
      index: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required']
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program'
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch'
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: 1950,
      max: 2050,
      index: true
    },
    degree: {
      type: String,
      required: true,
      trim: true
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 4.0
    },
    currentCompany: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    location: {
      city: { type: String, trim: true },
      country: { type: String, trim: true, default: 'Bangladesh' }
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown'
    },
    bio: {
      type: String,
      maxlength: 1000,
      trim: true
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      facebook: { type: String, trim: true },
      website: { type: String, trim: true }
    },
    skills: [{ type: String, trim: true }],
    privacySettings: {
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      showCurrentCompany: { type: Boolean, default: true },
      showBloodGroup: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true
  }
);

// Compound index for directory searching
alumniProfileSchema.index({ currentCompany: 'text', designation: 'text', bio: 'text' });

export const AlumniProfile = mongoose.model('AlumniProfile', alumniProfileSchema);
