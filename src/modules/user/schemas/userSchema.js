// import { z } from "zod";
//
// // Enum for Status
// const statusEnum = z.enum(["active", "suspended", "deactivated"], {
//     errorMap: () => "Status must be 'active', 'suspended', or 'deactivated'" ,
// });
// const userSchema =  z.object({
//     password: z.string().optional(),
//     avatar_id: z.union([z.string().length(0), z.number(), z.null()]).optional(),
//     status: statusEnum.default("active"),
//     role_ids: z.array(z.number()).optional(),
// });
//
// export default userSchema;
// src/modules/user/schemas/userCreateSchema.js
import { z } from "zod";

// Enum for Status (if needed)
const statusEnum = z.enum(["active", "suspended", "deactivated"], {
    errorMap: () => "Status must be 'active', 'suspended', or 'deactivated'",
});

// Schema for creating a user
const userCreateSchema = z.object({
    password: z.string().optional(),
    is_superuser: z.boolean(),
    is_active: z.boolean(),
    avatar: z.union([z.string().length(0), z.number(), z.null()]).optional(),
    employee: z.number(),
    group_ids: z.array(z.number()).min(1, { message: "At least one role is required" }),
    // Uncomment if 'status' is required
    // status: statusEnum.default("active"),
});


export default userCreateSchema;
