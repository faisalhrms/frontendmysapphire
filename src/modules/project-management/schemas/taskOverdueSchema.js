import { z } from "zod";
import {dateTimeSchema} from "@helpers/schema.js";

const taskOverdueSchema = z.object({
  challenges: z.string()
    .max(1000, "Challenges must be at most 1000 characters long").optional(),
  support_required: z.string()
      .max(1000, "Support Required must be at most 1000 characters long").optional(),
  requested_due_date: dateTimeSchema('Due Date'),
})

export default taskOverdueSchema;
