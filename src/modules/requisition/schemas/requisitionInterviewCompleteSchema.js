// @modules/requisition/schemas/requisitionInterviewCompleteSchema.js
import { z } from "zod";

export const requisitionInterviewCompleteSchema = z.object({
    communication: z.coerce.number().min(0).max(5),
    cultural_fit: z.coerce.number().min(0).max(5),
    technical_expertise: z.coerce.number().min(0).max(5),
    functional_expertise: z.coerce.number().min(0).max(5),
    leadership: z.coerce.number().min(0).max(5),

    recommendation: z.enum(["recommended", "not_recommended"]).default("recommended"),
    remarks: z.string().optional().nullable(),
});
