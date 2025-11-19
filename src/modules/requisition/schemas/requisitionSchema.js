import { z } from "zod";

// basic positive number or null
const numOrNull = z.number().int().positive().nullable().optional();

const personSpecSchema = z.object({
    age_from: numOrNull.refine((v) => v == null || (v >= 0 && v <= 100), "Must be 0–100"),
    age_to: numOrNull.refine((v) => v == null || (v >= 0 && v <= 100), "Must be 0–100"),
    gender: z.enum(["male", "female", "any"]).optional().nullable(),
    preferred_industry_background: z.string().max(1000).optional().nullable(),
    education_relevant_experience: z.string().max(4000).optional().nullable(),
    alternate_education_experience: z.string().max(4000).optional().nullable(),
    knowledge_technical_skills: z.string().max(4000).optional().nullable(),
    business_functional_understanding: z.string().max(4000).optional().nullable(),
    personality_behavioral_attributes: z.string().max(4000).optional().nullable(),
    hiring_justification: z.string().max(4000).optional().nullable(),
}).refine((ps) => {
    if (ps.age_from != null && ps.age_to != null) return ps.age_from <= ps.age_to;
    return true;
}, { message: "age_from must be ≤ age_to", path: ["age_from"] });

const requisitionSchema = z.object({
    company_id: z.number().int().optional().nullable(), // set by server for normal users

    job_description: z.number({ required_error: "Job Description is required" }).int(),
    designation: z.number().int().nullable().optional(),
    location: z.number({ required_error: "Location is required" }).int(),
    hiring_manager: z.number().int().nullable().optional(),

    openings: z.number().int().positive(),
    req_type: z.enum(["new", "replacement", "additional"]),
    employment_type: z.enum(["permanent", "contract", "intern", "consultant"]),
    contract_duration_months: z.number().int().positive().nullable().optional(),
    work_mode: z.enum(["onsite", "hybrid", "remote"]),
    replacement_for_employee: z.number().int().nullable().optional(),

    business_justification: z.string().min(1, "Business justification is required"),

    person_spec: personSpecSchema,

    salary_band_code: z.string().max(50).optional().nullable(),
    target_salary_currency: z.string().max(3).optional().nullable(),
    target_salary_min: z.number().nonnegative().nullable().optional(),
    target_salary_max: z.number().nonnegative().nullable().optional(),

    publish_on_approval: z.boolean().default(true),
    application_deadline: z.string().optional().nullable(),
    channels: z.array(z.union([z.string(), z.object({ value: z.string(), label: z.string() })])).default([]),

    attachment_ids: z.array(z.number().int()).default([]),
})
    .superRefine((data, ctx) => {
        if (data.employment_type === "contract" && !data.contract_duration_months) {
            ctx.addIssue({ code: "custom", message: "Duration is required for Contract", path: ["contract_duration_months"] });
        }
        if (data.req_type === "replacement" && !data.replacement_for_employee) {
            ctx.addIssue({ code: "custom", message: "Replacement employee is required", path: ["replacement_for_employee"] });
        }
        if (data.target_salary_min != null && data.target_salary_max != null && data.target_salary_min > data.target_salary_max) {
            ctx.addIssue({ code: "custom", message: "Min must be ≤ Max", path: ["target_salary_min"] });
        }
    });

export default requisitionSchema;
