// @modules/requisition/schemas/requisitionSchema.js
import { z } from "zod";

// convert {value,label} -> value
const extractId = (v) => {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "object" && v !== null && "value" in v) return v.value;
    return v;
};

// ✅ bool preprocess for LOV values (supports boolean, {value:...}, or "true"/"false")
const toBool = (v) => {
    const vv = extractId(v);
    if (vv === true || vv === false) return vv;
    if (typeof vv === "string") {
        const s = vv.trim().toLowerCase();
        if (s === "true") return true;
        if (s === "false") return false;
    }
    if (typeof vv === "number") return Boolean(vv);
    return vv;
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

        // ✅ REQUIRED now
        designation: idRequired("Grade"),

        location: idRequired("Location"),

        // ✅ REQUIRED now
        hiring_manager: idRequired("Hiring Manager"),

        // ✅ REQUIRED already
        openings: z.coerce.number().int().min(1, "Openings must be at least 1"),
        req_type: z.enum(["new", "replacement", "additional"]),
        employment_type: z.enum(["permanent", "contract", "intern", "consultant"]),
        contract_duration_months: z.preprocess(
            extractId,
            z.union([z.coerce.number().int().positive(), z.null()]).optional()
        ),
        work_mode: z.enum(["onsite", "hybrid", "remote"]),
        replacement_for_employee: idOptional,

        // ✅ REQUIRED already (enum)
        budget_status: z.enum(["budgeted", "unbudgeted"]).default("budgeted"),
        unbudgeted_reason: z.string().optional().nullable(),

        min_total_experience_years: z.preprocess(
            extractId,
            z.union([z.coerce.number().min(0, "Must be ≥ 0"), z.null()]).optional()
        ),

        // ✅ NEW
        max_total_experience_years: z.preprocess(
            extractId,
            z.union([z.coerce.number().min(0, "Must be ≥ 0"), z.null()]).optional()
        ),

        // ✅ REQUIRED now (validated via superRefine using htmlToText)
        education_relevant_experience: z.string().optional().nullable(),
        knowledge_technical_skills: z.string().optional().nullable(),

        salary_band_code: z.string().max(50).optional().nullable(),
        target_salary_currency: z.string().max(3).optional().nullable(),
        target_salary_min: z.preprocess(extractId, z.union([z.coerce.number().min(0), z.null()]).optional()),
        target_salary_max: z.preprocess(extractId, z.union([z.coerce.number().min(0), z.null()]).optional()),

        publish_on_approval: z.boolean().default(true),

        // ✅ LOV FIELD (boolean) default false
        prevent_duplicate_applications_by_jd: z.preprocess(toBool, z.boolean().default(false)),

        // ✅ REQUIRED
        validity_days: z.preprocess(
            (v) => {
                // Handles "", null, undefined, and NaN (when input uses valueAsNumber)
                if (v === "" || v === null || v === undefined) return undefined;
                if (typeof v === "number" && Number.isNaN(v)) return undefined;

                // If string, convert to number safely
                if (typeof v === "string") {
                    const s = v.trim();
                    if (!s) return undefined;
                    const n = Number(s);
                    return Number.isNaN(n) ? undefined : n;
                }

                return v;
            },
            z
                .number({
                    required_error: "Validity Days is required",
                    invalid_type_error: "Validity Days is required",
                })
                .int("Validity Days must be a whole number")
                .min(0, "Validity Days must be 0 or greater")
        ),



        channels: z
            .array(z.union([z.string(), z.object({ value: z.string(), label: z.string().optional() })]))
            .default([]),

        attachment_ids: z.array(z.number().int()).default([]),
    })
    .superRefine((data, ctx) => {
        if (data.employment_type === "contract" && !data.contract_duration_months) {
            ctx.addIssue({
                code: "custom",
                message: "Duration is required for Contract",
                path: ["contract_duration_months"],
            });
        }

        if (data.req_type === "replacement" && !data.replacement_for_employee) {
            ctx.addIssue({
                code: "custom",
                message: "Replacement employee is required",
                path: ["replacement_for_employee"],
            });
        }

        // Salary min/max validation
        if (
            data.target_salary_min != null &&
            data.target_salary_max != null &&
            Number(data.target_salary_min) > Number(data.target_salary_max)
        ) {
            ctx.addIssue({ code: "custom", message: "Min must be ≤ Max", path: ["target_salary_min"] });
        }

        // ✅ Experience min/max validation
        if (
            data.min_total_experience_years != null &&
            data.max_total_experience_years != null &&
            Number(data.min_total_experience_years) > Number(data.max_total_experience_years)
        ) {
            ctx.addIssue({
                code: "custom",
                message: "Min Total Experience must be ≤ Max Total Experience",
                path: ["min_total_experience_years"],
            });
        }

        // Unbudgeted reason required (rich text)
        if (data.budget_status === "unbudgeted") {
            const t = htmlToText(data.unbudgeted_reason);
            if (!t) {
                ctx.addIssue({
                    code: "custom",
                    message: "Unbudgeted reason is required",
                    path: ["unbudgeted_reason"],
                });
            }
        }

        // ✅ REQUIRED rich fields
        const edu = htmlToText(data.education_relevant_experience);
        if (!edu) {
            ctx.addIssue({
                code: "custom",
                message: "Education & Relevant Experience is required",
                path: ["education_relevant_experience"],
            });
        }

        const skills = htmlToText(data.knowledge_technical_skills);
        if (!skills) {
            ctx.addIssue({
                code: "custom",
                message: "Knowledge & Technical Skills is required",
                path: ["knowledge_technical_skills"],
            });
        }
    });

export default requisitionSchema;
