import { z } from "zod";

const emailSetupTypes = z.enum([
    "offline_store_performance_report",
    "daily_sales_report",
    "comparative_sales_report",
    "sr_daily_stat_report",
    "ai_qc_daily_report"
]);

const emailSetupSchema = z.object({
    company_id: z.number().min(1, "Company ID is required"),

    to_emails: z
        .array(z.string().email("Each recipient must be a valid email"))
        .min(1, "At least one recipient (To) is required"),

    cc_emails: z
        .array(z.string().email("Each CC must be a valid email"))
        .optional()
        .nullable(),

    type: emailSetupTypes,

});

export { emailSetupTypes };
export default emailSetupSchema;
