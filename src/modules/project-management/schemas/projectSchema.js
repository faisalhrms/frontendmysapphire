import { z } from "zod";
import {dateSchema} from "@helpers/schema.js";

export const prioritiesEnum = z.enum(["low", "medium", "high"], {
    errorMap: () => "Priority must be 'low', 'medium', or 'high'",
});

// Enum for Status
export const statusEnum = z.enum(["active", "archived", "on_hold"], {
    errorMap: () => "Status must be 'active', 'on hold', or 'archived'",
});

// Zod schema for project creation and updates
const projectSchema = z.object({
    name: z.string().min(1, "Project name is required").max(255, "Project name must be at most 255 characters long"),
    manager_id: z.number().min(1, "Manager is required"),
    department_id: z.number().min(1, "Department is required"),
    priority: prioritiesEnum.default("medium"),
    description: z.string().min(20, "Description is required and must have a minimum of 50 characters"),
    started_at: dateSchema('Started'),
    ended_at: dateSchema('Ended'),
    status: statusEnum.default("active"),
    user_ids: z.array(z.number()).min(1, "At least one member must be assigned"),
    tag_ids: z.array(z.number()).min(1, "At least one tag must be assigned"),
    attachment_ids: z.array(z.number()),
}).refine(data => {
    if (data.ended_at) {
        return new Date(data.ended_at) >= new Date(data.started_at);
    }
    return true;
}, {
    message: "End date must be greater than or equal to start date",
    path: ["ended_at"],
})

export default projectSchema;