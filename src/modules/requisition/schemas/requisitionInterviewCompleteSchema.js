// @modules/requisition/schemas/requisitionInterviewCompleteSchema.js
import { z } from "zod";

export const requisitionInterviewCompleteSchema = z.object({
    interviewer_rating: z.coerce.number().min(0).max(5),
    interviewer_notes: z.string().optional().nullable(),
    outcome: z.enum(["pass", "fail", "hold"]).default("pass"),

    // dynamic feedback rows -> converted into JSON object
    feedback_items: z
        .array(
            z.object({
                key: z.string().min(1, "Key is required"),
                score: z.coerce.number().min(0).max(5),
            })
        )
        .default([]),

    feedback_notes: z.string().optional().nullable(),
});
