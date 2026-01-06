// @modules/requisition/schemas/requisitionInterviewCancelSchema.js
import { z } from "zod";

export const requisitionInterviewCancelSchema = z.object({
    cancel_reason: z.string().min(3, "Cancel reason is required"),
});
