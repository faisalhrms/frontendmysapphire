import { z } from "zod";

const durationNumber = z
    .preprocess((v) => {
        // allow string numbers from inputs
        if (typeof v === "string" && v.trim() !== "") return Number(v);
        return v;
    }, z.number().nonnegative({ message: "Must be a non-negative number" }).optional());

const itGovernSchema = z.object({
    vendor_name: z
        .string({ required_error: "Vendor name is required" })
        .min(1, "Vendor name is required"),

    address: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    responsibilities: z.string().optional().nullable(),
    services_provided: z.string().optional().nullable(),

    key_metric_id: z.preprocess(
        (v) => {
            if (v === null || v === undefined || v === "") return undefined;
            return Number(v);
        },
        z.number().int().positive().optional()
    ),

    support_hours: z.string().optional().nullable(),
    duration: z.string().optional().nullable(),
    penalties: z.string().optional().nullable(),
    confidentiality_requirement: z.string().optional().nullable(),

    termination_notice_period: z
        .preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().int().nonnegative().optional()),

    priority: z.enum(["low", "medium", "high"]).optional(),

    // UI fields for duration
    response_value: durationNumber,
    response_unit: z.enum(["hours", "minutes", "days"]).optional(),

    resolution_value: durationNumber,
    resolution_unit: z.enum(["hours", "minutes", "days"]).optional(),

    review_frequency: z.preprocess((v) => (v === null || v === "" ? undefined : Number(v)), z.number().int().min(1).max(12).optional()),

    dispute_resolution: z.string().optional().nullable(),
    exit_clause_reference: z.string().optional().nullable(),
    exit_conditions: z.string().optional().nullable(),
    exit_obligations: z.string().optional().nullable(),
    early_exit_penalty: z.string().optional().nullable(),

    exclusions: z.array(z.string()).optional(),

    attachment_ids: z.array(z.preprocess((v) => Number(v), z.number().int().positive())).optional(),
});

export default itGovernSchema;
