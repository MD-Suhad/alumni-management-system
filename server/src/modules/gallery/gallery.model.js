import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    album: {
      type: String,
      default: 'General'
    },
    mediaUrl: {
      type: String,
      required: true
    },
    caption: {
      type: String
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

export const Gallery = mongoose.model('Gallery', gallerySchema);
