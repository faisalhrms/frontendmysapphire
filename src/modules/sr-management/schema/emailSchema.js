import {z} from "zod";

const emailSchema = z.object({
    to_email: z.array(
        z.union([
            z.string().email(),
            z.object({label: z.string(), value: z.string().email()})
        ])
    ).min(1, {message: "Please add at least one recipient."}),
    cc_email: z.array(
        z.union([
            z.string().email(),
            z.object({label: z.string(), value: z.string().email()})
        ])
    ).optional(),
    message: z.string().min(1, {message: "Message is required."})
});

export default emailSchema;