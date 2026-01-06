// @modules/requisition/schemas/requisitionInterviewCompleteSchema.js
import { z } from "zod";

export const requisitionInterviewCompleteSchema = z.object({
    interviewer_rating: z.coerce.number().min(0).max(5),
    interviewer_notes: z.string().optional().nullable(),
    outcome: z.enum(["pass", "fail", "hold"]).default("pass"),

    // UI rows -> will be converted into feedback.rubric
    feedback_items: z
        .array(
            z.object({
                key: z.string().min(1, "Criteria is required"),
                score: z.coerce.number().min(0).max(5),
            })
        )
        .default([{ key: "communication", score: 0 }]),

    feedback_notes: z.string().optional().nullable(),
});
