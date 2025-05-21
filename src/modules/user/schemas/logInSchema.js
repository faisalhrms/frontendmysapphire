import { z } from 'zod';

const loginSchema = z.object({
  email: z.preprocess(
    val => (typeof val === 'string' ? val.toLowerCase() : val),
    z.string()
     .min(1, 'Email is required')
     .email('Enter a valid email address in lowercase')
  ),
  password: z.string().min( 1,'Password  is required')
});

export default loginSchema;
