import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    studentId: z.string().min(3, 'Student ID / Roll is required'),
    departmentId: z.string().min(1, 'Department selection is required'),
    graduationYear: z.number().int().min(1950).max(2050),
    degree: z.string().min(2, 'Degree title is required'),
    phone: z.string().optional()
  })
};

export const loginSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email('Invalid email address')
  })
};

export const resetPasswordSchema = {
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters')
  })
};
