
import { z } from "zod";


// Schema for updating a user
const profileEditSchema = z.object({
    password: z.string().optional(),
    avatar_id: z.union([z.number(), z.null()]).optional(),

});

export default profileEditSchema;
