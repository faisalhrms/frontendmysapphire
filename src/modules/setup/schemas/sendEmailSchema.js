import { z } from "zod";

/**
 * Zod schema for SendEmail form
 */
export const sendEmailSchema = z.object({
    date: z
        .string()
        .min(1, "Date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format"
        }),
    report_type: z.enum(["user_management", "abcd_management", "maintenance_reminder"], {
        errorMap: () => ({ message: "Email type is required" })
    })
});
