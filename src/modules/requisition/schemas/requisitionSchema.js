// @modules/requisition/schemas/requisitionSchema.js
import { z } from "zod";

// convert {value,label} -> value
const extractId = (v) => {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "object" && v !== null && "value" in v) return v.value;
    return v;
};

const idRequired = (name) =>
    z.preprocess(
        extractId,
        z.coerce.number({ required_error: `${name} is required` }).int().positive(`${name} is required`)
    );

const idOptional = z.preprocess(
    extractId,
    z.union([z.coerce.number().int().positive(), z.null()]).optional()
);

// strip HTML to validate rich text required
const htmlToText = (html) =>
    (html || "")
        .toString()
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const requisitionSchema = z
    .object({
        company_id: z.preprocess(extractId, z.union([z.coerce.number().int().positive(), z.null()]).optional()),

        job_description: idRequired("Job Description"),
        designation: idOptional,
        location: idRequired("Location"),
        hiring_manager: idOptional,

        openings: z.coerce.number().int().min(1, "Openings must be at least 1"),
        req_type: z.enum(["new", "replacement", "additional"]),
        employment_type: z.enum(["permanent", "contract", "intern", "consultant"]),
        contract_duration_months: z.preprocess(extractId, z.union([z.coerce.number().int().positive(), z.null()]).optional()),
        work_mode: z.enum(["onsite", "hybrid", "remote"]),
        replacement_for_employee: idOptional,

        budget_status: z.enum(["budgeted", "unbudgeted"]).default("budgeted"),
        unbudgeted_reason: z.string().optional().nullable(),

        min_total_experience_years: z.preprocess(
            extractId,
            z.union([z.coerce.number().min(0, "Must be ≥ 0"), z.null()]).optional()
        ),

        education_relevant_experience: z.string().optional().nullable(),
        knowledge_technical_skills: z.string().optional().nullable(),

        salary_band_code: z.string().max(50).optional().nullable(),
        target_salary_currency: z.string().max(3).optional().nullable(),
        target_salary_min: z.preprocess(extractId, z.union([z.coerce.number().min(0), z.null()]).optional()),
        target_salary_max: z.preprocess(extractId, z.union([z.coerce.number().min(0), z.null()]).optional()),

        publish_on_approval: z.boolean().default(true),

        validity_days: z.coerce.number().int().min(0, "Must be 0 or greater").default(0),

        channels: z.array(z.union([z.string(), z.object({ value: z.string(), label: z.string().optional() })])).default([]),

        attachment_ids: z.array(z.number().int()).default([]),
    })
    .superRefine((data, ctx) => {
        if (data.employment_type === "contract" && !data.contract_duration_months) {
            ctx.addIssue({ code: "custom", message: "Duration is required for Contract", path: ["contract_duration_months"] });
        }

        if (data.req_type === "replacement" && !data.replacement_for_employee) {
            ctx.addIssue({ code: "custom", message: "Replacement employee is required", path: ["replacement_for_employee"] });
        }

        if (
            data.target_salary_min != null &&
            data.target_salary_max != null &&
            Number(data.target_salary_min) > Number(data.target_salary_max)
        ) {
            ctx.addIssue({ code: "custom", message: "Min must be ≤ Max", path: ["target_salary_min"] });
        }

        if (data.budget_status === "unbudgeted") {
            const t = htmlToText(data.unbudgeted_reason);
            if (!t) {
                ctx.addIssue({ code: "custom", message: "Unbudgeted reason is required", path: ["unbudgeted_reason"] });
            }
        }
    });

export default requisitionSchema;
