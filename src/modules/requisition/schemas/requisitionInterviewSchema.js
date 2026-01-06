import { z } from "zod";

export const requisitionInterviewSchema = z
    .object({
        round: z.string().min(1, "Round is required"),
        interview_type: z.string().min(1, "Interview type is required"),
        scheduled_at_local: z.string().min(1, "Scheduled time is required"),
        duration_minutes: z.coerce.number().int().min(5, "Minimum 5 minutes"),
        timezone: z.string().min(1, "Timezone is required"),
        link_or_location: z.string().optional(),

        // ✅ MULTI interviewer ids
        interviewer_ids: z
            .array(z.coerce.number().int().positive("Invalid interviewer"))
            .min(1, "At least one interviewer is required"),
    })
    .superRefine((val, ctx) => {
        const s = (val.link_or_location || "").trim();
        if (val.interview_type === "online" && !s) {
            ctx.addIssue({ code: "custom", path: ["link_or_location"], message: "Meeting link is required" });
        }
        if (val.interview_type === "onsite" && !s) {
            ctx.addIssue({ code: "custom", path: ["link_or_location"], message: "Location is required" });
        }
    });
