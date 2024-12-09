import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

const serviceRequestSchema = (isSaveMode) => z.object({
    company_id: z.number().min(1).default(1),
    location_id: z.number().min(1).default(1),
    department_id: z.number().min(1).default(1),

    request_title: z.string()
        .min(1, { message: "Request title is required" })
        .max(255, { message: "Request title must be at most 255 characters long" })
        .default("string"),

    reporter: z.string().default("string"),



    // on_behalf_of: z.boolean().default(false),
    // other_employee_code: z.string().default("string"),

    // Handle `to_email` and `cc_email` as arrays of email strings directly
    to_email: z.array(
        z.string().email("Each email must be a valid email address")
    ).min(1, "At least one recipient must be assigned"),


    description: z.string()
        .max(500, {message: "Description must be at most 500 characters long"})
        .nullable()
        .optional()
        .default("string"),

    sub_department_id: z.number().min(1).default(1),
    sr_type_id: z.number().min(1).default(1),

    is_submitted: z.boolean().default(false),
    parent_request_id: z.number().optional(),

    reporter_email: z.string().email().optional().default("user@example.com"),

    reporter_location: z.string().optional().default("string"),

    attachment_ids: z.array(z.number()).optional()
});

export default serviceRequestSchema;
