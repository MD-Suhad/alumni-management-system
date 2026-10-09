import QRCode from 'qrcode';
import { Event } from './event.model.js';
import { EventRegistration } from '../eventRegistrations/eventRegistration.model.js';
import { ApiError } from '../../utils/apiError.js';
import { EVENT_STATUS } from '../../config/roles.js';

export const getEvents = async (query = {}) => {
  const { category, status = 'upcoming', search, page = 1, limit = 9 } = query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const filter = {};
  if (category) filter.category = category;

  if (status === 'upcoming') {
    filter.startTime = { $gte: new Date() };
    filter.status = { $ne: EVENT_STATUS.CANCELLED };
  } else if (status === 'past') {
    filter.startTime = { $lt: new Date() };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.venue': { $regex: search, $options: 'i' } }
    ];
  }

  const [events, total] = await Promise.all([
    Event.find(filter)
      .sort({ startTime: status === 'upcoming' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('organizer', 'firstName lastName email'),
    Event.countDocuments(filter)
  ]);

  return {
    data: events,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    }
  };
};

export const getEventBySlug = async (slug) => {
  const event = await Event.findOne({ slug }).populate('organizer', 'firstName lastName email');
  if (!event) {
    throw new ApiError(404, 'Event not found.');
  }
  return event;
};

export const createEvent = async (data, userId) => {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

  const event = await Event.create({
    ...data,
    slug,
    organizer: userId
  });

  return event;
};

export const registerForEvent = async (eventId, userId, details = {}) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found.');
  }

  // Check deadline
  if (new Date() > new Date(event.registrationDeadline)) {
    throw new ApiError(400, 'Registration deadline for this event has passed.');
  }

  // Check capacity
  if (event.registeredCount >= event.capacity) {
    throw new ApiError(400, 'Sorry, this event has reached maximum capacity.');
  }

  // Check duplicate registration
  const existing = await EventRegistration.findOne({ event: eventId, user: userId });
  if (existing) {
    throw new ApiError(409, 'You have already registered for this event.');
  }

  // Generate unique ticket number
  const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Generate QR Code data URL
  const qrPayload = JSON.stringify({
    ticketNumber,
    eventId: event._id,
    userId
  });
  const qrCodeString = await QRCode.toDataURL(qrPayload);

  // Atomic increment for registeredCount
  const updatedEvent = await Event.findOneAndUpdate(
    { _id: eventId, registeredCount: { $lt: event.capacity } },
    { $inc: { registeredCount: 1 } },
    { new: true }
  );

  if (!updatedEvent) {
    throw new ApiError(400, 'Event reached capacity just now.');
  }

  const registration = await EventRegistration.create({
    event: eventId,
    user: userId,
    ticketNumber,
    qrCodeString,
    paymentStatus: event.ticketPrice > 0 ? 'pending' : 'free',
    guestsCount: details.guestsCount || 0,
    dietaryNotes: details.dietaryNotes || ''
  });

  return registration;
};

export const checkInAttendee = async (ticketNumber, staffUserId) => {
  const registration = await EventRegistration.findOne({ ticketNumber })
    .populate('event', 'title startTime')
    .populate('user', 'firstName lastName email phone');

  if (!registration) {
    throw new ApiError(404, 'Invalid ticket or registration not found.');
  }

  if (registration.attended) {
    return {
      success: false,
      message: `Already checked in at ${new Date(registration.checkedInAt).toLocaleTimeString()}`,
      registration
    };
  }

  registration.attended = true;
  registration.checkedInAt = new Date();
  registration.checkedInBy = staffUserId;
  await registration.save();

  return {
    success: true,
    message: 'Check-in verified successfully!',
    registration
  };
};

export const getMyRegistrations = async (userId) => {
  return EventRegistration.find({ user: userId })
    .populate('event')
    .sort({ createdAt: -1 });
};
