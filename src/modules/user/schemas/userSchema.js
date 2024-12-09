import { z } from "zod";

// Enum for Status
const statusEnum = z.enum(["active", "suspended", "deactivated"], {
    errorMap: () => "Status must be 'active', 'suspended', or 'deactivated'" ,
});
const userSchema =  z.object({
    password: z.string().optional(),
    avatar_id: z.union([z.string().length(0), z.number(), z.null()]).optional(),
    status: statusEnum.default("active"),
    role_ids: z.array(z.number()).optional(),
});

export default userSchema;
