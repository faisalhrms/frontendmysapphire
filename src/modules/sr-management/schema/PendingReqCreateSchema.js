import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

const pendingReqTaskSchema = () => z.object({


    user_ids: z
        .array(z.number())
        .default(() => [13]),
    started_at: dateSchema()
        .optional()
        .default(() => new Date().toISOString()),
   description: z
                .string()
                .nullable()
                .default(""),
    ended_at: dateSchema()
        .optional()
        .nullable(),
})
     .superRefine((data, ctx) => {
            console.log("Validated Data:", data);
        });
export default pendingReqTaskSchema;
