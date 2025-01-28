// src/modules/user/schemas/userUpdateSchema.js
import { z } from "zod";

// Enum for Status
const statusEnum = z.enum(["active", "suspended", "deactivated"], {
    errorMap: () => ({
        message: "Status must be 'active', 'suspended', or 'deactivated'",
    }),
});

/**
 * Password policy checks:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (@$!%*?&)
 *
 * We make it `.optional()`, so if `password` is omitted,
 * no validation is triggered. Otherwise, each `.refine()`
 * ensures compliance with the policy.
 */
const passwordSchema = z
    .string()
    .optional()
    // Only run checks if `val` is not undefined
    .refine(
        (val) => !val || /.{8,}/.test(val),
        { message: "Password must be at least 8 characters long" }
    )
    .refine(
        (val) => !val || /[A-Z]/.test(val),
        { message: "Password must contain at least one uppercase letter" }
    )
    .refine(
        (val) => !val || /[a-z]/.test(val),
        { message: "Password must contain at least one lowercase letter" }
    )
    .refine(
        (val) => !val || /\d/.test(val),
        { message: "Password must contain at least one number" }
    )
    .refine(
        (val) => !val || /[@$!%*?&]/.test(val),
        { message: "Password must contain at least one special character (@$!%*?&)" }
    );

// Schema for updating a user
const userUpdateSchema = z.object({
    password: passwordSchema,
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
