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
    report_type: z.enum(["offline_store_performance_report", "daily_sales_report", "comparative_sales_report"], {
        errorMap: () => ({ message: "Email type is required" })
    })
});
