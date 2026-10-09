import { Membership } from './membership.model.js';
import { ApiError } from '../../utils/apiError.js';
import { MEMBERSHIP_TYPES } from '../../config/roles.js';

export const getMyMemberships = async (userId) => {
  return Membership.find({ user: userId }).sort({ createdAt: -1 });
};

export const applyMembership = async (userId, data) => {
  const membershipNumber = `ALM-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  let durationMonths = 12;
  if (data.type === MEMBERSHIP_TYPES.LIFETIME) durationMonths = 1200; // 100 years

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);

  const membership = await Membership.create({
    user: userId,
    membershipNumber,
    type: data.type || MEMBERSHIP_TYPES.GENERAL,
    amount: data.amount || 1000,
    paymentMethod: data.paymentMethod || 'bKash',
    transactionId: data.transactionId || '',
    paymentStatus: data.transactionId ? 'completed' : 'pending',
    startDate,
    endDate
  });

  return membership;
};
