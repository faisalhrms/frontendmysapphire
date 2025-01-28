import { z } from 'zod';

// Password policy checks
// - At least 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character (@$!%*?&)
const confirmSchema = z.object({
  password: z
      .string()
      .min(1, 'Password is required') // ensures it's not empty
      .refine(
          (val) => /.{8,}/.test(val),
          { message: 'Password must be at least 8 characters long' }
      )
      .refine(
          (val) => /[A-Z]/.test(val),
          { message: 'Password must contain at least one uppercase letter' }
      )
      .refine(
          (val) => /[a-z]/.test(val),
          { message: 'Password must contain at least one lowercase letter' }
      )
      .refine(
          (val) => /\d/.test(val),
          { message: 'Password must contain at least one number' }
      )
      .refine(
          (val) => /[@$!%*?&]/.test(val),
          { message: 'Password must contain at least one special character (@$!%*?&)' }
      ),
});

export default confirmSchema;
