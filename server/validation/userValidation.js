

import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    password: z.string().regex(passwordRegex, 'Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character (@$!%*?&).'),
    phone: z.string().optional(),
    address: z.string().optional()
  })
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required')
  })
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required')
  })
});

export const googleLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    fullName: z.string().optional(),
    name: z.string().optional(),
    profilePic: z.string().optional()
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    username: z.string().optional(),
    location: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional()
  })
});

export const verifyIdSchema = z.object({
  body: z.object({
    nationalIdNumber: z.string().min(1, 'National ID number is required'),
    name: z.string().optional()
  })
});

export const addBalanceSchema = z.object({
  body: z.object({
    amount: z.union([z.string(), z.number()]).transform((val) => Number(val))
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required')
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    otp: z.string().min(6, 'OTP must be 6 digits'),
    password: z.string().regex(passwordRegex, 'Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character.')
  })
});
