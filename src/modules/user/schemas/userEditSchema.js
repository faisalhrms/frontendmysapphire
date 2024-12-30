// src/modules/user/schemas/userUpdateSchema.js
import { z } from "zod";

// Enum for Status
const statusEnum = z.enum(["active", "suspended", "deactivated"], {
    errorMap: () => "Status must be 'active', 'suspended', or 'deactivated'",
});

// Schema for updating a user
const userUpdateSchema = z.object({
    password: z.string().optional(),
    is_superuser: z.boolean().optional(),
    is_active: z.boolean().optional(),
    avatar: z.union([z.string().length(0), z.number(), z.null()]).optional(),
    group_ids: z.array(z.number()).optional(),
});

export default userUpdateSchema;
