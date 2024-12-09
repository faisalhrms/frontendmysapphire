import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

const pendingReqTaskSchema = () => z.object({

    location_id:z.number()
        .min(1, { message: "location_id is required" })
        ,
    department_id:z.number()
        .min(1, { message: "department_id is required" })
        ,
    sub_department_id:z.number()
        .min(1, { message: "sub_department_id is required" })
        ,

    sr_type_id: z.number()
        .min(1, { message: "SR Type is required" })
        .default(1), // Set default based on the available SR types in your system

    user_ids: z.array(z.number()).min(1, "At least one member must be assigned"),


    started_at: dateSchema()
        .optional()
        .default(() => new Date().toISOString()),

    ended_at: dateSchema()
        .optional()
        .nullable(),
});

export default pendingReqTaskSchema;
