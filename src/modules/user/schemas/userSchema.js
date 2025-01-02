import { z } from "zod";

// Enum for Status (if needed)
const statusEnum = z.enum(["active", "suspended", "deactivated"], {
    errorMap: () => ({ message: "Status must be 'active', 'suspended', or 'deactivated'" }),
});

// Schema for creating a user
const userCreateSchema = z.object({
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(50, { message: "Password must not exceed 50 characters" })
        .optional(),
    is_superuser: z.boolean({
        required_error: "The 'is_superuser' field is required",
        invalid_type_error: "The 'is_superuser' field must be a boolean",
    }),
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
    employee: z.number({
        required_error: "Employee ID is required",
        invalid_type_error: "Employee ID must be a number",
    }),
    group_ids: z
        .array(z.number().positive({ message: "Group IDs must be positive numbers" }))
        .min(1, { message: "At least one role is required" }),
    // Uncomment if 'status' is required
    // status: statusEnum.default("active"),
});

export default userCreateSchema;
