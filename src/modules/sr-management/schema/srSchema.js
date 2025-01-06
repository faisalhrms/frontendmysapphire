import { z } from "zod";

const srSchema = z.object({
    date: z
        .string()
        .nullable()
        .refine(
            (value) => value === null || /^\d{4}-(0[1-9]|1[0-2])$/.test(value),
            { message: "Please select a valid month." }
        ),
    department_id: z.number().nullable(),
});

export default srSchema;
