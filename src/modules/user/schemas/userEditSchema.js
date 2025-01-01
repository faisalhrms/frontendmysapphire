// src/modules/user/schemas/userUpdateSchema.js
import { z } from "zod";

// Enum for Status
const statusEnum = z.enum(["active", "suspended", "deactivated"], {
    errorMap: () => ({ message: "Status must be 'active', 'suspended', or 'deactivated'" }),
});

// Schema for updating a user
const userUpdateSchema = z.object({
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(50, { message: "Password must not exceed 50 characters" })
        .optional(),
    is_superuser: z.boolean().optional(),
    is_active: z.boolean().optional(),
    avatar_id: z.union([z.string().length(0), z.number(), z.null()]).optional(),

    group_ids: z
        .array(z.number().positive({ message: "Group IDs must be positive numbers" }), {
            invalid_type_error: "Group IDs must be an array of positive numbers",
        })
        .optional(),
    status: statusEnum.optional(),
});

// Export the schema
export default userUpdateSchema;
