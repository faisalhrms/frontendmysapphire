import { z } from "zod";

const caseSchema = z.object({
    // Customer Information
    customer_name: z.string()
        .min(1, "Customer name is required")
        .max(100, "Customer name must be less than 100 characters"),

    phone_number: z.string()
        .min(1, "Phone number is required")
        .regex(/^[\d\-\+\(\)\s]+$/, "Invalid phone number format")
        .max(20, "Phone number must be less than 20 characters"),

    email_address: z.string()
        .email("Invalid email format")
        .optional()
        .or(z.literal("")),

    // Case Details
    case_number: z.string()
        .min(1, "Case number is required")
        .max(50, "Case number must be less than 50 characters"),

    case_type: z.string()
        .min(1, "Case type is required")
        .max(100, "Case type must be less than 100 characters"),

    case_status: z.enum(["open", "in_progress", "resolved", "closed"], {
        errorMap: () => ({ message: "Please select a valid case status" })
    }),

    reason: z.string()
        .min(1, "Reason is required")
        .max(200, "Reason must be less than 200 characters"),

    origin: z.string()
        .min(1, "Origin is required")
        .max(100, "Origin must be less than 100 characters"),

    priority: z.enum(["low", "medium", "high", "urgent"], {
        errorMap: () => ({ message: "Please select a valid priority" })
    }),

    subject: z.string()
        .min(1, "Subject is required")
        .max(200, "Subject must be less than 200 characters"),

    description: z.string()
        .min(1, "Description is required")
        .max(1000, "Description must be less than 1000 characters"),

    // Remarks - this is the field that can be edited
    remarks: z.string()
        .max(1000, "Remarks must be less than 1000 characters")
        .optional()
        .or(z.literal("")),

    // Optional fields for additional functionality
    assigned_to: z.string().optional().or(z.literal("")),

    resolution_notes: z.string()
        .max(1000, "Resolution notes must be less than 1000 characters")
        .optional()
        .or(z.literal("")),

    close_reason: z.string()
        .max(500, "Close reason must be less than 500 characters")
        .optional()
        .or(z.literal("")),

    // Timestamps (usually handled by backend)
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    closed_at: z.string().optional(),

    // Internal tracking
    internal_notes: z.string()
        .max(1000, "Internal notes must be less than 1000 characters")
        .optional()
        .or(z.literal("")),
});

export default caseSchema;