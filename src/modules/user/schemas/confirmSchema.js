import { z } from 'zod';

const confirmSchema = z.object({
  password: z.string().min( 1,'Password  is required')
});

export default confirmSchema;
