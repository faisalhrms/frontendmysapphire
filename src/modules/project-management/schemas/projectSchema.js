import { z } from "zod";
import {dateSchema} from "@helpers/schema.js";

export const prioritiesEnum = z.enum(["low", "medium", "high"], {
    errorMap: () => "Priority must be 'low', 'medium', or 'high'",
});


export const statusEnum = z.enum(["active", "archived", "on_hold", "completed"], {
    errorMap: () => "Status must be 'active', 'on hold', 'archived' or completed",
});


const projectSchema = z.object({
    for_customer: z.boolean().default(false),
    requires_approval: z.boolean().default(false),
    customer_id: z.number().nullable().default(null),
    company_id: z.number().nullable().default(null),
    department_id: z.number().nullable().default(null),
    name: z.string().min(1, "Project name is required").max(255, "Project name must be at most 255 characters long"),
    description: z.string().min(20, "Description is required and must have a minimum of 50 characters"),
    status: statusEnum.default("active"),
    priority: prioritiesEnum.default("medium"),
    started_at: dateSchema('Started'),
    ended_at: dateSchema('Ended'),
    manager_id: z.number().min(1, "Manager is required"),
    workspace_id: z.number().min(1, "Workspace is required"),
    tag_ids: z.array(z.number()).min(1, "At least one tag must be assigned"),
    attachment_ids: z.array(z.number()),
    user_ids: z.array(z.number()).min(1, "At least one member must be assigned"),
}).refine(data => {
    if (data.ended_at) {
        return new Date(data.ended_at) >= new Date(data.started_at);
    }
    return true;
}, {
    message: "End date must be greater than or equal to start date",
    path: ["ended_at"],
}).refine(data => {
    if (data.for_customer) {
        return data.customer_id !== null;
    }
    return true;
}, {
    message: "Customer is required",
    path: ["customer_id"],
})

export default projectSchema;