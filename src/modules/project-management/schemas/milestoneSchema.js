import { z } from "zod";
import {dateSchema} from "@helpers/schema.js";
import {prioritiesEnum, statusEnum} from "@modules/project-management/schemas/projectSchema.js";

const milestoneSchema = z.object({
    name: z.string().min(1, "Milestone name is required").max(255, "Milestone name must be at most 255 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    started_at: dateSchema('Started'),
    ended_at: dateSchema('Ended'),
    status: statusEnum.default("active"),
    priority: prioritiesEnum.default("medium"),
    requires_approval: z.boolean().default(false),
}).refine(data => {
    if (data.ended_at) {
        return new Date(data.ended_at) >= new Date(data.started_at);
    }
    return true;
}, {
    message: "End date must be greater than or equal to start date",
    path: ["ended_at"],
})

export default milestoneSchema;
