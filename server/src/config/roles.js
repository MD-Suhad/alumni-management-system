export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  EDITOR: 'editor',
  EVENT_MANAGER: 'event_manager',
  ALUMNI: 'alumni'
};

export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.ADMIN]: 80,
  [ROLES.MODERATOR]: 60,
  [ROLES.EDITOR]: 50,
  [ROLES.EVENT_MANAGER]: 40,
  [ROLES.ALUMNI]: 10
};

export const ALUMNI_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

export const MEMBERSHIP_TYPES = {
  GENERAL: 'general',
  ANNUAL: 'annual',
  LIFETIME: 'lifetime',
  HONORARY: 'honorary'
};

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const JOB_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  REJECTED: 'rejected'
};
