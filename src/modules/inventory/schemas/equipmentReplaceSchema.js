// @modules/inventory/schemas/equipmentReplaceSchema.js
import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

export const equipmentReplaceSchema = z.object({
    replacement_date: dateSchema("Replacement Date", true),
    maturity_date: dateSchema("Maturity Date", true),
    replaced_by_id: z.number().int().positive("Replaced By is required"),
    reason_for_replacement: z.string().min(1, "Reason for replacement is required"),
    remarks: z.string().optional(),
    attachment_ids: z.array(z.number()).optional().default([]),
});
