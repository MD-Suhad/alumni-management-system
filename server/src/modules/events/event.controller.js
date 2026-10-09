import * as eventService from './event.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getEvents = async (req, res, next) => {
  try {
    const result = await eventService.getEvents(req.query);
    return ApiResponse.success(res, result, 'Events list retrieved');
  } catch (error) {
    next(error);
  }
};

export const getEventBySlug = async (req, res, next) => {
  try {
    const event = await eventService.getEventBySlug(req.params.slug);
    return ApiResponse.success(res, event, 'Event details retrieved');
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user._id);
    return ApiResponse.created(res, event, 'Event created successfully');
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    const registration = await eventService.registerForEvent(req.params.id, req.user._id, req.body);
    return ApiResponse.created(res, registration, 'Registered for event successfully');
  } catch (error) {
    next(error);
  }
};

export const checkInAttendee = async (req, res, next) => {
  try {
    const { ticketNumber } = req.body;
    const result = await eventService.checkInAttendee(ticketNumber, req.user._id);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await eventService.getMyRegistrations(req.user._id);
    return ApiResponse.success(res, registrations, 'My registered events retrieved');
  } catch (error) {
    next(error);
  }
};
