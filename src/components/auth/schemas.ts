import { z } from 'zod';

const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const phoneRegex = /^\+?[1-9]\d{9,14}$/;

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
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'First name is too long' })
    .regex(nameRegex, {
      message: 'First name can only contain letters, spaces, hyphens, or apostrophes',
    }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .max(50, { message: 'Last name is too long' })
    .regex(nameRegex, {
      message: 'Last name can only contain letters, spaces, hyphens, or apostrophes',
    }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .max(254, { message: 'Email is too long' }),
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
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'First name is too long' })
    .regex(nameRegex, {
      message: 'First name can only contain letters, spaces, hyphens, or apostrophes',
    }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name should have more than 1 letter' })
    .max(50, { message: 'Last name is too long' })
    .regex(nameRegex, {
      message: 'Last name can only contain letters, spaces, hyphens, or apostrophes',
    })
    .optional(),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .max(254, { message: 'Email is too long' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^[+]?[\d\s\-\(\)]+$/, { message: 'Please enter a valid phone number' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});
