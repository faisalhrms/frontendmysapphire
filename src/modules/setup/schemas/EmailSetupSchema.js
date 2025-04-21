import { z } from "zod";

// Enum for email types (update these values to match your backend constants)
const emailSetupTypes = z.enum([
    "user_management",
    "abcd_management",
    "maintenance_reminder"
]);

const emailSetupSchema = z.object({
    company_id: z.number().min(1, "Company ID is required"),

    // Email recipients
    to_user_ids: z
        .array(z.number())
        .min(1, "At least one recipient (To) is required"),

    cc_user_ids: z
        .array(z.number())
        .optional()
        .nullable(),

    // Type of email setup
    type: emailSetupTypes,

    // Optional: description field if needed later
    // description: z.string().max(500).optional().nullable()
});

export default emailSetupSchema;
