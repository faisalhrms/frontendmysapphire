import { z } from "zod";
import {dateSchema, dateTimeSchema} from "@helpers/schema.js";
import {prioritiesEnum} from "@modules/project-management/schemas/projectSchema.js";

// Enum for Status
export const statusEnum = z.enum(["open", "in_progress", "on_hold", "completed", "Cancelled"], {
  errorMap: () => "Status must be 'open', 'in progress', 'on hold', 'completed' or 'cancelled'",
});

const taskSchema = z.object({
  name: z.string()
    .min(1, "Task name is required")
    .max(1000, "Task name must be at most 1000 characters long"),
  
  parent: z.union([z.number().int().positive("Parent must be a positive integer"), z.null()]).optional(),
  
  description: z.string()
    .min(1, "Description is required")
    .max(1000, "Description must be at most 1000 characters long"),

  priority: prioritiesEnum.default("medium"),
  
  status: statusEnum.default("in_progress"),

  started_at: dateTimeSchema('Started'),

  ended_at: dateTimeSchema('Started'),
  attachment_ids: z.array(z.number()),
  user_ids: z.array(z.number().int().positive("User ID must be a positive integer"))
    .min(1, "At least one user ID is required"),
  
  tag_ids: z.array(z.number().int().positive("Tag ID must be a positive integer"))
    .min(1, "At least one tag ID is required"),
}).refine(data => {
  if (data.ended_at) {
    return new Date(data.ended_at) >= new Date(data.started_at);
  }
  return true;
}, {
  message: "End date must be greater than or equal to start date",
  path: ["ended_at"],
});

export default taskSchema;
