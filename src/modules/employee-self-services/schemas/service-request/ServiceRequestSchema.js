import {z} from "zod";

const serviceRequestSchema = () =>
    z
        .object({
            sr_number: z
                .string()
                .optional(),
            company_id: z
                .number()
                .min(1, {message: "Company ID is required and must be a valid number"})
                .default(1),
            location_id: z
                .number()
                .min(1, {message: "Location ID is required and must be a valid number"}),
            department_id: z
                .number()
                .min(1, {message: "Department ID is required and must be a valid number"}),
            sub_department_id: z
                .number()
                .min(1, {message: "Sub Department ID is required and must be a valid number"}),
            sr_type: z
                .number()
                .min(1, {message: "SR Type is required and must be a valid number"}),
            request_title: z
                .string()
                .min(1, {message: "Request Title is required and cannot be empty"}),
            reporter: z
                .string()
                .min(1, {message: "Reporter is required and cannot be empty"})
                .default("Faisal"),
            reporter_email: z
                .string()
                .email({message: "Reporter Email must be a valid email address"})
                .transform((email) => email.trim()),
            to_email: z
                .array(
                    z.string().refine(
                        (email) => {
                            const trimmed = email.trim();
                            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
                        },
                        {message: "Each To Email must be a valid email address"}
                    )
                )
                .min(1, {message: "At least one To Email is required"}),
            cc_email: z
                .array(z.string().email({message: "Each CC Email must be a valid email address"}))
                .optional(),
            description: z.string().nullable().default(""),
           attachments: z
            .array(
                z.union([
                    z.number(), // Existing attachment IDs
                    z.object({
                        file_name: z.string().min(1, "File name is required"),
                        file_content: z.string().min(1, "File content is required"),
                    }),
                ])
            )
            .optional()
            .default([]),

            is_submitted: z.boolean().default(false),
            on_behalf_of: z.boolean().default(false),
            parent_request: z.number().nullable().optional(),
            on_behalf_employee: z.string().nullable().optional(),
            need_by_date: z
                .string()
                .min(1, {message: "Need By Date is required and must be valid"}),
        })
        .superRefine((data, ctx) => {
            console.log("Validated Data:", data);
        });

export default serviceRequestSchema;
