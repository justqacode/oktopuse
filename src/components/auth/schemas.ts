import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export const resetPasswordSchema = z.object({
  // password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  password: z
    .string()
    .min(9, 'Password must be at least 9 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^[+]?[\d\s\-\(\)]+$/, { message: 'Please enter a valid phone number' }),
  // password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  password: z
    .string()
    .min(9, 'Password must be at least 9 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  role: z.string().refine((val) => ['tenant', 'landlord', 'manager'].includes(val), {
    message: 'Please select a valid role',
  }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms & Conditions',
  }),
});

export const contactSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^[+]?[\d\s\-\(\)]+$/, { message: 'Please enter a valid phone number' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});
