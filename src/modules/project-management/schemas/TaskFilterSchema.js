import { z } from "zod";

const taskFilterSchema = z.object({
    priority: z.enum(['low', 'medium', 'high']).nullable().default(null),
});

export default taskFilterSchema;