import { z } from "zod";

const statusEnum = z.enum(["active", "suspended", "deactivated"], {
    errorMap: () => ({ message: "Status must be 'active', 'suspended', or 'deactivated'" }),
});
const otherUserSchema = z.object({
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(50, { message: "Password must not exceed 50 characters" })
        .optional(),

    is_active: z.boolean({
        required_error: "The 'is_active' field is required",
        invalid_type_error: "The 'is_active' field must be a boolean",
    }),

    avatar: z
        .union([
            z.string().length(0, { message: "Avatar cannot be an empty string" }),
            z.number(),
            z.null(),
        ])
        .optional(),
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    group_ids: z
        .array(z.number().positive({ message: "Group IDs must be positive numbers" })).optional(),



});

export default otherUserSchema;
