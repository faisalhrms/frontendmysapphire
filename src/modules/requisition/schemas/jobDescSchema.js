import { z } from "zod";

/**
 * Core Responsibility row
 * - id & sr_no come from server (optional on create)
 * - responsibility_name required
 * - weightage is a positive number (0..100)
 * - _delete is optional toggle used for soft-deletes on update
 */
export const responsibilitySchema = z.object({
    id: z.number().int().positive().optional(),
    sr_no: z.number().int().positive().optional(),
    responsibility_name: z
        .string({ required_error: "Responsibility name is required" })
        .trim()
        .min(1, "Responsibility name is required")
        .max(255, "Max 255 characters"),
    weightage: z.coerce
        .number({
            required_error: "Weightage is required",
            invalid_type_error: "Weightage must be a number",
        })
        .min(0, "Weightage cannot be negative")
        .max(100, "Weightage cannot exceed 100"),
    _delete: z.boolean().optional(),
});

/**
 * Job Description Schema
 * - company_id required (we inject it from the logged-in user's company)
 * - department_id required
 * - sub_department_id optional
 * - position_title required
 * - brief_role_overview optional
 * - core_responsibilities must:
 *    * have at least 1 active row
 *    * total weightage of NON-deleted rows === 100
 */
const jobDescSchema = z
    .object({
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

        sub_department_id: z
            .union([z.coerce.number().int().positive(), z.null()])
            .optional(),

        position_title: z
            .string({ required_error: "Position title is required" })
            .trim()
            .min(1, "Position title is required")
            .max(255, "Max 255 characters"),

        brief_role_overview: z
            .string()
            .trim()
            .max(1000, "Max 1000 characters")
            .optional()
            .or(z.literal("").transform(() => "")),

        core_responsibilities: z
            .array(responsibilitySchema, {
                required_error: "At least one responsibility is required",
            })
            .min(1, "At least one responsibility is required"),
    })
    .superRefine((val, ctx) => {
        // Active rows = not marked _delete
        const active = (val.core_responsibilities || []).filter((r) => !r._delete);

        if (active.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["core_responsibilities"],
                message: "At least one responsibility is required",
            });
            return;
        }

        // Sum weightage of active rows and enforce exactly 100.00
        const total = active.reduce((sum, r) => sum + (Number(r.weightage) || 0), 0);
        const rounded = Math.round(total * 100) / 100;

        if (rounded !== 100) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["core_responsibilities"],
                message: `Total weightage must equal 100.00 (currently ${rounded.toFixed(2)})`,
            });
        }
    });

export default jobDescSchema;
