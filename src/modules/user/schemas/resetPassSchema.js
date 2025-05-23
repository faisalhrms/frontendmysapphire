// src/modules/user/schemas/resetPassSchema.js
import { z } from 'zod';

// Password policy checks for newPassword
const passwordPolicy = z
    .string()
    .min(1, 'Password is required')
    .refine((val) => /.{8,}/.test(val), {
        message: 'Password must be at least 8 characters long',
    })
    .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
    })
    .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
    })
    .refine((val) => /\d/.test(val), {
        message: 'Password must contain at least one number',
    })
    .refine((val) => /[@$!%*?&]/.test(val), {
        message: 'Password must contain at least one special character (@$!%*?&)',
    });

const resetPassSchema = z
    .object({
        newPassword: passwordPolicy,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

export default resetPassSchema;
