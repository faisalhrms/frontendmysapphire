import {z} from "zod";

const complaintSchema = z.object({
    caseEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().min(1, 'Phone is required if email is missing').optional(),
    subject: z.string().nonempty('Subject is required'),
    description: z.string().optional(),
    orderNo: z.string().optional(),
    attachment_ids: z.any().optional()
}).refine(
    (data) => data.caseEmail || data.phone,
    {
        message: "Either Email or Phone is required",
        path: ["caseEmail"],
    }
);

export default complaintSchema;