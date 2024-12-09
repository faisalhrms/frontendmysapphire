import { z } from "zod";

const workflow = z.object({
    type: z.string().default('subscription'),
    user_id: z.union([z.string(), z.number()]),
    position: z.union([z.string(), z.number()])
});

const workflowSchemas = z.object({
    workflows: z.array(workflow)
});

export default workflowSchemas;
