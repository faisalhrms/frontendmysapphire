import { z } from 'zod';

const resetSchema = z.object({
  email: z.string().min(1,'Email is required'),
});

export default resetSchema;
