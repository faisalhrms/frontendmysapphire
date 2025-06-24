// src/modules/dumps/schemas/dateRangeSchema.js
import { z } from "zod";

export const dateRangeSchema = z
  .object({
    startDate: z.string().nonempty("Select From date"),
    endDate: z.string().nonempty("Select To date")
  })
  .superRefine((v, ctx) => {
    const s = new Date(v.startDate);
    const e = new Date(v.endDate);
    if (s > e)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "From date must be before To date", path: ["startDate"] });
    else if ((e - s) / 86400000 > 31)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Range must not exceed 31 days", path: ["endDate"] });
  });
