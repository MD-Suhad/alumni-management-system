import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      maxlength: 300
    },
    content: {
      type: String,
      required: true
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'
    },
    category: {
      type: String,
      enum: ['Alumni Spotlight', 'Campus News', 'Association Announcement', 'Research & Achievements', 'General'],
      default: 'General'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    viewsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const News = mongoose.model('News', newsSchema);
