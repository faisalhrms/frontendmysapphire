import {z} from "zod";

const complaintSchema = z.object({
    caseEmail: z.string().nonempty('Email is required').email('Invalid email address'),
    subject: z.string().nonempty('Subject is required'),
    description: z.string().optional(),
});

export default complaintSchema;