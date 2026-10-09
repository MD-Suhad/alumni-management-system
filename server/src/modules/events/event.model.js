import mongoose from 'mongoose';
import { EVENT_STATUS } from '../../config/roles.js';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required']
    },
    category: {
      type: String,
      enum: ['Reunion', 'Conference', 'Workshop', 'Webinar', 'Annual General Meeting', 'Sports', 'Cultural', 'Networking'],
      default: 'Reunion'
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'
    },
    location: {
      venue: { type: String, required: true },
      address: { type: String },
      city: { type: String, default: 'Dhaka' },
      isVirtual: { type: Boolean, default: false },
      virtualMeetingUrl: { type: String }
    },
    startTime: {
      type: Date,
      required: [true, 'Event start time is required']
    },
    endTime: {
      type: Date,
      required: [true, 'Event end time is required']
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity limit is required'],
      min: 1
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    ticketPrice: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: Object.values(EVENT_STATUS),
      default: EVENT_STATUS.UPCOMING
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requiresApproval: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
