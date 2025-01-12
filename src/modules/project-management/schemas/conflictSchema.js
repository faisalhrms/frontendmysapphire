import { z } from "zod";
import {dateSchema, dateTimeSchema} from "@helpers/schema.js";


const milestoneConflictSchema = z.object({
    id: z.union([z.number(), z.string()]),
    started_at: dateSchema("Started"),
    ended_at: dateSchema("Ended"),
    reason: z.string().min(10),
}).refine(data => {
    if (data.ended_at) {
        return new Date(data.ended_at) >= new Date(data.started_at);
    }
    return true;
}, {
    message: "End date must be greater than or equal to start date",
    path: ["ended_at"],
});

const taskConflictSchema = z.object({
    id: z.union([z.number(), z.string()]),
    started_at: dateTimeSchema("Started"),
    ended_at: dateTimeSchema("Ended"),
    reason: z.string().min(10),
}).refine(data => {
    if (data.ended_at) {
        return new Date(data.ended_at) >= new Date(data.started_at);
    }
    return true;
}, {
    message: "End date must be greater than or equal to start date",
    path: ["ended_at"],
});


export const milestonesSchema = z.array(milestoneConflictSchema);

export const tasksSchema = z.array(taskConflictSchema);

const conflictSchema = z.object({
    project: milestoneConflictSchema.optional(),
    milestones: milestonesSchema.optional(),
    tasks: tasksSchema.optional(),
});

export default conflictSchema;
