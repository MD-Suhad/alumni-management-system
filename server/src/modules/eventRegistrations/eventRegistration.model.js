import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true
    },
    qrCodeString: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['free', 'pending', 'paid', 'refunded'],
      default: 'free'
    },
    transactionId: {
      type: String
    },
    attended: {
      type: Boolean,
      default: false
    },
    checkedInAt: {
      type: Date
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    guestsCount: {
      type: Number,
      default: 0
    },
    dietaryNotes: {
      type: String
    }
  },
  { timestamps: true }
);

// Prevent duplicate user registration for the same event
eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

export const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
