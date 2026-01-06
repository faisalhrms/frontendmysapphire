import { z } from "zod";

/**
 * Job Description Schema
 * - company_id required (we inject it from the logged-in user's company)
 * - department_id required
 * - sub_department_id optional
 * - position_title required
 * - brief_role_overview optional (stores HTML / rich text)
 */
const jobDescSchema = z.object({
    id: z.number().int().positive().optional(),

    company_id: z.coerce
        .number({
            required_error: "Company is required",
            invalid_type_error: "Company is required",
        })
        .int()
        .positive("Company is required"),

    department_id: z.coerce
        .number({
            required_error: "Department is required",
            invalid_type_error: "Department is required",
        })
        .int()
        .positive("Department is required"),

    sub_department_id: z.union([z.coerce.number().int().positive(), z.null()]).optional(),

    position_title: z
        .string({ required_error: "Position title is required" })
        .trim()
        .min(1, "Position title is required")
        .max(255, "Max 255 characters"),

    // ✅ Rich text (HTML). We validate length of the stored string.
    // If you want to validate plain text length only, tell me and I’ll strip tags before checking.
    brief_role_overview: z
        .string()
        .max(5000, "Max 5000 characters")
        .optional()
        .or(z.literal("").transform(() => "")),
});

export default jobDescSchema;
