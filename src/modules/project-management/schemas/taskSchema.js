import { z } from "zod";
import {dateTimeSchema} from "@helpers/schema.js";
import {prioritiesEnum} from "@modules/project-management/schemas/projectSchema.js";
import {taskStatuses} from "@modules/project-management/services/taskService.js";

const statusValues = taskStatuses.map((status) => status.value || status.key);

export const statusEnum = z.enum(statusValues, {
  errorMap: () => `Status must be one of: ${statusValues.join(", ")}`,
});

const taskSchema = z.object({
  name: z.string()
    .min(1, "Task name is required")
    .max(1000, "Task name must be at most 1000 characters long"),
  
  parent: z.union([z.number().int().positive("Parent must be a positive integer"), z.null()]).optional(),
  requires_approval: z.boolean().default(false),
  is_ecom: z.boolean().default(false),
  description: z.string()
    .min(1, "Description is required")
    .max(1000, "Description must be at most 1000 characters long"),

  priority: prioritiesEnum.default("medium"),
  
  status: statusEnum.default("not_started"),

  started_at: dateTimeSchema('Started'),

  ended_at: dateTimeSchema('Ended'),
  attachment_ids: z.array(z.number()),
  team_ids: z.array(z.number()),
  user_ids: z.array(z.number().int().positive("User ID must be a positive integer"))
    .min(1, "At least one user ID is required"),
  external_user_ids: z.array(z.number().int().positive("External User ID must be a positive integer")).optional(),
  tag_ids: z.array(z.number().int().positive("Tag ID must be a positive integer")).min(1, "At least one tag ID is required"),

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
