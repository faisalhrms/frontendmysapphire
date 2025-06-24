import { z } from "zod";

// Enum for email types (keep these in sync with your backend)
const emailSetupTypes = z.enum([
    "offline_store_performance_report",
    "daily_sales_report",
    "comparative_sales_report",
]);

const emailSetupSchema = z.object({
    company_id: z.number().min(1, "Company ID is required"),

    // Email recipients (now emails, not IDs)
    to_emails: z
        .array(z.string().email("Each recipient must be a valid email"))
        .min(1, "At least one recipient (To) is required"),

    cc_emails: z
        .array(z.string().email("Each CC must be a valid email"))
        .optional()
        .nullable(),

    // Type of email setup
    type: emailSetupTypes,

    // description: z.string().max(500).optional().nullable(),
});

export { emailSetupTypes };
export default emailSetupSchema;
