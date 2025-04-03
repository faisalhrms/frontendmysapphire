import { z } from "zod";
const otherUserCreateSchema = z.object({
    full_name: z.string().min(1, "Full name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    phone: z.string().optional(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(50, { message: "Password must not exceed 50 characters" }),
});

export default otherUserCreateSchema;
